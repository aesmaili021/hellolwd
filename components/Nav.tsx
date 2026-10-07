"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoMark } from "@/components/Pompebled";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onNews = pathname === "/";
  const onEvents = pathname.startsWith("/events");
  const onAbout = pathname.startsWith("/about");
  const onGuide = pathname.startsWith("/guide");
  const onPlaces = pathname.startsWith("/places");
  const onAdvertise = pathname.startsWith("/advertise");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3.5 lg:px-10">
        <Link
          href="/"
          className="flex min-h-11 cursor-pointer items-center gap-2.5"
        >
          <LogoMark className="h-[22px] w-[22px] lg:h-[30px] lg:w-[30px]" />
          <span className="text-[17px] font-extrabold tracking-[-0.02em] text-navy lg:text-[21px]">
            Hello<span className="text-primary">LWD</span>
          </span>
        </Link>

        <nav aria-label="HelloLWD" className="hidden items-center gap-6 md:flex">
          <NavLinks
            onNews={onNews}
            onEvents={onEvents}
            onGuide={onGuide}
            onPlaces={onPlaces}
            onAdvertise={onAdvertise}
            onAbout={onAbout}
            news={t("news")}
            events={t("events")}
            newcomers={t("newcomers")}
            places={t("places")}
            advertise={t("advertise")}
            about={t("about")}
          />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle label={t("theme")} />
          <LanguageSwitcher />
        </div>
      </div>
      <nav aria-label="HelloLWD" className="flex gap-5 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        <NavLinks
          onNews={onNews}
          onEvents={onEvents}
          onGuide={onGuide}
          onPlaces={onPlaces}
          onAdvertise={onAdvertise}
          onAbout={onAbout}
          news={t("news")}
          events={t("events")}
          newcomers={t("newcomers")}
          places={t("places")}
          advertise={t("advertise")}
          about={t("about")}
        />
      </nav>
    </header>
  );
}

function NavLinks({
  onNews,
  onEvents,
  onGuide,
  onPlaces,
  onAdvertise,
  onAbout,
  news,
  events,
  newcomers,
  places,
  advertise,
  about,
}: {
  onNews: boolean;
  onEvents: boolean;
  onGuide: boolean;
  onPlaces: boolean;
  onAdvertise: boolean;
  onAbout: boolean;
  news: string;
  events: string;
  newcomers: string;
  places: string;
  advertise: string;
  about: string;
}) {
  return (
    <>
      <NavText href="/" current={onNews}>
        {news}
      </NavText>
      <NavText href="/events" current={onEvents}>
        {events}
      </NavText>
      <NavText href="/guide" current={onGuide}>
        {newcomers}
      </NavText>
      <NavText href="/places" current={onPlaces}>
        {places}
      </NavText>
      <NavText href="/advertise" current={onAdvertise}>
        {advertise}
      </NavText>
      <NavText href="/about" current={onAbout}>
        {about}
      </NavText>
    </>
  );
}

function NavText({
  href,
  current,
  children,
}: {
  href: "/" | "/events" | "/about" | "/guide" | "/places" | "/advertise";
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`cursor-pointer pb-[3px] text-[15px] transition-colors duration-200 ease-out ${
        current
          ? "border-b-2 border-primary font-bold text-navy"
          : "font-semibold text-muted hover:text-navy"
      }`}
    >
      {children}
    </Link>
  );
}
