import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { localeUrl, pageMetadata } from "@/lib/seo";

const LINKS = {
  bsn: "https://www.leeuwarden.nl/verhuizen-of-inschrijven/inschrijven-in-nederland-vanuit-het-buitenland/",
  appointment: "https://leeuwarden.mijnafspraakmaken.nl/Client",
  digid: "https://www.digid.nl/",
  waste: "https://www.omrin.nl/zelf-regelen/afvalkalender",
  wasteGemeente: "https://www.leeuwarden.nl/afval-en-recycling/inzamelen-van-afval/",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("guide");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/guide",
    title: t("title"),
    description: seo("guideDescription"),
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("guide");

  const sections = [
    {
      key: "bsn",
      title: t("bsnTitle"),
      body: t("bsn"),
      links: [
        { href: LINKS.bsn, label: t("bsnLink") },
        { href: LINKS.appointment, label: t("bsnBook") },
      ],
    },
    {
      key: "digid",
      title: t("digidTitle"),
      body: t("digid"),
      links: [{ href: LINKS.digid, label: t("digidLink") }],
    },
    {
      key: "waste",
      title: t("wasteTitle"),
      body: t("waste"),
      links: [
        { href: LINKS.waste, label: t("wasteLink") },
        { href: LINKS.wasteGemeente, label: t("wasteGemeente") },
      ],
    },
  ];

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-10 lg:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("title"),
          description: t("intro"),
          url: localeUrl(locale, "/guide"),
        }}
      />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">{t("kicker")}</p>
      <h1 className="mt-2 max-w-[16ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-[62ch] text-base leading-7 text-ink">{t("intro")}</p>

      <div className="mt-10 grid max-w-[72ch] gap-5">
        {sections.map((section) => (
          <section key={section.key} className="rounded-[12px] bg-ice px-5 py-5 lg:px-6 lg:py-6">
            <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{section.title}</h2>
            <p className="mt-2 text-base leading-7 text-ink">{section.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-paper px-4 text-[13px] font-extrabold text-navy hover:bg-wash"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 max-w-[62ch] text-sm leading-6 text-mute">{t("note")}</p>
      <Link href="/about" className="mt-4 inline-flex cursor-pointer text-sm font-bold text-primary hover:text-navy">
        {t("back")}
      </Link>
    </main>
  );
}
