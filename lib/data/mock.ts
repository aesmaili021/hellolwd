import type { Article, EventRow, RssSource } from "@/lib/types";

const created = "2026-08-31T10:00:00+02:00";

export const SEED_ARTICLE_IDS = new Set([
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f701",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f702",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f703",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f704",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f705",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f706",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f707",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f708",
  "a8c1d2e3-4f56-4789-a012-b3c4d5e6f709",
]);

export function withoutSeedArticles<T extends { id: string }>(rows: T[]) {
  return rows.filter((row) => !SEED_ARTICLE_IDS.has(row.id));
}

export const mockArticles: Article[] = [];

const allLocales = ["nl", "en", "es", "fa"] as const;

export const mockRss: RssSource[] = [
  {
    id: "rss-omrop",
    name: "Omrop Fryslân",
    url: "https://www.omropfryslan.nl/rss/nederlands",
    enabled: true,
    locales: [...allLocales],
    scope: "local",
    created_at: created,
  },
  {
    id: "rss-ol",
    name: "Omroep Leeuwarden",
    url: "https://omroepleeuwarden.nl/feed/",
    enabled: true,
    locales: [...allLocales],
    scope: "local",
    created_at: created,
  },
  {
    id: "rss-lc",
    name: "LC.nl",
    url: "https://www.lc.nl/rss/",
    enabled: true,
    locales: [...allLocales],
    scope: "local",
    created_at: created,
  },
  {
    id: "rss-nos",
    name: "NOS Binnenland",
    url: "https://feeds.nos.nl/nosnieuwsbinnenland",
    enabled: true,
    locales: [...allLocales],
    scope: "national",
    created_at: created,
  },
];

export const mockEvents: EventRow[] = [
  {
    id: "b9d2e3f4-5a67-4890-b123-c4d5e6f70801",
    name: "Warehouse Frisian",
    venue: "Neushoorn",
    event_datetime: "2026-09-05T23:00:00+02:00",
    genre: "electronic",
    ticket_link: "https://neushoorn.nl/",
    image_url: null,
    description_nl:
      "Twee zalen, techno en breaks. Deuren 23:00, last in 01:30. Geen gastlijst na middernacht.",
    description_en:
      "Two rooms, techno and breaks. Doors 23:00, last in 01:30. No guest list after midnight.",
    description_es:
      "Dos salas, techno y breaks. Puertas 23:00, último acceso 01:30. Sin lista después de medianoche.",
    description_fa:
      "دو سالن، تکنو و بریکس. درها ۲۳:۰۰، ورود آخر ۰۱:۳۰. بعد نیمه‌شب لیست مهمان نیست.",
    created_at: created,
  },
  {
    id: "b9d2e3f4-5a67-4890-b123-c4d5e6f70802",
    name: "Intro Friday: International Mixer",
    venue: "Neushoorn",
    event_datetime: "2026-09-04T21:30:00+02:00",
    genre: "student-party",
    ticket_link: "https://neushoorn.nl/",
    image_url: null,
    description_nl:
      "Eerstejaars en exchange. Gratis met studentenkaart tot 22:30. Jassen in de garderobe verplicht.",
    description_en:
      "First years and exchange students. Free with student card until 22:30. Coat check required.",
    description_es:
      "Primer curso e intercambio. Gratis con carnet hasta las 22:30. Guardarropa obligatorio.",
    description_fa:
      "سال‌اولی و تبادل. تا ۲۲:۳۰ با کارت دانشجویی رایگان. سپردن کت لازم است.",
    created_at: created,
  },
  {
    id: "b9d2e3f4-5a67-4890-b123-c4d5e6f70803",
    name: "De Ossekop: local four-piece",
    venue: "Café de Ossekop",
    event_datetime: "2026-09-05T20:00:00+02:00",
    genre: "live-band",
    ticket_link: "https://www.ossekop.nl/",
    image_url: null,
    description_nl:
      "Gitaar en NL/EN vocals. Staand, geen tickets vooraf. Begin stipt 20:30.",
    description_en:
      "Guitar and NL/EN vocals. Standing, no tickets in advance. Starts 20:30 sharp.",
    description_es:
      "Guitarra y voces NL/EN. De pie, sin entradas previas. Empieza a las 20:30 en punto.",
    description_fa:
      "گیتار و آواز هلندی/انگلیسی. ایستاده، بلیت از قبل نیست. شروع دقیق ۲۰:۳۰.",
    created_at: created,
  },
  {
    id: "b9d2e3f4-5a67-4890-b123-c4d5e6f70804",
    name: "Late Cipher",
    venue: "Club T",
    event_datetime: "2026-09-06T22:00:00+02:00",
    genre: "hiphop",
    ticket_link: "https://www.instagram.com/",
    image_url: null,
    description_nl: "Cypher open van 22:00 tot 23:00, daarna dj’s. 18+ en ID aan de deur.",
    description_en: "Open cypher 22:00 to 23:00, then DJs. 18+ and ID at the door.",
    description_es: "Cifrado abierto de 22:00 a 23:00, luego DJs. +18 y DNI en la puerta.",
    description_fa: "سایفر باز از ۲۲:۰۰ تا ۲۳:۰۰، بعد دی‌جی. ۱۸+ و کارت شناسایی دم در.",
    created_at: created,
  },
  {
    id: "b9d2e3f4-5a67-4890-b123-c4d5e6f70805",
    name: "Domingo Latino",
    venue: "De Koperen Tuin",
    event_datetime: "2026-09-06T16:00:00+02:00",
    genre: "electronic",
    ticket_link: "https://www.dekoperentuin.nl/",
    image_url: null,
    description_nl:
      "Salsa en cumbia in de middagzon. Gratis tot 19:00, daarna entreeprijs. Buiten als het droog blijft.",
    description_en:
      "Salsa and cumbia in the afternoon. Free until 19:00, then a door fee. Outside if it stays dry.",
    description_es:
      "Salsa y cumbia por la tarde. Gratis hasta las 19:00, luego entrada. Fuera si no llueve.",
    description_fa:
      "سالسا و کومبیا بعدازظهر. تا ۱۹:۰۰ رایگان، بعد ورودی. اگر باران نباشد بیرون.",
    created_at: created,
  },
  {
    id: "b9d2e3f4-5a67-4890-b123-c4d5e6f70806",
    name: "Asteriks: residents + guest",
    venue: "Podium Asteriks",
    event_datetime: "2026-09-04T22:30:00+02:00",
    genre: "electronic",
    ticket_link: "https://www.instagram.com/",
    image_url: null,
    description_nl:
      "Kleine zaal, house tot 03:00. Cap 120. Link in bio voor de gastlijst tot vrijdag 18:00.",
    description_en:
      "Small room, house until 03:00. Cap 120. Link in bio for the guest list until Friday 18:00.",
    description_es:
      "Sala pequeña, house hasta las 03:00. Cupo 120. Enlace en bio para la lista hasta el viernes 18:00.",
    description_fa:
      "سالن کوچک، هاوس تا ۰۳:۰۰. ظرفیت ۱۲۰. لینک بیو برای لیست مهمان تا جمعه ۱۸:۰۰.",
    created_at: created,
  },
];
