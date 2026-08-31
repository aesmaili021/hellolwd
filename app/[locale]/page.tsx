import Link from "next/link";
import { notFound } from "next/navigation";
import { FeaturedStory, NewsRow } from "@/components/NewsList";
import { FilterRow } from "@/components/FilterRow";
import { Header } from "@/components/Header";
import { copy, newsCategories } from "@/lib/copy";
import { getNewsFeed } from "@/lib/news";
import { isLocale } from "@/lib/locales";
import type { NewsCategory } from "@/lib/types";

const categorySet = new Set<string>(newsCategories);

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { locale } = await params;
  const { cat } = await searchParams;
  if (!isLocale(locale)) notFound();

  const category =
    cat && categorySet.has(cat) ? (cat as NewsCategory) : undefined;
  const { featured, rest } = getNewsFeed(category);

  return (
    <>
      <Header locale={locale} section="news" />
      <main id="content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <FilterRow
          label={copy.filterNews[locale]}
          allHref={`/${locale}`}
          allLabel={copy.allCategories[locale]}
          activeId={category}
          items={newsCategories.map((id) => ({
            id,
            label: copy.categories[id][locale],
            href: `/${locale}?cat=${id}`,
          }))}
        />

        <div className="mt-8">
          {featured ? <FeaturedStory item={featured} locale={locale} /> : null}

          {!category ? (
            <Link
              href={`/${locale}/events`}
              className="mt-6 flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl bg-navy px-4 py-3 text-paper transition-colors duration-200 ease-out hover:bg-navy/90"
            >
              <span>
                <span className="block text-sm font-semibold">
                  {copy.weekendStrip[locale]}
                </span>
                <span className="block text-sm text-paper/80">
                  {copy.weekendCta[locale]}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-xl rtl:-scale-x-100"
              >
                →
              </span>
            </Link>
          ) : null}

          {rest.length > 0 ? (
            <section className="mt-2" aria-label={copy.moreNews[locale]}>
              {rest.map((item) => (
                <NewsRow key={item.id} item={item} locale={locale} />
              ))}
            </section>
          ) : null}

          {!featured && rest.length === 0 ? (
            <p className="mt-10 text-ink-soft">{copy.emptyNews[locale]}</p>
          ) : null}
        </div>
      </main>
    </>
  );
}
