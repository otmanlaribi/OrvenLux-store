# ORVEN LUX

## Production configuration

Copy `.env.example` to `.env.local` and supply every required secret. Checkout fails closed in production unless both Cloudflare Turnstile keys are configured.

Apply `supabase/migrations/202607190001_security_hardening.sql` before deployment. Add administrator IDs to `public.admin_users` after applying it.

Configure an Upstash Redis REST database with `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for distributed rate limiting. The local limiter is only a development/outage fallback.

Schedule `GET /api/cron/ecotrack` at least every minute with `Authorization: Bearer <CRON_SECRET>`. It processes up to ten pending shipments per run and uses persisted exponential retry state.

## Verification

```bash
npm run lint
npm run build
```
