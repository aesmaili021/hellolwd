import { normalizeReadableText } from "@/lib/rss/parse";
import {
  articleHasTranslation,
  CONTENT_LOCALES,
  isNationalSource,
  NEWS_CATEGORIES,
  type Article,
  type ContentLocale,
  type NewsCategory,
} from "@/lib/types";

export type TargetLocale = "en" | "es" | "fa";

export type LocalePiece = {
  title: string;
  summary: string;
};

const TARGETS = ["en", "es", "fa"] as const;

const LANG: Record<ContentLocale, string> = {
  nl: "Dutch",
  en: "English",
  es: "Spanish",
  fa: "Persian (Farsi)",
};
const UA = "HelloLWD/0.1 (local news briefing; +https://hellolwd.nl)";

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
].filter((name, index, list): name is string => Boolean(name) && list.indexOf(name) === index);

let geminiCoolUntil = 0;
let claudeCoolUntil = 0;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function geminiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
}

function claudeKey() {
  return process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || "";
}

function azureClaudeKey() {
  return (
    process.env.AZURE_ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_FOUNDRY_API_KEY ||
    process.env.AZURE_API_KEY ||
    ""
  );
}

function azureClaudeUrl() {
  const raw = (
    process.env.AZURE_ANTHROPIC_ENDPOINT ||
    process.env.ANTHROPIC_FOUNDRY_BASE_URL ||
    ""
  ).replace(/\/$/, "");
  if (!raw) return "";
  if (raw.endsWith("/v1/messages")) return raw;
  if (raw.endsWith("/anthropic")) return `${raw}/v1/messages`;
  return `${raw}/anthropic/v1/messages`;
}

function azureClaudeModel() {
  return (
    process.env.AZURE_CLAUDE_DEPLOYMENT ||
    process.env.CLAUDE_MODEL ||
    "claude-haiku-4-5"
  );
}

function libreUrl() {
  return (process.env.LIBRETRANSLATE_URL || "").replace(/\/$/, "");
}

function extractJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asPiece(parsed: Record<string, unknown> | Partial<LocalePiece> | null): LocalePiece | null {
  const title = String(parsed?.title ?? "").trim();
  const summary = String(parsed?.summary ?? "").trim();
  if (!title || !summary) return null;
  return { title, summary };
}

function briefingPrompt(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
) {
  const extra =
    locale === "fa"
      ? "- Farsi: natural contemporary Persian, not literary and not a calque. Correct Persian punctuation. Western digits for numbers and dates."
      : locale === "es"
        ? "- Spanish: neutral Latin American Spanish. No vosotros. No Spain-only slang."
        : "- English: plain international English. Short sentences.";

  return `You are a professional local-news editor and translator for HelloLWD in Leeuwarden.

Translate this ${LANG[from]} briefing into ${LANG[locale]}. Translate the briefing, not a new article.

Rules:
- Write as a native ${LANG[locale]} speaker. Compact local-news briefing, not word-for-word.
- Keep every fact, name, place, date, and number. Do not invent news.
- Same approximate length and detail. Do not add or drop facts.
- Keep Dutch and Frisian proper names (Leeuwarden, Grou, Cambuur, Zaailand, street names).
${extra}

Title: one-line natural headline, similar length, no trailing period unless the source has one. Plain text.

Return JSON only:
{"title":"...","summary":"..."}

TITLE:
${title}

BRIEFING:
${summary}`;
}

function parseClaudeResponse(data: {
  content?: { type?: string; text?: string }[];
}) {
  const text = (data.content ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("\n");
  return asPiece(extractJson(text));
}

async function postClaudeMessages(
  url: string,
  headers: Record<string, string>,
  model: string,
  prompt: string,
  maxTokens = 1400,
  temperature = 0.35,
  system?: string,
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      ...headers,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      ...(system ? { system } : {}),
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(maxTokens > 2000 ? 90000 : 45000),
  });
  return res;
}

