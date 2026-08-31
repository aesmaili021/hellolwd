import { notFound } from "next/navigation";
import { EventBlock } from "@/components/EventList";
import { FilterRow } from "@/components/FilterRow";
import { Header } from "@/components/Header";
import { copy, eventGenres } from "@/lib/copy";
import { getEvents } from "@/lib/events";
import { isLocale } from "@/lib/locales";
import type { EventGenre } from "@/lib/types";

const genreSet = new Set<string>(eventGenres);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: copy.navEvents[locale] };
}

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ genre?: string }>;
}) {
  const { locale } = await params;
  const { genre } = await searchParams;
  if (!isLocale(locale)) notFound();

  const active =
    genre && genreSet.has(genre) ? (genre as EventGenre) : undefined;
  const items = getEvents(active);
  const [first, ...rest] = items;

  return (
    <>
      <Header locale={locale} section="events" />
      <main id="content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <p className="mb-5 max-w-[62ch] text-base leading-7 text-ink">
          {copy.eventsLead[locale]}
        </p>
        <FilterRow
          label={copy.filterEvents[locale]}
          allHref={`/${locale}/events`}
          allLabel={copy.allGenres[locale]}
          activeId={active}
          items={eventGenres.map((id) => ({
            id,
            label: copy.genres[id][locale],
            href: `/${locale}/events?genre=${id}`,
          }))}
        />

        <div className="mt-8">
          {first ? (
            <EventBlock
              item={first}
              locale={locale}
              featured={!active}
            />
          ) : null}
          {rest.map((item) => (
            <EventBlock key={item.id} item={item} locale={locale} />
          ))}
          {items.length === 0 ? (
            <p className="mt-10 text-ink-soft">{copy.emptyEvents[locale]}</p>
          ) : null}
        </div>
      </main>
    </>
  );
}
