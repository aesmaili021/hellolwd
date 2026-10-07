"use client";

import { useState } from "react";

/** Club crest, or the abbreviation when the image is missing or blocked. */
export function ClubCrest({
  abbr,
  logo,
  ours = false,
  className = "h-10 w-10 text-[11px]",
}: {
  abbr: string;
  logo?: string | null;
  ours?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(logo) && !failed;

  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-white font-black text-brand ${
        ours ? "ring-2 ring-[#F6C400]" : ""
      } ${className}`}
      dir="ltr"
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element -- ESPN crests are not in the image allowlist
        <img
          src={logo!}
          alt=""
          className="h-[70%] w-[70%] object-contain"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        abbr
      )}
    </span>
  );
}
