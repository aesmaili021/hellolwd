import { getTranslations } from "next-intl/server";
import { BusinessCta } from "@/components/BusinessCta";
import { FeaturedPlaces } from "@/components/FeaturedPlaces";
import { features } from "@/lib/features";

export async function HomePromos() {
  if (!features.featuredPlaces) return <BusinessCta />;

  const t = await getTranslations("business");

  return (
    <section aria-label={t("kicker")} className="border-b border-line px-4 py-7 lg:px-10 lg:py-11">
      <div className="mx-auto grid max-w-[1440px] items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <BusinessCta variant="card" />
        <FeaturedPlaces />
      </div>
    </section>
  );
}
