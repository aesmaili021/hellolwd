"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  readSavedEventIds,
  SAVED_EVENTS_KEY,
  toggleSavedEventId,
} from "@/lib/saved-events";

const SYNC = "hellolwd-saved-events";

function emit() {
  window.dispatchEvent(new Event(SYNC));
}

export function SaveEventButton({ id }: { id: string }) {
  const t = useTranslations("events");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readSavedEventIds().includes(id));
    sync();
    window.addEventListener(SYNC, sync);
    const onStorage = (event: StorageEvent) => {
      if (event.key === SAVED_EVENTS_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SYNC, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [id]);

  const onToggle = useCallback(() => {
    setSaved(toggleSavedEventId(id).includes(id));
    emit();
  }, [id]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t("unsave") : t("save")}
      onClick={onToggle}
      className={`absolute end-2.5 top-2.5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm ${
        saved
          ? "border-accent bg-accent text-paper"
          : "border-paper/30 bg-brand/55 text-paper hover:bg-brand/80"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M12 20.2 4.8 13a4.4 4.4 0 0 1 6.2-6.2L12 7.8l1 1a4.4 4.4 0 0 1 6.2 6.2z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
