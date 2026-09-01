import { getLocale, getTranslations } from "next-intl/server";
import { CalendarRibbon } from "@/components/CalendarRibbon";
import { WeatherIcon } from "@/components/WeatherIcon";
import { localeTag } from "@/i18n/routing";
import { getLeeuwardenWeather, type WeatherKind } from "@/lib/weather";

function weekday(date: string, locale: string, index: number) {
  if (index === 0) return null;
  return new Intl.DateTimeFormat(localeTag(locale), { weekday: "short" }).format(new Date(`${date}T12:00:00`));
}

export async function WeatherStrip() {
  const weather = await getLeeuwardenWeather();
  if (!weather) return <CalendarRibbon />;

  const locale = await getLocale();
  const t = await getTranslations("weather");
  const kind = (value: WeatherKind) => t(`kind.${value}`);

  return (
    <>
    <CalendarRibbon />
    <section className="border-b border-line bg-mist" aria-label={t("label")}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ice text-brand">
            <WeatherIcon kind={weather.current.kind} className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
              {t("city")}
            </p>
            <p className="flex flex-wrap items-baseline gap-x-2 text-navy">
              <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">
                {weather.current.temp}°
              </span>
              <span className="text-sm font-bold">{kind(weather.current.kind)}</span>
            </p>
            <p className="mt-0.5 text-[12px] text-mute">
              {t("nowMeta", { wind: weather.current.wind, humidity: weather.current.humidity })}
            </p>
          </div>
        </div>

        <ol className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {weather.days.map((day, index) => (
            <li
              key={day.date}
              className="flex min-w-[4.6rem] flex-col items-center gap-1 rounded-xl bg-paper px-2.5 py-2 text-center lg:min-w-[5.2rem]"
            >
              <span className="text-[10px] font-extrabold tracking-[0.08em] text-mute uppercase">
                {index === 0 ? t("today") : weekday(day.date, locale, index)}
              </span>
              <span className="text-brand">
                <WeatherIcon kind={day.kind} className="h-5 w-5" />
              </span>
              <span className="text-[13px] font-extrabold text-navy">
                {day.max}° <span className="font-semibold text-mute">{day.min}°</span>
              </span>
              <span className="text-[10px] font-semibold text-mute">{t("rain", { value: day.rain })}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mx-auto max-w-[1440px] px-4 pb-2.5 text-[11px] text-mute lg:px-10">
        {t("credit")}
      </p>
    </section>
    </>
  );
}
