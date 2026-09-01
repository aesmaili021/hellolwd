"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { requestFullTranslation } from "@/app/[locale]/article/actions";

export function ArticleTranslation({
  articleId,
  locale,
  languageLabel,
  fullBody,
}: {
  articleId: string;
  locale: string;
  languageLabel: string;
  fullBody: string | null;
}) {
  const t = useTranslations("article");
  const [open, setOpen] = useState(Boolean(fullBody));
  const [body, setBody] = useState(fullBody);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const ready = Boolean(body);

  function reveal() {
    setError("");
    if (ready) {
      setOpen(true);
      return;
    }
    startTransition(async () => {
      const result = await requestFullTranslation(articleId, locale);
      if (!result.ok) {
        setError(t("translateFailed"));
        return;
      }
      setBody(result.body);
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
            {t("hideFull")}
          </button>
        ) : (
          <button
            type="button"
            onClick={reveal}
            disabled={pending}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-4 text-[13px] font-extrabold text-brand transition-[transform,background-color] duration-200 ease-out hover:opacity-90 active:scale-[0.96] disabled:cursor-wait disabled:opacity-70"
          >
            {pending
              ? t("translatingFull")
              : ready
                ? t("showFull", { language: languageLabel })
                : locale === "nl"
                  ? t("requestFullNl")
                  : t("requestFull", { language: languageLabel })}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-3 text-sm font-semibold text-accent" role="status">
          {error}
        </p>
      ) : null}
      {open && body ? (
        <div className="mt-4 rounded-[10px] bg-mist px-4 py-4 lg:px-5 lg:py-5">
          <p className="text-[10px] font-extrabold tracking-[0.12em] text-mute uppercase">
            {t("fullBadge")}
          </p>
          <div className="mt-3 max-w-[65ch] space-y-4 text-[15px] leading-[1.65] text-ink text-pretty lg:text-base">
            {body.split(/\n{2,}/).map((para, index) => (
              <p key={`${index}-${para.slice(0, 24)}`}>{para}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
