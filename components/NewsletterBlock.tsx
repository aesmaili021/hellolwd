import { getTranslations } from "next-intl/server";
import { NewsletterForm } from "@/components/NewsletterSignup";
import { features } from "@/lib/features";

export async function NewsletterBlock() {
  if (!features.newsletter) return null;
  const t = await getTranslations("newsletter");

  return (
    <section aria-label={t("label")} className="mt-10 lg:mt-14">
      <div className="flex flex-col gap-5 rounded-[14px] bg-ice px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-6">
        <div className="min-w-0 max-w-[36rem]">
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-primary uppercase">{t("kicker")}</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-navy">{t("title")}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{t("body")}</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
