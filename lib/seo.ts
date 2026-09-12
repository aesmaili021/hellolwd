import type { Metadata } from "next";
import { routing, localeTag, type Locale } from "@/i18n/routing";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://hellolwd.com"
).replace(/\/$/, "");

export const DEFAULT_OG_PATH = "/placeholders/news.jpg";

const HREFLANG: Record<Locale, string> = {
  nl: "nl-NL",
  en: "en-GB",
  es: "es-419",
  fa: "fa-IR",
};

export function localePath(locale: string, path = "/") {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${suffix}`;
}

export function absUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${suffix}`;
}

export function localeUrl(locale: string, path = "/") {
  return absUrl(localePath(locale, path));
}

export function absoluteImage(src?: string | null) {
  if (!src) return absUrl(DEFAULT_OG_PATH);
  return absUrl(src);
}

export function languageAlternates(path = "/", locales: readonly string[] = routing.locales) {
  const languages: Record<string, string> = {
    "x-default": localeUrl("en", path),
  };
  for (const locale of locales) {
    if (!(routing.locales as readonly string[]).includes(locale)) continue;
    languages[HREFLANG[locale as Locale]] = localeUrl(locale, path);
  }
  return languages;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
  publishedTime,
  authors,
  section,
  languages,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  section?: string;
  languages?: readonly string[];
}): Metadata {
  const url = localeUrl(locale, path);
  const ogImage = absoluteImage(image);
  const ogLocale = localeTag(locale).replace("-", "_");

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path, languages),
    },
    openGraph: {
      type,
      locale: ogLocale,
      url,
      siteName: "HelloLWD",
      title,
      description,
      images: [{ url: ogImage, alt: title }],
      ...(type === "article"
        ? {
            publishedTime,
            authors,
            section,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
