import { getTranslations } from "next-intl/server";
import { EventsSkeleton } from "@/components/Skeletons";

export default async function Loading() {
  const t = await getTranslations("nav");
  return (
    <>
      <p className="sr-only">{t("loading")}</p>
      <EventsSkeleton />
    </>
  );
}
