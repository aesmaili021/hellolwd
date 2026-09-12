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
  /cookie|nieuwsbrief|inschrijven|privacy|abonneer je|advertentie|lees ook|deel dit artikel|tips van de redactie|formulier is aan het laden|fout gezien|just a moment|enable javascript|whatsapp[- ]kanaal|via ons whatsapp/i;

const PAGE_CHROME =
  /deel dit artikel|tips van de redactie|formulier is aan het laden|share this article|compartir este art[ií]culo|این مقاله را به اشتراک|فرم در حال بارگذاری/i;

function isBlockedHtml(html: string) {
  return /just a moment|cf-browser-verification|challenge-platform|enable javascript and cookies|sorry, you have been blocked/i.test(
    html,
  );
}

function usefulText(value: string, min = 40) {
  const text = normalizeReadableText(value).replace(/[ \t]+/g, " ").trim();
  return text.length >= min && !NOISE.test(text) && !PAGE_CHROME.test(text) ? text : "";
}

export function looksLikePageChrome(value: string | null | undefined) {
  const text = normalizeReadableText(value ?? "");
  if (!text) return false;
  if (PAGE_CHROME.test(text)) return true;
  const paras = text.split(/\n+/).map((para) => para.replace(/[ \t]+/g, " ").trim()).filter(Boolean);
  const long = paras.filter((para) => para.length >= 120);
  const cards = paras.filter((para) => para.length < 160 && /[:"""«]/.test(para));
  return long.length === 0 && cards.length >= 4;
}

function cleanArticleText(value: string) {
  return normalizeReadableText(value)
    .split(/\n+/)
    .map((para) => para.replace(/[ \t]+/g, " ").trim())
    .filter((para) => para.length >= 40 && !NOISE.test(para) && !PAGE_CHROME.test(para))
    .join("\n\n");
}

function nodeTypes(node: { "@type"?: string | string[] } | null | undefined) {
  const type = node?.["@type"];
  return (Array.isArray(type) ? type : type ? [type] : []).map((value) => String(value).toLowerCase());
}

function collectJsonLdNodes(data: unknown): { articleBody?: string; description?: string; "@type"?: string | string[] }[] {
  if (!data) return [];
  if (Array.isArray(data)) return data.flatMap((node) => collectJsonLdNodes(node));
  if (typeof data !== "object") return [];
  const record = data as { "@graph"?: unknown; articleBody?: string; description?: string; "@type"?: string | string[] };
  const self = record.articleBody || record["@type"] ? [record] : [];
  return [...self, ...collectJsonLdNodes(record["@graph"])];
}

function extractJsonLdBody(html: string) {
  const scripts = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  let best = "";
  for (const match of scripts) {
    try {
      const nodes = collectJsonLdNodes(JSON.parse(match[1] || "null"));
      for (const node of nodes) {
        if (!nodeTypes(node).some((type) => /newsarticle|article|reportage|blogposting/.test(type))) {
          continue;
        }
        const body = cleanArticleText(node.articleBody || "");
        if (body.length < 80 || looksLikePageChrome(body)) continue;
        if (body.length > best.length) best = body;
      }
    } catch {
      /* ignore broken json-ld */
    }
  }
  return best;
}

function clipRelatedChrome(html: string) {
  const cut = html.search(
    /lees ook|deel dit artikel|tips van de redactie|share-buttons|formulier is aan het laden|meer verhalen|gerelateerde/i,
  );
  return cut > 400 ? html.slice(0, cut) : html;
}

function mainRegion(html: string) {
  return (
    html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ||
    html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ||
    html
  );
}

function extractHtmlBody(html: string) {
  const region = clipRelatedChrome(mainRegion(html));
  const blocks = [...region.matchAll(/<(p|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => usefulText(stripHtml(match[2]), match[1].toLowerCase() === "p" ? 40 : 18))
    .filter(Boolean);
  const paragraphs = blocks.filter((block) => block.length >= 80);
  if (paragraphs.length < 2) return paragraphs.join("\n\n");
  return blocks.join("\n\n");
}

function sameStory(left: string, right: string) {
  const needle = left.slice(0, 48).toLowerCase();
  return needle.length >= 32 && right.toLowerCase().includes(needle);
}

export function extractLead(html: string) {
  if (isBlockedHtml(html)) return "";
  const jsonLd = extractJsonLdBody(html);
  if (jsonLd.length >= 80) {
    return jsonLd.split(/\n+/).filter(Boolean).slice(0, 3).join(" ");
  }
  const paras = [...clipRelatedChrome(html).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => usefulText(stripHtml(match[1])))
    .filter(Boolean);
  return paras.slice(0, 4).join(" ");
}

export function extractArticleBody(html: string) {
  if (isBlockedHtml(html)) return "";
  const jsonLd = extractJsonLdBody(html);
  const htmlBody = cleanArticleText(extractHtmlBody(html));
  const jsonOk = jsonLd.length >= 200 && !looksLikePageChrome(jsonLd);
  const htmlOk = htmlBody.length >= 200 && !looksLikePageChrome(htmlBody);
  if (jsonOk && htmlOk) {
    if (htmlBody.length > jsonLd.length + 80 && sameStory(jsonLd, htmlBody)) {
      return htmlBody.slice(0, 12000);
    }
    return (htmlBody.length > jsonLd.length ? htmlBody : jsonLd).slice(0, 12000);
  }
  if (htmlOk) return htmlBody.slice(0, 12000);
  if (jsonOk) return jsonLd.slice(0, 12000);
  return (jsonLd.length > htmlBody.length ? jsonLd : htmlBody).slice(0, 12000);
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
