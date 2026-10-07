import { FeaturedPlaces } from "@/components/FeaturedPlaces";
import { features } from "@/lib/features";

/** Featured-places samples stay behind the server flag. The advertise banner does not. */
export async function HomePromos() {
  if (!features.featuredPlaces) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
      <FeaturedPlaces />
    </div>
  );
}
