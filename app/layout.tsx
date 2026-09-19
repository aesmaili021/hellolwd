import type { Metadata, Viewport } from "next";
import { Manrope, Vazirmatn } from "next/font/google";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { localeDir } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HelloLWD",
    template: "%s · HelloLWD",
  },
  description: "Local news and weekend nights in Leeuwarden",
  applicationName: "HelloLWD",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "HelloLWD",
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/icons/splash-1290x2796.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/icons/splash-1179x2556.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/icons/splash-1170x2532.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/icons/splash-1284x2778.png",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
      },
      { url: "/icons/splash-1170x2532.png" },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B3D5C" },
    { media: "(prefers-color-scheme: dark)", color: "#08131C" },
  ],
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
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
