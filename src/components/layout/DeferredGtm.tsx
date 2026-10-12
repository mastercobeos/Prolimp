"use client";

import { useEffect } from "react";
import {
  BANNER_SELECTOR,
  CONSENT_EVENT,
  readConsent,
  type CookieConsent,
} from "./cookieConsent";

type Props = { id: string };

const WAKE_EVENTS = ["pointerdown", "touchstart", "keydown", "scroll", "mousemove"] as const;
// Visitors who never interact still get tracked after this delay.
const FALLBACK_MS = 8000;

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

type WindowWithDataLayer = Window & { dataLayer?: unknown[] };

/**
 * Loads Google Tag Manager on the first user interaction (or after a fallback
 * timeout) instead of right after hydration. GTM pulls GA4, Google Ads and the
 * Facebook Pixel, which together block the main thread for ~2 s on mobile and
 * were the largest cost in the Lighthouse total-blocking-time budget.
 * `dataLayer` is created immediately so pushes made before GTM loads are queued.
 *
 * Never loads once the visitor rejected cookies. While the banner is still
 * unanswered, interactions with the banner itself (and bare mouse movement,
 * which is how the pointer reaches it) do not count as a wake-up, so
 * "Rechazar" can win the race.
 */
export function DeferredGtm({ id }: Props) {
  useEffect(() => {
    if (readConsent() === "rejected") return;

    const w = window as WindowWithDataLayer;
    w.dataLayer = w.dataLayer || [];

    // Consent Mode commands must reach dataLayer as an `arguments` object.
    const gtag: (...args: unknown[]) => void = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };

    let loaded = false;
    const stopWaiting = () => {
      window.clearTimeout(timer);
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake));
    };
    const load = () => {
      if (loaded) return;
      loaded = true;
      stopWaiting();
      w.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
      document.head.appendChild(script);
    };
    const wake = (e: Event) => {
      if (readConsent() === null) {
        if (e.type === "mousemove") return;
        if (e.target instanceof Element && e.target.closest(BANNER_SELECTOR)) return;
      }
      load();
    };
    const onConsent = (e: Event) => {
      if ((e as CustomEvent<CookieConsent>).detail === "accepted") return load();
      stopWaiting();
      if (loaded) gtag("consent", "update", DENIED);
    };

    WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    window.addEventListener(CONSENT_EVENT, onConsent);
    const timer = window.setTimeout(load, FALLBACK_MS);
    return () => {
      stopWaiting();
      window.removeEventListener(CONSENT_EVENT, onConsent);
    };
  }, [id]);

  return null;
}
