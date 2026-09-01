import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Pompebled } from "@/components/Pompebled";
import { articleTitle, type Article } from "@/lib/types";

export async function EmptyWeekend() {
  const t = await getTranslations("events");
  const footer = await getTranslations("footer");

  return (
    <section className="flex flex-col items-center justify-center rounded-xl bg-brand px-6 py-16 text-center lg:px-10 lg:py-24">
      <Pompebled className="h-[52px] w-[52px] text-accent" vein={false} />
      <p className="mt-3.5 text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
        {t("stripShort")}
      </p>
      <h2 className="mt-2 max-w-[18ch] text-2xl font-extrabold leading-snug tracking-[-0.02em] text-paper">
        {t("emptyTitle")}
      </h2>
      <p className="mt-3.5 max-w-[36ch] text-sm leading-relaxed text-paper/70">
        {t("emptyBody")}
      </p>
      <a
        href={`mailto:${footer("email")}`}
        className="mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-5 text-[13px] font-extrabold text-brand"
      >
        {t("submit")}
      </a>
    </section>
  );
}

export async function EmptyFilter({
  categoryLabel,
  meanwhile,
}: {
  categoryLabel: string;
  meanwhile: Article[];
}) {
  const t = await getTranslations("article");
  const filters = await getTranslations("filters");
  const locale = await getLocale();
  const categories = await getTranslations("categories");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-[#CBD6E0] px-5 py-8 text-center lg:px-8 lg:py-10">
        <h2 className="max-w-[22ch] text-[19px] font-extrabold leading-snug text-navy">
          {t("emptyTitle", { category: categoryLabel.toLowerCase() })}
        </h2>
        <p className="max-w-[42ch] text-sm leading-relaxed text-muted">{t("empty")}</p>
        <Link
          href="/"
          className="mt-1 cursor-pointer text-[13px] font-bold text-primary hover:text-navy"
        >
          {filters("clear")}
        </Link>
      </div>
      {meanwhile.length > 0 ? (
        <section aria-label={t("meanwhile")}>
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-mute uppercase">
            {t("meanwhile")}
          </p>
          <div className="mt-2 flex flex-col">
            {meanwhile.map((article) => (
              <article
                key={article.id}
                className="flex flex-col gap-1.5 border-t border-line pt-3"
              >
                <span className="self-start rounded bg-ice px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-navy">
                  {categories(article.category).toUpperCase()}
                </span>
                <h3 className="pb-3 text-[15px] font-bold leading-snug text-navy">
                  <Link
                    href={`/article/${article.id}`}
                    className="cursor-pointer hover:underline"
                  >
                    {articleTitle(article, locale)}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
