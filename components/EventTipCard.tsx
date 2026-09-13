import { getTranslations } from "next-intl/server";
import { Pompebled } from "@/components/Pompebled";

export async function EventTipCard() {
  const t = await getTranslations("events");
  const footer = await getTranslations("footer");
  const href = `mailto:${footer("email")}?subject=${encodeURIComponent(t("tipSubject"))}&body=${encodeURIComponent(t("tipMailBody"))}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-dashed border-line bg-ice">
      <div className="flex h-[130px] items-center justify-center bg-brand lg:h-[152px]">
        <Pompebled className="h-12 w-12 text-accent" vein={false} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5 lg:gap-2.5 lg:p-[18px]">
        <p className="text-[10px] font-extrabold tracking-wide text-accent uppercase">
          {t("tipKicker")}
        </p>
        <h2 className="text-lg font-bold leading-snug tracking-[-0.015em] text-navy lg:text-[19px]">
          {t("tipTitle")}
        </h2>
        <p className="text-[13px] leading-relaxed text-muted">{t("tipBody")}</p>
        <a
          href={href}
          className="mt-auto inline-flex min-h-11 w-fit cursor-pointer items-center rounded-full bg-brand px-4 text-[13px] font-extrabold text-paper hover:bg-navy"
        >
          {t("tipCta")}
        </a>
      </div>
    </article>
  );
}
