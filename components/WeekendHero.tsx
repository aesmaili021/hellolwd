import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatEventChip } from "@/lib/format";
import type { EventRow } from "@/lib/types";

export async function WeekendHero({ events }: { events: EventRow[] }) {
  const locale = await getLocale();
  const t = await getTranslations("events");
  const genres = await getTranslations("genres");
  const preview = events.slice(0, 3);

  return (
    <section className="bg-brand px-4 py-[18px] lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-3 flex items-end justify-between gap-4 lg:mb-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase lg:text-xs lg:tracking-[0.14em]">
              <span className="lg:hidden">{t("stripShort")}</span>
              <span className="hidden lg:inline">{t("strip")}</span>
            </p>
            <p className="hidden text-[30px] font-extrabold tracking-[-0.02em] text-paper lg:block">
              {t("kicker")}
            </p>
          </div>
          <Link
            href="/events"
            className="cursor-pointer text-xs font-bold text-paper/70 lg:rounded-full lg:border lg:border-paper/35 lg:px-4 lg:py-2 lg:text-sm lg:font-bold lg:text-paper"
          >
            <span className="lg:hidden">{t("allShort", { count: events.length })} →</span>
            <span className="hidden lg:inline">{t("all", { count: events.length })} →</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3 lg:gap-4">
          {preview.map((ev, index) => (
            <Link
              key={ev.id}
              href="/events"
              className={`flex flex-col gap-2 rounded-[10px] border border-paper/14 bg-paper/[0.07] p-3.5 lg:gap-2.5 lg:rounded-[12px] lg:p-[18px] ${
                index === 2 ? "hidden lg:flex" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary px-2 py-1 text-[10px] font-extrabold tracking-wide text-brand lg:text-[11px]">
                  {genres(ev.genre).toUpperCase()}
                </span>
                <span className="text-[11px] font-semibold text-paper/60 lg:text-xs">
                  {formatEventChip(ev.event_datetime, locale)}
                </span>
              </div>
              <span className="text-base font-bold leading-snug text-paper lg:text-lg">
                {ev.name}
              </span>
              <span className="text-xs text-paper/60 lg:text-[13px]">{ev.venue}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
