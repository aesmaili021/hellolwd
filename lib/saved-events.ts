export const SAVED_EVENTS_KEY = "hellolwd.savedEvents";

function isId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function readSavedEventIds(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_EVENTS_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter(isId) : [];
  } catch {
    return [];
  }
}

export function writeSavedEventIds(ids: string[]) {
  localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(ids));
}

export function toggleSavedEventId(id: string): string[] {
  const current = readSavedEventIds();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  writeSavedEventIds(next);
  return next;
}
