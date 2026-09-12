import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WeatherIcon } from "@/components/WeatherIcon";
import { formatEventChip } from "@/lib/format";
import { getCambuur } from "@/lib/cambuur";
import { getLeeuwardenWeather } from "@/lib/weather";
import { isAmsterdamToday, pickTodayEvent } from "@/lib/today";
import { articleTitle, type Article, type EventRow } from "@/lib/types";

export async function TodayStrip({
  events,
  story,
}: {
  events: EventRow[];
  story: Article | null;
}) {
  const locale = await getLocale();
  const t = await getTranslations("today");
  const weatherT = await getTranslations("weather");
  const weather = await getLeeuwardenWeather();
  const night = pickTodayEvent(events);
  const cambuur = await getCambuur();
  const match =
    cambuur?.live ||
    (cambuur?.next && isAmsterdamToday(cambuur.next.date) ? cambuur.next : null);
  const headline = story ? articleTitle(story, locale) : "";
  const cambuurT = await getTranslations("cambuur");

  if (!weather && !night.event && !headline) return null;

  return (
    <section className="border-b border-line bg-ice" aria-label={t("label")}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-4 py-3.5 sm:grid-cols-3 sm:items-center sm:gap-6 lg:px-10 lg:py-4">
        <p className="text-[11px] font-extrabold tracking-[0.14em] text-primary uppercase sm:col-span-3">
          {t("kicker")}
        </p>
        {weather ? (
          <p className="flex min-w-0 items-center gap-2.5 text-navy">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper text-brand">
              <WeatherIcon kind={weather.current.kind} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-extrabold tracking-[0.1em] text-mute uppercase">
                {weatherT("city")}
              </span>
              <span className="block truncate text-[17px] font-extrabold tracking-[-0.02em]">
                {t("weather", {
                  temp: weather.current.temp,
                  kind: weatherT(`kind.${weather.current.kind}`),
                })}
              </span>
            </span>
          </p>
        ) : (
          <span />
        )}
        {night.event ? (
          <Link href="/events" className="min-w-0 text-navy hover:text-primary">
            <span className="block text-[10px] font-extrabold tracking-[0.1em] text-mute uppercase">
              {night.tonight ? t("tonight") : t("weekend")}
            </span>
            <span className="block truncate text-[17px] font-extrabold tracking-[-0.02em]">
              {night.event.name}
            </span>
            <span className="block truncate text-[12px] font-semibold text-mute">
              {night.event.venue}
              <span aria-hidden="true"> · </span>
              {formatEventChip(night.event.event_datetime, locale)}
            </span>
          </Link>
        ) : match ? (
          <p className="min-w-0 text-navy">
            <span className="block text-[10px] font-extrabold tracking-[0.1em] text-mute uppercase">
              {match.live ? cambuurT("live") : t("tonight")}
            </span>
            <span className="block truncate text-[17px] font-extrabold tracking-[-0.02em]">
              SC Cambuur{" "}
              {match.home ? cambuurT("vs", { team: match.opponent }) : cambuurT("at", { team: match.opponent })}
            </span>
            <span className="block truncate text-[12px] font-semibold text-mute">
              {match.score || formatEventChip(match.date, locale)}
            </span>
          </p>
        ) : (
          <p className="min-w-0 text-[13px] font-semibold text-mute">{t("emptyNight")}</p>
        )}
        {story && headline ? (
          <Link href={`/article/${story.id}`} className="min-w-0 text-navy hover:text-primary">
            <span className="block text-[10px] font-extrabold tracking-[0.1em] text-mute uppercase">
              {t("news")}
            </span>
            <span className="block text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-pretty line-clamp-2">
              {headline}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
