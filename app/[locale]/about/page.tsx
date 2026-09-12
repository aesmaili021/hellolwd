import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { homeGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { SITE_VERSION } from "@/lib/version";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("about");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: seo("aboutDescription"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("about");

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-10 lg:py-16">
      <JsonLd data={homeGraph()} />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">
        HelloLWD · {t("version", { version: SITE_VERSION })}
      </p>
      <p className="mt-2 text-[13px] font-semibold text-mute">{t("place")}</p>
      <h1 className="mt-2 max-w-[18ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-[62ch] text-base leading-7 text-ink">{t("body")}</p>
      <p className="mt-4 max-w-[62ch] text-base leading-7 text-ink">{t("more")}</p>
      <Link
        href="/guide"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ice px-4 text-[13px] font-extrabold text-navy hover:bg-wash"
      >
        {t("guideCta")} →
      </Link>
    </main>
  );
}
