import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/data/articles";
import { routing } from "@/i18n/routing";
import { languageAlternates, localeUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = ["/", "/events", "/about", "/privacy", "/cookies"] as const;

function entry(path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl("en", path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency: path === "/" ? "hourly" : path === "/events" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/events" ? 0.8 : 0.5,
    alternates: {
      languages: languageAlternates(path),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const rows: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => entry(path));

  for (const article of articles) {
    const path = `/article/${article.id}`;
    const locales = article.locales?.length ? article.locales : routing.locales;
    rows.push({
      url: localeUrl(locales.includes("en") ? "en" : locales[0], path),
      lastModified: new Date(article.published_at),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: languageAlternates(path, locales),
      },
    });
  }

  return rows;
}
