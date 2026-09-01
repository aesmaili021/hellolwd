import { mockRss } from "@/lib/data/mock";
import { loadStore, updateStore } from "@/lib/data/store";
import { normalizeArticleUrl } from "@/lib/rss/parse";
import { normalizeRss, type RssSource } from "@/lib/types";

export async function ensureNationalFeed() {
  const seed = mockRss.find((feed) => feed.scope === "national");
  if (!seed) return;
  await updateStore((store) => {
    const exists = store.rss.some(
      (row) =>
        row.id === seed.id ||
        normalizeArticleUrl(row.url) === normalizeArticleUrl(seed.url) ||
        row.scope === "national",
    );
    if (!exists) store.rss.push(normalizeRss(seed));
  });
}

export async function getRssSources(): Promise<RssSource[]> {
  await ensureNationalFeed();
  const store = await loadStore();
  return store.rss
    .map(normalizeRss)
    .sort((a, b) => a.name.localeCompare(b.name));
}
