import { routing, type Locale } from "@/i18n/routing";

export const NEWS_CATEGORIES = [
  "politics",
  "infrastructure",
  "culture",
  "business",
  "safety",
  "education",
  "sports",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const EVENT_GENRES = [
  "electronic",
  "hiphop",
  "live-band",
  "student-party",
] as const;

export type EventGenre = (typeof EVENT_GENRES)[number];

export const CONTENT_LOCALES = routing.locales;
export type ContentLocale = Locale;

export type Article = {
  id: string;
  source_url: string;
  source_name: string;
  category: NewsCategory;
  published_at: string;
  title_nl: string;
  title_en: string;
  title_es: string;
  title_fa: string;
  summary_nl: string;
  summary_en: string;
  summary_es: string;
  summary_fa: string;
  image_url: string | null;
  locales: ContentLocale[];
  created_at: string;
};

export type EventRow = {
  id: string;
  name: string;
  venue: string;
  event_datetime: string;
  genre: EventGenre;
  ticket_link: string | null;
  image_url: string | null;
  description_nl: string | null;
  description_en: string | null;
  description_es: string | null;
  description_fa: string | null;
  created_at: string;
};

export type RssSource = {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  created_at: string;
  last_pulled_at?: string | null;
  last_error?: string | null;
};

export function articleVisible(article: Article, locale: string) {
  if (!article.locales?.length) return true;
  return article.locales.includes(locale as ContentLocale);
}

function pickLocaleField(
  locale: string,
  fields: Record<ContentLocale, string | null | undefined>,
) {
  const key = (CONTENT_LOCALES as readonly string[]).includes(locale)
    ? (locale as ContentLocale)
    : "en";
  const value = fields[key]?.trim() || "";
  const source = fields.nl?.trim() || "";
  if (key !== "nl" && value && value !== source) return value;
  if (key === "nl") return source || value;
  return source || fields.en?.trim() || value;
}

export function articleHasTranslation(article: Article, locale: string) {
  if (locale === "nl") return true;
  const title = pickLocaleField(locale, {
    nl: article.title_nl,
    en: article.title_en,
    es: article.title_es,
    fa: article.title_fa,
  });
  return Boolean(title && title !== article.title_nl.trim());
}

export function articleTitle(article: Article, locale: string) {
  return pickLocaleField(locale, {
    nl: article.title_nl,
    en: article.title_en,
    es: article.title_es,
    fa: article.title_fa,
  });
}

export function articleSummary(article: Article, locale: string) {
  return pickLocaleField(locale, {
    nl: article.summary_nl,
    en: article.summary_en,
    es: article.summary_es,
    fa: article.summary_fa,
  });
}

export function articleLocaleCopy(article: Article, locale: ContentLocale) {
  if (locale === "nl") {
    return { title: article.title_nl, summary: article.summary_nl };
  }
  if (!articleHasTranslation(article, locale)) return null;
  return {
    title: articleTitle(article, locale),
    summary: articleSummary(article, locale),
  };
}

export function eventDescription(event: EventRow, locale: string) {
  const value = pickLocaleField(locale, {
    nl: event.description_nl,
    en: event.description_en,
    es: event.description_es,
    fa: event.description_fa,
  });
  return value || null;
}

export function normalizeArticle(row: Partial<Article> & { id: string }): Article {
  return {
    id: row.id,
    source_url: row.source_url ?? "",
    source_name: row.source_name ?? "",
    category: (row.category as NewsCategory) ?? "culture",
    published_at: row.published_at ?? new Date().toISOString(),
    title_nl: row.title_nl ?? "",
    title_en: row.title_en ?? "",
    title_es: row.title_es ?? "",
    title_fa: row.title_fa ?? "",
    summary_nl: row.summary_nl ?? "",
    summary_en: row.summary_en ?? "",
    summary_es: row.summary_es ?? "",
    summary_fa: row.summary_fa ?? "",
    image_url: row.image_url ?? null,
    locales:
      row.locales?.length ? row.locales : [...CONTENT_LOCALES],
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

export function normalizeEvent(row: Partial<EventRow> & { id: string }): EventRow {
  return {
    id: row.id,
    name: row.name ?? "",
    venue: row.venue ?? "",
    event_datetime: row.event_datetime ?? new Date().toISOString(),
    genre: (row.genre as EventGenre) ?? "live-band",
    ticket_link: row.ticket_link ?? null,
    image_url: row.image_url ?? null,
    description_nl: row.description_nl ?? null,
    description_en: row.description_en ?? null,
    description_es: row.description_es ?? null,
    description_fa: row.description_fa ?? null,
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

export function normalizeRss(row: Partial<RssSource> & { id: string }): RssSource {
  return {
    id: row.id,
    name: row.name ?? "",
    url: row.url ?? "",
    enabled: row.enabled !== false,
    created_at: row.created_at ?? new Date().toISOString(),
    last_pulled_at: row.last_pulled_at ?? null,
    last_error: row.last_error ?? null,
  };
}
