import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { BusinessCta } from "@/components/BusinessCta";
import { EmptyWeekend } from "@/components/EmptyStates";
import { EventCard } from "@/components/EventCard";
import { EventsBoard, SavedEventSlot } from "@/components/EventsBoard";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { getEvents } from "@/lib/data/events";
import { formatWeekendRange } from "@/lib/format";
import { eventsGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { EVENT_GENRES, type EventGenre } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/events",
    title: seo("eventsTitle"),
    description: seo("eventsDescription"),
    image: "/placeholders/event.jpg",
  });
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
  const seo = await getTranslations("seo");
  const filters = await getTranslations("filters");
  const genres = await getTranslations("genres");
  const currentLocale = await getLocale();
  const range = formatWeekendRange(
    rangeSource.map((event) => event.event_datetime),
    currentLocale,
  );

  return (
    <>
    <JsonLd
      data={eventsGraph(events, currentLocale, seo("eventsTitle"), seo("eventsDescription"))}
    />
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

      {events.length > 0 ? (
        <EventsBoard
          ids={events.map((event) => event.id)}
          filters={
            <>
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
            </>
          }
        >
          {events.map((event) => (
            <SavedEventSlot key={event.id} id={event.id}>
              <EventCard event={event} />
            </SavedEventSlot>
          ))}
        </EventsBoard>
      ) : active ? (
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-line px-5 py-10 text-center">
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
    <BusinessCta />
    </>
  );
}
