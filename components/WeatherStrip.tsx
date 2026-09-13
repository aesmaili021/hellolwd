import { getLocale, getTranslations } from "next-intl/server";
import { WeatherIcon } from "@/components/WeatherIcon";
import { localeTag } from "@/i18n/routing";
import { getCalendarStrip } from "@/lib/calendar";
import { getLeeuwardenWeather, type WeatherKind } from "@/lib/weather";

function weekday(date: string, locale: string, index: number) {
  if (index === 0) return null;
  return new Intl.DateTimeFormat(localeTag(locale), { weekday: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function dayLabel(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    calendar: "gregory",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

export async function WeatherStrip() {
  const weather = await getLeeuwardenWeather();
  const locale = await getLocale();
  const t = await getTranslations("weather");
  const calendar = await getTranslations("calendar");
  const nextDay = getCalendarStrip(1).upcoming[0];
  const kind = (value: WeatherKind) => t(`kind.${value}`);

  if (!weather && !nextDay) return null;

  return (
    <section className="border-b border-line bg-mist" aria-label={t("label")}>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 lg:px-10">
        {weather ? (
          <p className="flex min-w-0 items-center gap-2 text-navy">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ice text-brand">
              <WeatherIcon kind={weather.current.kind} className="h-4 w-4" />
            </span>
            <span className="text-[17px] font-extrabold tracking-[-0.02em] tabular-nums">
              {weather.current.temp}°
            </span>
            <span className="text-[13px] font-bold">{kind(weather.current.kind)}</span>
          </p>
        ) : null}

        {weather ? (
          <ol className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {weather.days.map((day, index) => (
              <li key={day.date} className="flex shrink-0 items-center gap-1 text-navy">
                <span className="text-[10px] font-extrabold tracking-[0.06em] text-mute uppercase">
                  {index === 0 ? t("today") : weekday(day.date, locale, index)}
                </span>
                <span className="text-brand">
                  <WeatherIcon kind={day.kind} className="h-3.5 w-3.5" />
                </span>
                <span className="text-[12px] font-extrabold tabular-nums">{day.max}°</span>
              </li>
            ))}
          </ol>
        ) : (
          <span className="flex-1" />
        )}

        {nextDay ? (
          <p className="shrink-0 text-[12px] font-semibold text-mute">
            <span className="font-extrabold tracking-[0.08em] text-primary uppercase">
              {nextDay.region === "frl" ? calendar("frl") : calendar("nl")}
            </span>
            <span aria-hidden> </span>
            {calendar(`day.${nextDay.id}` as "day.newYear")}
            <span className="text-mute/70"> · {dayLabel(nextDay.date, locale)}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
