# Algerian location import

Run the existing Supabase migrations first, including `202607190002_location_data_indexes.sql`. Then configure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the intended Supabase project and run:

```sh
npm run seed:locations
```

The importer downloads the government-derived source maintained by `othmanus/algeria-cities`, verifies the pinned SHA-256 checksum, validates exactly 1,541 communes across wilaya codes 1 through 58, and upserts them into `public.algeria_cities`. It removes pre-existing rows whose IDs are not part of that official dataset after the replacement data is in place.

The importer deliberately does not create `shipping_prices` or `delivery_offices`: tariffs and Ecotrack office coverage are courier-account operational data and must be supplied from the configured courier account. It reports any missing tariff rows without inventing values. Use `npm run seed:locations -- --strict-pricing` in deployment automation to make missing price mappings fail the command.

The current application schema scopes delivery offices by shipping `state`, not by commune. That is preserved intentionally because changing it would require an API and checkout business-logic change. A future courier office import can use the existing `delivery_offices (state, office_name)` schema.
