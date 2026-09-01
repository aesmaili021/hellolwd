export type RssItem = {
  title: string;
  link: string;
  summary: string;
  published_at: string;
  image_url: string | null;
  category: string;
};

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeXml(value: string) {
  let text = value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let i = 0; i < 2; i++) {
    text = text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, code: string) => {
      if (code[0] === "#") {
        const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
        return Number.isFinite(n) ? String.fromCodePoint(n) : "";
      }
      return ENTITIES[code.toLowerCase()] ?? "";
    });
  }
  return text;
}

export function normalizeReadableText(value: string) {
  return decodeXml(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2028\u2029]/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripHtml(value: string) {
  return decodeXml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string) {
  const re = new RegExp(
    `<(?:[\\w.-]+:)?${name}(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[\\w.-]+:)?${name}>`,
    "i",
  );
  const match = block.match(re);
  return match ? decodeXml(match[1]) : "";
}

function attr(block: string, name: string, key: string) {
  const re = new RegExp(`<${name}\\b[^>]*\\b${key}=["']([^"']+)["'][^>]*>`, "i");
  const match = block.match(re);
  return match ? decodeXml(match[1]) : "";
}

function firstImg(html: string) {
  const match = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return match ? decodeXml(match[1]) : "";
}

function pickImage(block: string) {
  const enclosure = attr(block, "enclosure", "url");
  const enclosureType = attr(block, "enclosure", "type").toLowerCase();
  if (enclosure && (!enclosureType || enclosureType.startsWith("image"))) return enclosure;

  const media = attr(block, "media:content", "url") || attr(block, "media:thumbnail", "url");
  if (media) return media;

  const fromHtml = firstImg(tag(block, "encoded") || tag(block, "description") || block);
  if (fromHtml && !/32x32|favicon|logo-square|cropped-logo/i.test(fromHtml)) return fromHtml;
  return null;
}

export function parseRssItems(xml: string): RssItem[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  return items.map((block) => {
    const title = stripHtml(tag(block, "title"));
    const link = decodeXml(tag(block, "link") || attr(block, "atom:link", "href")).split(/\s/)[0];
    const description = stripHtml(tag(block, "description"));
    const encoded = stripHtml(tag(block, "encoded"));
    const rawSummary = encoded.length > description.length ? encoded : description;
    const summary = rawSummary.slice(0, 900);
    const published = tag(block, "pubDate") || tag(block, "updated") || tag(block, "date");
    const date = published ? new Date(published) : new Date();
    return {
      title,
      link,
      summary,
      published_at: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      image_url: pickImage(block),
      category: stripHtml(tag(block, "category")),
    };
  }).filter((item) => item.title && item.link);
}

const NOISE =
  /cookie|nieuwsbrief|inschrijven|privacy|abonneer|advertentie|lees ook|fout gezien|just a moment|enable javascript/i;

function isBlockedHtml(html: string) {
  return /just a moment|cf-browser-verification|challenge-platform|enable javascript and cookies|sorry, you have been blocked/i.test(
    html,
  );
}

function usefulText(value: string, min = 40) {
  const text = normalizeReadableText(value).replace(/[ \t]+/g, " ").trim();
  return text.length >= min && !NOISE.test(text) ? text : "";
}

function extractJsonLdBody(html: string) {
  const scripts = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  let best = "";
  for (const match of scripts) {
    try {
      const data = JSON.parse(match[1] || "null") as
        | { articleBody?: string; "@graph"?: { articleBody?: string }[] }
        | { articleBody?: string }[]
        | null;
      const nodes = Array.isArray(data) ? data : data?.["@graph"] ? data["@graph"] : data ? [data] : [];
      for (const node of nodes) {
        const body = normalizeReadableText(node?.articleBody || "");
        if (body.length < 80 || NOISE.test(body)) continue;
        if (body.length > best.length) best = body;
      }
    } catch {
      /* ignore broken json-ld */
    }
  }
  return best;
}

export function extractLead(html: string) {
  if (isBlockedHtml(html)) return "";
  const paras = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => usefulText(stripHtml(match[1])))
    .filter(Boolean);
  return paras.slice(0, 4).join(" ");
}

export function extractArticleBody(html: string) {
  if (isBlockedHtml(html)) return "";
  const jsonLd = extractJsonLdBody(html);
  const article = html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ?? html;
  const blocks = [...article.matchAll(/<(p|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => usefulText(stripHtml(match[2]), match[1].toLowerCase() === "p" ? 40 : 8))
    .filter(Boolean);
  const text = blocks.join("\n\n").trim();
  return (jsonLd.length > text.length ? jsonLd : text).slice(0, 12000);
}

export function normalizeArticleUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    [...url.searchParams.keys()].forEach((key) => {
      if (key.startsWith("utm_") || key === "fbclid") url.searchParams.delete(key);
    });
    url.hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return value.trim();
  }
}
