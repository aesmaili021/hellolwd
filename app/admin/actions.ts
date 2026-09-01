"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminLoginPath,
  checkAdminCredentials,
  clearAdminCookie,
  isAdmin,
  loginAllowed,
  recordFailedLogin,
  requireAdmin,
  setAdminCookie,
} from "@/lib/admin/auth";
import { resolveImageUrl } from "@/lib/data/media";
import { updateStore } from "@/lib/data/store";
import { fillMissingBriefings, translateBriefingTo } from "@/lib/rss/translate";
import {
  CONTENT_LOCALES,
  EVENT_GENRES,
  NEWS_CATEGORIES,
  normalizeArticle,
  normalizeEvent,
  normalizeRss,
  type ContentLocale,
  type EventGenre,
  type NewsCategory,
} from "@/lib/types";

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function optional(form: FormData, key: string) {
  const value = text(form, key);
  return value || null;
}

function toIso(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function pickedLocales(form: FormData): ContentLocale[] {
  const picked = form
    .getAll("locales")
    .map(String)
    .filter((code): code is ContentLocale =>
      (CONTENT_LOCALES as readonly string[]).includes(code),
    );
  return picked.length ? picked : ["en"];
}

function refreshPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/news");
  revalidatePath("/admin/events");
  revalidatePath("/admin/rss");
}

export async function loginAction(form: FormData) {
  const gate = adminLoginPath();
  const allowed = await loginAllowed();
  const ok = allowed && (await checkAdminCredentials(text(form, "username"), text(form, "password")));
  if (!ok) {
    if (allowed) await recordFailedLogin();
    await new Promise((resolve) => setTimeout(resolve, 350));
    redirect(`${gate}?error=1`);
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminCookie();
  redirect(adminLoginPath());
}

export async function saveArticleAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id") || crypto.randomUUID();
  const category = text(form, "category") as NewsCategory;
  const locales = pickedLocales(form);
  const article = normalizeArticle({
    id,
    source_url: text(form, "source_url") || "https://hellolwd.nl",
    source_name: text(form, "source_name") || "HelloLWD",
    category: NEWS_CATEGORIES.includes(category) ? category : "culture",
    published_at: toIso(text(form, "published_at") || new Date().toISOString()),
    image_url: await resolveImageUrl(form),
    locales,
    title_nl: text(form, "title_nl"),
    title_en: text(form, "title_en"),
    title_es: text(form, "title_es"),
    title_fa: text(form, "title_fa"),
    summary_nl: text(form, "summary_nl"),
    summary_en: text(form, "summary_en"),
    summary_es: text(form, "summary_es"),
    summary_fa: text(form, "summary_fa"),
  });
  const source = text(form, "source_locale");
  const preferred = (CONTENT_LOCALES as readonly string[]).includes(source)
    ? (source as ContentLocale)
    : undefined;
  const filled = await fillMissingBriefings(article, locales, preferred);

  const hasCopy = locales.some((code) => filled[`title_${code}` as const]);
  if (!hasCopy) redirect("/admin/news/new?error=1");

  await updateStore((store) => {
    const index = store.articles.findIndex((row) => row.id === id);
    if (index >= 0) store.articles[index] = filled;
    else store.articles.unshift(filled);
  });
  refreshPublic();
  redirect("/admin/news");
}

export async function translateDeskCopyAction(input: {
  source: ContentLocale;
  title: string;
  summary: string;
  targets: ContentLocale[];
}): Promise<
  | { ok: true; copy: Partial<Record<ContentLocale, { title: string; summary: string }>> }
  | { ok: false }
> {
  if (!(await isAdmin())) return { ok: false };
  if (!(CONTENT_LOCALES as readonly string[]).includes(input.source) || !input.title.trim()) {
    return { ok: false };
  }
  const copy: Partial<Record<ContentLocale, { title: string; summary: string }>> = {};
  for (const locale of input.targets) {
    if (!(CONTENT_LOCALES as readonly string[]).includes(locale) || locale === input.source) continue;
    const piece = await translateBriefingTo(input.title, input.summary, locale, input.source);
    if (piece) copy[locale] = piece;
  }
  return { ok: true, copy };
}

export async function deleteArticleAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  await updateStore((store) => {
    store.articles = store.articles.filter((row) => row.id !== id);
  });
  refreshPublic();
  redirect("/admin/news");
}

export async function saveEventAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id") || crypto.randomUUID();
  const genre = text(form, "genre") as EventGenre;
  const event = normalizeEvent({
    id,
    name: text(form, "name"),
    venue: text(form, "venue"),
    event_datetime: toIso(text(form, "event_datetime")),
    genre: EVENT_GENRES.includes(genre) ? genre : "live-band",
    ticket_link: optional(form, "ticket_link"),
    image_url: await resolveImageUrl(form),
    description_nl: optional(form, "description_nl"),
    description_en: optional(form, "description_en"),
    description_es: optional(form, "description_es"),
    description_fa: optional(form, "description_fa"),
  });
  if (!event.name || !event.venue) redirect("/admin/events/new?error=1");

  await updateStore((store) => {
    const index = store.events.findIndex((row) => row.id === id);
    if (index >= 0) store.events[index] = event;
    else store.events.unshift(event);
  });
  refreshPublic();
  redirect("/admin/events");
}

export async function deleteEventAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  await updateStore((store) => {
    store.events = store.events.filter((row) => row.id !== id);
  });
  refreshPublic();
  redirect("/admin/events");
}

export async function saveRssAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id") || crypto.randomUUID();
  const locales = form.getAll("locales").length ? pickedLocales(form) : undefined;
  const source = normalizeRss({
    id,
    name: text(form, "name"),
    url: text(form, "url"),
    enabled: form.get("enabled") === "on",
    locales,
  });
  if (!source.name || !source.url) redirect("/admin/rss?error=1");

  await updateStore((store) => {
    const index = store.rss.findIndex((row) => row.id === id);
    if (index >= 0) {
      const prev = store.rss[index];
      store.rss[index] = {
        ...prev,
        ...source,
        locales: locales ?? prev.locales,
        last_pulled_at: prev.last_pulled_at,
        last_error: prev.last_error,
      };
    } else store.rss.unshift(source);
  });
  refreshPublic();
  redirect("/admin/rss");
}

export async function ingestFeedsAction() {
  await requireAdmin();
  const { ingestFeeds } = await import("@/lib/rss/ingest");
  const result = await ingestFeeds();
  refreshPublic();
  redirect(`/admin/rss?added=${result.added}&updated=${result.updated}&images=${result.images}`);
}

export async function deleteRssAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  await updateStore((store) => {
    store.rss = store.rss.filter((row) => row.id !== id);
  });
  refreshPublic();
  redirect("/admin/rss");
}
