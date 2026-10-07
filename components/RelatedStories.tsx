import { getLocale, getTranslations } from "next-intl/server";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { getRelatedArticles } from "@/lib/data/articles";
import { articleImage } from "@/lib/data/placeholders";
import { formatRelative } from "@/lib/format";
import { articleTitle, type Article } from "@/lib/types";

export async function RelatedStories({ article }: { article: Article }) {
  const locale = await getLocale();
  const related = await getRelatedArticles(article, locale, 4);
  if (!related.length) return null;

  const t = await getTranslations("article");

  return (
    <section aria-label={t("related")} className="mt-10 border-t border-line pt-8">
      <h2 className="border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase">
        {t("related")}
      </h2>
      <div className="flex flex-col">
        {related.map((item) => (
          <article key={item.id} className="flex gap-3 border-b border-line py-4">
            <CoverImage
              src={articleImage(item.image_url, item.category)}
              alt=""
              className="h-16 w-[84px] shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-mute">
                {item.source_name}
                <span aria-hidden> · </span>
                <time dateTime={item.published_at}>{formatRelative(item.published_at, locale)}</time>
              </p>
              <h3 className="mt-1 text-[15px] leading-snug font-bold tracking-[-0.01em] text-navy">
                <Link href={`/article/${item.id}`} className="cursor-pointer hover:underline">
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
