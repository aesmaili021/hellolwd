import { getTranslations, setRequestLocale } from "next-intl/server";
import { FilterRow } from "@/components/ArticleCard";
import { CambuurBoard, cambuurBoardScore, cambuurFixture, cambuurPlace } from "@/components/CambuurBoard";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { getCambuur } from "@/lib/cambuur";
import { getCambuurArticles } from "@/lib/data/articles";
import { localeTag } from "@/i18n/routing";
import { localeUrl, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("cambuur");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/cambuur",
    title: t("pageTitle"),
    description: seo("cambuurDescription"),
  });
}

function formatNum(value: number, locale: string) {
  return new Intl.NumberFormat(localeTag(locale)).format(value);
}

export default async function CambuurPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("cambuur");
  const article = await getTranslations("article");
  const [data, articles] = await Promise.all([getCambuur(), getCambuurArticles(locale)]);

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-10 lg:py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("pageTitle"),
          description: t("pageIntro"),
          url: localeUrl(locale, "/cambuur"),
        }}
      />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">{t("kicker")}</p>
      <h1 className="mt-2 text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("pageTitle")}
      </h1>
      <p className="mt-3 max-w-[62ch] text-base leading-7 text-ink">{t("pageIntro")}</p>

      <CambuurBoard showNews={false} />

      {data && data.table.length ? (
        <section aria-label={t("table")} className="mt-10 max-w-[40rem]">
          <h2 className="border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase">
            {t("table")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-start text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase">
                  <th className="py-2 pe-3 text-start font-extrabold">{t("colRank")}</th>
                  <th className="py-2 pe-3 text-start font-extrabold">{t("club")}</th>
                  <th className="py-2 pe-3 text-end font-extrabold">{t("colPlayed")}</th>
                  <th className="py-2 pe-3 text-end font-extrabold">{t("colGd")}</th>
                  <th className="py-2 text-end font-extrabold">{t("colPoints")}</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row) => (
                  <tr
                    key={`${row.rank}-${row.name}`}
                    className={`border-b border-line ${row.cambuur ? "bg-ice font-extrabold text-navy" : "text-ink"}`}
                  >
                    <td className="py-2.5 pe-3 tabular-nums">{formatNum(row.rank, locale)}</td>
                    <td className="py-2.5 pe-3">{row.name}</td>
                    <td className="py-2.5 pe-3 text-end tabular-nums">{formatNum(row.played, locale)}</td>
                    <td className="py-2.5 pe-3 text-end tabular-nums" dir="ltr">
                      {formatNum(row.gd, locale)}
                    </td>
                    <td className="py-2.5 text-end tabular-nums">{formatNum(row.points, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.rank > 0 ? (
            <p className="mt-3 text-[13px] font-semibold text-mute">
              {t("position", { place: cambuurPlace(data.rank, locale) })}
              <span aria-hidden> · </span>
              {t(`zone.${data.zone}`)}
              <span aria-hidden> · </span>
              {t("record", {
                points: data.points,
                played: data.played,
                w: data.won,
                d: data.drawn,
                l: data.lost,
                gf: data.gf,
                ga: data.ga,
                gd: data.gd > 0 ? `+${data.gd}` : String(data.gd),
              })}
            </p>
          ) : null}
        </section>
      ) : null}

      {data && data.recent.length ? (
        <section aria-label={t("results")} className="mt-10 max-w-[40rem]">
          <h2 className="border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase">
            {t("results")}
          </h2>
          <ul>
            {data.recent.map((match) => (
              <li
                key={match.id}
                className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm"
              >
                <span className="min-w-0 font-bold text-navy" dir="ltr">
                  {cambuurFixture(match)}
                </span>
                <span className="shrink-0 font-extrabold text-ink tabular-nums" dir="ltr">
                  {cambuurBoardScore(match)}
                  {match.result ? (
                    <span className="ms-2 text-[11px] font-extrabold tracking-wide text-mute">
                      {t(`result.${match.result}`)}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label={t("news")} className="mt-10">
        <h2 className="border-b-2 border-brand pb-3 text-xs font-extrabold tracking-[0.12em] text-mute uppercase">
          {t("news")}
        </h2>
        {articles.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-11">
            {articles.map((item) => (
              <FilterRow key={item.id} article={item} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-ink">{t("emptyNews")}</p>
        )}
      </section>

      <p className="mt-8 max-w-[62ch] text-sm leading-6 text-mute">{t("credit")}</p>
      <Link href="/" className="mt-4 inline-flex cursor-pointer text-sm font-bold text-primary hover:text-navy">
        <span className="me-1 inline-block rtl:rotate-180" aria-hidden>
          ←
        </span>
        {article("back")}
      </Link>
    </main>
  );
}
