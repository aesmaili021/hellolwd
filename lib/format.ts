import { localeTag } from "@/i18n/routing";

export function formatRelative(iso: string, locale: string) {
  const then = new Date(iso).getTime();
  const minutes = Math.round((then - Date.now()) / 60000);
  const rtf = new Intl.RelativeTimeFormat(localeTag(locale), {
    numeric: "auto",
  });

  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 14) return rtf.format(days, "day");

  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function formatEventWhen(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatEventChip(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(iso))
    .replace(",", "")
    .toUpperCase();
}

export function formatWeekendRange(dates: string[], locale: string) {
  if (!dates.length) return "";
  const sorted = dates.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  const weekday = new Intl.DateTimeFormat(localeTag(locale), { weekday: "short" });
  const day = new Intl.DateTimeFormat(localeTag(locale), { day: "numeric" });
  const month = new Intl.DateTimeFormat(localeTag(locale), { month: "long" });
  return `${weekday.format(start).toUpperCase()} ${day.format(start)} — ${weekday.format(end).toUpperCase()} ${day.format(end)} ${month.format(end).toUpperCase()}`;
}

export function formatPublished(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
