import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const TILES = [
  { id: "nightlife", emoji: "🍻", title: "nightlifeTitle", blurb: "nightlifeBlurb" },
  { id: "room", emoji: "🏠", title: "roomTitle", blurb: "roomBlurb" },
  { id: "first-month", emoji: "📋", title: "firstMonthTitle", blurb: "firstMonthBlurb" },
  { id: "eats", emoji: "🍜", title: "eatsTitle", blurb: "eatsBlurb" },
] as const;

export async function NewcomerGuides() {
  const t = await getTranslations("guides");

  return (
    <section aria-label={t("title")} className="mt-10 lg:mt-14">
      <h2 className="mb-3 text-xl font-extrabold tracking-[-0.02em] text-navy">{t("title")}</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3.5">
        {TILES.map((tile) => (
          <Link
            key={tile.id}
            href={`/guide#${tile.id}`}
            className="min-w-0 cursor-pointer rounded-xl border border-line bg-mist p-4 hover:border-primary lg:p-[18px]"
          >
            <span className="emoji text-2xl leading-none" aria-hidden>
              {tile.emoji}
            </span>
            <span className="mt-2 block text-[15px] font-extrabold text-navy">{t(tile.title)}</span>
            <span className="mt-0.5 block text-xs leading-snug text-muted">{t(tile.blurb)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
