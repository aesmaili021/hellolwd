"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeDir, routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const labels = useTranslations("locales");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  return (
    <nav
      aria-label={t("language")}
      className="flex items-center gap-0.5 rounded-full bg-wash p-[3px] lg:gap-1.5 lg:p-1"
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            dir={code === "fa" ? "rtl" : "ltr"}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.documentElement.lang = code;
              document.documentElement.dir = localeDir(code);
              const qs = search.toString();
              const href = qs ? `${pathname}?${qs}` : pathname;
              router.replace(href, { locale: code });
            }}
            className={`inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full px-2 text-[11px] font-bold tracking-wide transition-colors duration-200 ease-out lg:min-w-10 lg:px-3 lg:text-[13px] ${
              active ? "bg-primary text-paper" : "text-muted hover:text-navy"
            }`}
          >
            {labels(code)}
          </button>
        );
      })}
    </nav>
  );
}
