import type { EventRow } from "@/lib/types";

export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function eventMapsHref(event: Pick<EventRow, "venue" | "maps_url">): string {
  return (
    safeHttpUrl(event.maps_url) ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, Leeuwarden`)}`
  );
}
