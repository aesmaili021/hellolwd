import { getLocale, getTranslations } from "next-intl/server";
import { WeatherIcon } from "@/components/WeatherIcon";
import { localeTag } from "@/i18n/routing";
import { getCalendarStrip } from "@/lib/calendar";
import { getCambuur } from "@/lib/cambuur";
import { getLeeuwardenWeather } from "@/lib/weather";

function todayLabel(locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    calendar: "gregory",
    timeZone: "Europe/Amsterdam",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());
}

function when(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function occasionDay(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    calendar: "gregory",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

function Rule() {
  return <span className="h-3 w-px shrink-0 bg-paper/20" aria-hidden />;
}

export async function StatusBar() {
  const locale = await getLocale();
  const [weather, cambuur] = await Promise.all([getLeeuwardenWeather(), getCambuur()]);
  const today = await getTranslations("today");
  const weatherT = await getTranslations("weather");
  const cambuurT = await getTranslations("cambuur");
  const calendar = await getTranslations("calendar");
  const nextDay = getCalendarStrip(1).upcoming[0];
  const last = cambuur?.recent[0] ?? null;
  const highlight = cambuur?.live ?? last;

  return (
    <div className="bg-navy text-paper" aria-label={today("label")}>
      <div className="mx-auto flex h-9 max-w-[1440px] items-center gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
        <time className="shrink-0 text-[12px] font-bold text-paper/75">{todayLabel(locale)}</time>

        {weather ? (
          <>
            <Rule />
            <p className="flex shrink-0 items-center gap-1.5 text-[12px] font-bold">
              <WeatherIcon kind={weather.current.kind} className="h-3.5 w-3.5 text-primary" />
              <span className="tabular-nums">{weather.current.temp}°</span>
              <span>{weatherT(`kind.${weather.current.kind}`)}</span>
            </p>
          </>
        ) : null}

        {cambuur && highlight ? (
          <>
            <Rule />
            <p className="shrink-0 text-[12px] font-bold">
              <span className="text-[#F6C400]">{cambuurT("short")}</span>
              <span className="text-paper/45"> · </span>
              {cambuur.live ? (
                <span className="text-[#F6C400]">
                  {cambuurT("live")}{" "}
                  {highlight.home
                    ? cambuurT("vs", { team: highlight.opponent })
                    : cambuurT("at", { team: highlight.opponent })}{" "}
                  <span className="tabular-nums">{highlight.score ?? "–"}</span>
                </span>
              ) : (
                <>
                  <span className="text-[#F6C400]">{cambuurT("rank", { rank: cambuur.rank })}</span>
                  <span className="text-paper/45"> · </span>
                  {highlight.result ? <span className="text-[#F6C400]">{highlight.result} </span> : null}
                  {highlight.home
                    ? cambuurT("vs", { team: highlight.opponent })
                    : cambuurT("at", { team: highlight.opponent })}
                  {highlight.score ? (
                    <span className="tabular-nums text-paper/80"> {highlight.score}</span>
                  ) : null}
                  {cambuur.next ? (
                    <>
                      <span className="text-paper/45"> · </span>
                      <span className="text-[#F6C400]">{cambuurT("next")}</span>{" "}
                      {cambuur.next.home
                        ? cambuurT("vs", { team: cambuur.next.opponent })
                        : cambuurT("at", { team: cambuur.next.opponent })}{" "}
                      <span className="text-paper/70">{when(cambuur.next.date, locale)}</span>
                    </>
                  ) : null}
                </>
              )}
            </p>
          </>
        ) : null}

        {nextDay ? (
          <>
            <Rule />
            <p className="shrink-0 text-[12px] font-bold text-paper/80">
              <span className="text-primary">
                {nextDay.region === "frl" ? calendar("frl") : calendar("nl")}
              </span>
              <span aria-hidden> </span>
              {calendar(`day.${nextDay.id}` as "day.newYear")}
              <span className="text-paper/45"> · {occasionDay(nextDay.date, locale)}</span>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
