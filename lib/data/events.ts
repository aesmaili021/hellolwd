import { loadStore } from "@/lib/data/store";
import { EVENT_GENRES, normalizeEvent, type EventGenre, type EventRow } from "@/lib/types";

function isGenre(value: string): value is EventGenre {
  return (EVENT_GENRES as readonly string[]).includes(value);
}

export async function getAllEvents(): Promise<EventRow[]> {
  const store = await loadStore();
  return store.events
    .map(normalizeEvent)
    .sort(
      (a, b) =>
        new Date(a.event_datetime).getTime() -
        new Date(b.event_datetime).getTime(),
    );
}

export async function getEvents(genre?: string): Promise<EventRow[]> {
  const now = Date.now();
  const rows = (await getAllEvents()).filter(
    (item) => new Date(item.event_datetime).getTime() >= now,
  );
  if (genre && isGenre(genre)) {
    return rows.filter((item) => item.genre === genre);
  }
  return rows;
}

export async function getEvent(id: string): Promise<EventRow | null> {
  const rows = await getAllEvents();
  return rows.find((item) => item.id === id) ?? null;
}
