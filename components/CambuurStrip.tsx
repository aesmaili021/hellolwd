import { getLocale, getTranslations } from "next-intl/server";
import { localeTag } from "@/i18n/routing";
import { getCambuur } from "@/lib/cambuur";

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

export async function CambuurStrip() {
  const data = await getCambuur();
  if (!data) return null;

  const locale = await getLocale();
  const t = await getTranslations("cambuur");
  const last = data.recent[0] ?? null;
  const highlight = data.live ?? last;

  return (
    <section className="border-b border-line bg-brand" aria-label={t("label")}>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 lg:px-10">
        <div className="flex min-w-0 items-center gap-2.5">
          {data.logo ? (
            <img
              src={data.logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg bg-paper/10 object-contain p-0.5"
            />
          ) : null}
          <p className="min-w-0 text-paper">
            <span className="block text-[10px] font-extrabold tracking-[0.1em] text-[#F6C400] uppercase">
              {t("kicker")}
            </span>
            <span className="block text-[15px] font-extrabold tracking-[-0.02em]">
              {t("rank", { rank: data.rank })}{" "}
              <span className="text-[13px] font-bold text-paper/70">{t("of")}</span>
            </span>
          </p>
        </div>

        {data.live ? (
          <p className="rounded-md bg-[#F6C400] px-2.5 py-1 text-[12px] font-extrabold text-brand">
            {t("live")}{" "}
            {data.live.home
              ? t("vs", { team: data.live.opponent })
              : t("at", { team: data.live.opponent })}{" "}
            <span className="tabular-nums">{data.live.score ?? "–"}</span>
          </p>
        ) : highlight ? (
          <p className="min-w-0 truncate text-[13px] font-semibold text-paper">
            <span className="me-1.5 font-extrabold text-[#F6C400]">{highlight.result}</span>
            {highlight.home
              ? t("vs", { team: highlight.opponent })
              : t("at", { team: highlight.opponent })}
            <span className="ms-1.5 tabular-nums text-paper/80">{highlight.score}</span>
          </p>
        ) : null}

        {data.next ? (
          <p className="ms-auto min-w-0 truncate text-[13px] font-semibold text-paper/85">
            <span className="me-1.5 text-[10px] font-extrabold tracking-[0.08em] text-[#F6C400] uppercase">
              {t("next")}
            </span>
            {data.next.home
              ? t("vs", { team: data.next.opponent })
              : t("at", { team: data.next.opponent })}
            <span className="ms-1.5 text-[12px] text-[#F6C400]">{when(data.next.date, locale)}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
