import type { Metadata } from "next";
import { Manrope, Vazirmatn } from "next/font/google";
import { headers } from "next/headers";
import { copy } from "@/lib/copy";
import { isLocale, localeDir, type Locale } from "@/lib/locales";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-latin",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HelloLWD",
    template: "%s · HelloLWD",
  },
  description: copy.tagline.en,
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const raw = headerList.get("x-locale") ?? "en";
  const locale: Locale = isLocale(raw) ? raw : "en";

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      className={`${manrope.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
