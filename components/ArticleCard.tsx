import { getLocale, getTranslations } from "next-intl/server";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { articleImage } from "@/lib/data/placeholders";
import { formatRelative } from "@/lib/format";
import { articleHasTranslation, articleSummary, articleTitle, type Article } from "@/lib/types";

export async function FeaturedStory({ article }: { article: Article }) {
  const locale = await getLocale();
  const t = await getTranslations("article");
  const categories = await getTranslations("categories");

  return (
    <article className="flex flex-col gap-3.5">
      <CoverImage
        src={articleImage(article.image_url, article.category)}
        alt=""
        className="h-[190px] w-full rounded-[10px] lg:h-[300px] lg:rounded-xl"
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded bg-accent px-2 py-1 text-[10px] font-extrabold tracking-wide text-paper lg:text-[11px]">
          {categories(article.category).toUpperCase()}
        </span>
        <span className="text-[11px] font-semibold text-mute lg:text-xs">
          {article.source_name} · {formatRelative(article.published_at, locale)}
        </span>
        {locale !== "nl" && articleHasTranslation(article, locale) ? (
          <span className="rounded bg-ice px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-navy">
            {t("translatedBadge")}
          </span>
        ) : null}
      </div>
      <h2 className="max-w-[22ch] text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy text-pretty lg:text-[34px] lg:leading-[1.15]">
        <Link href={`/article/${article.id}`} className="cursor-pointer hover:underline">
          {articleTitle(article, locale)}
        </Link>
      </h2>
      <p className="max-w-[60ch] text-[15px] leading-[1.55] text-ink lg:text-base lg:leading-[1.6]">
        {articleSummary(article, locale)}
      </p>
      <a
        href={article.source_url}
        className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy lg:text-sm"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="lg:hidden">{t("readSource")} ↗</span>
        <span className="hidden lg:inline">
          {t("readAt", { source: article.source_name })} ↗
        </span>
      </a>
    </article>
  );
}

export async function BriefingRow({ article }: { article: Article }) {
  const locale = await getLocale();
  const t = await getTranslations("article");
  const categories = await getTranslations("categories");

  return (
    <article className="flex flex-col gap-1.5 border-t border-line py-4 lg:gap-[7px] lg:border-t-0 lg:border-b lg:py-[18px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-ice px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-navy">
          {categories(article.category).toUpperCase()}
        </span>
        <span className="text-[11px] font-semibold text-mute">
          {article.source_name} · {formatRelative(article.published_at, locale)}
        </span>
        {locale !== "nl" && articleHasTranslation(article, locale) ? (
          <span className="rounded bg-ice px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-navy">
            {t("translatedBadge")}
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-bold leading-snug tracking-[-0.01em] text-navy lg:text-[17px] lg:leading-[1.3]">
        <Link href={`/article/${article.id}`} className="cursor-pointer hover:underline">
          {articleTitle(article, locale)}
        </Link>
      </h3>
      <p className="hidden text-sm leading-[1.5] text-ink lg:line-clamp-2 lg:block">
        {articleSummary(article, locale)}
      </p>
    </article>
  );
}

export async function FilterRow({ article }: { article: Article }) {
  const locale = await getLocale();
  const t = await getTranslations("article");

  return (
    <article className="flex gap-4 border-b border-line py-5">
      <CoverImage
        src={articleImage(article.image_url, article.category)}
        alt=""
        className="h-[78px] w-[104px] shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[11px] font-bold text-mute">
          {article.source_name} · {formatRelative(article.published_at, locale)}
        </span>
        {locale !== "nl" && articleHasTranslation(article, locale) ? (
          <span className="ms-2 rounded bg-ice px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-navy">
            {t("translatedBadge")}
          </span>
        ) : null}
        <h3 className="text-[17px] font-bold leading-snug tracking-[-0.01em] text-navy">
          <Link href={`/article/${article.id}`} className="cursor-pointer hover:underline">
            {articleTitle(article, locale)}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-[1.5] text-ink">
          {articleSummary(article, locale)}
        </p>
      </div>
    </article>
  );
}
