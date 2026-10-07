"use client";

import { useTranslations } from "next-intl";
import { LineIcon, type LineIconName } from "@/components/LineIcon";
import { Link, usePathname } from "@/i18n/navigation";

const ICONS = {
  news: "newspaper",
  events: "calendar",
  cambuur: "ball",
  guide: "compass",
} as const satisfies Record<string, LineIconName>;

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
  icon: keyof typeof ICONS;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`flex min-h-12 flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-3 ${
        current ? "text-navy" : "text-mute"
      }`}
    >
      <LineIcon name={ICONS[icon]} className="h-6 w-6" />
      <span className={`text-[11px] ${current ? "font-bold" : "font-semibold"}`}>{label}</span>
    </Link>
  );
}
