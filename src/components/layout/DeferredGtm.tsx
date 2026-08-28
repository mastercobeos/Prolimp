"use client";

import { useEffect } from "react";

type Props = { id: string };

const WAKE_EVENTS = ["pointerdown", "touchstart", "keydown", "scroll", "mousemove"] as const;
// Visitors who never interact still get tracked after this delay.
const FALLBACK_MS = 8000;

type WindowWithDataLayer = Window & { dataLayer?: unknown[] };

/**
 * Loads Google Tag Manager on the first user interaction (or after a fallback
 * timeout) instead of right after hydration. GTM pulls GA4, Google Ads and the
 * Facebook Pixel, which together block the main thread for ~2 s on mobile and
 * were the largest cost in the Lighthouse total-blocking-time budget.
 * `dataLayer` is created immediately so pushes made before GTM loads are queued.
 */
export function DeferredGtm({ id }: Props) {
  useEffect(() => {
    const w = window as WindowWithDataLayer;
    w.dataLayer = w.dataLayer || [];

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, load));
      w.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
      document.head.appendChild(script);
    };

    WAKE_EVENTS.forEach((e) => window.addEventListener(e, load, { passive: true }));
    const timer = window.setTimeout(load, FALLBACK_MS);
    return () => {
      window.clearTimeout(timer);
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, load));
    };
  }, [id]);

  return null;
}
