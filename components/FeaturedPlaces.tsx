import { getLocale, getTranslations } from "next-intl/server";
import { FeaturedBadge } from "@/components/FeaturedBadge";
import { Link } from "@/i18n/navigation";
import { placeDescription, spotlightPlaces } from "@/lib/places";

export async function FeaturedPlaces() {
  const t = await getTranslations("places");
  const locale = await getLocale();
  const rows = spotlightPlaces(3);
  if (!rows.length) return null;

  return (
    <div className="flex h-full flex-col rounded-[14px] border border-line bg-paper p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-extrabold text-navy">
          <Link href="/places" className="cursor-pointer hover:text-primary">
            {t("title")}
          </Link>
        </h2>
        <Link href="/places" className="cursor-pointer text-[13px] font-extrabold text-primary hover:text-navy">
          {t("homeAll")}
        </Link>
      </div>
      <div className="mt-3 grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {rows.map((place) => (
          <Link
            key={place.slug}
            href={`/places#${place.slug}`}
            className="block cursor-pointer rounded-[10px] border border-line bg-ice p-3 hover:border-primary"
          >
            {place.featured ? <FeaturedBadge>{t("featured")}</FeaturedBadge> : null}
            <span className="mt-1 block text-sm font-extrabold text-navy">{place.name}</span>
            <span className="mt-0.5 block text-xs leading-snug text-muted">{placeDescription(place, locale)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