async function azureClaudeBriefing(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
): Promise<LocalePiece | null> {
  const url = azureClaudeUrl();
  const key = azureClaudeKey();
  if (!url || !key || Date.now() < claudeCoolUntil) return null;

  try {
    const res = await postClaudeMessages(
      url,
      { "x-api-key": key, "api-key": key },
      azureClaudeModel(),
      briefingPrompt(title, summary, locale, from),
    );
    if (res.status === 429) {
      claudeCoolUntil = Date.now() + 60 * 60 * 1000;
      console.warn("[translate] Azure Claude quota hit, falling back");
      return null;
    }
    if (!res.ok) {
      console.warn("[translate] Azure Claude", res.status, (await res.text()).slice(0, 200));
      return null;
    }
    return parseClaudeResponse(await res.json());
  } catch (error) {
    console.warn("[translate] Azure Claude", error instanceof Error ? error.message : error);
    return null;
  }
}

async function geminiBriefing(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
): Promise<LocalePiece | null> {
  if (!geminiKey() || Date.now() < geminiCoolUntil) return null;

  const prompt = briefingPrompt(title, summary, locale, from);
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": geminiKey(),
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.35,
                responseMimeType: "application/json",
              },
            }),
            signal: AbortSignal.timeout(45000),
          },
        );
        if (res.status === 429) {
          if (attempt < 2) {
            await sleep(12000 * (attempt + 1));
            continue;
          }
          geminiCoolUntil = Date.now() + 60 * 60 * 1000;
          console.warn("[translate] Gemini quota hit, falling back for 60m");
          return null;
        }
        if (!res.ok) break;
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = (data.candidates?.[0]?.content?.parts ?? [])
          .map((part) => part.text ?? "")
          .join("\n");
        const copy = asPiece(extractJson(text));
        if (copy) return copy;
      } catch {
        break;
      }
    }
  }
  return null;
}

