"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [note, setNote] = useState("");

  return (
    <form
      className="flex min-w-0 flex-1 flex-col gap-2 lg:max-w-[440px]"
      onSubmit={(event) => {
        event.preventDefault();
        setNote(t("notOpen"));
      }}
    >
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          {t("email")}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("placeholder")}
          className="min-h-12 min-w-0 flex-1 rounded-[10px] border border-line bg-paper px-3 text-sm text-ink"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-extrabold whitespace-nowrap text-white"
        >
          {t("subscribe")}
        </button>
      </div>
      {note ? (
        <p role="status" className="text-[13px] font-semibold text-navy">
          {note}
        </p>
      ) : null}
    </form>
  );
}
