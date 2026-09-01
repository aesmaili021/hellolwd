"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";
import { localeDir } from "@/i18n/routing";

export function DocumentLocale() {
  const locale = useLocale();

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);

  return null;
}
