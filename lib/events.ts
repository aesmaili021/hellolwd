import type { EventItem } from "./types";

export const events: EventItem[] = [
  {
    id: "neushoorn-warehouse",
    startsAt: "2026-09-05T23:00:00+02:00",
    venue: "Neushoorn",
    genre: "electronic",
    link: "https://neushoorn.nl/",
    featured: true,
    name: {
      nl: "Warehouse Frisian",
      en: "Warehouse Frisian",
      es: "Warehouse Frisian",
      fa: "ویرهاوس فریزی",
    },
    detail: {
      nl: "Twee zalen, techno en breaks. Deuren 23:00, last in 01:30. Geen gastlijst na middernacht.",
      en: "Two rooms, techno and breaks. Doors 23:00, last in 01:30. No guest list after midnight.",
      es: "Dos salas, techno y breaks. Puertas 23:00, último acceso 01:30. Sin lista después de medianoche.",
      fa: "دو سالن، تکنو و بریکس. درها ۲۳:۰۰، ورود آخر ۰۱:۳۰. بعد نیمه‌شب لیست مهمان نیست.",
    },
  },
  {
    id: "intro-friday",
    startsAt: "2026-09-04T21:30:00+02:00",
    venue: "Neushoorn",
    genre: "student",
    link: "https://neushoorn.nl/",
    name: {
      nl: "Intro Friday: International Mixer",
      en: "Intro Friday: International Mixer",
      es: "Intro Friday: International Mixer",
      fa: "جمعه آشنایی: میکس بین‌المللی",
    },
    detail: {
      nl: "Eerstejaars en exchange. Gratis met studentenkaart tot 22:30. Jassen in de garderobe verplicht.",
      en: "First years and exchange students. Free with student card until 22:30. Coat check required.",
      es: "Primer curso e intercambio. Gratis con carnet hasta las 22:30. Guardarropa obligatorio.",
      fa: "سال‌اولی و تبادل. تا ۲۲:۳۰ با کارت دانشجویی رایگان. سپردن کت لازم است.",
    },
  },
  {
    id: "ossekop-live",
    startsAt: "2026-09-05T20:00:00+02:00",
    venue: "Café de Ossekop",
    genre: "live",
    link: "https://www.ossekop.nl/",
    name: {
      nl: "De Ossekop: local four-piece",
      en: "De Ossekop: local four-piece",
      es: "De Ossekop: cuarteto local",
      fa: "ده اسه‌کپ: گروه چهارنفره محلی",
    },
    detail: {
      nl: "Gitaar en NL/EN vocals. Staand, geen tickets vooraf. Begin stipt 20:30.",
      en: "Guitar and NL/EN vocals. Standing, no tickets in advance. Starts 20:30 sharp.",
      es: "Guitarra y voces NL/EN. De pie, sin entradas previas. Empieza a las 20:30 en punto.",
      fa: "گیتار و آواز هلندی/انگلیسی. ایستاده، بلیت از قبل نیست. شروع دقیق ۲۰:۳۰.",
    },
  },
  {
    id: "zaailand-hiphop",
    startsAt: "2026-09-06T22:00:00+02:00",
    venue: "Club T",
    genre: "hiphop",
    link: "https://www.instagram.com/",
    name: {
      nl: "Late Cipher",
      en: "Late Cipher",
      es: "Late Cipher",
      fa: "لیت سایفر",
    },
    detail: {
      nl: "Cypher open van 22:00 tot 23:00, daarna dj’s. 18+ en ID aan de deur.",
      en: "Open cypher 22:00 to 23:00, then DJs. 18+ and ID at the door.",
      es: "Cifrado abierto de 22:00 a 23:00, luego DJs. +18 y DNI en la puerta.",
      fa: "سایفر باز از ۲۲:۰۰ تا ۲۳:۰۰، بعد دی‌جی. ۱۸+ و کارت شناسایی دم در.",
    },
  },
  {
    id: "latin-sunday",
    startsAt: "2026-09-06T16:00:00+02:00",
    venue: "De Koperen Tuin",
    genre: "dj",
    link: "https://www.dekoperentuin.nl/",
    name: {
      nl: "Domingo Latino",
      en: "Domingo Latino",
      es: "Domingo Latino",
      fa: "یکشنبه لاتین",
    },
    detail: {
      nl: "Salsa en cumbia in de middagzon. Gratis tot 19:00, daarna entreeprijs. Buiten als het droog blijft.",
      en: "Salsa and cumbia in the afternoon. Free until 19:00, then a door fee. Outside if it stays dry.",
      es: "Salsa y cumbia por la tarde. Gratis hasta las 19:00, luego entrada. Fuera si no llueve.",
      fa: "سالسا و کومبیا بعدازظهر. تا ۱۹:۰۰ رایگان، بعد ورودی. اگر باران نباشد بیرون.",
    },
  },
  {
    id: "asteriks-dj",
    startsAt: "2026-09-04T22:30:00+02:00",
    venue: "Podium Asteriks",
    genre: "dj",
    link: "https://www.instagram.com/",
    name: {
      nl: "Asteriks: residents + guest",
      en: "Asteriks: residents + guest",
      es: "Asteriks: residentes + invitado",
      fa: "آستریکس: رزیدنت و مهمان",
    },
    detail: {
      nl: "Kleine zaal, house tot 03:00. Cap 120. Link in bio voor de gastlijst tot vrijdag 18:00.",
      en: "Small room, house until 03:00. Cap 120. Link in bio for the guest list until Friday 18:00.",
      es: "Sala pequeña, house hasta las 03:00. Cupo 120. Enlace en bio para la lista hasta el viernes 18:00.",
      fa: "سالن کوچک، هاوس تا ۰۳:۰۰. ظرفیت ۱۲۰. لینک بیو برای لیست مهمان تا جمعه ۱۸:۰۰.",
    },
  },
];

export function getEvents(genre?: EventItem["genre"]) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  if (!genre) return sorted;
  return sorted.filter((item) => item.genre === genre);
}
