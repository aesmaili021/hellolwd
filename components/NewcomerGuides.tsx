import { getTranslations } from "next-intl/server";
import { LineIcon, type LineIconName } from "@/components/LineIcon";
import { Link } from "@/i18n/navigation";

const TILES: { id: string; icon: LineIconName; title: "nightlifeTitle" | "roomTitle" | "firstMonthTitle" | "eatsTitle"; blurb: "nightlifeBlurb" | "roomBlurb" | "firstMonthBlurb" | "eatsBlurb" }[] = [
  { id: "nightlife", icon: "beer", title: "nightlifeTitle", blurb: "nightlifeBlurb" },
  { id: "room", icon: "house", title: "roomTitle", blurb: "roomBlurb" },
  { id: "first-month", icon: "clipboard", title: "firstMonthTitle", blurb: "firstMonthBlurb" },
  { id: "eats", icon: "utensils", title: "eatsTitle", blurb: "eatsBlurb" },
];

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
            <LineIcon name={tile.icon} className="h-6 w-6 text-navy" />
            <span className="mt-2 block text-[15px] font-extrabold text-navy">{t(tile.title)}</span>
            <span className="mt-0.5 block text-xs leading-snug text-muted">{t(tile.blurb)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
