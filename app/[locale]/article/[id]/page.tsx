import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { getArticle, getArticles } from "@/lib/data/articles";
import { articleImage } from "@/lib/data/placeholders";
import { formatPublished } from "@/lib/format";
import { ArticleTranslation } from "@/components/ArticleTranslation";
import { articleBody, articleSummary, articleTitle } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const article = await getArticle(id, locale);
  if (!article) return {};
  return {
    title: articleTitle(article, locale),
    description: articleSummary(article, locale),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const article = await getArticle(id, locale);
  if (!article) notFound();

  const t = await getTranslations("article");
  const categories = await getTranslations("categories");
  const currentLocale = await getLocale();
  const languageLabel = t(
    currentLocale === "nl"
      ? "langNl"
      : currentLocale === "es"
        ? "langEs"
        : currentLocale === "fa"
          ? "langFa"
          : "langEn",
  );
  const fullBody = articleBody(article, currentLocale);

  return (
    <main id="content" className="mx-auto w-full max-w-[720px] flex-1 px-4 py-8 lg:px-10 lg:py-12">
      <Link
        href="/"
        className="inline-flex min-h-11 cursor-pointer items-center text-sm font-bold text-primary hover:text-navy"
      >
        <span className="me-1 inline-block rtl:rotate-180" aria-hidden>
          ←
        </span>
        {t("back")}
      </Link>
      <CoverImage
        src={articleImage(article.image_url, article.category)}
        alt=""
        className="mt-6 h-[190px] w-full rounded-[10px] lg:h-[300px] lg:rounded-xl"
      />
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <span className="rounded bg-accent px-2 py-1 text-[10px] font-extrabold tracking-wide text-paper lg:text-[11px]">
          {categories(article.category).toUpperCase()}
        </span>
        <p className="text-[11px] font-semibold text-mute lg:text-xs">
          {article.source_name}
          <span aria-hidden="true"> · </span>
          <time dateTime={article.published_at}>
            {formatPublished(article.published_at, currentLocale)}
          </time>
        </p>
      </div>
      <h1 className="mt-3.5 max-w-[22ch] text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy text-pretty lg:text-[34px] lg:leading-[1.15]">
        {articleTitle(article, currentLocale)}
      </h1>
      <p className="mt-4 max-w-[65ch] text-[15px] leading-[1.55] text-ink lg:text-base lg:leading-7">
        {articleSummary(article, currentLocale)}
      </p>
      <ArticleTranslation
        articleId={article.id}
        locale={currentLocale}
        languageLabel={languageLabel}
        fullBody={fullBody}
      />
      <a
        href={article.source_url}
        className="mt-7 inline-flex cursor-pointer text-[13px] font-bold text-primary hover:text-navy lg:text-sm"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t("readAt", { source: article.source_name })} ↗
      </a>
    </main>
  );
}
