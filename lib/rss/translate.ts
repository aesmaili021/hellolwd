import { articleHasTranslation, type Article } from "@/lib/types";

export type TargetLocale = "en" | "es" | "fa";

export type LocalePiece = {
  title: string;
  summary: string;
};

const TARGETS = ["en", "es", "fa"] as const;

const LANG: Record<TargetLocale, string> = {
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

function briefingPrompt(title: string, summary: string, locale: TargetLocale) {
  return `You are HelloLWD: a friendly local news desk in Leeuwarden writing for internationals who just moved here.

Translate this Dutch briefing into ${LANG[locale]}.

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
      max_tokens: 1400,
      temperature: 0.35,
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(45000),
  });
  return res;
}

async function azureClaudeBriefing(
  title: string,
  summary: string,
  locale: TargetLocale,
): Promise<LocalePiece | null> {
  const url = azureClaudeUrl();
  const key = azureClaudeKey();
  if (!url || !key || Date.now() < claudeCoolUntil) return null;

  try {
    const res = await postClaudeMessages(
      url,
      { "x-api-key": key, "api-key": key },
      azureClaudeModel(),
      briefingPrompt(title, summary, locale),
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
  locale: TargetLocale,
): Promise<LocalePiece | null> {
  if (!geminiKey() || Date.now() < geminiCoolUntil) return null;

  const prompt = briefingPrompt(title, summary, locale);
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
  locale: TargetLocale,
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
        messages: [{ role: "user", content: briefingPrompt(title, summary, locale) }],
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
  locale: TargetLocale,
): Promise<LocalePiece | null> {
  const nextTitle = await translateText(title, "nl", locale);
  await sleep(120);
  const nextSummary = await translateText(summary, "nl", locale);
  return asPiece({ title: nextTitle, summary: nextSummary });
}

export function isTargetLocale(value: string): value is TargetLocale {
  return (TARGETS as readonly string[]).includes(value);
}

export function needsTranslation(article: Article, locale?: TargetLocale) {
  if (!article.title_nl || !article.summary_nl) return false;
  if (locale) return !articleHasTranslation(article, locale);
  return TARGETS.some((code) => !articleHasTranslation(article, code));
}

export async function translateBriefingTo(
  title: string,
  summary: string,
  locale: TargetLocale,
): Promise<LocalePiece | null> {
  if (!title.trim()) return null;
  return (
    (await azureClaudeBriefing(title, summary, locale)) ||
    (await geminiBriefing(title, summary, locale)) ||
    (await claudeBriefing(title, summary, locale)) ||
    (await machineBriefing(title, summary, locale))
  );
}

export function applyLocaleTranslation(
  article: Article,
  locale: TargetLocale,
  piece: LocalePiece,
): Article {
  if (locale === "en") {
    return { ...article, title_en: piece.title, summary_en: piece.summary };
  }
  if (locale === "es") {
    return { ...article, title_es: piece.title, summary_es: piece.summary };
  }
  return { ...article, title_fa: piece.title, summary_fa: piece.summary };
}

export async function translateArticleTo(
  article: Article,
  locale: TargetLocale,
): Promise<Article> {
  if (!needsTranslation(article, locale)) return article;
  const piece = await translateBriefingTo(article.title_nl, article.summary_nl, locale);
  return piece ? applyLocaleTranslation(article, locale, piece) : article;
}
