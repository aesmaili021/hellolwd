"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const btn =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-wash px-4 text-[13px] font-extrabold text-navy transition-[transform,background-color] duration-200 ease-out hover:bg-ice active:scale-[0.96]";

export function ArticleShare({ url, title }: { url: string; title: string }) {
  const t = useTranslations("article");
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const message = `${title}\n${url}`;

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function shareNative() {
    try {
      await navigator.share({ title, text: title, url });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(t("copyLink"), url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mt-6 border-t border-line pt-5" aria-label={t("shareLabel")}>
      <p className="text-[10px] font-extrabold tracking-[0.12em] text-mute uppercase">
        {t("share")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canShare ? (
          <button type="button" className={btn} onClick={shareNative}>
            {t("shareNative")}
          </button>
        ) : null}
        <a
          className={btn}
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("shareWhatsApp")}
        </a>
        <a
          className={btn}
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("shareTelegram")}
        </a>
        <button type="button" className={btn} onClick={copyLink} aria-live="polite">
          {copied ? t("copied") : t("copyLink")}
        </button>
      </div>
    </section>
  );
}
