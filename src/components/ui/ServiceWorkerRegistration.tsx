"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    // Unregister old service workers first
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
      // Then register fresh
      navigator.serviceWorker.register("/sw.js?v=2").catch(() => {});
    });
  }, []);

  return null;
}
