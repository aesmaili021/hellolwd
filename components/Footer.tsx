import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_VERSION } from "@/lib/version";

const SOURCES = [
  { name: "Omrop Fryslân", href: "https://www.omropfryslan.nl/" },
  { name: "Omroep Leeuwarden", href: "https://www.omroepleeuwarden.nl/" },
  { name: "LC.nl", href: "https://lc.nl/" },
];

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto border-t border-line bg-mist pb-16 md:pb-0">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-9 lg:grid-cols-4 lg:gap-10 lg:px-10 lg:py-9">
        <div className="flex max-w-[34ch] flex-col gap-2">
          <p className="text-[17px] font-extrabold text-navy">
            Hello<span className="text-primary">LWD</span>
          </p>
          <p className="text-[11px] font-bold tracking-wide text-mute">
            {t("version", { version: SITE_VERSION })}
          </p>
          <p className="text-[13px] leading-relaxed text-muted">{t("blurb")}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-navy">
            {t("colofon")}
          </p>
          <p className="text-[13px] text-muted">HelloLWD</p>
          <p className="text-[13px] text-muted">
            {t("kvk")} {t("kvkValue")}
          </p>
          <a
            href={`mailto:${t("email")}`}
            className="cursor-pointer text-[13px] text-muted hover:text-navy"
          >
            {t("email")}
          </a>
          <p className="text-[13px] text-muted">{t("address")}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-navy">
            {t("sources")}
          </p>
          {SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.href}
              className="cursor-pointer text-[13px] text-muted hover:text-navy"
              rel="noopener noreferrer"
              target="_blank"
            >
              {source.name}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-navy">
            {t("legal")}
          </p>
          <Link href="/privacy" className="cursor-pointer text-[13px] text-muted hover:text-navy">
            {t("privacy")}
          </Link>
          <Link href="/cookies" className="cursor-pointer text-[13px] text-muted hover:text-navy">
            {t("cookies")}
          </Link>
          <a
            href={`mailto:${t("email")}`}
            className="cursor-pointer text-[13px] text-muted hover:text-navy"
          >
            {t("contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}
