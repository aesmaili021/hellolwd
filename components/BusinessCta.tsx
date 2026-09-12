import { getTranslations } from "next-intl/server";

const MAIL = "info@hellolwd.com";

export async function BusinessCta() {
  const t = await getTranslations("business");
  const href = `mailto:${MAIL}?subject=${encodeURIComponent(t("subject"))}`;

  return (
    <section
      aria-label={t("kicker")}
      className="border-b border-line bg-ice px-4 py-7 lg:px-10 lg:py-11"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="max-w-[38rem]">
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.14em] text-accent uppercase lg:text-xs">
            {t("kicker")}
          </p>
          <h2 className="text-[28px] font-extrabold leading-[1.12] tracking-[-0.03em] text-balance text-navy lg:text-[42px]">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-pretty text-ink lg:mt-4 lg:text-base">
            {t("body")}
          </p>
        </div>
        <a
          href={href}
          className="inline-flex min-h-12 w-fit shrink-0 cursor-pointer items-center rounded-full bg-accent px-6 text-[15px] font-extrabold text-paper hover:bg-navy lg:min-h-14 lg:px-8 lg:text-base"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
