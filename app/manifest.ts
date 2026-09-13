import { cookies } from "next/headers";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

function localeFromCookie(value?: string) {
  return value && routing.locales.includes(value as (typeof routing.locales)[number])
    ? value
    : routing.defaultLocale;
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = localeFromCookie((await cookies()).get("NEXT_LOCALE")?.value);

  return {
    id: "/",
    name: "HelloLWD",
    short_name: "HelloLWD",
    description: "Local news and weekend nights in Leeuwarden",
    start_url: `/${locale}`,
    scope: "/",
    display: "standalone",
    background_color: "#0B3D5C",
    theme_color: "#0B3D5C",
    lang: locale,
    dir: locale === "fa" ? "rtl" : "ltr",
    orientation: "portrait-primary",
    categories: ["news", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/icons/screenshot-narrow.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
        label: "HelloLWD home",
      },
      {
        src: "/icons/screenshot-wide.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "HelloLWD home",
      },
    ],
  };
}
