-- Courier tariff import. Prices are in DZD and retain the existing
-- shipping_prices (state, wilaya_code, home_price, office_price) contract.
-- No tariff was supplied for wilayas 50, 54, or 56, so they are intentionally absent.
with tariffs (wilaya_code, state, home_price, office_price) as (
  values
    (1, 'أدرار', 1100, 600),
    (2, 'الشلف', 700, 400),
    (3, 'الأغواط', 900, 500),
    (4, 'أم البواقي', 900, 400),
    (5, 'باتنة', 900, 400),
    (6, 'بجاية', 800, 400),
    (7, 'بسكرة', 1000, 500),
    (8, 'بشار', 1000, 600),
    (9, 'البليدة', 600, 400),
    (10, 'البويرة', 700, 400),
    (11, 'تمنراست', 1100, 800),
    (12, 'تبسة', 900, 400),
    (13, 'تلمسان', 600, 400),
    (14, 'تيارت', 700, 400),
    (15, 'تيزي وزو', 700, 400),
    (16, 'الجزائر', 500, 400),
    (17, 'الجلفة', 900, 500),
    (18, 'جيجل', 800, 400),
    (19, 'سطيف', 800, 400),
    (20, 'سعيدة', 800, 400),
    (21, 'سكيكدة', 700, 400),
    (22, 'سيدي بلعباس', 600, 400),
    (23, 'عنابة', 800, 400),
    (24, 'قالمة', 900, 400),
    (25, 'قسنطينة', 800, 400),
    (26, 'المدية', 700, 400),
    (27, 'مستغانم', 600, 400),
    (28, 'المسيلة', 900, 500),
    (29, 'معسكر', 600, 400),
    (30, 'ورقلة', 900, 500),
    (31, 'وهران', 500, 250),
    (32, 'البيض', 900, 500),
    (33, 'إليزي', 1300, 600),
    (34, 'برج بوعريريج', 800, 400),
    (35, 'بومرداس', 700, 350),
    (36, 'الطارف', 900, 400),
    (37, 'تندوف', 1300, 600),
    (38, 'تيسمسيلت', 800, 400),
    (39, 'الوادي', 1000, 600),
    (40, 'خنشلة', 900, 500),
    (41, 'سوق أهراس', 900, 500),
    (42, 'تيبازة', 700, 400),
    (43, 'ميلة', 700, 400),
    (44, 'عين الدفلة', 700, 400),
    (45, 'النعامة', 900, 500),
    (46, 'عين تيموشنت', 600, 400),
    (47, 'غرداية', 1000, 500),
    (48, 'غليزان', 700, 400),
    (49, 'تيميمون', 1000, 600),
    (51, 'أولاد جلال', 900, 500),
    (52, 'بني عباس', 1100, 0),
    (53, 'عين صالح', 1100, 600),
    (55, 'تقرت', 1000, 500),
    (57, 'المغير', 900, 0),
    (58, 'المنيعة', 1000, 500)
), updated as (
  update public.shipping_prices as shipping
  set state = tariffs.state,
      home_price = tariffs.home_price,
      office_price = tariffs.office_price
  from tariffs
  where shipping.wilaya_code = tariffs.wilaya_code
  returning shipping.wilaya_code
)
insert into public.shipping_prices (state, wilaya_code, home_price, office_price)
select tariffs.state, tariffs.wilaya_code, tariffs.home_price, tariffs.office_price
from tariffs
where not exists (
  select 1
  from public.shipping_prices as shipping
  where shipping.wilaya_code = tariffs.wilaya_code
);
