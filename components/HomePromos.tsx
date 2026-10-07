import { FeaturedPlaces } from "@/components/FeaturedPlaces";
import { features } from "@/lib/features";

/** Homepage places slot. On unless FEATURE_PLACES is explicitly off. The advertise banner does not use this flag. */
export async function HomePromos() {
  if (!features.featuredPlaces) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
      <FeaturedPlaces />
    </div>
  );
}
