import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturedBadge } from "@/components/FeaturedBadge";
import { JsonLd } from "@/components/JsonLd";
import { localeUrl, pageMetadata } from "@/lib/seo";

const MAIL = "info@hellolwd.com";

const FACTS = ["factReaders", "factWhere", "factSearch", "factMobile", "factLanguages", "factWho"] as const;

const PACKAGES = [
  { id: "free", name: "freeName", price: "freePrice", body: "freeBody", subject: "freeSubject", featured: false },
  { id: "featured", name: "featuredName", price: "featuredPrice", body: "featuredBody", subject: "featuredSubject", featured: true },
  { id: "sponsored", name: "sponsoredName", price: "sponsoredPrice", body: "sponsoredBody", subject: "sponsoredSubject", featured: false },
  { id: "week", name: "weekName", price: "weekPrice", body: "weekBody", subject: "weekSubject", featured: false },
  { id: "match", name: "matchName", price: "matchPrice", body: "matchBody", subject: "matchSubject", featured: false },
] as const;

const FAQ = [
  { q: "faqLabelQ", a: "faqLabelA" },
  { q: "faqMinQ", a: "faqMinA" },
  { q: "faqCancelQ", a: "faqCancelA" },
] as const;

function mail(subject: string) {
  return `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("ads");
  const seo = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/advertise",
    title: t("title"),
    description: seo("advertiseDescription"),
  });
}

export default async function AdvertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const t = await getTranslations("ads");
  const places = await getTranslations("places");

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-10 lg:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("title"),
          description: t("intro"),
          url: localeUrl(locale, "/advertise"),
        }}
      />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">{t("kicker")}</p>
      <h1 className="mt-2 max-w-[16ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-[62ch] text-base leading-7 text-ink">{t("intro")}</p>

      <section aria-label={t("audienceTitle")} className="mt-8 max-w-[72ch] rounded-[12px] bg-ice px-5 py-5 lg:px-6">
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{t("audienceTitle")}</h2>
        <ul className="mt-3 list-disc space-y-1.5 ps-5 text-base leading-7 text-ink">
          {FACTS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </section>

      <section aria-label={t("packagesTitle")} className="mt-10">
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{t("packagesTitle")}</h2>
        <p className="mt-3 max-w-[62ch] rounded-[12px] border border-[#F6C400] bg-[#fff8dc] px-4 py-3 text-sm leading-6 font-semibold text-navy">
          {t("founding")}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {PACKAGES.map((item) => (
            <article key={item.id} className="flex flex-col rounded-[12px] border border-line bg-paper px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[17px] font-extrabold text-navy">{t(item.name)}</h3>
                {item.featured ? <FeaturedBadge>{places("featured")}</FeaturedBadge> : null}
              </div>
              <p className="mt-2 text-[22px] font-black tracking-[-0.03em] text-brand" dir="ltr">
                {t(item.price)}
              </p>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink">{t(item.body)}</p>
              <a
                href={mail(t(item.subject))}
                className="mt-4 inline-flex min-h-11 w-fit cursor-pointer items-center rounded-full bg-brand px-5 text-[13px] font-extrabold text-white hover:bg-navy"
              >
                {t("cta")}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section aria-label={t("faqTitle")} className="mt-10 max-w-[72ch]">
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{t("faqTitle")}</h2>
        <div className="mt-3 grid gap-3">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-[12px] bg-ice px-5 py-4">
              <h3 className="text-[15px] font-extrabold text-navy">{t(item.q)}</h3>
              <p className="mt-1 text-sm leading-6 text-ink">{t(item.a)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
