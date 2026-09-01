"use client";

import { useEffect, useState } from "react";

export function ImageField({
  currentUrl,
}: {
  currentUrl?: string | null;
}) {
  const [preview, setPreview] = useState(currentUrl ?? "");

  useEffect(() => {
    setPreview(currentUrl ?? "");
  }, [currentUrl]);

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase">
        Photo
      </span>
      {preview ? (
        <img src={preview} alt="" className="mb-3 h-40 w-full rounded-lg object-cover" />
      ) : null}
      <input
        name="image"
        type="file"
        aria-label="Upload photo"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="w-full text-sm text-navy file:me-3 file:min-h-10 file:cursor-pointer file:rounded-full file:border-0 file:bg-ice file:px-4 file:text-[12px] file:font-extrabold file:text-navy"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setPreview((prev) => {
            if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
            return url;
          });
        }}
      />
      <input type="hidden" name="image_url" value={currentUrl ?? ""} />
      <label className="mt-3 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase" htmlFor="image_link">
        Or image URL
      </label>
      <input
        id="image_link"
        name="image_link"
        type="url"
        defaultValue=""
        placeholder="https://"
        className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm text-navy outline-none"
      />
    </div>
  );
}
