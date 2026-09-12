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
  const t = await getTranslations("cookies");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/cookies",
    title: t("title"),
    description: seo("cookiesDescription"),
  });
}

const SECTIONS = ["needed", "list", "notused", "choice"] as const;

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("cookies");

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
