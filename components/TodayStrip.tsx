import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/data/articles";
import { getEvents } from "@/lib/data/events";
import { formatEventChip } from "@/lib/format";
import { getCambuur } from "@/lib/cambuur";
import { isAmsterdamToday, pickTodayEvent } from "@/lib/today";
import { articleTitle } from "@/lib/types";

export async function TodayStrip() {
  const locale = await getLocale();
  const t = await getTranslations("today");
  const [events, articles, cambuur] = await Promise.all([
    getEvents(),
    getArticles(undefined, locale),
    getCambuur(),
  ]);
  const story = articles[0] ?? null;
  const night = pickTodayEvent(events);
  const match =
    cambuur?.live ||
    (cambuur?.next && isAmsterdamToday(cambuur.next.date) ? cambuur.next : null);
  const headline = story ? articleTitle(story, locale) : "";
  const cambuurT = await getTranslations("cambuur");

  if (!night.event && !match && !headline) return null;

  return (
    <section className="border-b border-line bg-ice" aria-label={t("label")}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-4 py-3.5 sm:grid-cols-2 sm:items-center sm:gap-6 lg:px-10 lg:py-4">
        <p className="text-[11px] font-extrabold tracking-[0.14em] text-primary uppercase sm:col-span-2">
          {t("kicker")}
        </p>
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
