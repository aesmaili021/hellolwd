import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { copy } from "@/lib/copy";
import { isLocale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: copy.privacyTitle[locale] };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Header locale={locale} section="news" />
      <main id="content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">
          {copy.privacyTitle[locale]}
        </h1>
        <p className="mt-4 max-w-[65ch] text-base leading-7 text-ink">
          {copy.privacyBody[locale]}
        </p>
      </main>
    </>
  );
}
