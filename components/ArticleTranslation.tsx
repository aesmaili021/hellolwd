"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { requestArticleTranslation } from "@/app/[locale]/article/actions";

export function ArticleTranslation({
  articleId,
  locale,
  languageLabel,
  translatedTitle,
  translatedSummary,
}: {
  articleId: string;
  locale: string;
  languageLabel: string;
  translatedTitle: string | null;
  translatedSummary: string | null;
}) {
  const t = useTranslations("article");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(translatedTitle);
  const [summary, setSummary] = useState(translatedSummary);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const ready = Boolean(title && summary);

  if (locale === "nl") return null;

  function reveal() {
    setError("");
    if (ready) {
      setOpen(true);
      return;
    }
    startTransition(async () => {
      const result = await requestArticleTranslation(articleId, locale);
      if (!result.ok) {
        setError(t("translateFailed"));
        return;
      }
      setTitle(result.title);
      setSummary(result.summary);
      setOpen(true);
    });
  }

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center gap-2.5">
        {open && ready ? (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-wash px-4 text-[13px] font-extrabold text-navy transition-[transform,background-color] duration-200 ease-out hover:bg-ice active:scale-[0.96]"
          >
            {t("hideTranslation")}
          </button>
        ) : (
          <button
            type="button"
            onClick={reveal}
            disabled={pending}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-4 text-[13px] font-extrabold text-brand transition-[transform,background-color] duration-200 ease-out hover:opacity-90 active:scale-[0.96] disabled:cursor-wait disabled:opacity-70"
          >
            {pending
              ? t("translating")
              : ready
                ? t("showTranslation", { language: languageLabel })
                : t("requestTranslation", { language: languageLabel })}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-3 text-sm font-semibold text-accent" role="status">
          {error}
        </p>
      ) : null}
      {open && title && summary ? (
        <div className="mt-4 rounded-[10px] bg-mist px-4 py-4 lg:px-5 lg:py-5">
          <p className="text-[10px] font-extrabold tracking-[0.12em] text-mute uppercase">
            {t("translatedBadge")}
          </p>
          <h2 className="mt-2 max-w-[28ch] text-[20px] font-extrabold leading-[1.25] tracking-[-0.02em] text-navy text-pretty lg:text-[24px]">
            {title}
          </h2>
          <p className="mt-3 max-w-[65ch] text-[15px] leading-[1.6] text-ink text-pretty lg:text-base">
            {summary}
          </p>
        </div>
      ) : null}
    </div>
  );
}
