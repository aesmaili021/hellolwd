import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDoc } from "@/components/LegalDoc";
import { pageMetadata } from "@/lib/seo";
import { SITE_VERSION } from "@/lib/version";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("privacy");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/privacy",
    title: t("title"),
    description: seo("privacyDescription"),
  });
}

const SECTIONS = ["who", "data", "cookies", "third", "rights"] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("privacy");

  return (
    <LegalDoc
      title={t("title")}
      updated={t("updated", { version: SITE_VERSION })}
      sections={SECTIONS.map((key) => ({
        heading: t(`${key}Title`),
        body: t(key),
      }))}
    />
  );
}
