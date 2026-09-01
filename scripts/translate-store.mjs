import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data/store.json", import.meta.url);
const UA = "HelloLWD/0.1 (local news briefing; +https://hellolwd.nl)";
const TARGETS = ["en", "es", "fa"];

function needs(article) {
  if (!article.title_nl || !article.summary_nl) return false;
  return (
    article.title_en === article.title_nl ||
    article.title_es === article.title_nl ||
    article.title_fa === article.title_nl
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseGtx(data) {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return "";
  return data[0]
    .map((seg) => (Array.isArray(seg) && typeof seg[0] === "string" ? seg[0] : ""))
    .join("")
    .trim();
}

async function viaGtx(text, source, target) {
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

async function viaMyMemory(text, source, target) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text.slice(0, 450)) +
    `&langpair=${source}|${target}&de=hello@hellolwd.nl`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) return "";
  const data = await res.json();
  const translated = data.responseData?.translatedText?.trim() || "";
  if (!translated || data.responseStatus !== 200 || /MYMEMORY WARNING/i.test(translated)) return "";
  return translated;
}

async function translateText(text, target) {
  const value = text.trim();
  if (!value) return "";
  for (const engine of [viaGtx, viaMyMemory]) {
    try {
      const translated = await engine(value, "nl", target);
      if (translated && translated !== value) return translated;
    } catch {
      // next engine
    }
  }
  return "";
}

const store = JSON.parse(await readFile(FILE, "utf8"));
const pending = store.articles.filter(needs);
console.log(`pending ${pending.length}`);

let ok = 0;
let fail = 0;

for (const article of pending) {
  const copy = {};
  for (const locale of TARGETS) {
    copy[`title_${locale}`] = await translateText(article.title_nl, locale);
    await sleep(120);
    copy[`summary_${locale}`] = await translateText(article.summary_nl, locale);
    await sleep(120);
  }
  if (!copy.title_en || !copy.title_es || !copy.title_fa) {
    fail += 1;
    console.log(`fail ${article.title_nl.slice(0, 70)}`);
    continue;
  }
  Object.assign(article, copy);
  ok += 1;
  console.log(`ok ${ok} ${article.title_en.slice(0, 70)}`);
  await writeFile(FILE, JSON.stringify(store, null, 2), "utf8");
}

console.log(`done ok=${ok} fail=${fail} left=${store.articles.filter(needs).length}`);
