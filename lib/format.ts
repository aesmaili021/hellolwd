import { localeTag, type Locale } from "./locales";

export function formatStamp(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatEventWhen(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
