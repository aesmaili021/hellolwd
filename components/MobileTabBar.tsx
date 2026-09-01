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
        href="/about"
        current={pathname.startsWith("/about")}
        label={t("about")}
        icon="about"
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
  href: "/" | "/events" | "/about";
  current: boolean;
  label: string;
  icon: "news" | "events" | "about";
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="flex min-h-12 flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-3"
    >
      <span className="text-[17px] leading-none" aria-hidden>
        {icon === "news" ? "📰" : icon === "events" ? "🎧" : "ℹ️"}
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
