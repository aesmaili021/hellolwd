/** Recent-list page size. Two columns on desktop is five rows. */
export const STORY_PAGE_SIZE = 10;

export function parseStoryPage(value?: string) {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}

export function storyPageCount(total: number) {
  if (total <= 0) return 1;
  return Math.ceil(total / STORY_PAGE_SIZE);
}

export function storyPageSlice<T>(items: T[], page: number) {
  const start = (page - 1) * STORY_PAGE_SIZE;
  return items.slice(start, start + STORY_PAGE_SIZE);
}

/** Shareable home URL. Page 1 omits `page` so it matches the bare homepage. */
export function storyListPath(category?: string, page = 1) {
  const params = new URLSearchParams();
  if (category) params.set("cat", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

/** Numbered pages, with gaps when the list is long. */
export function storyPageWindow(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const keep = [1, total, current - 1, current, current + 1].filter(
    (n) => n >= 1 && n <= total,
  );
  const sorted = [...new Set(keep)].sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  for (const n of sorted) {
    const prev = out[out.length - 1];
    if (typeof prev === "number" && n - prev > 1) out.push("gap");
    out.push(n);
  }
  return out;
}
