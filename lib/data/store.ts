import { copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { mockEvents, mockRss, withoutSeedArticles } from "@/lib/data/mock";
import { seedPlaces } from "@/lib/data/places-seed";
import { loadPostgresStore, persistPostgresStore } from "@/lib/data/postgres";
import {
  normalizeArticle,
  normalizeEvent,
  normalizePlace,
  normalizeRss,
  type Article,
  type EventRow,
  type PlaceRow,
  type RssSource,
} from "@/lib/types";

export type StoreData = {
  articles: Article[];
  events: EventRow[];
  rss: RssSource[];
  places: PlaceRow[];
  placesSeeded?: boolean;
};

const FILE = path.join(process.cwd(), "data", "store.json");

function databaseUrl() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_PRIVATE_URL?.trim() ||
    ""
  );
}

let writeChain = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>) {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function seed(): StoreData {
  return {
    articles: [],
    events: mockEvents.map((row) => normalizeEvent(row)),
    rss: mockRss.map((row) => normalizeRss(row)),
    places: seedPlaces().map((row) => normalizePlace(row)),
    placesSeeded: true,
  };
}

async function readStore(): Promise<StoreData> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const placesSeeded = parsed.placesSeeded === true || Array.isArray(parsed.places);
    const next = {
      articles: withoutSeedArticles(
        (parsed.articles ?? []).map((row) => normalizeArticle(row)),
      ),
      events: (parsed.events ?? []).map((row) => normalizeEvent(row)),
      rss: (parsed.rss ?? []).map((row) => normalizeRss(row)),
      places: placesSeeded
        ? (parsed.places ?? []).map((row) => normalizePlace(row))
        : seedPlaces().map((row) => normalizePlace(row)),
      placesSeeded: true,
    };
    if (next.articles.length !== (parsed.articles ?? []).length || !placesSeeded) {
      await persist(next);
    }
    return next;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
    const next = seed();
    await persist(next);
    return next;
  }
}

async function persist(data: StoreData) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await copyFile(tmp, FILE);
  await unlink(tmp).catch(() => undefined);
}

export const loadStore = cache(async () => {
  noStore();
  if (databaseUrl()) return loadPostgresStore();
  return readStore();
});

export async function updateStore(mutator: (data: StoreData) => StoreData | void) {
  return enqueue(async () => {
    const current = databaseUrl() ? await loadPostgresStore() : await readStore();
    const next = mutator(current) ?? current;
    if (databaseUrl()) await persistPostgresStore(next);
    else await persist(next);
    return next;
  });
}
