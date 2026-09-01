import type { NewsCategory } from "@/lib/types";

export const CATEGORY_PLACEHOLDERS: Record<NewsCategory, string> = {
  politics: "/placeholders/politics.jpg",
  infrastructure: "/placeholders/infrastructure.jpg",
  culture: "/placeholders/culture.jpg",
  business: "/placeholders/business.jpg",
  safety: "/placeholders/safety.jpg",
  education: "/placeholders/education.jpg",
  sports: "/placeholders/sports.jpg",
};

export const EVENT_PLACEHOLDER = "/placeholders/event.jpg";
export const NEWS_PLACEHOLDER = "/placeholders/news.jpg";

export function articleImage(imageUrl: string | null | undefined, category?: NewsCategory) {
  if (imageUrl) return imageUrl;
  if (category) return CATEGORY_PLACEHOLDERS[category];
  return NEWS_PLACEHOLDER;
}

export function eventImage(imageUrl: string | null | undefined) {
  return imageUrl || EVENT_PLACEHOLDER;
}
