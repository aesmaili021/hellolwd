import places from "@/data/places.json";

export const PLACE_CATEGORIES = [
  "cafes",
  "eats",
  "bars",
  "groceries",
  "hair",
  "sports",
  "student",
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export type Place = {
  slug: string;
  name: string;
  category: PlaceCategory;
  address: string;
  website: string | null;
  email: string | null;
  description: { nl: string; en: string; es: string; fa: string };
  source: string;
  featured: boolean;
};

const rows = places as Place[];

function isCategory(value: string): value is PlaceCategory {
  return (PLACE_CATEGORIES as readonly string[]).includes(value);
}

export function placeMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function placeDescription(place: Place, locale: string) {
  if (locale === "nl" || locale === "en" || locale === "es" || locale === "fa") {
    return place.description[locale];
  }
  return place.description.en;
}

export function getPlaces() {
  return [...rows].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name, "en");
  });
}

export function getPlace(slug: string) {
  return rows.find((place) => place.slug === slug) ?? null;
}

export function filterPlaces(category?: string, query?: string) {
  const cat = category && isCategory(category) ? category : undefined;
  const q = query?.trim().toLowerCase() ?? "";
  return getPlaces().filter((place) => {
    if (cat && place.category !== cat) return false;
    if (!q) return true;
    const haystack = [place.name, place.address, place.description.en, place.description.nl]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Homepage slot: featured rows first, then one place from each category until full. */
export function spotlightPlaces(limit = 3) {
  const all = getPlaces();
  const picked = all.filter((place) => place.featured).slice(0, limit);
  const used = new Set(picked.map((place) => place.slug));
  for (const category of PLACE_CATEGORIES) {
    if (picked.length >= limit) break;
    const next = all.find((place) => place.category === category && !used.has(place.slug));
    if (!next) continue;
    picked.push(next);
    used.add(next.slug);
  }
  return picked.slice(0, limit);
}

export function claimSubject(name: string) {
  return `Claim listing: ${name}`;
}
