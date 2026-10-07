import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function BusinessCta() {
  const t = await getTranslations("business");

  return (
    <section aria-label={t("kicker")} className="border-y-4 border-primary bg-brand text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10 lg:py-12">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#F6C400] uppercase">
            {t("kicker")}
          </p>
          <div className="mt-4 inline-flex flex-col rounded-2xl bg-primary px-5 py-3 text-brand">
            <p className="text-[40px] leading-none font-black tracking-[-0.04em] lg:text-[52px]" dir="ltr">
              {t("stat")}
            </p>
            <p className="mt-1 text-sm font-extrabold">{t("statLabel")}</p>
          </div>
          <h2 className="mt-4 max-w-[16ch] text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance lg:text-[40px]">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-white/80">{t("line")}</p>
          <p className="mt-1 max-w-[42ch] text-[15px] leading-relaxed text-white/80">{t("whatsapp")}</p>
        </div>
        <Link
          href="/advertise"
          className="inline-flex min-h-12 w-fit shrink-0 cursor-pointer items-center rounded-full bg-accent px-6 text-[15px] font-extrabold text-white hover:bg-white hover:text-brand lg:min-h-14 lg:px-8 lg:text-base"
        >
          {t("cta")}
          <span className="ms-1 inline-block rtl:rotate-180" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
