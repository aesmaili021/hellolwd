import { revalidatePath } from "next/cache";
import { getRssSources } from "@/lib/data/rss";
import { loadStore, updateStore } from "@/lib/data/store";
import { CONTENT_LOCALES, normalizeArticle, type Article } from "@/lib/types";
import { briefing, classifyCategory, isLeeuwardenStory } from "@/lib/rss/classify";
import { extractLead, normalizeArticleUrl, parseRssItems } from "@/lib/rss/parse";
import { needsTranslation, translateMany } from "@/lib/rss/translate";

const UA = "HelloLWD/0.1 (local news briefing; +https://hellolwd.nl)";
const MAX_AGE_MS = 21 * 24 * 60 * 60 * 1000;
const MAX_NEW = 25;
const MAX_STORE = 80;

export type IngestResult = {
  added: number;
  updated: number;
  translated: number;
  images: number;
  feeds: number;
  errors: string[];
};

let running: Promise<IngestResult> | null = null;

async function fetchText(url: string, ms = 20000) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, text/html;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(ms),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function ogImage(html: string) {
  const match =
    html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i);
  return match?.[1]?.trim() || null;
}

async function fillImage(url: string) {
  try {
    const html = await fetchText(url, 8000);
    return ogImage(html);
  } catch {
    return null;
  }
}

function toArticle(item: {
  title: string;
  link: string;
  summary: string;
  published_at: string;
  image_url: string | null;
  category: string;
}, sourceName: string): Article {
  const summary = briefing(item.summary || item.title);
  return normalizeArticle({
    id: crypto.randomUUID(),
    source_url: item.link,
    source_name: sourceName,
    category: classifyCategory(item),
    published_at: item.published_at,
    image_url: item.image_url,
    locales: [...CONTENT_LOCALES],
    title_nl: item.title,
    title_en: item.title,
    title_es: item.title,
    title_fa: item.title,
    summary_nl: summary,
    summary_en: summary,
    summary_es: summary,
    summary_fa: summary,
  });
}

async function runIngest(): Promise<IngestResult> {
  const feeds = (await getRssSources()).filter((feed) => feed.enabled);
  const result: IngestResult = { added: 0, updated: 0, translated: 0, images: 0, feeds: feeds.length, errors: [] };
  const incoming: Article[] = [];
  const now = Date.now();
  const pulledAt = new Date().toISOString();

  for (const feed of feeds) {
    try {
      const xml = await fetchText(feed.url);
      const items = parseRssItems(xml)
        .filter((item) => isLeeuwardenStory(item, feed.url))
        .filter((item) => now - new Date(item.published_at).getTime() < MAX_AGE_MS);

      for (const item of items) {
        if (!item.image_url || item.summary.length < 450) {
          try {
            const html = await fetchText(item.link, 8000);
            if (!item.image_url) item.image_url = ogImage(html);
            const lead = extractLead(html);
            if (lead.length > item.summary.length) item.summary = lead;
          } catch {
            if (!item.image_url) item.image_url = await fillImage(item.link);
          }
        }
        incoming.push(toArticle(item, feed.name));
      }

      await updateStore((store) => {
        const row = store.rss.find((rss) => rss.id === feed.id);
        if (row) {
          row.last_pulled_at = pulledAt;
          row.last_error = null;
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push(`${feed.name}: ${message}`);
      await updateStore((store) => {
        const row = store.rss.find((rss) => rss.id === feed.id);
        if (row) {
          row.last_pulled_at = pulledAt;
          row.last_error = message.slice(0, 180);
        }
      });
    }
  }

  const missing = (await loadStore()).articles.filter((row) => !row.image_url && row.source_url.startsWith("http"));
  const backfill = new Map<string, string>();
  for (const article of missing.slice(0, 12)) {
    const image = await fillImage(article.source_url);
    if (image) backfill.set(article.id, image);
  }

  await updateStore((store) => {
    const seen = new Set(store.articles.map((row) => normalizeArticleUrl(row.source_url)));

    for (const article of store.articles) {
      const image = backfill.get(article.id);
      if (image && !article.image_url) {
        article.image_url = image;
        result.images += 1;
      }
    }

    for (const article of store.articles) {
      if (!article.image_url) {
        const match = incoming.find(
          (row) => normalizeArticleUrl(row.source_url) === normalizeArticleUrl(article.source_url),
        );
        if (match?.image_url) {
          article.image_url = match.image_url;
          result.images += 1;
        }
      }
    }

    for (const article of incoming) {
      const key = normalizeArticleUrl(article.source_url);
      const existing = store.articles.find((row) => normalizeArticleUrl(row.source_url) === key);
      if (existing) {
        let changed = false;
        if (article.image_url && !existing.image_url) {
          existing.image_url = article.image_url;
          result.images += 1;
          changed = true;
        }
        if (article.summary_nl.length > existing.summary_nl.length + 20) {
          existing.summary_nl = article.summary_nl;
        }
        if (article.title_en !== article.title_nl) {
          existing.title_en = article.title_en;
          existing.title_es = article.title_es;
          existing.title_fa = article.title_fa;
          existing.summary_en = article.summary_en;
          existing.summary_es = article.summary_es;
          existing.summary_fa = article.summary_fa;
          changed = true;
        }
        if (changed) result.updated += 1;
        continue;
      }
      if (result.added >= MAX_NEW) continue;
      store.articles.unshift(article);
      seen.add(key);
      result.added += 1;
      if (article.image_url) result.images += 1;
    }

    store.articles.sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );
    store.articles = store.articles.slice(0, MAX_STORE);
  });

  const pending = (await loadStore()).articles.filter(needsTranslation).slice(0, 25);
  if (pending.length) {
    const translated = await translateMany(pending, 3);
    const byId = new Map(translated.map((row) => [row.id, row]));
    await updateStore((store) => {
      for (const article of store.articles) {
        const next = byId.get(article.id);
        if (!next || needsTranslation(next)) continue;
        if (next.title_nl) article.title_nl = next.title_nl;
        if (next.summary_nl) article.summary_nl = next.summary_nl;
        article.title_en = next.title_en;
        article.title_es = next.title_es;
        article.title_fa = next.title_fa;
        article.summary_en = next.summary_en;
        article.summary_es = next.summary_es;
        article.summary_fa = next.summary_fa;
        result.translated += 1;
      }
    });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/news");
    revalidatePath("/admin/rss");
  } catch {
    /* cron / scheduler has no request context */
  }

  return result;
}

export async function ingestFeeds() {
  if (running) return running;
  running = runIngest().finally(() => {
    running = null;
  });
  return running;
}
