import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { BriefingRow, FeaturedStory, FilterRow } from "@/components/ArticleCard";
import { CategoryPills } from "@/components/CategoryPills";
import { EmptyFilter } from "@/components/EmptyStates";
import { CambuurStrip } from "@/components/CambuurStrip";
import { WeatherStrip } from "@/components/WeatherStrip";
import { WeekendHero } from "@/components/WeekendHero";
import { getArticles } from "@/lib/data/articles";
import { getEvents } from "@/lib/data/events";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/types";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const { cat } = await searchParams;
  const category =
    cat && (NEWS_CATEGORIES as readonly string[]).includes(cat)
      ? (cat as NewsCategory)
      : undefined;

  const articles = await getArticles(category, locale);
  const meanwhile = category ? await getArticles(undefined, locale) : [];
  const events = category ? [] : await getEvents();
  const [featured, ...rest] = articles;
  const briefing = rest.slice(0, 5);
  const more = rest.slice(5);

  const t = await getTranslations("article");
  const filters = await getTranslations("filters");
  const categories = await getTranslations("categories");
  const currentLocale = await getLocale();

  return (
    <>
      {!category && events.length > 0 ? <WeekendHero events={events} /> : null}
      <WeatherStrip />
      <CambuurStrip />

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
                {articles.map((article) => (
                  <FilterRow key={article.id} article={article} />
                ))}
              </section>
            </>
          ) : (
            <EmptyFilter
              categoryLabel={categories(category)}
              meanwhile={meanwhile.slice(0, 3)}
            />
          )
        ) : featured ? (
          <>
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
              </section>
            ) : null}
          </>
        ) : (
          <p className="mt-10 text-ink">{t("empty")}</p>
        )}
      </main>
    </>
  );
}
