import type { Article } from "@/lib/types";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isArticleId(value: string) {
  return UUID.test(value);
}

export function slugifyTitle(title: string) {
  const ascii = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .toLowerCase();
  const slug = ascii
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || "story";
}

export function articleSlug(article: Pick<Article, "id" | "slug" | "title_nl" | "title_en">) {
  return article.slug?.trim() || slugifyTitle(article.title_nl || article.title_en || article.id);
}

export function articlePath(article: Pick<Article, "id" | "slug" | "title_nl" | "title_en">) {
  return `/article/${articleSlug(article)}`;
}

export function assignArticleSlugs(articles: Article[]): { articles: Article[]; changed: boolean } {
  const taken = new Set<string>();
  let changed = false;
  const next = articles.map((row) => {
    const stored = row.slug?.trim();
    const base = stored || slugifyTitle(row.title_nl || row.title_en || row.id);
    let slug = base;
    if (taken.has(slug)) {
      slug = `${base.slice(0, 63)}-${row.id.replace(/-/g, "").slice(0, 8)}`;
    }
    taken.add(slug);
    if (slug !== row.slug) changed = true;
    return slug === row.slug ? row : { ...row, slug };
  });
  return { articles: next, changed };
}
