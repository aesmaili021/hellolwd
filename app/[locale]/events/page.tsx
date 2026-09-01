import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { EmptyWeekend } from "@/components/EmptyStates";
import { EventCard } from "@/components/EventCard";
import { WeatherStrip } from "@/components/WeatherStrip";
import { Link } from "@/i18n/navigation";
import { getEvents } from "@/lib/data/events";
import { formatWeekendRange } from "@/lib/format";
import { EVENT_GENRES, type EventGenre } from "@/lib/types";

export async function generateMetadata() {
  const t = await getTranslations("nav");
  return { title: t("events") };
}

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ genre?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const { genre } = await searchParams;
  const active =
    genre && (EVENT_GENRES as readonly string[]).includes(genre)
      ? (genre as EventGenre)
      : undefined;
  const events = await getEvents(active);
  const rangeSource = active ? await getEvents() : events;
  const t = await getTranslations("events");
  const filters = await getTranslations("filters");
  const genres = await getTranslations("genres");
  const currentLocale = await getLocale();
  const range = formatWeekendRange(
    rangeSource.map((event) => event.event_datetime),
    currentLocale,
  );

  return (
    <>
    <WeatherStrip />
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <header className="mb-6 flex flex-col gap-2 lg:mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5 lg:gap-2">
          {range ? (
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase lg:text-xs lg:tracking-[0.14em]">
              {range}
            </p>
          ) : null}
          <h1 className="text-[27px] font-extrabold tracking-[-0.025em] text-navy lg:text-[38px] lg:tracking-[-0.03em]">
            {t("title")}
          </h1>
        </div>
        <p className="hidden text-sm text-muted lg:block">
          {t("updated", { count: events.length })}
        </p>
      </header>

      <nav
        aria-label={filters("events")}
        className="-mx-4 mb-6 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:mb-7 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max flex-nowrap gap-2 lg:flex-wrap">
          <li>
            <Link
              href="/events"
              aria-current={!active ? "page" : undefined}
              className={`inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-full px-3.5 text-[13px] ${
                !active
                  ? "bg-brand font-extrabold text-paper"
                  : "bg-wash font-semibold text-ink hover:text-navy"
              }`}
            >
              {filters("allGenres")}
            </Link>
          </li>
          {EVENT_GENRES.map((id) => {
            const on = active === id;
            return (
              <li key={id}>
                <Link
                  href={on ? "/events" : { pathname: "/events", query: { genre: id } }}
                  aria-current={on ? "page" : undefined}
                  className={`inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-full px-3.5 text-[13px] ${
                    on
                      ? "bg-accent font-extrabold text-paper"
                      : "bg-wash font-semibold text-ink hover:text-navy"
                  }`}
                >
                  {genres(id)}
                  {on ? <span className="ms-1.5" aria-hidden>✕</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {events.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      ) : active ? (
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-[#CBD6E0] px-5 py-10 text-center">
          <h2 className="max-w-[24ch] text-[19px] font-extrabold leading-snug text-navy">
            {t("emptyGenre", { genre: genres(active).toLowerCase() })}
          </h2>
          <Link href="/events" className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy">
            {filters("clear")}
          </Link>
        </div>
      ) : (
        <EmptyWeekend />
      )}
    </main>
    </>
  );
}