async function claudeBriefing(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
): Promise<LocalePiece | null> {
  if (!claudeKey() || Date.now() < claudeCoolUntil) return null;

  const model = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeKey(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        temperature: 0.2,
        messages: [{ role: "user", content: briefingPrompt(title, summary, locale, from) }],
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (res.status === 429) {
      claudeCoolUntil = Date.now() + 60 * 60 * 1000;
      console.warn("[translate] Claude quota hit, falling back");
      return null;
    }
    if (!res.ok) {
      console.warn("[translate] Claude", res.status, (await res.text()).slice(0, 160));
      return null;
    }
    const data = (await res.json()) as {
      content?: { type?: string; text?: string }[];
    };
    const text = (data.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n");
    return asPiece(extractJson(text));
  } catch (error) {
    console.warn("[translate] Claude", error instanceof Error ? error.message : error);
    return null;
  }
}

function parseGtx(data: unknown) {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return "";
  return data[0]
    .map((seg) => (Array.isArray(seg) && typeof seg[0] === "string" ? seg[0] : ""))
    .join("")
    .trim();
}

async function viaLibre(text: string, source: string, target: string) {
  const base = libreUrl();
  if (!base) return "";
  const res = await fetch(`${base}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": UA },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: "text",
      api_key: process.env.LIBRETRANSLATE_API_KEY || "",
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) return "";
  const data = (await res.json()) as { translatedText?: string };
  return (data.translatedText || "").trim();
}

async function viaGtx(text: string, source: string, target: string) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    encodeURIComponent(source) +
    "&tl=" +
    encodeURIComponent(target) +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) return "";
  return parseGtx(await res.json());
}

async function viaMyMemory(text: string, source: string, target: string) {
  const chunks: string[] = [];
  let rest = text.trim();
  while (rest) {
    if (rest.length <= 450) {
      chunks.push(rest);
      break;
    }
    const cut = rest.lastIndexOf(" ", 450);
    chunks.push(rest.slice(0, cut > 200 ? cut : 450).trim());
    rest = rest.slice(cut > 200 ? cut : 450).trim();
  }

  const email = process.env.TRANSLATE_EMAIL || "hello@hellolwd.nl";
  const out: string[] = [];
  for (const chunk of chunks) {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(chunk) +
      `&langpair=${source}|${target}&de=${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return "";
    const data = (await res.json()) as {
      responseStatus?: number;
      responseData?: { translatedText?: string };
    };
    const translated = data.responseData?.translatedText?.trim() || "";
    if (!translated || data.responseStatus !== 200) return "";
    if (/MYMEMORY WARNING/i.test(translated)) return "";
    out.push(translated);
  }
  return out.join(" ").trim();
}

async function translateText(text: string, source: string, target: string) {
  const value = text.trim();
  if (!value) return "";
  for (const engine of [viaLibre, viaGtx, viaMyMemory]) {
    try {
      const translated = await engine(value, source, target);
      if (translated && translated !== value) return translated;
    } catch {
      // next free engine
    }
  }
  return "";
}

async function machineBriefing(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
): Promise<LocalePiece | null> {
  const nextTitle = await translateText(title, from, locale);
  await sleep(120);
  const nextSummary = await translateText(summary, from, locale);
  return asPiece({ title: nextTitle, summary: nextSummary });
}

export function isTargetLocale(value: string): value is TargetLocale {
  return (TARGETS as readonly string[]).includes(value);
}

function wantedLocales(article: Article) {
  const picked = article.locales?.length ? article.locales : [...CONTENT_LOCALES];
  return TARGETS.filter((code) => picked.includes(code));
}

export function needsTranslation(article: Article, locale?: TargetLocale) {
  if (!article.title_nl || !article.summary_nl) return false;
  if (locale) return wantedLocales(article).includes(locale) && !articleHasTranslation(article, locale);
  return wantedLocales(article).some((code) => !articleHasTranslation(article, code));
}

export async function translateBriefingTo(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
): Promise<LocalePiece | null> {
  if (!title.trim() || locale === from) return { title: title.trim(), summary: summary.trim() };
  return (
    (await azureClaudeBriefing(title, summary, locale, from)) ||
    (await geminiBriefing(title, summary, locale, from)) ||
    (await claudeBriefing(title, summary, locale, from)) ||
    (await machineBriefing(title, summary, locale, from))
  );
}

export function applyLocaleTranslation(
  article: Article,
  locale: ContentLocale,
  piece: LocalePiece,
): Article {
  if (locale === "nl") return { ...article, title_nl: piece.title, summary_nl: piece.summary };
  if (locale === "en") return { ...article, title_en: piece.title, summary_en: piece.summary };
  if (locale === "es") return { ...article, title_es: piece.title, summary_es: piece.summary };
  return { ...article, title_fa: piece.title, summary_fa: piece.summary };
}

function localeCopy(article: Article, locale: ContentLocale) {
  if (locale === "nl") return { title: article.title_nl, summary: article.summary_nl };
  if (locale === "en") return { title: article.title_en, summary: article.summary_en };
  if (locale === "es") return { title: article.title_es, summary: article.summary_es };
  return { title: article.title_fa, summary: article.summary_fa };
}

export function pickBriefingSource(
  article: Article,
  locales: ContentLocale[] = [...CONTENT_LOCALES],
  preferred?: ContentLocale,
) {
  if (preferred && localeCopy(article, preferred).title.trim()) return preferred;
  const filled = locales.filter((code) => localeCopy(article, code).title.trim());
  if (!filled.length) return null;
  return filled.sort(
    (a, b) => localeCopy(article, b).summary.trim().length - localeCopy(article, a).summary.trim().length,
  )[0];
}

export async function fillMissingBriefings(
  article: Article,
  locales: ContentLocale[],
  preferred?: ContentLocale,
): Promise<Article> {
  const source = pickBriefingSource(article, locales, preferred);
  if (!source) return article;
  const { title, summary } = localeCopy(article, source);
  let next = article;
  for (const locale of locales) {
    if (locale === source) continue;
    const existing = localeCopy(next, locale);
    if (existing.title.trim() && existing.summary.trim()) continue;
    const piece = await translateBriefingTo(title, summary, locale, source);
    if (piece) next = applyLocaleTranslation(next, locale, piece);
  }
  return next;
}

export async function translateArticleTo(
  article: Article,
  locale: TargetLocale,
): Promise<Article> {
  if (!needsTranslation(article, locale)) return article;
  const piece = await translateBriefingTo(article.title_nl, article.summary_nl, locale);
  return piece ? applyLocaleTranslation(article, locale, piece) : article;
}

export type BriefingCopy = {
  category?: NewsCategory;
  title_nl?: string;
  title_en: string;
  title_es: string;
  title_fa: string;
  summary_nl?: string;
  summary_en: string;
  summary_es: string;
  summary_fa: string;
};

export type DeskBriefing = { skip: true } | ({ skip?: false } & BriefingCopy);

const DESK_SYSTEM =
  "You are a professional local-news editor and translator for HelloLWD, a multilingual local news site for Leeuwarden, Friesland, Netherlands. Return ONLY valid JSON. No markdown fences, no commentary.";

function asBriefing(parsed: Record<string, unknown> | null): BriefingCopy | null {
  const title_en = String(parsed?.title_en ?? "").trim();
  const title_es = String(parsed?.title_es ?? "").trim();
  const title_fa = String(parsed?.title_fa ?? "").trim();
  const summary_en = String(parsed?.summary_en ?? "").trim();
  const summary_es = String(parsed?.summary_es ?? "").trim();
  const summary_fa = String(parsed?.summary_fa ?? "").trim();
  if (!title_en || !title_es || !title_fa || !summary_en || !summary_es || !summary_fa) {
    return null;
  }
  const categoryRaw = String(parsed?.category ?? "").trim().toLowerCase();
  const category = NEWS_CATEGORIES.includes(categoryRaw as NewsCategory)
    ? (categoryRaw as NewsCategory)
    : undefined;
  const title_nl = String(parsed?.title_nl ?? "").trim();
  const summary_nl = String(parsed?.summary_nl ?? "").trim();
  return {
    category,
    title_nl: title_nl || undefined,
    title_en,
    title_es,
    title_fa,
    summary_nl: summary_nl || undefined,
    summary_en,
    summary_es,
    summary_fa,
  };
}

function asDeskBriefing(parsed: Record<string, unknown> | null): DeskBriefing | null {
  if (!parsed) return null;
  if (String(parsed.category ?? "").trim().toLowerCase() === "skip") return { skip: true };
  return asBriefing(parsed);
}

function deskBriefingPrompt(title: string, body: string, sourceName: string, national = false) {
  return `INPUT
Title (Dutch): ${title}
Body (Dutch): ${body}
Source: ${sourceName}
Desk: ${national ? "Dutch national / government news for readers in Leeuwarden" : "Leeuwarden / Friesland local news"}

INSTRUCTIONS

1. CATEGORIZE into exactly one of:
   politics, infrastructure, culture, business, safety, education, sports

   Use these meanings:
   - politics: cabinet, Tweede Kamer, ministers, elections, council, mayor, province, public policy
   - infrastructure: roads, NS/OV, construction, water, energy, housing-as-building
   - culture: arts, festivals, heritage, nightlife as culture
   - business: shops, companies, jobs, tourism as economy
   - safety: police, fire, accidents, crime, nuisance
   - education: schools, universities, NHL Stenden, students
   - sports: Cambuur, Oranje, matches, sport clubs
   If two fit, pick the one the reader opened the story for.

2. WRITE summary_nl: 2–3 factual Dutch sentences. Original paraphrase — do not copy sentences from the source. Neutral. No editorializing. No quotes.
   The body may be only an RSS teaser. That is enough. Do not invent facts that are not in the title or body. If the teaser is thin, write two short sentences from what is given.

3. TRANSLATE that Dutch summary (not the source article) into English, Spanish, and Farsi.
   - Native voice. Compact local-news briefing. Not word-for-word.
   - Same facts and roughly the same length. Do not add or drop facts.
   - English: plain international English.
   - Spanish: neutral Latin American Spanish (no vosotros, no Spain-only slang).
   - Farsi: natural contemporary Persian, not literary. Correct Persian punctuation. Western digits for numbers and dates so they match the site.
   - Keep Dutch and Frisian proper names (Leeuwarden, Grou, Cambuur, Zaailand, street names).

4. TITLES
   - title_nl: keep the original Dutch headline if it is already a clear news headline. Rewrite only if it is vague, clickbait, or all-caps — same length, factual.
   - title_en / title_es / title_fa: natural headlines in each language, concise, similar length. Not a calque.

5. SKIP
   Set "category" to "skip" and all other fields to "" ONLY if:
   - the text is empty, garbled, or not news, OR
   - it is foreign/international wire with no Netherlands angle.
   Dutch national news, cabinet, Tweede Kamer, Rijksoverheid, and national policy ARE in scope. Do not skip them for lacking a Leeuwarden angle.
   Do NOT skip a short local RSS teaser.

OUTPUT — valid JSON only:
{
  "category": "politics|infrastructure|culture|business|safety|education|sports|skip",
  "title_nl": "...",
  "title_en": "...",
  "title_es": "...",
  "title_fa": "...",
  "summary_nl": "...",
  "summary_en": "...",
  "summary_es": "...",
  "summary_fa": "..."
}`;
}

function bodyPrompt(body: string, locale: TargetLocale) {
  return `You are HelloLWD: a friendly local news desk in Leeuwarden writing for internationals who just moved here.

Translate this full Dutch news article into ${LANG[locale]}.

Voice:
- Warm and plain. Short sentences. Everyday words.
- Keep every fact, name, place, date, and number. Do not invent news.
- Keep paragraph breaks.
- If a Dutch or Frisian saying or very local habit would confuse a newcomer, add one short extra sentence that says what it means.
${locale === "fa" ? "- Natural Persian (BBC Persian). Persian digits for ages and clock times." : ""}

Return JSON only:
{"body":"..."}

ARTICLE:
${body}`;
}

function asBody(parsed: Record<string, unknown> | null) {
  const body = normalizeReadableText(String(parsed?.body ?? ""));
  return body || null;
}

async function azurePrompt(prompt: string, maxTokens: number, system?: string, temperature = 0.35) {
  const url = azureClaudeUrl();
  const key = azureClaudeKey();
  if (!url || !key || Date.now() < claudeCoolUntil) return null;
  try {
    const res = await postClaudeMessages(
      url,
      { "x-api-key": key, "api-key": key },
      azureClaudeModel(),
      prompt,
      maxTokens,
      temperature,
      system,
    );
    if (res.status === 429) {
      claudeCoolUntil = Date.now() + 60 * 60 * 1000;
      return null;
    }
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: { type?: string; text?: string }[] };
    return (data.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n");
  } catch {
    return null;
  }
}

async function geminiPrompt(prompt: string) {
  if (!geminiKey() || Date.now() < geminiCoolUntil) return null;
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": geminiKey(),
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.35,
                responseMimeType: "application/json",
              },
            }),
            signal: AbortSignal.timeout(60000),
          },
        );
        if (res.status === 429) {
          if (attempt < 2) {
            await sleep(12000 * (attempt + 1));
            continue;
          }
          geminiCoolUntil = Date.now() + 60 * 60 * 1000;
          return null;
        }
        if (!res.ok) break;
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        return (data.candidates?.[0]?.content?.parts ?? [])
          .map((part) => part.text ?? "")
          .join("\n");
      } catch {
        break;
      }
    }
  }
  return null;
}

