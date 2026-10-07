import { getLocale, getTranslations } from "next-intl/server";
import { localeTag } from "@/i18n/routing";
import { localePath } from "@/lib/seo";
import { storyListPath, storyPageWindow } from "@/lib/story-page";

const control =
  "inline-flex min-h-11 items-center justify-center rounded-full px-3 text-[13px] font-bold";

export async function StoryPager({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category?: string;
}) {
  if (totalPages <= 1) return null;

  const t = await getTranslations("article");
  const locale = await getLocale();
  const format = new Intl.NumberFormat(localeTag(locale));
  const pages = storyPageWindow(page, totalPages);
  const hrefFor = (target: number) => localePath(locale, storyListPath(category, target));

  return (
    <nav aria-label={t("pagination")} className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <a href={hrefFor(page - 1)} rel="prev" className={`${control} cursor-pointer text-primary hover:text-navy`}>
          <span className="me-1 inline-block rtl:rotate-180" aria-hidden>
            ←
          </span>
          {t("prev")}
        </a>
      ) : (
        <span aria-disabled="true" className={`${control} text-mute`}>
          <span className="me-1 inline-block rtl:rotate-180" aria-hidden>
            ←
          </span>
          {t("prev")}
        </span>
      )}

      {pages.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-sm font-bold text-mute" aria-hidden>
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            aria-label={t("pageLabel", { page: format.format(item) })}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-brand px-2 text-[13px] font-extrabold text-paper"
          >
            {format.format(item)}
          </span>
        ) : (
          <a
            key={item}
            href={hrefFor(item)}
            aria-label={t("pageLabel", { page: format.format(item) })}
            className={`${control} min-w-11 cursor-pointer bg-wash px-2 text-ink hover:text-navy`}
          >
            {format.format(item)}
          </a>
        ),
      )}

      {page < totalPages ? (
        <a href={hrefFor(page + 1)} rel="next" className={`${control} cursor-pointer text-primary hover:text-navy`}>
          {t("next")}
          <span className="ms-1 inline-block rtl:rotate-180" aria-hidden>
            →
          </span>
        </a>
      ) : (
        <span aria-disabled="true" className={`${control} text-mute`}>
          {t("next")}
          <span className="ms-1 inline-block rtl:rotate-180" aria-hidden>
            →
          </span>
        </span>
      )}
    </nav>
  );
}
