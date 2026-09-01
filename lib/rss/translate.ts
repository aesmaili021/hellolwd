import { normalizeReadableText } from "@/lib/rss/parse";
import {
  articleHasTranslation,
  CONTENT_LOCALES,
  type Article,
  type ContentLocale,
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

function extractJson(text: string) {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Partial<LocalePiece>;
  } catch {
    return null;
  }
}

function asPiece(parsed: Partial<LocalePiece> | null): LocalePiece | null {
  const title = parsed?.title?.trim() || "";
  const summary = parsed?.summary?.trim() || "";
  if (!title || !summary) return null;
  return { title, summary };
}

function briefingPrompt(
  title: string,
  summary: string,
  locale: ContentLocale,
  from: ContentLocale = "nl",
) {
  return `You are HelloLWD: a friendly local news desk in Leeuwarden writing for internationals who just moved here.

Translate this ${LANG[from]} briefing into ${LANG[locale]}.

Voice:
- Warm and plain, like telling a smart friend the news over coffee.
- Short sentences. Everyday words. No stiff agency tone, no slang that needs a dictionary.
- Keep every fact, name, place, date, and number. Do not invent news.
- Do not copy Dutch word order.

Cultural terms:
- If a Dutch or Frisian saying, nickname, or very local habit would confuse a newcomer, add one short extra sentence that says what it means in daily life.
- Examples: mienskip, pompeblêd, borrel, oranjegevoel, a street everyone here just calls by a nickname.
- Do not lecture. One sentence is enough, and only when it really helps.

${locale === "fa" ? "Farsi: natural Persian (BBC Persian / radio), not a machine calque. Use Persian digits for ages and clock times." : "Keep it spoken and compact: 3–5 sentences."}

Title: one line, no trailing period unless the source has one. Plain text, no HTML.

Return JSON only:
{"title":"...","summary":"..."}

TITLE:
${title}

SOURCE:
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
      temperature: 0.35,
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
  title_en: string;
  title_es: string;
  title_fa: string;
  summary_en: string;
  summary_es: string;
  summary_fa: string;
};

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
  return { title_en, title_es, title_fa, summary_en, summary_es, summary_fa };
}

function briefingAllPrompt(title: string, summary: string) {
  return `You are HelloLWD: a friendly local news desk in Leeuwarden writing for internationals who just moved here.

Translate this Dutch briefing into English, Spanish, and Persian (Farsi).

Voice:
- Warm and plain, like telling a smart friend the news over coffee.
- Short sentences. Everyday words.
- Keep every fact, name, place, date, and number. Do not invent news.
- If a Dutch or Frisian saying would confuse a newcomer, add one short extra sentence that explains it.

Farsi: natural Persian (BBC Persian), Persian digits for ages and clock times.
English / Spanish: 3–5 spoken sentences.
Titles: one line, no trailing period unless the source has one. Plain text.

Return JSON only with keys:
title_en, title_es, title_fa, summary_en, summary_es, summary_fa

TITLE:
${title}

SOURCE:
${summary}`;
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

function asBody(parsed: Partial<LocalePiece> & { body?: string } | null) {
  const body = normalizeReadableText(parsed?.body || "");
  return body || null;
}

async function azurePrompt(prompt: string, maxTokens: number) {
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

async function claudePrompt(prompt: string, maxTokens: number) {
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
        temperature: 0.35,
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
  summary: string,
): Promise<BriefingCopy | null> {
  if (!title.trim()) return null;
  const prompt = briefingAllPrompt(title, summary);
  const text =
    (await azurePrompt(prompt, 2200)) ||
    (await geminiPrompt(prompt)) ||
    (await claudePrompt(prompt, 2200));
  const copy = asBriefing(extractJson(text || "") as Record<string, unknown> | null);
  if (copy) return copy;

  const assembled: Partial<BriefingCopy> = {};
  for (const locale of TARGETS) {
    const piece = await translateBriefingTo(title, summary, locale);
    if (!piece) return null;
    assembled[`title_${locale}`] = piece.title;
    assembled[`summary_${locale}`] = piece.summary;
  }
  return asBriefing(assembled as Record<string, unknown>);
}

export async function translateMany(articles: Article[]) {
  const done: Article[] = [];
  for (const article of articles) {
    if (!needsTranslation(article)) {
      done.push(article);
      continue;
    }
    const wanted = wantedLocales(article);
    if (wanted.length === TARGETS.length) {
      const copy = await translateBriefingAll(article.title_nl, article.summary_nl);
      done.push(copy ? applyBriefingCopy(article, copy) : article);
      continue;
    }
    let next = article;
    for (const locale of wanted) {
      if (articleHasTranslation(next, locale)) continue;
      const piece = await translateBriefingTo(next.title_nl, next.summary_nl, locale);
      if (piece) next = applyLocaleTranslation(next, locale, piece);
    }
    done.push(next);
  }
  return done;
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
  const parsed = asBody(extractJson(text || "") as { body?: string } | null);
  if (parsed) return parsed;
  return (await translateText(source.slice(0, 4500), "nl", locale)) || null;
}
