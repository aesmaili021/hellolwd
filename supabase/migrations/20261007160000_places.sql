create table if not exists public.places (
  id text primary key,
  name text not null,
  category text not null,
  address text not null,
  website text,
  email text,
  description_nl text not null default '',
  description_en text not null default '',
  description_es text not null default '',
  description_fa text not null default '',
  source_url text not null,
  featured boolean not null default false,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.app_flags (
  key text primary key,
  value text not null
);

-- Rows are inserted once by the app (lib/data/places-seed.ts) the first time
-- the places table is empty. Editing them in /admin/places is what stays.
