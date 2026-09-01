export type OccasionRegion = "nl" | "frl";

export type OccasionId =
  | "newYear"
  | "goodFriday"
  | "easter"
  | "easterMonday"
  | "sintPiterArrival"
  | "sintPiter"
  | "kingsNight"
  | "kingsDay"
  | "remembrance"
  | "liberation"
  | "ascension"
  | "pentecost"
  | "pentecostMonday"
  | "pcFraneker"
  | "sneekweek"
  | "prinsjesdag"
  | "sintMaarten"
  | "sinterklaas"
  | "christmas"
  | "boxingDay"
  | "newYearsEve";

export type Occasion = {
  id: OccasionId;
  date: string;
  region: OccasionRegion;
};

function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

function iso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate() + days);
}

function amsterdamToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });
}

function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utcDate(year, month, day);
}

function nthWeekday(year: number, month: number, weekday: number, n: number) {
  const first = utcDate(year, month, 1);
  const shift = (weekday - first.getUTCDay() + 7) % 7;
  return utcDate(year, month, 1 + shift + (n - 1) * 7);
}

function kingsDay(year: number) {
  const day = utcDate(year, 4, 27);
  return day.getUTCDay() === 0 ? utcDate(year, 4, 26) : day;
}

function sintPiterArrival(year: number) {
  const nameDay = utcDate(year, 2, 22);
  const back = nameDay.getUTCDay() === 6 ? 7 : (nameDay.getUTCDay() + 1) % 7 || 7;
  let arrival = addDays(nameDay, -back);
  if (nameDay.getTime() - arrival.getTime() <= 86400000) arrival = addDays(arrival, -7);
  return arrival;
}

function yearOccasions(year: number): Occasion[] {
  const easter = easterSunday(year);
  const kings = kingsDay(year);
  const items: Occasion[] = [
    { id: "newYear", date: iso(utcDate(year, 1, 1)), region: "nl" },
    { id: "goodFriday", date: iso(addDays(easter, -2)), region: "nl" },
    { id: "easter", date: iso(easter), region: "nl" },
    { id: "easterMonday", date: iso(addDays(easter, 1)), region: "nl" },
    { id: "sintPiterArrival", date: iso(sintPiterArrival(year)), region: "frl" },
    { id: "sintPiter", date: iso(utcDate(year, 2, 21)), region: "frl" },
    { id: "kingsNight", date: iso(addDays(kings, -1)), region: "nl" },
    { id: "kingsDay", date: iso(kings), region: "nl" },
    { id: "remembrance", date: iso(utcDate(year, 5, 4)), region: "nl" },
    { id: "liberation", date: iso(utcDate(year, 5, 5)), region: "nl" },
    { id: "ascension", date: iso(addDays(easter, 39)), region: "nl" },
    { id: "pentecost", date: iso(addDays(easter, 49)), region: "nl" },
    { id: "pentecostMonday", date: iso(addDays(easter, 50)), region: "nl" },
    { id: "pcFraneker", date: iso(addDays(nthWeekday(year, 7, 2, 4), 1)), region: "frl" },
    { id: "sneekweek", date: iso(nthWeekday(year, 8, 6, 1)), region: "frl" },
    { id: "prinsjesdag", date: iso(nthWeekday(year, 9, 2, 3)), region: "nl" },
    { id: "sintMaarten", date: iso(utcDate(year, 11, 11)), region: "nl" },
    { id: "sinterklaas", date: iso(utcDate(year, 12, 5)), region: "nl" },
    { id: "christmas", date: iso(utcDate(year, 12, 25)), region: "nl" },
    { id: "boxingDay", date: iso(utcDate(year, 12, 26)), region: "nl" },
    { id: "newYearsEve", date: iso(utcDate(year, 12, 31)), region: "nl" },
  ];
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

export function getCalendarStrip(limit = 5) {
  const today = amsterdamToday();
  const year = Number(today.slice(0, 4));
  const upcoming = [...yearOccasions(year), ...yearOccasions(year + 1)]
    .filter((item, index, list) => item.date >= today && list.findIndex((row) => row.id === item.id && row.date === item.date) === index)
    .slice(0, limit);
  return { today, upcoming };
}
