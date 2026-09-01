import { loadStore } from "@/lib/data/store";
import { normalizeRss, type RssSource } from "@/lib/types";

export async function getRssSources(): Promise<RssSource[]> {
  const store = await loadStore();
  return store.rss
    .map(normalizeRss)
    .sort((a, b) => a.name.localeCompare(b.name));
}
