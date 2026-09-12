import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "HelloLWD",
    short_name: "HelloLWD",
    description: "Local news and weekend nights in Leeuwarden",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0B3D5C",
    theme_color: "#0B3D5C",
    lang: "en",
    dir: "auto",
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
  };
}
