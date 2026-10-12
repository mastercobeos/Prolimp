export type CookieConsent = "accepted" | "rejected";

const STORAGE_KEY = "prolimp-cookies-consent";

export const CONSENT_EVENT = "cookie-consent";
export const BANNER_SELECTOR = "[data-cookie-banner]";

export function readConsent(): CookieConsent | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "accepted" || saved === "rejected" ? saved : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
  window.dispatchEvent(new CustomEvent<CookieConsent>(CONSENT_EVENT, { detail: value }));
}
