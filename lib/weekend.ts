import { amsterdamDay } from "@/lib/today";
import type { EventRow } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function amsterdamWeekday(value: Date | string = new Date()) {
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    weekday: "short",
  }).format(new Date(value));
  return WEEKDAYS.indexOf(label as (typeof WEEKDAYS)[number]);
}

export function shiftYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function listingWeekend(now = new Date()) {
  const today = amsterdamDay(now);
  const weekday = amsterdamWeekday(now);
  const friday = shiftYmd(today, weekday === 0 ? -2 : 5 - weekday);
  return { friday, sunday: shiftYmd(friday, 2) };
}

export function nextListingWeekend(now = new Date()) {
  const { friday } = listingWeekend(now);
  const nextFriday = shiftYmd(friday, 7);
  return { friday: nextFriday, sunday: shiftYmd(nextFriday, 2) };
}

export function inYmdRange(iso: string, start: string, end: string) {
  const day = amsterdamDay(iso);
  return day >= start && day <= end;
}

export function weekendEvents(events: EventRow[], friday: string, sunday: string) {
  return events.filter((event) => inYmdRange(event.event_datetime, friday, sunday));
}

export function splitDeskEvents(events: EventRow[], now = new Date()) {
  const current = listingWeekend(now);
  const thisWeekend = weekendEvents(events, current.friday, current.sunday);
  const upcoming = events.filter((event) => amsterdamDay(event.event_datetime) > current.sunday);
  const past = events.filter((event) => amsterdamDay(event.event_datetime) < current.friday);
  return { thisWeekend, upcoming, past, current };
}

export function eventsToCopyForward(events: EventRow[], now = new Date()) {
  const { thisWeekend, current } = splitDeskEvents(events, now);
  if (thisWeekend.length) return thisWeekend;
  const next = nextListingWeekend(now);
  return weekendEvents(events, next.friday, next.sunday);
}

export function shiftIsoDays(iso: string, days: number) {
  return new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function alreadyListed(events: EventRow[], name: string, venue: string, iso: string) {
  const day = amsterdamDay(iso);
  return events.some(
    (event) =>
      event.name === name && event.venue === venue && amsterdamDay(event.event_datetime) === day,
  );
}

export function copyForwardPreview(events: EventRow[], now = new Date()) {
  const source = eventsToCopyForward(events, now);
  const fresh = source.filter((row) => {
    const nextTime = shiftIsoDays(row.event_datetime, 7);
    return !alreadyListed(events, row.name, row.venue, nextTime);
  });
  const from = source[0] ? amsterdamDay(source[0].event_datetime) : "";
  const to = fresh[0]
    ? amsterdamDay(shiftIsoDays(fresh[0].event_datetime, 7))
    : source[0]
      ? amsterdamDay(shiftIsoDays(source[0].event_datetime, 7))
      : "";
  return { source, fresh, from, to };
}

export function formatDeskRange(friday: string, sunday: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${fmt.format(new Date(`${friday}T00:00:00Z`))} – ${fmt.format(new Date(`${sunday}T00:00:00Z`))}`;
}
