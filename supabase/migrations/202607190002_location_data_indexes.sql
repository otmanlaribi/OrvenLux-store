-- The checkout validates a commune by wilaya code and its canonical name.
-- Keep this index aligned with that lookup and the public commune endpoint ordering.
create index if not exists algeria_cities_wilaya_commune_idx
  on public.algeria_cities (wilaya_code, commune_name);

create index if not exists algeria_cities_wilaya_ascii_idx
  on public.algeria_cities (wilaya_code, commune_name_ascii);

-- Delivery office validation is scoped to the selected shipping state.
create index if not exists delivery_offices_state_office_idx
  on public.delivery_offices (state, office_name);

create index if not exists shipping_prices_wilaya_code_idx
  on public.shipping_prices (wilaya_code);
