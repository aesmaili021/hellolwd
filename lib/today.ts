import type { EventRow } from "@/lib/types";

const TZ = "Europe/Amsterdam";

export function amsterdamDay(value: Date | string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function isAmsterdamToday(value: Date | string) {
  return amsterdamDay(value) === amsterdamDay(new Date());
}

export function pickTodayEvent(events: EventRow[]) {
  const now = Date.now();
  const today = amsterdamDay(new Date());
  const open = events.filter((event) => new Date(event.event_datetime).getTime() >= now - 2 * 60 * 60 * 1000);
  const tonight = open.find((event) => amsterdamDay(event.event_datetime) === today) ?? null;
  return {
    event: tonight ?? open[0] ?? null,
    tonight: Boolean(tonight),
  };
}
