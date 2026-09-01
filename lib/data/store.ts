import { copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { mockArticles, mockEvents, mockRss } from "@/lib/data/mock";
import {
  normalizeArticle,
  normalizeEvent,
  normalizeRss,
  type Article,
  type EventRow,
  type RssSource,
} from "@/lib/types";

export type StoreData = {
  articles: Article[];
  events: EventRow[];
  rss: RssSource[];
};

const FILE = path.join(process.cwd(), "data", "store.json");

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
    articles: mockArticles.map((row) => normalizeArticle(row)),
    events: mockEvents.map((row) => normalizeEvent(row)),
    rss: mockRss.map((row) => normalizeRss(row)),
  };
}

async function readStore(): Promise<StoreData> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      articles: (parsed.articles ?? []).map((row) => normalizeArticle(row)),
      events: (parsed.events ?? []).map((row) => normalizeEvent(row)),
      rss: (parsed.rss ?? []).map((row) => normalizeRss(row)),
    };
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

export async function loadStore() {
  return readStore();
}

export async function updateStore(mutator: (data: StoreData) => StoreData | void) {
  return enqueue(async () => {
    const current = await readStore();
    const next = mutator(current) ?? current;
    await persist(next);
    return next;
  });
}
