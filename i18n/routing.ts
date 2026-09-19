import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en", "es", "fa"],
  defaultLocale: "en",
  localePrefix: "always",
  // HTML <link rel="alternate" hreflang> comes from page metadata (lib/seo).
  // next-intl's Link header mirrors the request host (www vs apex) and uses an
  // unprefixed x-default URL — that conflicts with our canonicals in GSC.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export function localeDir(locale: string): "ltr" | "rtl" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function localeTag(locale: string): string {
  switch (locale) {
    case "nl":
      return "nl-NL";
    case "es":
      return "es-ES";
    case "fa":
      return "fa-IR";
    default:
      return "en-GB";
  }
}
