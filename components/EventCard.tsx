import { getLocale, getTranslations } from "next-intl/server";
import { CoverImage } from "@/components/CoverImage";
import { SaveEventButton } from "@/components/SaveEventButton";
import { eventImage } from "@/lib/data/placeholders";
import { formatEventWhen } from "@/lib/format";
import { eventMapsHref } from "@/lib/maps";
import type { EventRow } from "@/lib/types";

function MapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M8 1.6c-2.4 0-4.3 1.9-4.3 4.3 0 3.2 4.3 8.5 4.3 8.5s4.3-5.3 4.3-8.5C12.3 3.5 10.4 1.6 8 1.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="8" cy="5.9" r="1.4" fill="currentColor" />
    </svg>
  );
}

export async function EventCard({ event }: { event: EventRow }) {
  const locale = await getLocale();
  const t = await getTranslations("events");
  const genres = await getTranslations("genres");
  const instagram = Boolean(event.ticket_link?.includes("instagram.com"));
  const mapsHref = eventMapsHref(event);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line">
      <div className="relative">
        <CoverImage
          src={eventImage(event.image_url)}
          alt=""
          className="h-[130px] w-full lg:h-[152px]"
        />
        <SaveEventButton id={event.id} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5 lg:gap-2.5 lg:p-[18px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-paper">
            {genres(event.genre).toUpperCase()}
          </span>
          <time
            dateTime={event.event_datetime}
            className="text-xs font-bold text-navy"
          >
            {formatEventWhen(event.event_datetime, locale)}
          </time>
        </div>
        <h2 className="text-lg font-bold leading-snug tracking-[-0.015em] text-navy lg:text-[19px]">
          {event.name}
        </h2>
        <p className="text-[13px] text-muted">{event.venue}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3.5 border-t border-line pt-2.5">
          <a
            href={mapsHref}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-[13px] font-bold text-primary hover:text-navy"
            rel="noopener noreferrer"
            target="_blank"
            aria-label={t("mapLabel", { venue: event.venue })}
          >
            <MapPin className="h-3.5 w-3.5" />
            {t("map")}
          </a>
          {event.ticket_link ? (
            instagram ? (
              <a
                href={event.ticket_link}
                className="inline-flex min-h-11 cursor-pointer items-center text-[13px] font-bold text-primary hover:text-navy"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("instagram")} ↗
              </a>
            ) : (
              <a
                href={event.ticket_link}
                className="inline-flex min-h-11 cursor-pointer items-center text-[13px] font-bold text-primary hover:text-navy"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("tickets")} ↗
              </a>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}