async function claudePrompt(prompt: string, maxTokens: number, system?: string, temperature = 0.35) {
  if (!claudeKey() || Date.now() < claudeCoolUntil) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeKey(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5",
        max_tokens: maxTokens,
        temperature,
        ...(system ? { system } : {}),
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (res.status === 429) {
      claudeCoolUntil = Date.now() + 60 * 60 * 1000;
      return null;
    }
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: { type?: string; text?: string }[] };
    return (data.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n");
  } catch {
    return null;
  }
}

export function applyBriefingCopy(article: Article, copy: BriefingCopy): Article {
  return {
    ...article,
    ...(copy.category ? { category: copy.category } : {}),
    ...(copy.title_nl ? { title_nl: copy.title_nl } : {}),
    ...(copy.summary_nl ? { summary_nl: copy.summary_nl } : {}),
    title_en: copy.title_en,
    title_es: copy.title_es,
    title_fa: copy.title_fa,
    summary_en: copy.summary_en,
    summary_es: copy.summary_es,
    summary_fa: copy.summary_fa,
  };
}

export async function translateBriefingAll(
  title: string,
  body: string,
  sourceName = "",
  national = false,
): Promise<DeskBriefing | null> {
  if (!title.trim()) return null;
  const prompt = deskBriefingPrompt(title, body, sourceName, national);
  const text =
    (await azurePrompt(prompt, 2200, DESK_SYSTEM, 0.2)) ||
    (await geminiPrompt(`${DESK_SYSTEM}\n\n${prompt}`)) ||
    (await claudePrompt(prompt, 2200, DESK_SYSTEM, 0.2));
  const desk = asDeskBriefing(extractJson(text || ""));
  if (desk) return desk;

  const assembled: Record<string, string> = {};
  for (const locale of TARGETS) {
    const piece = await translateBriefingTo(title, body, locale);
    if (!piece) return null;
    assembled[`title_${locale}`] = piece.title;
    assembled[`summary_${locale}`] = piece.summary;
  }
  return asDeskBriefing(assembled);
}

