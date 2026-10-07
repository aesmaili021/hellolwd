import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { localeUrl, pageMetadata } from "@/lib/seo";
import { VENUE_PRESETS } from "@/lib/venues";

const LINKS = {
  bsn: "https://www.leeuwarden.nl/verhuizen-of-inschrijven/inschrijven-in-nederland-vanuit-het-buitenland/",
  appointment: "https://leeuwarden.mijnafspraakmaken.nl/Client",
  rni: "https://www.leeuwarden.nl/verhuizen-of-inschrijven/registratie-niet-ingezetenen/",
  rniForm: "https://www.rvig.nl/inschrijfformulieren-rni",
  digid: "https://www.digid.nl/aanvragen-en-activeren/digid-aanvragen",
  waste: "https://www.omrin.nl/zelf-regelen/afvalkalender",
  wastePas: "https://www.omrin.nl/zelf-regelen/milieupas-aanvragen",
  wasteGemeente: "https://www.leeuwarden.nl/afval-en-recycling/inzamelen-van-afval/",
  huisarts: "https://www.zorgkaartnederland.nl/",
  insurance: "https://www.studyinnl.org/plan-your-stay/healthcare-insurance",
  dokterswacht: "https://dokterswacht.nl/locaties/huisartsenspoedpost-leeuwarden/",
};

const HUB = [
  { id: "nightlife", title: "nightlifeTitle" },
  { id: "room", title: "roomTitle" },
  { id: "first-month", title: "firstMonthTitle" },
  { id: "eats", title: "eatsTitle" },
] as const;

function paragraphs(text: string) {
  return text.split("\n\n").map((part) => part.trim()).filter(Boolean);
}

function lines(text: string) {
  return text.split("\n").map((part) => part.trim()).filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const guides = await getTranslations("guides");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/guide",
    title: guides("title"),
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
  const guides = await getTranslations("guides");

  const sections = [
    {
      key: "bsn",
      title: t("bsnTitle"),
      body: t("bsn"),
      bringTitle: t("bsnBringTitle"),
      bring: t("bsnBring"),
      links: [
        { href: LINKS.bsn, label: t("bsnLink") },
        { href: LINKS.appointment, label: t("bsnBook") },
      ],
    },
    {
      key: "rni",
      title: t("rniTitle"),
      body: t("rni"),
      bringTitle: t("rniBringTitle"),
      bring: t("rniBring"),
      links: [
        { href: LINKS.rni, label: t("rniLink") },
        { href: LINKS.rniForm, label: t("rniForm") },
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
        { href: LINKS.wastePas, label: t("wastePas") },
        { href: LINKS.wasteGemeente, label: t("wasteGemeente") },
      ],
    },
    {
      key: "care",
      title: t("careTitle"),
      body: t("care"),
      links: [
        { href: LINKS.huisarts, label: t("careHuisarts") },
        { href: LINKS.insurance, label: t("careInsurance") },
        { href: LINKS.dokterswacht, label: t("carePost") },
      ],
    },
  ];

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-10 lg:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: guides("title"),
          description: guides("intro"),
          url: localeUrl(locale, "/guide"),
        }}
      />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">{t("kicker")}</p>
      <h1 className="mt-2 max-w-[16ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {guides("title")}
      </h1>
      <div className="mt-5 max-w-[62ch] space-y-4 text-base leading-7 text-ink">
        {paragraphs(guides("intro")).map((part) => (
          <p key={part}>{part}</p>
        ))}
      </div>

      <nav aria-label={guides("title")} className="mt-6 flex max-w-[72ch] flex-wrap gap-2">
        {HUB.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ice px-4 text-[13px] font-extrabold text-navy hover:bg-wash"
          >
            {guides(item.title)}
          </a>
        ))}
      </nav>

      <div className="mt-10 grid max-w-[72ch] gap-5">
        <section id="nightlife" className="scroll-mt-24 rounded-[12px] bg-ice px-5 py-5 lg:px-6 lg:py-6">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{guides("nightlifeTitle")}</h2>
          <div className="mt-2 space-y-3 text-base leading-7 text-ink">
            {paragraphs(guides("nightlifeBody")).map((part) => (
              <p key={part}>{part}</p>
            ))}
          </div>
          <h3 className="mt-4 text-[13px] font-extrabold tracking-[0.06em] text-navy uppercase">
            {guides("roomsLabel")}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {VENUE_PRESETS.map((venue) => (
              <li key={venue.id}>
                <a
                  href={venue.maps_url}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-paper px-4 text-[13px] font-extrabold text-navy hover:bg-wash"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {venue.name} ↗
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/events"
            className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-[13px] font-extrabold text-primary hover:text-navy"
          >
            {guides("weekendCta")} <span className="ms-1 inline-block rtl:rotate-180" aria-hidden>→</span>
          </Link>
        </section>

        <section id="room" className="scroll-mt-24 rounded-[12px] bg-ice px-5 py-5 lg:px-6 lg:py-6">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{guides("roomTitle")}</h2>
          <div className="mt-2 space-y-3 text-base leading-7 text-ink">
            {paragraphs(guides("roomBody")).map((part) => (
              <p key={part}>{part}</p>
            ))}
          </div>
        </section>

        <section id="first-month" className="scroll-mt-24">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{t("title")}</h2>
          <p className="mt-2 text-[13px] font-semibold text-mute">{t("updated")}</p>
          <div className="mt-3 space-y-4 text-base leading-7 text-ink">
            {paragraphs(t("intro")).map((part) => (
              <p key={part}>{part}</p>
            ))}
          </div>
          <nav aria-label={t("toc")} className="mt-5 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.key}
                href={`#${section.key}`}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ice px-4 text-[13px] font-extrabold text-navy hover:bg-wash"
              >
                {section.title}
              </a>
            ))}
          </nav>
          <div className="mt-5 grid gap-5">
            {sections.map((section) => (
              <section
                key={section.key}
                id={section.key}
                className="scroll-mt-24 rounded-[12px] bg-ice px-5 py-5 lg:px-6 lg:py-6"
              >
                <h3 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{section.title}</h3>
                <div className="mt-2 space-y-3 text-base leading-7 text-ink">
                  {paragraphs(section.body).map((part) => (
                    <p key={part}>{part}</p>
                  ))}
                </div>
                {"bring" in section && section.bring ? (
                  <>
                    <h4 className="mt-4 text-[13px] font-extrabold tracking-[0.06em] text-navy uppercase">
                      {section.bringTitle}
                    </h4>
                    <ul className="mt-2 list-disc space-y-1.5 ps-5 text-base leading-7 text-ink">
                      {lines(section.bring).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
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
        </section>

        <section id="eats" className="scroll-mt-24 rounded-[12px] bg-ice px-5 py-5 lg:px-6 lg:py-6">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{guides("eatsTitle")}</h2>
          <div className="mt-2 space-y-3 text-base leading-7 text-ink">
            {paragraphs(guides("eatsBody")).map((part) => (
              <p key={part}>{part}</p>
            ))}
          </div>
        </section>
      </div>

      <p className="mt-8 max-w-[62ch] text-sm leading-6 text-mute">{t("note")}</p>
      <Link href="/about" className="mt-4 inline-flex cursor-pointer text-sm font-bold text-primary hover:text-navy">
        {t("back")}
      </Link>
    </main>
  );
}
