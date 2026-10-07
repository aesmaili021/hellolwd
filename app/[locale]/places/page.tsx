import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturedBadge } from "@/components/FeaturedBadge";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import {
  claimMail,
  filterPlaces,
  getVisiblePlaces,
  placeDescription,
  placeDirectionsUrl,
} from "@/lib/data/places";
import { localePath, pageMetadata } from "@/lib/seo";
import { PLACE_CATEGORIES, isPlaceCategory, type PlaceCategory, type PlaceRow } from "@/lib/types";

function listPath(category?: string, query?: string) {
  const params = new URLSearchParams();
  if (category) params.set("cat", category);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/places?${search}` : "/places";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const { cat, q } = await searchParams;
  const t = await getTranslations("places");
  const seo = await getTranslations("seo");
  const category = cat && isPlaceCategory(cat) ? cat : undefined;
  return pageMetadata({
    locale,
    path: listPath(category, q?.trim() || undefined),
    title: category ? t("categoryTitle", { category: t(`cat.${category}`) }) : t("pageTitle"),
    description: seo("placesDescription"),
  });
}

export default async function PlacesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "nl" | "en" | "es" | "fa");
  const { cat, q } = await searchParams;
  const query = q?.trim() ?? "";
  const category = cat && isPlaceCategory(cat) ? cat : undefined;
  const t = await getTranslations("places");
  const visible = await getVisiblePlaces();
  const rows = filterPlaces(visible, category, query);
  const featured = rows.filter((place) => place.featured);
  const action = localePath(locale, "/places");

  return (
    <main id="content" className="flex-1">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t("pageTitle"),
          numberOfItems: rows.length,
          itemListElement: rows.map((place, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: place.name,
            url: place.website ?? placeDirectionsUrl(place.address),
          })),
        }}
      />
      <section className="bg-gradient-to-br from-[#0b3d5c] via-[#0c4d73] to-[#071e30] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-10 lg:py-14">
          <p className="text-xs font-extrabold tracking-[0.14em] text-[#9adcf6] uppercase">{t("kicker")}</p>
          <h1 className="mt-2 max-w-[16ch] text-[34px] font-extrabold tracking-[-0.03em] lg:text-[46px]">
            {t("pageTitle")}
          </h1>
          <p className="mt-3 max-w-[46ch] text-base leading-7 text-white/85">{t("intro")}</p>
        </div>
      </section>

      <div className="sticky top-28 z-10 border-b border-line bg-paper/95 backdrop-blur md:top-[4.25rem]">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-3 lg:px-10">
          <form action={action} method="get" className="flex max-w-[40rem] gap-2" role="search">
            {category ? <input type="hidden" name="cat" value={category} /> : null}
            <label className="sr-only" htmlFor="place-search">
              {t("searchLabel")}
            </label>
            <input
              id="place-search"
              name="q"
              defaultValue={query}
              placeholder={t("search")}
              className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-sm text-ink"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-brand px-4 text-[13px] font-extrabold text-white hover:bg-navy"
            >
              {t("searchSubmit")}
            </button>
          </form>
          <nav aria-label={t("filters")} className="mt-3 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max flex-nowrap gap-2">
              <li>
                <Pill href={query ? `/places?q=${encodeURIComponent(query)}` : "/places"} current={!category}>
                  {t("all")}
                </Pill>
              </li>
              {PLACE_CATEGORIES.map((id) => (
                <li key={id}>
                  <Pill href={listPath(category === id ? undefined : id, query || undefined)} current={category === id}>
                    {t(`cat.${id}`)}
                  </Pill>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        <section aria-label={t("featuredRow")}>
          <h2 className="text-[13px] font-extrabold tracking-[0.12em] text-mute uppercase">{t("featuredRow")}</h2>
          <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0">
            {featured.map((place) => (
              <a
                key={place.id}
                href={`#${place.id}`}
                className="block w-[240px] shrink-0 cursor-pointer rounded-[12px] border border-line bg-paper p-4 hover:border-primary"
              >
                <FeaturedBadge>{t("featured")}</FeaturedBadge>
                <span className="mt-2 block text-sm font-extrabold text-navy">{place.name}</span>
                <span className="mt-1 block text-xs leading-snug text-muted">{placeDescription(place, locale)}</span>
              </a>
            ))}
            <Link
              href="/advertise"
              className="block w-[240px] shrink-0 cursor-pointer rounded-[12px] border border-dashed border-slate bg-paper p-4 hover:border-primary"
            >
              <span className="block text-sm font-extrabold text-navy">{t("slotTitle")}</span>
            </Link>
            <Link
              href="/advertise"
              className="block w-[240px] shrink-0 cursor-pointer rounded-[12px] border border-dashed border-[#F6C400] bg-[#fff8dc] p-4"
            >
              <span className="block text-sm font-extrabold text-navy">{t("slotFounding")}</span>
            </Link>
          </div>
        </section>

        {rows.length ? (
          <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-4">
            {rows.map((place, index) => (
              <PlaceCard key={place.id} place={place} locale={locale} bannerAfter={index === 3 || (rows.length < 4 && index === rows.length - 1)} />
            ))}
          </div>
        ) : (
          <p className="mt-8 max-w-[42ch] text-ink">{t("empty")}</p>
        )}
      </div>
    </main>
  );
}

