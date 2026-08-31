"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { copy, localeLabels } from "@/lib/copy";
import { locales, type Locale } from "@/lib/locales";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const search = useSearchParams();
  const query = search.toString();
  const suffix = query ? `?${query}` : "";

  return (
    <nav aria-label={copy.language[locale]} className="flex items-center gap-1">
      {locales.map((code) => {
        const href = `/${code}${pathname.slice(locale.length + 1)}${suffix}`;
        const active = code === locale;
        return (
          <Link
            key={code}
            href={href}
            hrefLang={code}
            lang={code}
            dir={code === "fa" ? "rtl" : "ltr"}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full px-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 ease-out ${
              active
                ? "bg-navy text-paper"
                : "text-ink-soft hover:bg-mist hover:text-navy"
            }`}
          >
            {localeLabels[code]}
          </Link>
        );
      })}
    </nav>
  );
}