export async function translateMany(articles: Article[]) {
  const done: Article[] = [];
  const skippedIds: string[] = [];
  for (const article of articles) {
    if (!needsTranslation(article)) {
      done.push(article);
      continue;
    }
    const national = isNationalSource(article);
    const copy = await translateBriefingAll(
      article.title_nl,
      article.body_nl?.trim() || article.summary_nl,
      article.source_name,
      national,
    );
    if (copy?.skip) {
      if (!national) {
        console.warn("[translate] skipped non-local or empty story", article.title_nl.slice(0, 80));
        skippedIds.push(article.id);
        continue;
      }
      console.warn("[translate] ignoring skip on national story", article.title_nl.slice(0, 80));
    } else if (copy) {
      done.push(applyBriefingCopy(article, copy));
      continue;
    }
    let next = article;
    for (const locale of wantedLocales(article)) {
      if (articleHasTranslation(next, locale)) continue;
      const piece = await translateBriefingTo(next.title_nl, next.summary_nl, locale);
      if (piece) next = applyLocaleTranslation(next, locale, piece);
    }
    done.push(next);
  }
  return { articles: done, skippedIds };
}

export function applyBodyTranslation(
  article: Article,
  locale: TargetLocale | "nl",
  body: string,
): Article {
  if (locale === "nl") return { ...article, body_nl: body };
  if (locale === "en") return { ...article, body_en: body };
  if (locale === "es") return { ...article, body_es: body };
  return { ...article, body_fa: body };
}

export async function translateBodyTo(
  dutch: string,
  locale: TargetLocale,
): Promise<string | null> {
  const source = dutch.trim();
  if (!source) return null;
  const prompt = bodyPrompt(source, locale);
  const text =
    (await azurePrompt(prompt, 4000)) ||
    (await geminiPrompt(prompt)) ||
    (await claudePrompt(prompt, 4000));
  const parsed = asBody(extractJson(text || ""));
  if (parsed) return parsed;
  return (await translateText(source.slice(0, 4500), "nl", locale)) || null;
}
