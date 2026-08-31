import type { NewsItem } from "./types";

export const news: NewsItem[] = [
  {
    id: "stenden-housing",
    category: "politics",
    publishedAt: "2026-08-31T08:20:00+02:00",
    sourceName: "Omrop Fryslân",
    sourceUrl: "https://www.omropfryslan.nl/",
    originalUrl: "https://www.omropfryslan.nl/",
    featured: true,
    headline: {
      nl: "Gemeente steunt honderd extra studentenwoningen bij NHL Stenden",
      en: "Council backs a hundred extra student rooms near NHL Stenden",
      es: "El ayuntamiento apoya cien habitaciones extra junto a NHL Stenden",
      fa: "شورا با صد خوابگاه اضافه کنار ان‌اچ‌ال استندن موافقت کرد",
    },
    summary: {
      nl: "Het college wil tijdelijke units aan de Rengerslaan. Bewoners eisten eerst duidelijkheid over parkeren en geluid. Stemming volgt volgende week.",
      en: "The board wants temporary units on Rengerslaan. Neighbours asked first for a clear plan on parking and noise. The vote is next week.",
      es: "El gobierno local quiere módulos temporales en Rengerslaan. Los vecinos pidieron antes un plan claro de parking y ruido. La votación es la semana que viene.",
      fa: "شهرداری واحدهای موقت در رنخرسلان می‌خواهد. همسایه‌ها اول طرح پارک و صدا خواستند. رأی‌گیری هفته بعد است.",
    },
  },
  {
    id: "wirdumerdijk",
    category: "infrastructure",
    publishedAt: "2026-08-30T16:40:00+02:00",
    sourceName: "LC.nl",
    sourceUrl: "https://lc.nl/",
    originalUrl: "https://lc.nl/",
    headline: {
      nl: "Wirdumerdijk twee weken dicht: bus 10 om via Zaailand",
      en: "Wirdumerdijk closed for two weeks: bus 10 reroutes via Zaailand",
      es: "Wirdumerdijk cerrado dos semanas: el bus 10 desvía por Zaailand",
      fa: "ویردومردایک دو هفته بسته است: اتوبوس ۱۰ از زایلاند می‌رود",
    },
    summary: {
      nl: "Werk aan riolering start maandag 1 september. Fietsers kunnen door. Reken extra 8 minuten in de ochtendspits.",
      en: "Sewer works start Monday 1 September. Bikes can still pass. Add about 8 minutes in the morning rush.",
      es: "Las obras de alcantarillado empiezan el lunes 1 de septiembre. Las bicis pasan. Suma unos 8 minutos en la hora punta.",
      fa: "کار فاضلاب دوشنبه ۱ سپتامبر شروع می‌شود. دوچرخه عبور می‌کند. صبح حدود ۸ دقیقه بیشتر حساب کنید.",
    },
  },
  {
    id: "oldehove-nights",
    category: "culture",
    publishedAt: "2026-08-30T11:05:00+02:00",
    sourceName: "Omroep Leeuwarden",
    sourceUrl: "https://www.omroepleeuwarden.nl/",
    originalUrl: "https://www.omroepleeuwarden.nl/",
    headline: {
      nl: "Oldehove Night Markets: extra zaterdag in september",
      en: "Oldehove Night Markets: extra Saturday in September",
      es: "Oldehove Night Markets: sábado extra en septiembre",
      fa: "بازار شب اولدهوفه: شنبه اضافه در سپتامبر",
    },
    summary: {
      nl: "Foodstalls en korte sets op het Oldehoofsterkerkhof. Toegang vrij. Laatste ronde 23:30 vanwege de buren.",
      en: "Food stalls and short sets on Oldehoofsterkerkhof. Free entry. Last round 23:30 for the neighbours.",
      es: "Puestos de comida y sets cortos en Oldehoofsterkerkhof. Entrada libre. Última ronda 23:30 por los vecinos.",
      fa: "غذا و ست‌های کوتاه در اولدهوفسترکرک‌هوف. ورود آزاد. آخرین دور ۲۳:۳۰ به‌خاطر همسایه‌ها.",
    },
  },
  {
    id: "bike-thefts",
    category: "safety",
    publishedAt: "2026-08-29T18:15:00+02:00",
    sourceName: "Omrop Fryslân",
    sourceUrl: "https://www.omropfryslan.nl/",
    originalUrl: "https://www.omropfryslan.nl/",
    headline: {
      nl: "Politie: meer fietsdiefstallen rond station en Zaailand",
      en: "Police: more bike thefts around the station and Zaailand",
      es: "Policía: más robos de bici junto a la estación y Zaailand",
      fa: "پلیس: دزدی دوچرخه اطراف ایستگاه و زایلاند بیشتر شده",
    },
    summary: {
      nl: "Vooral ’s avonds bij onverlichte rekken. Gebruik een tweede slot. Meld via 0900-8844, geen spoed.",
      en: "Mostly evenings at unlit racks. Use a second lock. Report on 0900-8844 if it is not urgent.",
      es: "Sobre todo por la noche en aparcamientos sin luz. Usa un segundo candado. Avisa al 0900-8844 si no es urgente.",
      fa: "بیشتر شب‌ها کنار رک‌های بی‌نور. قفل دوم بزنید. اگر فوری نیست با ۰۹۰۰-۸۸۴۴ خبر دهید.",
    },
  },
  {
    id: "semester-start",
    category: "education",
    publishedAt: "2026-08-29T09:30:00+02:00",
    sourceName: "Omroep Leeuwarden",
    sourceUrl: "https://www.omroepleeuwarden.nl/",
    originalUrl: "https://www.omroepleeuwarden.nl/",
    headline: {
      nl: "NHL Stenden opent semester: introweek tot donderdag",
      en: "NHL Stenden term opens: intro week runs through Thursday",
      es: "NHL Stenden abre el semestre: la intro sigue hasta el jueves",
      fa: "ترم ان‌اچ‌ال استندن شروع شد: هفته آشنایی تا پنجشنبه",
    },
    summary: {
      nl: "Internationale studenten halen hun OV-chip en inschrijving bij het Student Service Centre. Avondprogramma in Neushoorn.",
      en: "International students pick up OV-chip cards and enrolment at the Student Service Centre. Evening programme at Neushoorn.",
      es: "Los estudiantes internacionales recogen el OV-chip y la matrícula en el Student Service Centre. Programa nocturno en Neushoorn.",
      fa: "دانشجوهای بین‌المللی کارت او‌وی و ثبت‌نام را از مرکز خدمات دانشجویی می‌گیرند. برنامه شب در نویسهورن.",
    },
  },
  {
    id: "kelders-cafes",
    category: "business",
    publishedAt: "2026-08-28T13:50:00+02:00",
    sourceName: "LC.nl",
    sourceUrl: "https://lc.nl/",
    originalUrl: "https://lc.nl/",
    headline: {
      nl: "Drie nieuwe zaken openen in De Kelders deze maand",
      en: "Three new spots open on De Kelders this month",
      es: "Tres locales nuevos abren en De Kelders este mes",
      fa: "این ماه سه جای جدید در ده کلدرز باز می‌شود",
    },
    summary: {
      nl: "Een lunchbar, een tweedehandsboekwinkel en een kleine wijnbar. Terrasplekken blijven beperkt tot de kade.",
      en: "A lunch counter, a second-hand bookshop and a small wine bar. Terrace seats stay limited to the quay.",
      es: "Un mostrador de comida, una librería de segundo uso y un vino pequeño. Las terrazas siguen solo en el muelle.",
      fa: "یک ناهاربار، کتاب‌فروشی دست‌دوم و یک بار شراب کوچک. صندلی فضای باز فقط روی اسکله می‌ماند.",
    },
  },
  {
    id: "cambuur-home",
    category: "sports",
    publishedAt: "2026-08-28T07:45:00+02:00",
    sourceName: "Omrop Fryslân",
    sourceUrl: "https://www.omropfryslan.nl/",
    originalUrl: "https://www.omropfryslan.nl/",
    headline: {
      nl: "Cambuur thuis tegen De Graafschap: poort open 18:00",
      en: "Cambuur at home vs De Graafschap: gates at 18:00",
      es: "Cambuur en casa contra De Graafschap: puertas a las 18:00",
      fa: "کامبور در خانه برابر ده خراف‌اسخاپ: درها ساعت ۱۸:۰۰",
    },
    summary: {
      nl: "Klapstoelkaartjes nog via de club. Bus 2 rijdt extra ritten na afloop. Geen alcohol in de trein terug.",
      en: "Terrace tickets still via the club. Bus 2 adds extra runs after the match. No alcohol on the train back.",
      es: "Aún hay entradas de grada en el club. El bus 2 pone viajes extra al final. Sin alcohol en el tren de vuelta.",
      fa: "بلیت جایگاه هنوز از باشگاه. اتوبوس ۲ بعد بازی اضافه می‌رود. در قطار برگشت الکل نیست.",
    },
  },
  {
    id: "potmarge-path",
    category: "infrastructure",
    publishedAt: "2026-08-27T15:10:00+02:00",
    sourceName: "Omroep Leeuwarden",
    sourceUrl: "https://www.omroepleeuwarden.nl/",
    originalUrl: "https://www.omroepleeuwarden.nl/",
    headline: {
      nl: "Nieuw fietspad langs de Potmarge deels open",
      en: "New Potmarge bike path partly open",
      es: "El nuevo carril bici del Potmarge abre en parte",
      fa: "مسیر دوچرخه جدید پوت‌مارخه نیمه‌باز شد",
    },
    summary: {
      nl: "Het stuk tot de Heliconweg is klaar. Het laatste deel naar het station volgt in oktober als het weer meezit.",
      en: "The stretch to Heliconweg is done. The last piece to the station follows in October if the weather holds.",
      es: "El tramo hasta Heliconweg ya está. El último tramo a la estación llega en octubre si el tiempo aguanta.",
      fa: "قطعه تا هلی‌کن‌وخ تمام شد. تکه آخر تا ایستگاه اگر هوا بسازد اکتبر می‌آید.",
    },
  },
];

export function getFeaturedStory() {
  return news.find((item) => item.featured) ?? news[0];
}

export function getNewsFeed(category?: NewsItem["category"]) {
  const featured = getFeaturedStory();
  const rest = news.filter((item) => item.id !== featured.id);
  if (!category) return { featured, rest };
  if (featured.category === category) {
    return { featured, rest: rest.filter((item) => item.category === category) };
  }
  return {
    featured: undefined,
    rest: news.filter((item) => item.category === category),
  };
}
