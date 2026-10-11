alter table articles add column if not exists slug text;
create index if not exists articles_slug_idx on articles (slug);
