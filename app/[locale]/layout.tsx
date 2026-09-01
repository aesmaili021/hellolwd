import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DocumentLocale } from "@/components/DocumentLocale";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { Nav } from "@/components/Nav";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: { absolute: t("name") },
    description: t("tagline"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("nav");

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DocumentLocale />
      <div className="flex min-h-full flex-1 flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-paper"
      >
        {t("skip")}
      </a>
      <Suspense fallback={<div className="h-16 border-b border-line bg-paper" />}>
        <Nav />
      </Suspense>
      {children}
      <Footer />
      <MobileTabBar />
      </div>
    </NextIntlClientProvider>
  );
}
