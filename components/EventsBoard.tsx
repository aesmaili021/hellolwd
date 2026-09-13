"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { readSavedEventIds, SAVED_EVENTS_KEY } from "@/lib/saved-events";

const SYNC = "hellolwd-saved-events";

type SavedEventsState = {
  saved: string[];
  savedOnly: boolean;
  setSavedOnly: (value: boolean | ((on: boolean) => boolean)) => void;
};

const SavedEventsContext = createContext<SavedEventsState | null>(null);

function useSavedEvents() {
  const value = useContext(SavedEventsContext);
  if (!value) throw new Error("SavedEventsProvider missing");
  return value;
}

export function EventsBoard({
  ids,
  filters,
  aside,
  children,
}: {
  ids: string[];
  filters: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations("events");
  const filtersT = useTranslations("filters");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const value = useMemo(
    () => ({ saved, savedOnly, setSavedOnly }),
    [saved, savedOnly],
  );

  useEffect(() => {
    const sync = () => setSaved(readSavedEventIds());
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
  }, []);

  return (
    <SavedEventsContext.Provider value={value}>
      <nav
        aria-label={filtersT("events")}
        className="-mx-4 mb-6 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:mb-7 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max flex-nowrap gap-2 lg:flex-wrap">
          {filters}
          <li>
            <button
              type="button"
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly((on) => !on)}
              className={`inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-full px-3.5 text-[13px] ${
                savedOnly
                  ? "bg-accent font-extrabold text-paper"
                  : "bg-wash font-semibold text-ink hover:text-navy"
              }`}
            >
              {t("saved")}
              {saved.length > 0 ? (
                <span className="ms-1.5 tabular-nums" aria-hidden>
                  {saved.length}
                </span>
              ) : null}
              {savedOnly ? (
                <span className="ms-1.5" aria-hidden>
                  ✕
                </span>
              ) : null}
            </button>
          </li>
        </ul>
      </nav>
      {savedOnly && ids.filter((id) => saved.includes(id)).length === 0 ? (
        <SavedEmptyNotice />
      ) : (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {children}
          {!savedOnly ? aside : null}
        </section>
      )}
    </SavedEventsContext.Provider>
  );
}

export function SavedEventSlot({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { saved, savedOnly } = useSavedEvents();
  if (savedOnly && !saved.includes(id)) return null;
  return children;
}

function SavedEmptyNotice() {
  const t = useTranslations("events");
  return (
    <div className="mt-2 flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-line px-5 py-10 text-center">
      <h2 className="max-w-[24ch] text-[19px] font-extrabold leading-snug text-navy">
        {t("emptySaved")}
      </h2>
      <p className="max-w-[40ch] text-sm leading-relaxed text-muted">{t("emptySavedBody")}</p>
    </div>
  );
}
