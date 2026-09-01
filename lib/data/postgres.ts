import { Pool, type PoolClient } from "pg";
import { mockArticles, mockEvents, mockRss } from "@/lib/data/mock";
import {
  normalizeArticle,
  normalizeEvent,
  normalizeRss,
  type Article,
  type EventRow,
  type RssSource,
} from "@/lib/types";

type StoreData = {
  articles: Article[];
  events: EventRow[];
  rss: RssSource[];
};

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function connectionString() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_PRIVATE_URL?.trim() ||
    ""
  );
}

function sslConfig() {
  const url = connectionString();
  if (process.env.DATABASE_SSL === "false") return false;
  if (url.includes("railway.internal") || url.includes("sslmode=disable")) {
    return false;
  }
  return { rejectUnauthorized: false } as const;
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: connectionString(),
      ssl: sslConfig(),
      max: 4,
    });
  }
  return pool;
}

const SCHEMA = `
create table if not exists articles (
  id text primary key,
  source_url text not null,
  source_name text not null,
  category text not null,
  published_at timestamptz not null,
  title_nl text not null,
  title_en text not null,
  title_es text not null,
  title_fa text not null,
  summary_nl text not null,
  summary_en text not null,
  summary_es text not null,
  summary_fa text not null,
  image_url text,
  locales text[] not null default array['nl','en','es','fa']::text[],
  created_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
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

create table if not exists rss_sources (
  id text primary key,
  name text not null,
  url text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  last_pulled_at timestamptz,
  last_error text
);

create index if not exists articles_published_at_idx on articles (published_at desc);
create index if not exists articles_category_idx on articles (category);
create index if not exists events_datetime_idx on events (event_datetime asc);
`;

function iso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value) return value;
  return new Date().toISOString();
}

function seed(): StoreData {
  return {
    articles: mockArticles.map((row) => normalizeArticle(row)),
    events: mockEvents.map((row) => normalizeEvent(row)),
    rss: mockRss.map((row) => normalizeRss(row)),
  };
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(SCHEMA)
      .then(() => undefined);
  }
  await schemaReady;
}

function mapArticle(row: Record<string, unknown>): Article {
  return normalizeArticle({
    id: String(row.id),
    source_url: String(row.source_url ?? ""),
    source_name: String(row.source_name ?? ""),
    category: row.category as Article["category"],
    published_at: iso(row.published_at),
    title_nl: String(row.title_nl ?? ""),
    title_en: String(row.title_en ?? ""),
    title_es: String(row.title_es ?? ""),
    title_fa: String(row.title_fa ?? ""),
    summary_nl: String(row.summary_nl ?? ""),
    summary_en: String(row.summary_en ?? ""),
    summary_es: String(row.summary_es ?? ""),
    summary_fa: String(row.summary_fa ?? ""),
    image_url: (row.image_url as string | null) ?? null,
    locales: (row.locales as Article["locales"]) ?? undefined,
    created_at: iso(row.created_at),
  });
}

function mapEvent(row: Record<string, unknown>): EventRow {
  return normalizeEvent({
    id: String(row.id),
    name: String(row.name ?? ""),
    venue: String(row.venue ?? ""),
    event_datetime: iso(row.event_datetime),
    genre: row.genre as EventRow["genre"],
    ticket_link: (row.ticket_link as string | null) ?? null,
    image_url: (row.image_url as string | null) ?? null,
    description_nl: (row.description_nl as string | null) ?? null,
    description_en: (row.description_en as string | null) ?? null,
    description_es: (row.description_es as string | null) ?? null,
    description_fa: (row.description_fa as string | null) ?? null,
    created_at: iso(row.created_at),
  });
}

function mapRss(row: Record<string, unknown>): RssSource {
  return normalizeRss({
    id: String(row.id),
    name: String(row.name ?? ""),
    url: String(row.url ?? ""),
    enabled: row.enabled !== false,
    created_at: iso(row.created_at),
    last_pulled_at: row.last_pulled_at ? iso(row.last_pulled_at) : null,
    last_error: (row.last_error as string | null) ?? null,
  });
}

async function insertStore(client: PoolClient, data: StoreData) {
  for (const row of data.articles) {
    await client.query(
      `insert into articles (
        id, source_url, source_name, category, published_at,
        title_nl, title_en, title_es, title_fa,
        summary_nl, summary_en, summary_es, summary_fa,
        image_url, locales, created_at
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
      )`,
      [
        row.id,
        row.source_url,
        row.source_name,
        row.category,
        row.published_at,
        row.title_nl,
        row.title_en,
        row.title_es,
        row.title_fa,
        row.summary_nl,
        row.summary_en,
        row.summary_es,
        row.summary_fa,
        row.image_url,
        row.locales,
        row.created_at,
      ],
    );
  }

  for (const row of data.events) {
    await client.query(
      `insert into events (
        id, name, venue, event_datetime, genre, ticket_link, image_url,
        description_nl, description_en, description_es, description_fa, created_at
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )`,
      [
        row.id,
        row.name,
        row.venue,
        row.event_datetime,
        row.genre,
        row.ticket_link,
        row.image_url,
        row.description_nl,
        row.description_en,
        row.description_es,
        row.description_fa,
        row.created_at,
      ],
    );
  }

  for (const row of data.rss) {
    await client.query(
      `insert into rss_sources (
        id, name, url, enabled, created_at, last_pulled_at, last_error
      ) values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        row.id,
        row.name,
        row.url,
        row.enabled,
        row.created_at,
        row.last_pulled_at ?? null,
        row.last_error ?? null,
      ],
    );
  }
}

export async function loadPostgresStore(): Promise<StoreData> {
  await ensureSchema();
  const db = getPool();
  const [articles, events, rss] = await Promise.all([
    db.query("select * from articles"),
    db.query("select * from events"),
    db.query("select * from rss_sources"),
  ]);

  if (!articles.rowCount && !events.rowCount && !rss.rowCount) {
    const next = seed();
    const client = await db.connect();
    try {
      await client.query("begin");
      await insertStore(client, next);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
    return next;
  }

  return {
    articles: articles.rows.map((row) => mapArticle(row as Record<string, unknown>)),
    events: events.rows.map((row) => mapEvent(row as Record<string, unknown>)),
    rss: rss.rows.map((row) => mapRss(row as Record<string, unknown>)),
  };
}

export async function persistPostgresStore(data: StoreData) {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("begin");
    await client.query("truncate articles, events, rss_sources");
    await insertStore(client, data);
    await client.query("commit");
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function pingPostgres() {
  await ensureSchema();
  await getPool().query("select 1");
}
