"use client";

import { useEffect, useState } from "react";

function currentTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={theme === "dark"}
      onClick={() => {
        const next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
        document.cookie = `theme=${next};path=/;max-age=31536000;samesite=lax`;
        setTheme(next);
      }}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-wash text-navy transition-colors duration-200 ease-out hover:text-primary"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="currentColor"
            d="M12 4.5a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H12.75A.75.75 0 0112 4.5zm0 15a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H12.75A.75.75 0 0112 19.5zM4.5 12a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12zm15 0a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H20.25A.75.75 0 0119.5 12zM6.4 6.4a.75.75 0 011.06 0l.01.01a.75.75 0 11-1.06 1.06L6.4 7.46a.75.75 0 010-1.06zm10.13 10.13a.75.75 0 011.06 0l.01.01a.75.75 0 11-1.06 1.06l-.01-.01a.75.75 0 010-1.06zM17.6 6.4a.75.75 0 010 1.06l-.01.01a.75.75 0 11-1.06-1.06l.01-.01a.75.75 0 011.06 0zM7.47 16.53a.75.75 0 010 1.06l-.01.01a.75.75 0 11-1.06-1.06l.01-.01a.75.75 0 011.06 0zM12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="currentColor"
            d="M16.5 13.2A6.7 6.7 0 0110.8 7.5 5.5 5.5 0 1016.5 13.2z"
          />
        </svg>
      )}
    </button>
  );
}
