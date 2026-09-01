import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en", "es", "fa"],
  defaultLocale: "en",
  localePrefix: "always",
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
