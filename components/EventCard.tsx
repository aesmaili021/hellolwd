import { getLocale, getTranslations } from "next-intl/server";
import { CoverImage } from "@/components/CoverImage";
import { eventImage } from "@/lib/data/placeholders";
import { formatEventWhen } from "@/lib/format";
import type { EventRow } from "@/lib/types";

export async function EventCard({ event }: { event: EventRow }) {
  const locale = await getLocale();
  const t = await getTranslations("events");
  const genres = await getTranslations("genres");
  const instagram = Boolean(event.ticket_link?.includes("instagram.com"));

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line">
      <CoverImage
        src={eventImage(event.image_url)}
        alt=""
        className="h-[130px] w-full lg:h-[152px]"
      />
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
        {event.ticket_link ? (
          <div className="mt-auto flex items-center gap-3.5 border-t border-line pt-2.5">
            {instagram ? (
              <a
                href={event.ticket_link}
                className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("instagram")} ↗
              </a>
            ) : (
              <>
                <a
                  href={event.ticket_link}
                  className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t("tickets")} ↗
                </a>
                <span className="text-[13px] font-semibold text-mute">
                  {t("instagram")} ↗
                </span>
              </>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
