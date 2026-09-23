import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { FilterRow } from "@/components/ArticleCard";
import { CategoryPills } from "@/components/CategoryPills";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { getArchivedArticles } from "@/lib/data/articles";
import { formatArchiveMonth } from "@/lib/format";
import { localeUrl, pageMetadata } from "@/lib/seo";
import { NEWS_CATEGORIES, type Article, type NewsCategory } from "@/lib/types";

function monthKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(iso));
}

function groupByMonth(articles: Article[], locale: string) {
  const groups: { key: string; label: string; items: Article[] }[] = [];
  for (const article of articles) {
    const key = monthKey(article.published_at);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(article);
    else groups.push({ key, label: formatArchiveMonth(article.published_at, locale), items: [article] });
  }
  return groups;
}

export async function generateMetadata({
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
  const t = await getTranslations("archive");
  const seo = await getTranslations("seo");
  const categories = await getTranslations("categories");
  if (category) {
    const label = categories(category);
    return pageMetadata({
      locale,
      path: `/archive?cat=${category}`,
      title: t("categoryTitle", { category: label }),
      description: seo("archiveDescription"),
    });
  }
  return pageMetadata({
    locale,
    path: "/archive",
    title: t("title"),
    description: seo("archiveDescription"),
  });
}

export default async function ArchivePage({
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
  const currentLocale = await getLocale();
  const articles = await getArchivedArticles(category, currentLocale);
  const groups = groupByMonth(articles, currentLocale);
  const t = await getTranslations("archive");
  const categories = await getTranslations("categories");

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-10 lg:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("title"),
          description: t("intro"),
          url: localeUrl(locale, "/archive"),
        }}
      />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">{t("kicker")}</p>
      <h1 className="mt-2 max-w-[16ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-[62ch] text-base leading-7 text-ink">{t("intro")}</p>

      <div className="mt-8 mb-5 lg:mb-7">
        <CategoryPills active={category} locale={currentLocale} basePath="/archive" />
      </div>

      {category ? (
        <div className="mb-2 flex flex-wrap items-baseline gap-2.5">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-navy">
            {categories(category)}
          </h2>
          <p className="text-sm text-mute">{t("count", { count: articles.length })}</p>
        </div>
      ) : articles.length ? (
        <p className="mb-2 text-sm text-mute">{t("count", { count: articles.length })}</p>
      ) : null}

      {articles.length ? (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.key} aria-labelledby={`archive-${group.key}`}>
              <h2
                id={`archive-${group.key}`}
                className="mb-1 border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase"
              >
                {group.label}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-11">
                {group.items.map((article) => (
                  <FilterRow key={article.id} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-6 max-w-[52ch]">
          <p className="text-ink">{t("empty")}</p>
          {category ? (
            <Link href="/archive" className="mt-4 inline-flex cursor-pointer text-sm font-bold text-primary hover:text-navy">
              {t("all")}
            </Link>
          ) : (
            <Link href="/" className="mt-4 inline-flex cursor-pointer text-sm font-bold text-primary hover:text-navy">
              {t("back")}
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
