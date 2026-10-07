"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function MobileTabBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("tabs")}
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <Tab href="/" current={pathname === "/"} label={t("news")} icon="news" />
      <Tab
        href="/events"
        current={pathname.startsWith("/events")}
        label={t("events")}
        icon="events"
      />
      <Tab
        href="/cambuur"
        current={pathname.startsWith("/cambuur")}
        label={t("cambuur")}
        icon="cambuur"
      />
      <Tab
        href="/guide"
        current={pathname.startsWith("/guide")}
        label={t("guide")}
        icon="guide"
      />
    </nav>
  );
}

function Tab({
  href,
  current,
  label,
  icon,
}: {
  href: "/" | "/events" | "/cambuur" | "/guide";
  current: boolean;
  label: string;
  icon: "news" | "events" | "cambuur" | "guide";
}) {
  const glyph =
    icon === "news" ? "📰" : icon === "events" ? "📅" : icon === "cambuur" ? "⚽" : "🧭";
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="flex min-h-12 flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-3"
    >
      <span className="emoji text-[17px] leading-none" aria-hidden>
        {glyph}
      </span>
      <span
        className={`text-[11px] ${
          current ? "font-extrabold text-navy" : "font-semibold text-mute"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
