import { Suspense } from "react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { BriefingRow, FeaturedStory, FilterRow } from "@/components/ArticleCard";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CategoryPills } from "@/components/CategoryPills";
import { EmptyFilter } from "@/components/EmptyStates";
import { CambuurBoard } from "@/components/CambuurBoard";
import { HomePromos } from "@/components/HomePromos";
import { NewcomerGuides } from "@/components/NewcomerGuides";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { TodayStrip } from "@/components/TodayStrip";
import { WeekendHeroSection } from "@/components/WeekendHero";
import { JsonLd } from "@/components/JsonLd";
import { CambuurSkeleton, NewsSkeleton, TodaySkeleton, WeekendSlotSkeleton } from "@/components/Skeletons";
import { StoryPager } from "@/components/StoryPager";
import { getArchivedArticles, getRecentArticles } from "@/lib/data/articles";
import { homeGraph } from "@/lib/schema";
import { localePath, pageMetadata } from "@/lib/seo";
import { localeTag } from "@/i18n/routing";
import {
  parseStoryPage,
  storyListPath,
  storyPageCount,
  storyPageSlice,
} from "@/lib/story-page";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/types";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const { cat, page: pageParam } = await searchParams;
  const category =
    cat && (NEWS_CATEGORIES as readonly string[]).includes(cat)
      ? (cat as NewsCategory)
      : undefined;
  const page = parseStoryPage(pageParam);
  const seo = await getTranslations("seo");
  const article = await getTranslations("article");
  const categories = await getTranslations("categories");
  const path = storyListPath(category, page);
  const pageSuffix =
    page > 1
      ? ` — ${article("pageLabel", { page: new Intl.NumberFormat(localeTag(locale)).format(page) })}`
      : "";
  if (category) {
    const label = categories(category);
    return pageMetadata({
      locale,
      path,
      title: `${seo("categoryTitle", { category: label })}${pageSuffix}`,
      description: seo("categoryDescription", { category: label.toLowerCase() }),
    });
  }
  return pageMetadata({
    locale,
    path,
    title: `${seo("homeTitle")}${pageSuffix}`,
    description: seo("homeDescription"),
  });
}

function ensureStoryPage(page: number, total: number, category: string | undefined, locale: string) {
  const totalPages = storyPageCount(total);
  const max = total > 0 ? totalPages : 1;
  if (page > max) {
    redirect(localePath(locale, storyListPath(category, total > 0 ? max : 1)));
  }
  return total > 0 ? totalPages : 1;
}

async function HomeNews({ category, page }: { category?: NewsCategory; page: number }) {
  const locale = await getLocale();
  const articles = await getRecentArticles(category, locale);
  const meanwhile = category ? await getRecentArticles(undefined, locale) : [];
  const archived = category
    ? await getArchivedArticles(category, locale)
    : await getArchivedArticles(undefined, locale);
  const [featured, ...rest] = articles;
  const briefing = rest.slice(0, 5);
  const moreAll = rest.slice(5);
  const listTotal = category ? articles.length : moreAll.length;
  const totalPages = ensureStoryPage(page, listTotal, category, locale);
  const visibleCategory = storyPageSlice(articles, page);
  const more = storyPageSlice(moreAll, page);

  const t = await getTranslations("article");
  const filters = await getTranslations("filters");
  const categories = await getTranslations("categories");
  const currentLocale = await getLocale();

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-4 lg:px-10 lg:py-8">
      <div className="mb-5 lg:mb-7">
        <CategoryPills active={category} locale={currentLocale} />
      </div>

      {category ? (
        articles.length > 0 ? (
          <>
            <div className="mb-2 flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-navy">
                {categories(category)}
              </h1>
              <p className="text-sm text-mute">
                {filters("storiesThisWeek", { count: articles.length })}
              </p>
            </div>
            <section className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-11">
              {visibleCategory.map((article) => (
                <FilterRow key={article.id} article={article} />
              ))}
            </section>
            <StoryPager page={page} totalPages={totalPages} category={category} />
            {archived.length ? (
              <p className="mt-10">
                <Link
                  href={`/archive?cat=${category}`}
                  className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy"
                >
                  {t("olderStories")} →
                </Link>
              </p>
            ) : null}
          </>
        ) : (
          <EmptyFilter
            categoryLabel={categories(category)}
            meanwhile={meanwhile.slice(0, 3)}
            archiveHref={archived.length ? `/archive?cat=${category}` : undefined}
          />
        )
      ) : (
        <>
          {featured ? (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-9">
              <FeaturedStory article={featured} />
              {briefing.length > 0 ? (
                <aside aria-label={t("briefing")}>
                  <p className="mb-0 hidden border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase lg:block">
                    {t("briefing")}
                  </p>
                  <div className="flex flex-col">
                    {briefing.map((article) => (
                      <BriefingRow key={article.id} article={article} />
                    ))}
                  </div>
                </aside>
              ) : null}
            </div>
          ) : archived.length ? null : (
            <p className="text-ink">{t("empty")}</p>
          )}
          <Suspense fallback={<CambuurSkeleton />}>
            <CambuurBoard pageLink newsLimit={3} />
          </Suspense>
          <NewcomerGuides />
          {more.length > 0 ? (
            <section className="mt-10 lg:mt-14" aria-label={t("more")}>
              <p className="mb-1 border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase">
                {t("more")}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-11">
                {more.map((article) => (
                  <FilterRow key={article.id} article={article} />
                ))}
              </div>
              <StoryPager page={page} totalPages={totalPages} />
            </section>
          ) : null}
          {archived.length ? (
            <p className="mt-10">
              <Link href="/archive" className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy">
                {t("olderStories")} →
              </Link>
            </p>
          ) : null}
          <NewsletterBlock />
        </>
      )}
    </main>
  );
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const { cat, page: pageParam } = await searchParams;
  const category =
    cat && (NEWS_CATEGORIES as readonly string[]).includes(cat)
      ? (cat as NewsCategory)
      : undefined;
  const page = parseStoryPage(pageParam);
  const listed = await getRecentArticles(category, locale);
  const listTotal = category ? listed.length : Math.max(0, listed.length - 6);
  ensureStoryPage(page, listTotal, category, locale);

  return (
    <>
      {!category ? <JsonLd data={homeGraph()} /> : null}
      {!category ? (
        <Suspense fallback={<TodaySkeleton />}>
          <TodayStrip />
        </Suspense>
      ) : null}
      {!category ? (
        <Suspense fallback={<WeekendSlotSkeleton />}>
          <WeekendHeroSection />
        </Suspense>
      ) : null}
      <Suspense fallback={<NewsSkeleton filtered={Boolean(category)} />}>
        <HomeNews category={category} page={page} />
      </Suspense>
      <HomePromos />
    </>
  );
}
