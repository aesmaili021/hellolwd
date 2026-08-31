import { copy } from "@/lib/copy";
import { formatEventWhen } from "@/lib/format";
import type { Locale } from "@/lib/locales";
import type { EventItem } from "@/lib/types";

export function EventBlock({
  item,
  locale,
  featured,
}: {
  item: EventItem;
  locale: Locale;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "border-b border-line pb-8"
          : "grid gap-1 border-b border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pompebled">
        {copy.genres[item.genre][locale]}
      </p>
      <div>
        <h2
          className={
            featured
              ? "mt-3 max-w-[22ch] text-3xl font-semibold leading-[1.15] tracking-tight text-navy text-balance"
              : "mt-2 text-xl font-semibold leading-snug tracking-tight text-navy text-balance sm:mt-0"
          }
        >
          {item.name[locale]}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          <time dateTime={item.startsAt}>{formatEventWhen(item.startsAt, locale)}</time>
          <span aria-hidden="true"> · </span>
          {item.venue}
        </p>
        <p className="mt-2 max-w-[62ch] text-sm leading-6 text-ink">
          {item.detail[locale]}
        </p>
        <a
          href={item.link}
          className="mt-3 inline-flex min-h-11 cursor-pointer items-center font-medium text-navy underline-offset-4 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {copy.eventLink[locale]}
        </a>
      </div>
    </article>
  );
}
