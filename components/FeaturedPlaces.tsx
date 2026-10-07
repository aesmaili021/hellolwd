import { getTranslations } from "next-intl/server";

const MAIL = "info@hellolwd.com";

const SLOTS = [
  { title: "barTitle", body: "barBody" },
  { title: "restaurantTitle", body: "restaurantBody" },
  { title: "shopTitle", body: "shopBody" },
] as const;

export async function FeaturedPlaces() {
  const t = await getTranslations("places");
  const business = await getTranslations("business");
  const href = `mailto:${MAIL}?subject=${encodeURIComponent(business("subject"))}`;

  return (
    <div className="flex h-full flex-col rounded-[14px] border border-line bg-paper p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-extrabold text-navy">{t("title")}</h2>
        <span className="rounded bg-[#fdf3c4] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-[#8a6d00] uppercase">
          {t("sample")}
        </span>
      </div>
      <div className="mt-3 grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {SLOTS.map((slot) => (
          <a
            key={slot.title}
            href={href}
            className="block cursor-pointer rounded-[10px] border border-dashed border-slate p-3 hover:border-primary"
          >
            <span className="text-[9px] font-extrabold tracking-wide text-[#8a6d00] uppercase">
              {t("featured")}
            </span>
            <span className="mt-1 block text-sm font-extrabold text-navy">{t(slot.title)}</span>
            <span className="mt-0.5 block text-xs text-muted">{t(slot.body)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
