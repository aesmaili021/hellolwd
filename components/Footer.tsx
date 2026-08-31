import Link from "next/link";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/locales";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-auto border-t border-line bg-mist">
      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">
            {copy.colofon[locale]}
          </p>
          <p className="mt-2 text-base font-semibold text-navy">
            {copy.siteName}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {copy.kvk[locale]} 00000000
          </p>
          <p className="text-sm text-ink-soft">{copy.address[locale]}</p>
        </div>
        <div className="sm:text-end">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">
            {copy.contact[locale]}
          </p>
          <a
            href="mailto:hello@hellolwd.nl"
            className="mt-2 inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-navy underline-offset-4 hover:underline"
          >
            hello@hellolwd.nl
          </a>
          <div>
            <Link
              href={`/${locale}/privacy`}
              className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-navy underline-offset-4 hover:underline"
            >
              {copy.privacy[locale]}
            </Link>
          </div>
        </div>
        <p className="text-sm text-ink-soft sm:col-span-2">
          {copy.footerNote[locale]}
        </p>
      </div>
    </footer>
  );
}
