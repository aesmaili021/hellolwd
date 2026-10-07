"use client";

import { useTranslations } from "next-intl";
import { WHATSAPP_CHANNEL, WHATSAPP_DISMISS_KEY, trackWhatsAppClick } from "@/lib/whatsapp";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.61-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39 1.02-.39.12 0 .23 0 .33.01.3.01.44.03.64.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.41.48-.14.14-.28.28-.12.55.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.54.73 1.8.86.27.14.44.2.51.31.07.12.07.68-.17 1.36z"
      />
    </svg>
  );
}

const followClass =
  "inline-flex min-h-10 shrink-0 cursor-pointer items-center rounded-full bg-[#25D366] px-3.5 text-[13px] font-extrabold text-[#064e3b] hover:bg-[#1ebe5d]";

export function WhatsAppFollow({
  place,
  className = followClass,
  children,
}: {
  place: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={WHATSAPP_CHANNEL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsAppClick(place)}
    >
      {children}
    </a>
  );
}

function dismissStrip() {
  try {
    localStorage.setItem(WHATSAPP_DISMISS_KEY, "1");
  } catch {
    /* private mode */
  }
  document.documentElement.dataset.waDismissed = "1";
}

export function WhatsAppStrip() {
  const t = useTranslations("whatsapp");

  return (
    <div data-whatsapp-strip className="border-b border-[#b7ebc9] bg-[#e7f8ef] text-[#0b3d5c]">
      <div className="mx-auto flex max-w-[1440px] items-center gap-2.5 px-4 py-1.5 lg:gap-3 lg:px-10">
        <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#128C7E]" />
        <p className="min-w-0 flex-1 text-[13px] leading-snug font-bold">{t("strip")}</p>
        <WhatsAppFollow place="strip">{t("follow")}</WhatsAppFollow>
        <button
          type="button"
          onClick={dismissStrip}
          aria-label={t("dismiss")}
          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg leading-none text-[#0b3d5c]/70 hover:bg-[#0b3d5c]/10 hover:text-[#0b3d5c]"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </div>
  );
}

export function WhatsAppArticle() {
  const t = useTranslations("whatsapp");

  return (
    <aside className="mt-10 flex flex-col gap-3 rounded-[12px] border border-[#25D366] bg-[#e7f8ef] px-5 py-4 text-[#0b3d5c] sm:flex-row sm:items-center sm:justify-between">
      <p className="flex min-w-0 items-start gap-2.5 text-[15px] leading-snug font-extrabold">
        <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#128C7E]" />
        <span>{t("article")}</span>
      </p>
      <WhatsAppFollow place="article">{t("follow")}</WhatsAppFollow>
    </aside>
  );
}
