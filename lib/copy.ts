import type { EventGenre, NewsCategory } from "./types";
import type { Locale } from "./locales";

export const copy = {
  siteName: "HelloLWD",
  tagline: {
    nl: "Lokaal nieuws en weekend in Leeuwarden",
    en: "Local news and weekend nights in Leeuwarden",
    es: "Noticias locales y fines de semana en Leeuwarden",
    fa: "خبر محلی و آخر هفته در لیوواردن",
  },
  skip: {
    nl: "Naar inhoud",
    en: "Skip to content",
    es: "Saltar al contenido",
    fa: "برو به محتوا",
  },
  navNews: {
    nl: "Nieuws",
    en: "News",
    es: "Noticias",
    fa: "خبر",
  },
  navEvents: {
    nl: "Weekend",
    en: "Weekend",
    es: "Fin de semana",
    fa: "آخر هفته",
  },
  allCategories: {
    nl: "Alles",
    en: "All",
    es: "Todo",
    fa: "همه",
  },
  allGenres: {
    nl: "Alles",
    en: "All",
    es: "Todo",
    fa: "همه",
  },
  readFull: {
    nl: "Lees het artikel",
    en: "Read full article",
    es: "Leer el artículo",
    fa: "خواندن مطلب اصلی",
  },
  sourcePrefix: {
    nl: "Bron",
    en: "Source",
    es: "Fuente",
    fa: "منبع",
  },
  weekendStrip: {
    nl: "Dit weekend in LWD",
    en: "This weekend in LWD",
    es: "Este fin de semana en LWD",
    fa: "این آخر هفته در LWD",
  },
  weekendCta: {
    nl: "Bekijk avonden",
    en: "See nights",
    es: "Ver noches",
    fa: "دیدن شب‌ها",
  },
  eventsLead: {
    nl: "Feesten, dj’s en live in de stad. Kort, gefilterd, met een link naar tickets of Instagram.",
    en: "Parties, DJs and live sets in town. Short, filtered, with a ticket or Instagram link.",
    es: "Fiestas, DJs y en vivo en la ciudad. Corto, filtrado, con enlace a entradas o Instagram.",
    fa: "پارتی، دی‌جی و اجرای زنده در شهر. کوتاه، قابل فیلتر، با لینک بلیت یا اینستاگرام.",
  },
  eventLink: {
    nl: "Tickets / Instagram",
    en: "Tickets / Instagram",
    es: "Entradas / Instagram",
    fa: "بلیت / اینستاگرام",
  },
  emptyNews: {
    nl: "Geen berichten in deze categorie. Kies een andere filter.",
    en: "No stories in this category. Try another filter.",
    es: "No hay noticias en esta categoría. Prueba otro filtro.",
    fa: "در این دسته خبری نیست. فیلتر دیگری را امتحان کنید.",
  },
  emptyEvents: {
    nl: "Geen avonden in dit genre. Kies een andere filter.",
    en: "No nights in this genre. Try another filter.",
    es: "No hay noches en este género. Prueba otro filtro.",
    fa: "در این ژانر شبی نیست. فیلتر دیگری را امتحان کنید.",
  },
  featured: {
    nl: "Uitgelicht",
    en: "Featured",
    es: "Destacado",
    fa: "برگزیده",
  },
  moreNews: {
    nl: "Meer nieuws",
    en: "More news",
    es: "Más noticias",
    fa: "خبرهای بیشتر",
  },
  colofon: {
    nl: "Colofon",
    en: "Colophon",
    es: "Colofón",
    fa: "شناسنامه",
  },
  privacy: {
    nl: "Privacy",
    en: "Privacy",
    es: "Privacidad",
    fa: "حریم خصوصی",
  },
  contact: {
    nl: "Contact",
    en: "Contact",
    es: "Contacto",
    fa: "تماس",
  },
  kvk: {
    nl: "KVK",
    en: "KVK",
    es: "KVK",
    fa: "KVK",
  },
  address: {
    nl: "Leeuwarden, Nederland",
    en: "Leeuwarden, the Netherlands",
    es: "Leeuwarden, Países Bajos",
    fa: "لیوواردن، هلند",
  },
  footerNote: {
    nl: "Samenvattingen met link naar de bron. Geen overname van artikelen.",
    en: "Summaries that link back to the source. No full-article copies.",
    es: "Resúmenes con enlace a la fuente. Sin copia del artículo completo.",
    fa: "خلاصه با لینک به منبع. بدون بازنشر متن کامل.",
  },
  language: {
    nl: "Taal",
    en: "Language",
    es: "Idioma",
    fa: "زبان",
  },
  filterNews: {
    nl: "Filter op onderwerp",
    en: "Filter by topic",
    es: "Filtrar por tema",
    fa: "فیلتر موضوع",
  },
  filterEvents: {
    nl: "Filter op genre",
    en: "Filter by genre",
    es: "Filtrar por género",
    fa: "فیلتر ژانر",
  },
  privacyTitle: {
    nl: "Privacy",
    en: "Privacy",
    es: "Privacidad",
    fa: "حریم خصوصی",
  },
  privacyBody: {
    nl: "HelloLWD slaat geen accounts of reacties op. We tonen samenvattingen van openbare RSS-bronnen en linken terug. Taalvoorkeur kan in je browser blijven staan. Geen trackingcookies in v1.",
    en: "HelloLWD stores no accounts or comments. We show summaries of public RSS sources and link back. Language preference may stay in your browser. No tracking cookies in v1.",
    es: "HelloLWD no guarda cuentas ni comentarios. Mostramos resúmenes de RSS públicos y enlazamos a la fuente. El idioma puede quedarse en el navegador. Sin cookies de seguimiento en v1.",
    fa: "HelloLWD حساب یا نظر ذخیره نمی‌کند. خلاصه منابع RSS عمومی را نشان می‌دهیم و به اصل لینک می‌دهیم. زبان ممکن است در مرورگر بماند. در نسخه یک کوکی ردیابی نیست.",
  },
  categories: {
    politics: {
      nl: "Politiek",
      en: "Politics",
      es: "Política",
      fa: "سیاست",
    },
    infrastructure: {
      nl: "Infrastructuur",
      en: "Infrastructure",
      es: "Infraestructura",
      fa: "زیرساخت",
    },
    culture: {
      nl: "Cultuur",
      en: "Culture",
      es: "Cultura",
      fa: "فرهنگ",
    },
    business: {
      nl: "Economie",
      en: "Business",
      es: "Economía",
      fa: "اقتصاد",
    },
    safety: {
      nl: "Veiligheid",
      en: "Safety",
      es: "Seguridad",
      fa: "امنیت",
    },
    education: {
      nl: "Onderwijs",
      en: "Education",
      es: "Educación",
      fa: "آموزش",
    },
    sports: {
      nl: "Sport",
      en: "Sports",
      es: "Deportes",
      fa: "ورزش",
    },
  } satisfies Record<NewsCategory, Record<Locale, string>>,
  genres: {
    electronic: {
      nl: "Electronic",
      en: "Electronic",
      es: "Electrónica",
      fa: "الکترونیک",
    },
    hiphop: {
      nl: "Hip-hop",
      en: "Hip-hop",
      es: "Hip-hop",
      fa: "هیپ‌هاپ",
    },
    live: {
      nl: "Live band",
      en: "Live band",
      es: "Banda en vivo",
      fa: "گروه زنده",
    },
    student: {
      nl: "Studentenfeest",
      en: "Student party",
      es: "Fiesta estudiantil",
      fa: "پارتی دانشجویی",
    },
    dj: {
      nl: "DJ set",
      en: "DJ set",
      es: "Set de DJ",
      fa: "ست دی‌جی",
    },
  } satisfies Record<EventGenre, Record<Locale, string>>,
} as const;

export const localeLabels: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
  es: "ES",
  fa: "فا",
};

export const newsCategories: NewsCategory[] = [
  "politics",
  "infrastructure",
  "culture",
  "business",
  "safety",
  "education",
  "sports",
];

export const eventGenres: EventGenre[] = [
  "electronic",
  "hiphop",
  "live",
  "student",
  "dj",
];
