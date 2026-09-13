import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEvents } from "@/lib/data/events";

export async function WeekendHeroSection() {
  const events = await getEvents();
  const t = await getTranslations("events");

  return (
    <nav className="border-b border-line bg-paper" aria-label={t("stripShort")}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2.5 lg:px-10">
        <p className="min-w-0 truncate text-[13px] font-semibold text-ink">
          <span className="font-extrabold tracking-[0.08em] text-mute uppercase">
            {t("stripShort")}
          </span>
          <span className="text-mute" aria-hidden>
            {" · "}
          </span>
          {events.length > 0 ? t("homeNights", { count: events.length }) : t("emptyTitle")}
        </p>
        <Link
          href="/events"
          className="shrink-0 text-[13px] font-bold text-primary hover:text-navy"
        >
          {events.length > 0 ? t("homeNightsCta") : t("emptyHomeCta")}
        </Link>
      </div>
    </nav>
  );
}
