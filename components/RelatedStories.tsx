import { getLocale, getTranslations } from "next-intl/server";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { articlePath } from "@/lib/article-path";
import { getRelatedArticles } from "@/lib/data/articles";
import { articleImage } from "@/lib/data/placeholders";
import { formatRelative } from "@/lib/format";
import { articleTitle, type Article } from "@/lib/types";

export async function RelatedStories({ article }: { article: Article }) {
  const locale = await getLocale();
  const related = await getRelatedArticles(article, locale, 4);
  if (!related.length) return null;

  const t = await getTranslations("article");
  const categories = await getTranslations("categories");

  return (
    <section aria-label={t("related")} className="mt-12 border-t-2 border-brand pt-8">
      <h2 className="text-xs font-extrabold tracking-[0.12em] text-mute uppercase">
        {t("related")}
      </h2>
      <div className="mt-4 flex flex-col">
        {related.map((item) => (
          <article key={item.id} className="flex gap-3 border-b border-line py-4">
            <CoverImage
              src={articleImage(item.image_url, item.category)}
              alt={articleTitle(item, locale)}
              className="h-16 w-[84px] shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-mute">
                <span className="rounded bg-ice px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-navy">
                  {categories(item.category).toUpperCase()}
                </span>
                <time dateTime={item.published_at}>{formatRelative(item.published_at, locale)}</time>
              </p>
              <h3 className="mt-1 text-[15px] leading-snug font-bold tracking-[-0.01em] text-navy">
                <Link href={articlePath(item)} className="cursor-pointer hover:underline">
                  {articleTitle(item, locale)}
                </Link>
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
