import type { Locale } from "./locales";

export type Localized = Record<Locale, string>;

export type NewsCategory =
  | "politics"
  | "infrastructure"
  | "culture"
  | "business"
  | "safety"
  | "education"
  | "sports";

export type EventGenre =
  | "electronic"
  | "hiphop"
  | "live"
  | "student"
  | "dj";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  originalUrl: string;
  featured?: boolean;
  headline: Localized;
  summary: Localized;
};

export type EventItem = {
  id: string;
  startsAt: string;
  venue: string;
  genre: EventGenre;
  link: string;
  featured?: boolean;
  name: Localized;
  detail: Localized;
};
