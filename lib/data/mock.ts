import type { Article, EventRow, RssSource } from "@/lib/types";

const created = "2026-08-31T10:00:00+02:00";

type ArticleSeed = Omit<Article, "image_url" | "locales"> &
  Partial<Pick<Article, "image_url" | "locales">>;

export const mockArticles: ArticleSeed[] = [
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f701",
    source_url:
      "https://www.omropfryslan.nl/nl/nieuws/17753351/voor-een-kamer-in-leeuwarden-moeten-studenten-dieper-in-de-buidel-tasten",
    source_name: "Omrop Fryslân",
    category: "politics",
    published_at: "2026-08-31T08:20:00+02:00",
    title_nl: "Gemeente steunt honderd extra studentenwoningen bij NHL Stenden",
    title_en: "Council backs a hundred extra student rooms near NHL Stenden",
    title_es: "El ayuntamiento apoya cien habitaciones extra junto a NHL Stenden",
    title_fa: "شهرداری با صد خوابگاه اضافه کنار ان‌اچ‌ال استندن موافقت کرد",
    summary_nl:
      "Het college wil tijdelijke units aan de Rengerslaan. Bewoners eisten eerst duidelijkheid over parkeren en geluid. Stemming volgt volgende week.",
    summary_en:
      "The board wants temporary units on Rengerslaan. Neighbours asked first for a clear plan on parking and noise. The vote is next week.",
    summary_es:
      "El gobierno local quiere módulos temporales en Rengerslaan. Los vecinos pidieron antes un plan claro de parking y ruido. La votación es la semana que viene.",
    summary_fa:
      "شورا واحدهای موقت در رِنخرسلان می‌خواهد. همسایه‌ها اول تکلیف پارک و صدا را خواستند. رأی هفتهٔ بعد است.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f702",
    source_url:
      "https://www.lc.nl/regio/friesland/leeuwarden/aquaduct-tijdelijk-dicht-in-leeuwarden/157155527.html",
    source_name: "LC.nl",
    category: "infrastructure",
    published_at: "2026-08-30T16:40:00+02:00",
    title_nl: "Wirdumerdijk twee weken dicht: bus 10 om via Zaailand",
    title_en: "Wirdumerdijk closed for two weeks: bus 10 reroutes via Zaailand",
    title_es: "Wirdumerdijk cerrado dos semanas: el bus 10 desvía por Zaailand",
    title_fa: "ویردومردایک دو هفته بسته است؛ اتوبوس ۱۰ از زایلاند می‌رود",
    summary_nl:
      "Werk aan riolering start maandag 1 september. Fietsers kunnen door. Reken extra 8 minuten in de ochtendspits.",
    summary_en:
      "Sewer works start Monday 1 September. Bikes can still pass. Add about 8 minutes in the morning rush.",
    summary_es:
      "Las obras de alcantarillado empiezan el lunes 1 de septiembre. Las bicis pasan. Suma unos 8 minutos en la hora punta.",
    summary_fa:
      "کار فاضلاب دوشنبه ۱ سپتامبر شروع می‌شود. دوچرخه رد می‌شود. صبح شلوغ حدود ۸ دقیقه بیشتر حساب کنید.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f703",
    source_url:
      "https://omroepleeuwarden.nl/bruisende-markt-vol-kunst-muziek-dans-mienskip-en-lekker-eten-in-bouwurk-bij-de-oldehove/",
    source_name: "Omroep Leeuwarden",
    category: "culture",
    published_at: "2026-08-30T11:05:00+02:00",
    title_nl: "Oldehove Night Markets: extra zaterdag in september",
    title_en: "Oldehove Night Markets: extra Saturday in September",
    title_es: "Oldehove Night Markets: sábado extra en septiembre",
    title_fa: "بازار شب اولدهوفه: یک شنبهٔ اضافه در سپتامبر",
    summary_nl:
      "Foodstalls en korte sets op het Oldehoofsterkerkhof. Toegang vrij. Laatste ronde 23:30 vanwege de buren.",
    summary_en:
      "Food stalls and short sets on Oldehoofsterkerkhof. Free entry. Last round 23:30 for the neighbours.",
    summary_es:
      "Puestos de comida y sets cortos en Oldehoofsterkerkhof. Entrada libre. Última ronda 23:30 por los vecinos.",
    summary_fa:
      "غذا و ست‌های کوتاه در اولدهوفسترکرک‌هوف. ورود آزاد. آخرین دور ۲۳:۳۰ به‌خاطر همسایه‌ها.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f704",
    source_url:
      "https://www.omropfryslan.nl/nl/nieuws/681024/de-meeste-fietsen-worden-gestolen-bij-station-leeuwarden",
    source_name: "Omrop Fryslân",
    category: "safety",
    published_at: "2026-08-29T18:15:00+02:00",
    title_nl: "Politie: meer fietsdiefstallen rond station en Zaailand",
    title_en: "Police: more bike thefts around the station and Zaailand",
    title_es: "Policía: más robos de bici junto a la estación y Zaailand",
    title_fa: "پلیس: دزدی دوچرخه اطراف ایستگاه و زایلاند بیشتر شده",
    summary_nl:
      "Vooral ’s avonds bij onverlichte rekken. Gebruik een tweede slot. Meld via 0900-8844, geen spoed.",
    summary_en:
      "Mostly evenings at unlit racks. Use a second lock. Report on 0900-8844 if it is not urgent.",
    summary_es:
      "Sobre todo por la noche en aparcamientos sin luz. Usa un segundo candado. Avisa al 0900-8844 si no es urgente.",
    summary_fa:
      "بیشتر شب‌ها کنار رک‌های بی‌نور. قفل دوم بزنید. اگر فوری نیست با ۰۹۰۰-۸۸۴۴ خبر دهید.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f705",
    source_url:
      "https://omroepleeuwarden.nl/leip-zo-ontdekken-eerstejaars-studenten-hun-nieuwe-stad/",
    source_name: "Omroep Leeuwarden",
    category: "education",
    published_at: "2026-08-29T09:30:00+02:00",
    title_nl: "NHL Stenden opent semester: introweek tot donderdag",
    title_en: "NHL Stenden term opens: intro week runs through Thursday",
    title_es: "NHL Stenden abre el semestre: la intro sigue hasta el jueves",
    title_fa: "ترم ان‌اچ‌ال استندن شروع شد؛ هفتهٔ آشنایی تا پنجشنبه",
    summary_nl:
      "Internationale studenten halen hun OV-chip en inschrijving bij het Student Service Centre. Avondprogramma in Neushoorn.",
    summary_en:
      "International students pick up OV-chip cards and enrolment at the Student Service Centre. Evening programme at Neushoorn.",
    summary_es:
      "Los estudiantes internacionales recogen el OV-chip y la matrícula en el Student Service Centre. Programa nocturno en Neushoorn.",
    summary_fa:
      "دانشجوهای بین‌المللی کارت او‌وی و ثبت‌نام را از مرکز خدمات دانشجویی می‌گیرند. برنامهٔ شب در نویسهورن.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f706",
    source_url:
      "https://www.lc.nl/regio/friesland/leeuwarden/restaurant-de-gouverneur-opent-op-iconische-plek-in-het-centrum-van-leeuwarden-droom-komt-uit/156396143.html",
    source_name: "LC.nl",
    category: "business",
    published_at: "2026-08-28T13:50:00+02:00",
    title_nl: "Drie nieuwe zaken openen in De Kelders deze maand",
    title_en: "Three new spots open on De Kelders this month",
    title_es: "Tres locales nuevos abren en De Kelders este mes",
    title_fa: "این ماه سه جای تازه در ده کلدرز باز می‌شود",
    summary_nl:
      "Een lunchbar, een tweedehandsboekwinkel en een kleine wijnbar. Terrasplekken blijven beperkt tot de kade.",
    summary_en:
      "A lunch counter, a second-hand bookshop and a small wine bar. Terrace seats stay limited to the quay.",
    summary_es:
      "Un mostrador de comida, una librería de segundo uso y un vino pequeño. Las terrazas siguen solo en el muelle.",
    summary_fa:
      "یک ناهاربار، کتاب‌فروشی دست‌دوم و یک بار شراب کوچک. صندلی فضای باز فقط روی اسکله می‌ماند.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f707",
    source_url:
      "https://www.omropfryslan.nl/nl/nieuws/17862582/lees-terug-cambuur-koploper-na-zege-op-de-graafschap",
    source_name: "Omrop Fryslân",
    category: "sports",
    published_at: "2026-08-28T07:45:00+02:00",
    title_nl: "Cambuur thuis tegen De Graafschap: poort open 18:00",
    title_en: "Cambuur at home vs De Graafschap: gates at 18:00",
    title_es: "Cambuur en casa contra De Graafschap: puertas a las 18:00",
    title_fa: "کامبور در خانه برابر ده خراف‌اسخاپ؛ درها ساعت ۱۸:۰۰",
    summary_nl:
      "Klapstoelkaartjes nog via de club. Bus 2 rijdt extra ritten na afloop. Geen alcohol in de trein terug.",
    summary_en:
      "Terrace tickets still via the club. Bus 2 adds extra runs after the match. No alcohol on the train back.",
    summary_es:
      "Aún hay entradas de grada en el club. El bus 2 pone viajes extra al final. Sin alcohol en el tren de vuelta.",
    summary_fa:
      "بلیت جایگاه هنوز از باشگاه. اتوبوس ۲ بعد بازی اضافه می‌رود. در قطار برگشت الکل نیست.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f708",
    source_url:
      "https://omroepleeuwarden.nl/paddenschermen-beschermen-verliefde-padden-langs-fietspad-potmarge/",
    source_name: "Omroep Leeuwarden",
    category: "infrastructure",
    published_at: "2026-08-27T15:10:00+02:00",
    title_nl: "Nieuw fietspad langs de Potmarge deels open",
    title_en: "New Potmarge bike path partly open",
    title_es: "El nuevo carril bici del Potmarge abre en parte",
    title_fa: "مسیر دوچرخهٔ تازهٔ پوت‌مارخه نیمه‌باز شد",
    summary_nl:
      "Het stuk tot de Heliconweg is klaar. Het laatste deel naar het station volgt in oktober als het weer meezit.",
    summary_en:
      "The stretch to Heliconweg is done. The last piece to the station follows in October if the weather holds.",
    summary_es:
      "El tramo hasta Heliconweg ya está. El último tramo a la estación llega en octubre si el tiempo aguanta.",
    summary_fa:
      "قطعه تا هلی‌کن‌وخ تمام شد. تکه آخر تا ایستگاه اگر هوا بسازد اکتبر می‌آید.",
    created_at: created,
  },
  {
    id: "a8c1d2e3-4f56-4789-a012-b3c4d5e6f709",
    source_url:
      "https://omroepleeuwarden.nl/stadsdichter-van-leeuwarden-opent-de-zinnenfabriek-de-pop-up-gedichtenwinkel-van-leeuwarden/",
    source_name: "Omroep Leeuwarden",
    category: "culture",
    published_at: "2026-08-31T19:10:00+02:00",
    title_nl: "",
    title_en: "",
    title_es: "",
    title_fa: "شب شعر فارسی در کافه ده کلدرز",
    summary_nl: "",
    summary_en: "",
    summary_es: "",
    summary_fa:
      "جمعه ساعت ۲۰:۰۰ خوانش شعر و چای. ورود آزاد. این خبر فقط برای فارسی‌زبان‌هاست.",
    image_url: null,
    locales: ["fa"],
    created_at: created,
  },
];

export const mockRss: RssSource[] = [
  {
    id: "rss-omrop",
    name: "Omrop Fryslân",
    url: "https://www.omropfryslan.nl/rss/nederlands",
    enabled: true,
    created_at: created,
  },
  {
    id: "rss-ol",
    name: "Omroep Leeuwarden",
    url: "https://omroepleeuwarden.nl/feed/",
    enabled: true,
    created_at: created,
  },
  {
    id: "rss-lc",
    name: "LC.nl",
    url: "https://www.lc.nl/rss/",
    enabled: true,
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