function Pill({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[13px] font-extrabold whitespace-nowrap ${
        current ? "bg-brand text-white" : "bg-ice text-navy hover:bg-wash"
      }`}
    >
      {children}
    </Link>
  );
}

function PlaceCard({
  place,
  locale,
  bannerAfter,
}: {
  place: PlaceRow;
  locale: string;
  bannerAfter: boolean;
}) {
  return (
    <>
      <article id={place.id} className="flex scroll-mt-36 flex-col rounded-[12px] border border-line bg-paper px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-extrabold tracking-wide text-primary uppercase">
            <CategoryName category={place.category} />
          </p>
          {place.featured ? <FeaturedBadge><FeaturedLabel /></FeaturedBadge> : null}
        </div>
        <h2 className="mt-1 text-[17px] font-extrabold text-navy">{place.name}</h2>
        <p className="mt-1 text-sm leading-6 text-ink">{placeDescription(place, locale)}</p>
        <p className="mt-2 text-[13px] text-muted" dir="ltr">
          {place.address}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {place.website ? (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-line px-3 text-[13px] font-extrabold text-navy hover:border-primary"
            >
              <WebsiteLabel />
            </a>
          ) : null}
          <a
            href={placeDirectionsUrl(place.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-brand px-3 text-[13px] font-extrabold text-white hover:bg-navy"
          >
            <DirectionsLabel />
          </a>
        </div>
        <a href={claimMail(place.name)} className="mt-auto pt-3 text-[13px] font-bold text-accent hover:underline">
          <ClaimLabel />
        </a>
      </article>
      {bannerAfter ? <OwnBanner /> : null}
    </>
  );
}

async function CategoryName({ category }: { category: PlaceCategory }) {
  const t = await getTranslations("places");
  return t(`cat.${category}`);
}

async function FeaturedLabel() {
  const t = await getTranslations("places");
  return t("featured");
}

async function WebsiteLabel() {
  const t = await getTranslations("places");
  return t("website");
}

async function DirectionsLabel() {
  const t = await getTranslations("places");
  return t("directions");
}

async function ClaimLabel() {
  const t = await getTranslations("places");
  return t("claim");
}

async function OwnBanner() {
  const t = await getTranslations("places");
  return (
    <Link
      href="/advertise"
      className="flex min-h-16 cursor-pointer items-center rounded-[12px] bg-accent px-5 py-4 text-[15px] font-extrabold text-white hover:bg-[#a50d25] lg:col-span-4"
    >
      {t("banner")}
    </Link>
  );
}
