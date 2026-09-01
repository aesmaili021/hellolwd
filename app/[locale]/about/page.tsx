import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_VERSION } from "@/lib/version";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return { title: t("title") };
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
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">
        HelloLWD · {t("version", { version: SITE_VERSION })}
      </p>
      <h1 className="mt-2 max-w-[18ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-[62ch] text-base leading-7 text-ink">{t("body")}</p>
      <p className="mt-4 max-w-[62ch] text-base leading-7 text-ink">{t("more")}</p>
    </main>
  );
}
