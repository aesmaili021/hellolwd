alter table public.articles
  add column if not exists image_url text,
  add column if not exists locales text[] not null default array['nl','en','es','fa'];

create table if not exists public.rss_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.rss_sources enable row level security;

drop policy if exists "Public read rss" on public.rss_sources;
create policy "Public read rss"
  on public.rss_sources
  for select
  using (true);
