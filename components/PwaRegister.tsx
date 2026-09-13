"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    try {
      const locale = document.documentElement.lang;
      if (/^(nl|en|es|fa)$/.test(locale)) {
        localStorage.setItem("hellolwd.locale", locale);
      }
    } catch {
      /* ignore */
    }
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
  }, []);

  return null;
}
