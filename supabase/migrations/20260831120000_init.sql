create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  source_name text not null,
  category text not null
    check (category in (
      'politics',
      'infrastructure',
      'culture',
      'business',
      'safety',
      'education',
      'sports'
    )),
  published_at timestamptz not null,
  title_nl text not null,
  title_en text not null,
  title_es text not null,
  title_fa text not null,
  summary_nl text not null,
  summary_en text not null,
  summary_es text not null,
  summary_fa text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  venue text not null,
  event_datetime timestamptz not null,
  genre text not null,
  ticket_link text,
  image_url text,
  description_nl text,
  description_en text,
  description_es text,
  description_fa text,
  created_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

create index if not exists articles_category_idx
  on public.articles (category);

create index if not exists events_datetime_idx
  on public.events (event_datetime asc);

create index if not exists events_genre_idx
  on public.events (genre);

alter table public.articles enable row level security;
alter table public.events enable row level security;

drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles"
  on public.articles
  for select
  using (true);

drop policy if exists "Public read events" on public.events;
create policy "Public read events"
  on public.events
  for select
  using (true);
