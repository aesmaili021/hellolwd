import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturedBadge } from "@/components/FeaturedBadge";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import {
  PLACE_CATEGORIES,
  filterPlaces,
  placeDescription,
  placeMapsUrl,
  type PlaceCategory,
} from "@/lib/places";
import { localePath, pageMetadata } from "@/lib/seo";

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
  const category = cat && (PLACE_CATEGORIES as readonly string[]).includes(cat) ? cat : undefined;
  return pageMetadata({
    locale,
    path: listPath(category, q?.trim() || undefined),
    title: category ? t("categoryTitle", { category: t(`cat.${category}` as "cat.cafes") }) : t("pageTitle"),
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
  const category =
    cat && (PLACE_CATEGORIES as readonly string[]).includes(cat) ? (cat as PlaceCategory) : undefined;
  const t = await getTranslations("places");
  const rows = filterPlaces(category, query);
  const action = localePath(locale, "/places");
  const count = new Intl.NumberFormat(locale === "fa" ? "fa" : locale).format(rows.length);

  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-10 lg:py-12">
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
            url: place.website ?? placeMapsUrl(place.address),
          })),
        }}
      />
      <p className="text-xs font-extrabold tracking-[0.14em] text-primary uppercase">{t("kicker")}</p>
      <h1 className="mt-2 max-w-[18ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {t("pageTitle")}
      </h1>
      <p className="mt-4 max-w-[62ch] text-base leading-7 text-ink">{t("intro")}</p>

      <form action={action} method="get" className="mt-6 flex max-w-[36rem] gap-2" role="search">
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

      <nav aria-label={t("filters")} className="mt-4 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="flex w-max flex-nowrap gap-2 lg:flex-wrap">
          <li>
            <Link
              href={query ? `/places?q=${encodeURIComponent(query)}` : "/places"}
              aria-current={!category ? "page" : undefined}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[13px] font-extrabold ${
                !category ? "bg-brand text-white" : "bg-ice text-navy hover:bg-wash"
              }`}
            >
              {t("all")}
            </Link>
          </li>
          {PLACE_CATEGORIES.map((id) => (
            <li key={id}>
              <Link
                href={listPath(category === id ? undefined : id, query || undefined)}
                aria-current={category === id ? "page" : undefined}
                className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[13px] font-extrabold ${
                  category === id ? "bg-brand text-white" : "bg-ice text-navy hover:bg-wash"
                }`}
              >
                {t(`cat.${id}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-6 text-sm text-mute">{t("count", { count })}</p>

      {rows.length ? (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((place) => (
            <article id={place.slug} key={place.slug} className="flex scroll-mt-24 flex-col rounded-[12px] border border-line bg-paper px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-extrabold tracking-wide text-primary uppercase">
                  {t(`cat.${place.category}`)}
                </p>
                {place.featured ? <FeaturedBadge>{t("featured")}</FeaturedBadge> : null}
              </div>
              <h2 className="mt-1 text-[17px] font-extrabold text-navy">{place.name}</h2>
              <p className="mt-1 text-sm leading-6 text-ink">{placeDescription(place, locale)}</p>
              <p className="mt-2 text-[13px] text-muted" dir="ltr">
                {place.address}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] font-bold">
                {place.website ? (
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-primary hover:text-navy">
                    {t("website")}
                  </a>
                ) : null}
                <a href={placeMapsUrl(place.address)} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-primary hover:text-navy">
                  {t("map")}
                </a>
                <a href={place.source} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-mute hover:text-navy">
                  {t("source")}
                </a>
              </div>
              <Link
                href={`/advertise?ref=${place.slug}`}
                className="mt-auto pt-3 text-[12px] font-bold text-navy hover:text-primary"
              >
                {t("claim")}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 max-w-[42ch] text-ink">{t("empty")}</p>
      )}
    </main>
  );
}
