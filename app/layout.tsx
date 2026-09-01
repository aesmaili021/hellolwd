import type { Metadata } from "next";
import { Manrope, Vazirmatn } from "next/font/google";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { localeDir } from "@/i18n/routing";
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
  description: "Local news and weekend nights in Leeuwarden",
  icons: { icon: "/favicon.svg" },
};

const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);var t=m&&m[1];if(!t){t=localStorage.getItem("theme")}if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    locale = "en";
  }
  const jar = await cookies();
  const theme = jar.get("theme")?.value === "dark" ? "dark" : undefined;

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      data-theme={theme}
      className={`${manrope.variable} ${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
