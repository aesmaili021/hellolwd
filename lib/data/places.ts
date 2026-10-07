import { loadStore } from "@/lib/data/store";
import {
  PLACE_CATEGORIES,
  isPlaceCategory,
  normalizePlace,
  type PlaceCategory,
  type PlaceRow,
} from "@/lib/types";

export function placeDescription(place: PlaceRow, locale: string) {
  const copy = {
    nl: place.description_nl,
    en: place.description_en,
    es: place.description_es,
    fa: place.description_fa,
  };
  if (locale === "nl" || locale === "en" || locale === "es" || locale === "fa") {
    return copy[locale].trim() || copy.en.trim() || copy.nl.trim();
  }
  return copy.en.trim() || copy.nl.trim();
}

export function placeDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function claimMail(name: string) {
  return `mailto:info@hellolwd.com?subject=${encodeURIComponent(`Claim listing: ${name}`)}`;
}

export function sortPlaces(rows: PlaceRow[]) {
  return [...rows].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.name.localeCompare(b.name, "en");
  });
}

export async function getAllPlaces() {
  const store = await loadStore();
  return sortPlaces((store.places ?? []).map((row) => normalizePlace(row)));
}

export async function getVisiblePlaces() {
  return (await getAllPlaces()).filter((place) => place.visible);
}

export async function getPlace(id: string) {
  const rows = await getAllPlaces();
  return rows.find((place) => place.id === id) ?? null;
}

export function filterPlaces(rows: PlaceRow[], category?: string, query?: string) {
  const cat = category && isPlaceCategory(category) ? category : undefined;
  const q = query?.trim().toLowerCase() ?? "";
  return rows.filter((place) => {
    if (cat && place.category !== cat) return false;
    if (!q) return true;
    const haystack = [
      place.name,
      place.address,
      place.description_en,
      place.description_nl,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Homepage slot: featured rows first, then one visible place from each category. */
export function spotlightPlaces(rows: PlaceRow[], limit = 3) {
  const visible = rows.filter((place) => place.visible);
  const picked: PlaceRow[] = [];
  const used = new Set<string>();
  for (const place of visible) {
    if (!place.featured) continue;
    picked.push(place);
    used.add(place.id);
    if (picked.length >= limit) return picked;
  }
  for (const category of PLACE_CATEGORIES) {
    if (picked.length >= limit) break;
    const next = visible.find((place) => place.category === category && !used.has(place.id));
    if (!next) continue;
    picked.push(next);
    used.add(next.id);
  }
  return picked.slice(0, limit);
}

export function nextPlaceOrder(rows: PlaceRow[], category: PlaceCategory) {
  const inCategory = rows.filter((place) => place.category === category);
  const max = inCategory.reduce((highest, place) => Math.max(highest, place.sort_order), 0);
  return max + 10;
}
