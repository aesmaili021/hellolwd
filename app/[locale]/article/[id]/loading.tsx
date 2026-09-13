import { getTranslations } from "next-intl/server";
import { ArticleSkeleton } from "@/components/Skeletons";

export default async function Loading() {
  const t = await getTranslations("nav");
  return (
    <>
      <p className="sr-only">{t("loading")}</p>
      <ArticleSkeleton />
    </>
  );
}
