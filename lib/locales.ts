export const locales = ["nl", "en", "es", "fa"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function localeTag(locale: Locale): string {
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
