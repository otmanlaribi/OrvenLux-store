-- Apply with the Supabase CLI or SQL editor before deploying this release.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  ip_address text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists ecotrack_dispatch_state text not null default 'pending'
  check (ecotrack_dispatch_state in ('pending', 'processing', 'sent'));
alter table public.orders alter column sent_to_ecotrack set default false;
update public.orders set ecotrack_dispatch_state = case when sent_to_ecotrack then 'sent' else 'pending' end where ecotrack_dispatch_state is null;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;
alter table public.audit_logs enable row level security;
alter table public.shipping_prices enable row level security;
alter table public.delivery_offices enable row level security;
alter table public.algeria_cities enable row level security;
alter table storage.objects enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

drop policy if exists "public reads active products" on public.products;
create policy "public reads active products" on public.products for select using (active = true or public.is_admin());
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins read admin users" on public.admin_users;
create policy "admins read admin users" on public.admin_users for select to authenticated using (public.is_admin());
drop policy if exists "admins read audit logs" on public.audit_logs;
create policy "admins read audit logs" on public.audit_logs for select to authenticated using (public.is_admin());
drop policy if exists "public reads shipping prices" on public.shipping_prices;
create policy "public reads shipping prices" on public.shipping_prices for select using (true);
drop policy if exists "public reads delivery offices" on public.delivery_offices;
create policy "public reads delivery offices" on public.delivery_offices for select using (true);
drop policy if exists "public reads algeria cities" on public.algeria_cities;
create policy "public reads algeria cities" on public.algeria_cities for select using (true);

insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do update set public = true;
drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images" on storage.objects for select using (bucket_id = 'products');
drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'products' and public.is_admin() and name ~ ('^products/' || auth.uid()::text || '/[0-9a-f-]+\\.(jpg|png|webp)$'));
drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'products' and public.is_admin() and name ~ '^products/[0-9a-f-]+/[0-9a-f-]+\\.(jpg|png|webp)$');

revoke all on table public.orders from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.products to authenticated;
grant select, insert, update, delete on table public.orders to authenticated;
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_created_at_idx on public.orders (status, created_at desc);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- Checkout is intentionally a single database transaction: price, shipping, stock,
-- location validation, and idempotency cannot drift between separate API queries.
alter table public.orders add column if not exists idempotency_key uuid;
alter table public.orders add column if not exists ecotrack_dispatch_attempts integer not null default 0 check (ecotrack_dispatch_attempts >= 0);
alter table public.orders add column if not exists ecotrack_last_attempt_at timestamptz;
alter table public.orders add column if not exists ecotrack_next_attempt_at timestamptz;
alter table public.orders alter column ecotrack_next_attempt_at set default now();
update public.orders set ecotrack_next_attempt_at = now() where sent_to_ecotrack = false and ecotrack_dispatch_state = 'pending' and ecotrack_next_attempt_at is null;
create unique index if not exists orders_idempotency_key_idx on public.orders (idempotency_key) where idempotency_key is not null;
create index if not exists orders_ecotrack_pending_idx on public.orders (ecotrack_next_attempt_at asc) where sent_to_ecotrack = false and ecotrack_dispatch_state = 'pending';

create or replace function public.create_checkout_order(
  p_product_id bigint,
  p_customer_name text,
  p_phone text,
  p_state text,
  p_commune text,
  p_delivery_type text,
  p_address text,
  p_office_name text,
  p_idempotency_key uuid
)
returns table (id bigint, total_price numeric, delivery_price numeric)
language plpgsql security definer set search_path = public
as $$
declare
  v_product public.products%rowtype;
  v_shipping public.shipping_prices%rowtype;
  v_delivery_price numeric;
  v_order_id bigint;
begin
  return query select o.id, o.total_price, o.delivery_price from public.orders o where o.idempotency_key = p_idempotency_key;
  if found then return; end if;

  select * into v_product from public.products where products.id = p_product_id and active = true for update;
  if not found or v_product.stock < 1 then raise exception 'product_unavailable'; end if;

  select * into v_shipping from public.shipping_prices where state = p_state;
  if not found then raise exception 'invalid_delivery_state'; end if;

  if not exists (select 1 from public.algeria_cities where wilaya_code = v_shipping.wilaya_code and commune_name = p_commune) then
    raise exception 'invalid_commune';
  end if;
  if p_delivery_type = 'office' and not exists (select 1 from public.delivery_offices where state = p_state and office_name = p_office_name) then
    raise exception 'invalid_delivery_office';
  end if;
  if p_delivery_type not in ('home', 'office') then raise exception 'invalid_delivery_type'; end if;

  v_delivery_price := case when p_delivery_type = 'home' then v_shipping.home_price else v_shipping.office_price end;
  begin
    insert into public.orders (customer_name, phone, state, commune, wilaya, address, delivery_type, office_name, delivery_price, total_price, quantity, status, product_id, sent_to_ecotrack, ecotrack_dispatch_state, idempotency_key)
    values (p_customer_name, p_phone, p_state, p_commune, v_shipping.wilaya_code, case when p_delivery_type = 'home' then p_address else p_office_name end, p_delivery_type, case when p_delivery_type = 'office' then p_office_name else '' end, v_delivery_price, v_product.price + v_delivery_price, 1, 'جديد', v_product.id, false, 'pending', p_idempotency_key)
    returning orders.id into v_order_id;
    update public.products set stock = stock - 1 where products.id = v_product.id;
  exception when unique_violation then
    return query select o.id, o.total_price, o.delivery_price from public.orders o where o.idempotency_key = p_idempotency_key;
    return;
  end;

  return query select o.id, o.total_price, o.delivery_price from public.orders o where o.id = v_order_id;
end;
$$;
revoke all on function public.create_checkout_order(bigint, text, text, text, text, text, text, text, uuid) from public;
grant execute on function public.create_checkout_order(bigint, text, text, text, text, text, text, text, uuid) to service_role;
