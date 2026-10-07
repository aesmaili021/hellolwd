import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeTag } from "@/i18n/routing";
import { getCambuur, type CambuurMatch } from "@/lib/cambuur";
import { getCambuurArticles } from "@/lib/data/articles";
import { articleTitle, type Article } from "@/lib/types";

function when(iso: string, locale: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(iso));
}

export function cambuurPlace(rank: number, locale: string) {
  const n = new Intl.NumberFormat(localeTag(locale)).format(rank);
  if (locale === "nl") return `${n}e`;
  if (locale === "es") return `${n}.º`;
  if (locale === "fa") return n;
  const mod100 = rank % 100;
  const mod10 = rank % 10;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : mod10 === 1
        ? "st"
        : mod10 === 2
          ? "nd"
          : mod10 === 3
            ? "rd"
            : "th";
  return `${n}${suffix}`;
}

function abbrev(name: string) {
  const letters = name.replace(/[^A-Za-z]/g, "");
  return (letters || name).slice(0, 3).toUpperCase();
}

/** Home-away score. Stored scores are Cambuur goals–opponent goals. */
export function cambuurBoardScore(match: CambuurMatch) {
  if (!match.score) return null;
  const [us, them] = match.score.split("–");
  if (!them) return match.score;
  return match.home ? `${us} – ${them}` : `${them} – ${us}`;
}

export function cambuurFixture(match: CambuurMatch) {
  return match.home ? `SC Cambuur – ${match.opponent}` : `${match.opponent} – SC Cambuur`;
}

function Crest({
  label,
  logo,
  ours,
}: {
  label: string;
  logo?: string | null;
  ours?: boolean;
}) {
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-black ${
        ours ? "bg-[#F6C400] text-brand" : "bg-white text-brand"
      }`}
      dir="ltr"
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- ESPN crest host is not in the image allowlist
        <img src={logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
      ) : (
        label
      )}
    </span>
  );
}

function MatchCard({
  kicker,
  match,
  logo,
  locale,
  foot,
  empty,
}: {
  kicker: string;
  match: CambuurMatch | null;
  logo: string | null;
  locale: string;
  foot?: string;
  empty?: string;
}) {
  const us = { label: "SCC", logo, ours: true, name: "SC Cambuur" };
  const them = match
    ? { label: abbrev(match.opponent), logo: null as string | null, ours: false, name: match.opponent }
    : null;
  const left = match && them ? (match.home ? us : them) : null;
  const right = match && them ? (match.home ? them : us) : null;
  const score = match ? cambuurBoardScore(match) : null;

  return (
    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-[11px] font-extrabold tracking-[0.1em] text-[#F6C400] uppercase">{kicker}</p>
      {match && left && right ? (
        <>
          <div className="mt-3 flex items-center justify-between gap-3" dir="ltr">
            <Crest label={left.label} logo={left.logo} ours={left.ours} />
            {score ? (
              <span className="text-[28px] leading-none font-black tabular-nums text-white">{score}</span>
            ) : (
              <span className="text-xs font-semibold text-white/60">vs</span>
            )}
            <Crest label={right.label} logo={right.logo} ours={right.ours} />
          </div>
          <p className="mt-3 text-[15px] font-extrabold text-white" dir="ltr">
            {left.name} – {right.name}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-white/75">
            <time dateTime={match.date} dir="ltr">
              {when(match.date, locale)}
            </time>
          </p>
          {foot ? <p className="mt-1 text-[13px] font-semibold text-white/75">{foot}</p> : null}
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 font-semibold text-white/75">{empty}</p>
      )}
    </div>
  );
}

export async function CambuurBoard({
  showNews = true,
  newsLimit = 3,
  pageLink = false,
}: {
  showNews?: boolean;
  newsLimit?: number;
  pageLink?: boolean;
}) {
  const locale = await getLocale();
  const [data, articles] = await Promise.all([
    getCambuur(),
    showNews ? getCambuurArticles(locale, newsLimit) : Promise.resolve([] as Article[]),
  ]);
  if (!data && articles.length === 0) return null;

  const t = await getTranslations("cambuur");
  const featured = data?.live ?? data?.next ?? null;
  const last = data?.recent[0] ?? null;
  const position =
    data && data.rank > 0
      ? `${t("position", { place: cambuurPlace(data.rank, locale) })} · ${t(`zone.${data.zone}`)}`
      : undefined;

  return (
    <section aria-label={t("label")} className="mt-10 lg:mt-14">
      <div className="rounded-[14px] bg-brand p-5 text-white lg:p-6">
        <div
          className={`grid grid-cols-1 gap-4 ${
            showNews ? "lg:grid-cols-[1fr_1fr_1.3fr] lg:gap-6" : "lg:grid-cols-2 lg:gap-6"
          }`}
        >
          <MatchCard
            kicker={data?.live ? `${t("live")} · ${t("league")}` : `${t("nextMatch")} · ${t("league")}`}
            match={featured}
            logo={data?.logo ?? null}
            locale={locale}
            empty={t("emptyNext")}
          />
          <MatchCard
            kicker={`${t("lastResult")} · ${t("league")}`}
            match={last}
            logo={data?.logo ?? null}
            locale={locale}
            foot={position}
            empty={data ? t("emptyLast") : t("scoresUnavailable")}
          />
          {showNews ? (
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.1em] text-[#F6C400] uppercase">
                {t("news")}
              </p>
              {articles.length ? (
                <ul>
                  {articles.map((article) => (
                    <li key={article.id} className="border-b border-white/15">
                      <Link
                        href={`/article/${article.id}`}
                        className="block cursor-pointer py-2.5 hover:underline"
                      >
                        <span className="block text-sm leading-snug font-semibold text-white">
                          {articleTitle(article, locale)}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-medium text-white/60">
                          {article.source_name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 font-semibold text-white/70">{t("emptyNews")}</p>
              )}
              {pageLink ? (
                <Link
                  href="/cambuur"
                  className="mt-3 inline-flex cursor-pointer text-[13px] font-bold text-[#F6C400] hover:underline"
                >
                  {t("pageLink")}{" "}
                  <span className="ms-1 inline-block rtl:rotate-180" aria-hidden>
                    →
                  </span>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
