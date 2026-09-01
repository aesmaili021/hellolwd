"use server";

import { revalidatePath } from "next/cache";
import { getArticle } from "@/lib/data/articles";
import { updateStore } from "@/lib/data/store";
import {
  applyLocaleTranslation,
  isTargetLocale,
  translateBriefingTo,
} from "@/lib/rss/translate";
import { articleHasTranslation, articleSummary, articleTitle } from "@/lib/types";

export type TranslateResult =
  | { ok: true; title: string; summary: string; cached: boolean }
  | { ok: false; error: "missing" | "locale" | "busy" | "failed" };

const inflight = new Map<string, Promise<TranslateResult>>();
const recent: number[] = [];

function allowNewSpend() {
  const now = Date.now();
  while (recent[0] && now - recent[0] > 60 * 60 * 1000) recent.shift();
  if (recent.length >= 40) return false;
  recent.push(now);
  return true;
}

export async function requestArticleTranslation(
  articleId: string,
  locale: string,
): Promise<TranslateResult> {
  if (!isTargetLocale(locale)) return { ok: false, error: "locale" };

  const key = `${articleId}:${locale}`;
  const existing = inflight.get(key);
  if (existing) return existing;

  const run = (async (): Promise<TranslateResult> => {
    const article = await getArticle(articleId);
    if (!article) return { ok: false, error: "missing" };
    if (articleHasTranslation(article, locale)) {
      return {
        ok: true,
        cached: true,
        title: articleTitle(article, locale),
        summary: articleSummary(article, locale),
      };
    }
    if (!allowNewSpend()) return { ok: false, error: "busy" };

    const piece = await translateBriefingTo(article.title_nl, article.summary_nl, locale);
    if (!piece) return { ok: false, error: "failed" };

    await updateStore((store) => {
      const row = store.articles.find((item) => item.id === articleId);
      if (!row || articleHasTranslation(row, locale)) return;
      const next = applyLocaleTranslation(row, locale, piece);
      Object.assign(row, next);
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath(`/article/${articleId}`);
    } catch {
      /* no request context */
    }

    return { ok: true, cached: false, title: piece.title, summary: piece.summary };
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, run);
  return run;
}
