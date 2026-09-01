# HelloLWD

Local news and weekend nights for Leeuwarden, in Dutch, English, Spanish, and Farsi.

v1 is a compact briefing: short summaries that link back to the source, plus a curated nightlife list. No accounts, no ads, no full-article copies.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Routes live under `/nl`, `/en`, `/es`, and `/fa`.

Without Supabase keys the app serves bundled mock articles and events so the site stays demoable.

## Supabase

Apply `supabase/migrations/20260831120000_init.sql` then `supabase/seed.sql` in the Supabase SQL editor (or CLI). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

## Stack

Next.js (App Router), Tailwind CSS, next-intl, Supabase.
