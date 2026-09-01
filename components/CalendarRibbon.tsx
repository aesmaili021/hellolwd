import { getLocale, getTranslations } from "next-intl/server";
import { localeTag } from "@/i18n/routing";
import { getCalendarStrip } from "@/lib/calendar";

function dayLabel(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    calendar: "gregory",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

export async function CalendarRibbon() {
  const locale = await getLocale();
  const t = await getTranslations("calendar");
  const { today, upcoming } = getCalendarStrip();

  return (
    <div className="border-b border-line bg-navy text-paper" aria-label={t("label")}>
      <div className="mx-auto flex h-6 max-w-[1440px] items-center gap-2.5 overflow-hidden px-4 lg:px-10">
        <time
          dateTime={today}
          className="shrink-0 text-[10px] font-extrabold tracking-[0.14em] text-ice uppercase"
        >
          {dayLabel(today, locale)}
        </time>
        <span className="h-2.5 w-px shrink-0 bg-paper/20" aria-hidden />
        <ol className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {upcoming.map((item) => (
            <li key={`${item.id}-${item.date}`} className="flex shrink-0 items-center gap-1.5">
              <span className="text-[10px] font-extrabold tracking-[0.08em] text-primary uppercase">
                {item.region === "frl" ? t("frl") : t("nl")}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.01em] text-paper/90">
                {t(`day.${item.id}` as "day.newYear")}
                <span className="text-paper/45"> · {dayLabel(item.date, locale)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
