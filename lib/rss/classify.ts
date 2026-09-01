import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/types";

const LOCAL =
  /leeuwarden|ljouwert|liwwadden|liwwadders|nhl\s*stenden|cambuur|zaailand|oldehove|potmarge|rengerslaan|wirdumerdijk|de kelders|neushoorn|helikon|tweebaksmarkt|provinsjeh[uû]s/i;

const RULES: [NewsCategory, RegExp][] = [
  ["sports", /sport|cambuur|voetbal|wedstrijd|kaatsen|sc heerenveen|eredivisie/i],
  ["education", /student|school|onderwijs|nhl|stenden|universiteit|hogeschool|introweek/i],
  ["safety", /politie|diefstal|ongeval|brand|mishandeling|aangehouden|112|geweld/i],
  ["infrastructure", /weg|bus|fietspad|aquaduct|riool|station|verkeer|afgesloten|werkzaam/i],
  ["politics", /raad|gemeente|college|burgemeester|wethouder|politiek|provincie/i],
  ["business", /winkel|horeca|restaurant|zaak|economie|ondernem|failliet/i],
  ["culture", /festival|markt|museum|concert|theater|cultuur|po[eë]zie|muziek/i],
];

export function isLeeuwardenStory(item: {
  title: string;
  summary: string;
  link: string;
  category: string;
}, sourceUrl: string) {
  if (/omroepleeuwarden\.nl/i.test(sourceUrl)) return true;
  const hay = `${item.title} ${item.summary} ${item.link} ${item.category}`;
  return LOCAL.test(hay);
}

export function shouldIngestStory(
  item: {
    title: string;
    summary: string;
    link: string;
    category: string;
  },
  sourceUrl: string,
  national = false,
) {
  return national || isLeeuwardenStory(item, sourceUrl);
}

export function classifyCategory(item: {
  title: string;
  summary: string;
  category: string;
}): NewsCategory {
  const hay = `${item.title} ${item.summary} ${item.category}`;
  for (const [id, rule] of RULES) {
    if (rule.test(hay)) return id;
  }
  return NEWS_CATEGORIES.includes(item.category as NewsCategory)
    ? (item.category as NewsCategory)
    : "culture";
}

export function briefing(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 520) return clean;
  const cut = clean.slice(0, 560);
  const stops = [...cut.matchAll(/[.!?]["”’']?\s/g)];
  const fourth = stops[3]?.index;
  const last = stops.at(-1)?.index;
  const end = fourth != null && fourth > 140 ? fourth + 1 : last != null && last > 180 ? last + 1 : null;
  if (end) return cut.slice(0, end + 1).trim();
  return `${cut.replace(/\s+\S*$/, "")}.`.trim();
}
