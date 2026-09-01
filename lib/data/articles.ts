import { loadStore } from "@/lib/data/store";
import {
  NEWS_CATEGORIES,
  articleVisible,
  normalizeArticle,
  type Article,
  type NewsCategory,
} from "@/lib/types";

function isCategory(value: string): value is NewsCategory {
  return (NEWS_CATEGORIES as readonly string[]).includes(value);
}

function matches(rows: Article[], category?: string, locale?: string) {
  return rows
    .filter((item) => (category && isCategory(category) ? item.category === category : true))
    .filter((item) => (locale ? articleVisible(item, locale) : true))
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );
}

export async function getArticles(category?: string, locale?: string): Promise<Article[]> {
  const store = await loadStore();
  return matches(store.articles.map(normalizeArticle), category, locale);
}

export async function getArticle(id: string, locale?: string): Promise<Article | null> {
  const store = await loadStore();
  const article = store.articles.map(normalizeArticle).find((item) => item.id === id);
  if (!article) return null;
  if (locale && !articleVisible(article, locale)) return null;
  return article;
}
