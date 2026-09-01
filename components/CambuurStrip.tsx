import { getLocale, getTranslations } from "next-intl/server";
import { localeTag } from "@/i18n/routing";
import { getCambuur, type CambuurMatch } from "@/lib/cambuur";

function when(iso: string, locale: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function ResultMark({ match }: { match: CambuurMatch }) {
  const tone =
    match.result === "W"
      ? "bg-emerald-700 text-paper"
      : match.result === "D"
        ? "bg-slate text-navy"
        : "bg-accent text-paper";
  return (
    <span
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[11px] font-extrabold ${tone}`}
    >
      {match.result}
    </span>
  );
}

export async function CambuurStrip() {
  const data = await getCambuur();
  if (!data) return null;

  const locale = await getLocale();
  const t = await getTranslations("cambuur");
  const gd = data.gd > 0 ? `+${data.gd}` : `${data.gd}`;

  return (
    <section className="border-b border-line bg-brand" aria-label={t("label")}>
      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(16rem,0.9fr)] lg:items-start lg:gap-8 lg:px-10 lg:py-5">
        <div className="flex items-center gap-3.5">
          {data.logo ? (
            <img
              src={data.logo}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl bg-paper/10 object-contain p-1"
            />
          ) : null}
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#F6C400] uppercase">
              {t("kicker")}
            </p>
            <p className="flex flex-wrap items-baseline gap-x-2 text-paper">
              <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">
                {t("rank", { rank: data.rank })}
              </span>
              <span className="text-sm font-bold text-paper/75">{t("of")}</span>
            </p>
            <p className="mt-1 text-[12px] text-paper/70">
              {t("record", {
                points: data.points,
                played: data.played,
                w: data.won,
                d: data.drawn,
                l: data.lost,
                gf: data.gf,
                ga: data.ga,
                gd,
              })}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-[#F6C400]/90">{t(`zone.${data.zone}`)}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.1em] text-paper/55 uppercase">
            {t("results")}
          </p>
          <ol className="flex flex-col gap-1.5">
            {data.live ? (
              <li className="flex items-center justify-between gap-3 rounded-lg bg-[#F6C400] px-2.5 py-1.5 text-brand">
                <span className="text-[11px] font-extrabold tracking-wide uppercase">{t("live")}</span>
                <span className="text-[13px] font-bold">
                  {data.live.home ? t("vs", { team: data.live.opponent }) : t("at", { team: data.live.opponent })}
                </span>
                <span className="text-[15px] font-extrabold">{data.live.score ?? "–"}</span>
              </li>
            ) : null}
            {data.recent.map((match) => (
              <li key={match.id} className="flex items-center gap-2.5 text-paper">
                <ResultMark match={match} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                  {match.home ? t("vs", { team: match.opponent }) : t("at", { team: match.opponent })}
                </span>
                <span className="text-[13px] font-extrabold tabular-nums">{match.score}</span>
                <span className="hidden text-[11px] text-paper/50 sm:inline">{when(match.date, locale)}</span>
              </li>
            ))}
            {data.next ? (
              <li className="flex items-center gap-2.5 border-t border-paper/15 pt-2 text-paper/85">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-paper/12 px-1 text-[10px] font-extrabold tracking-wide">
                  {t("next")}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                  {data.next.home ? t("vs", { team: data.next.opponent }) : t("at", { team: data.next.opponent })}
                </span>
                <span className="text-[11px] font-semibold text-[#F6C400]">{when(data.next.date, locale)}</span>
              </li>
            ) : null}
          </ol>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.1em] text-paper/55 uppercase">
            {t("table")}
          </p>
          <table className="w-full text-[13px] text-paper">
            <thead>
              <tr className="text-[10px] tracking-wide text-paper/45 uppercase">
                <th className="pb-1 text-start font-bold">#</th>
                <th className="pb-1 text-start font-bold">{t("club")}</th>
                <th className="pb-1 text-end font-bold">P</th>
                <th className="pb-1 text-end font-bold">GD</th>
                <th className="pb-1 text-end font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {data.table.map((row) => (
                <tr
                  key={row.rank}
                  className={row.cambuur ? "font-extrabold text-[#F6C400]" : "font-semibold text-paper/85"}
                >
                  <td className="py-0.5 tabular-nums">{row.rank}</td>
                  <td className="py-0.5 pe-2">{row.name}</td>
                  <td className="py-0.5 text-end tabular-nums">{row.played}</td>
                  <td className="py-0.5 text-end tabular-nums">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="py-0.5 text-end tabular-nums">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mx-auto max-w-[1440px] px-4 pb-2.5 text-[11px] text-paper/40 lg:px-10">{t("credit")}</p>
    </section>
  );
}
