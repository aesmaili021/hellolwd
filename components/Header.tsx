import Link from "next/link";
import { Suspense } from "react";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/locales";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Pompebled } from "./Pompebled";

export function Header({
  locale,
  section,
}: {
  locale: Locale;
  section: "news" | "events";
}) {
  const newsHref = `/${locale}`;
  const eventsHref = `/${locale}/events`;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <Link
          href={newsHref}
          className="flex min-h-11 cursor-pointer items-center gap-2 text-navy"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-frisian">
            <Pompebled className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            {copy.siteName}
          </span>
        </Link>

        <nav
          aria-label={copy.siteName}
          className="order-3 flex w-full gap-1 border-t border-line pt-2 sm:order-2 sm:w-auto sm:border-0 sm:pt-0"
        >
          <Link
            href={newsHref}
            aria-current={section === "news" ? "page" : undefined}
            className={`inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold transition-colors duration-200 ease-out ${
              section === "news"
                ? "bg-frisian text-navy"
                : "text-ink-soft hover:bg-mist hover:text-navy"
            }`}
          >
            {copy.navNews[locale]}
          </Link>
          <Link
            href={eventsHref}
            aria-current={section === "events" ? "page" : undefined}
            className={`inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold transition-colors duration-200 ease-out ${
              section === "events"
                ? "bg-frisian text-navy"
                : "text-ink-soft hover:bg-mist hover:text-navy"
            }`}
          >
            {copy.navEvents[locale]}
          </Link>
        </nav>

        <Suspense
          fallback={
            <div className="ms-auto h-11 w-40" aria-hidden="true" />
          }
        >
          <div className="order-2 ms-auto sm:order-3">
            <LanguageSwitcher locale={locale} />
          </div>
        </Suspense>
      </div>
    </header>
  );
}
