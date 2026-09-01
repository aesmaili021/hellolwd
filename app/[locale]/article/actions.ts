"use server";

import { revalidatePath } from "next/cache";
import { getArticle } from "@/lib/data/articles";
import { updateStore } from "@/lib/data/store";
import { extractArticleBody } from "@/lib/rss/parse";
import {
  applyBodyTranslation,
  isTargetLocale,
  translateBodyTo,
} from "@/lib/rss/translate";
import { articleBody, articleHasFullTranslation } from "@/lib/types";

export type FullTranslateResult =
  | { ok: true; body: string; cached: boolean }
  | { ok: false; error: "missing" | "locale" | "busy" | "failed" };

const UA = "HelloLWD/0.1 (local news briefing; +https://hellolwd.nl)";
const inflight = new Map<string, Promise<FullTranslateResult>>();
const recent: number[] = [];

function allowNewSpend() {
  const now = Date.now();
  while (recent[0] && now - recent[0] > 60 * 60 * 1000) recent.shift();
  if (recent.length >= 20) return false;
  recent.push(now);
  return true;
}

async function fetchDutchBody(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!res.ok) return "";
  return extractArticleBody(await res.text());
}

export async function requestFullTranslation(
  articleId: string,
  locale: string,
): Promise<FullTranslateResult> {
  if (locale !== "nl" && !isTargetLocale(locale)) return { ok: false, error: "locale" };

  const key = `full:${articleId}:${locale}`;
  const existing = inflight.get(key);
  if (existing) return existing;

  const run = (async (): Promise<FullTranslateResult> => {
    const article = await getArticle(articleId);
    if (!article) return { ok: false, error: "missing" };

    if (articleHasFullTranslation(article, locale) || (locale === "nl" && article.body_nl)) {
      const body = locale === "nl" ? article.body_nl : articleBody(article, locale);
      if (body) return { ok: true, cached: true, body };
    }

    let dutch = article.body_nl?.trim() || "";
    if (!dutch) {
      dutch = (await fetchDutchBody(article.source_url)) || article.summary_nl;
      if (!dutch) return { ok: false, error: "failed" };
      await updateStore((store) => {
        const row = store.articles.find((item) => item.id === articleId);
        if (row && !row.body_nl) row.body_nl = dutch;
      });
    }

    if (locale === "nl") {
      return { ok: true, cached: false, body: dutch };
    }

    if (!allowNewSpend()) return { ok: false, error: "busy" };

    const translated = await translateBodyTo(dutch, locale);
    if (!translated) return { ok: false, error: "failed" };

    await updateStore((store) => {
      const row = store.articles.find((item) => item.id === articleId);
      if (!row || articleHasFullTranslation(row, locale)) return;
      Object.assign(row, applyBodyTranslation(row, locale, translated));
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath(`/article/${articleId}`);
    } catch {
      /* no request context */
    }

    return { ok: true, cached: false, body: translated };
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, run);
  return run;
}
