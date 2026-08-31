import { copy } from "@/lib/copy";
import { formatStamp } from "@/lib/format";
import type { Locale } from "@/lib/locales";
import type { NewsItem } from "@/lib/types";

export function FeaturedStory({
  item,
  locale,
}: {
  item: NewsItem;
  locale: Locale;
}) {
  return (
    <article className="border-b border-line pb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pompebled">
        {copy.categories[item.category][locale]}
      </p>
      <h1 className="mt-3 max-w-[22ch] text-3xl font-semibold leading-[1.15] tracking-tight text-navy text-balance sm:text-4xl">
        {item.headline[locale]}
      </h1>
      <p className="mt-4 max-w-[62ch] text-base leading-7 text-ink">
        {item.summary[locale]}
      </p>
      <Meta item={item} locale={locale} />
    </article>
  );
}

export function NewsRow({
  item,
  locale,
}: {
  item: NewsItem;
  locale: Locale;
}) {
  return (
    <article className="border-b border-line py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">
        {copy.categories[item.category][locale]}
      </p>
      <h2 className="mt-2 max-w-[34ch] text-xl font-semibold leading-snug tracking-tight text-navy text-balance">
        {item.headline[locale]}
      </h2>
      <p className="mt-2 max-w-[62ch] text-sm leading-6 text-ink">
        {item.summary[locale]}
      </p>
      <Meta item={item} locale={locale} />
    </article>
  );
}

function Meta({ item, locale }: { item: NewsItem; locale: Locale }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
      <a
        href={item.sourceUrl}
        className="cursor-pointer font-medium text-navy underline-offset-4 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        {item.sourceName}
      </a>
      <span aria-hidden="true">·</span>
      <time dateTime={item.publishedAt}>{formatStamp(item.publishedAt, locale)}</time>
      <span aria-hidden="true">·</span>
      <a
        href={item.originalUrl}
        className="cursor-pointer font-medium text-navy underline-offset-4 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        {copy.readFull[locale]}
      </a>
    </p>
  );
}
