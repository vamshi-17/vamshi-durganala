"use client";

import { useEffect } from "react";
import Script from "next/script";
import { visitSource } from "@/lib/visit-source";

// Both IDs are public by design: they say where to send counts, they don't grant access to the dashboards.
// Google Analytics 4 property.
const GA_ID = "G-CSC26DCGT1";
// GoatCounter site code → dashboard at https://<code>.goatcounter.com. Empty disables GoatCounter.
const GOATCOUNTER_CODE = "vamshi-durganala";

type GoatCounterCount = { path: string; title?: string; referrer?: string; event?: boolean };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    goatcounter?: { count?: (vars: GoatCounterCount) => void };
  }
}

// Captured when this module first runs — before RouteSync rewrites the URL while the reader scrolls, which would drop
// `?ref=` and change the path. So a visit is counted as the page it actually landed on, with its tagged source.
const landing =
  typeof window === "undefined" ? null : { path: window.location.pathname, search: window.location.search };

/** A GoatCounter event (listed separately from page views in the dashboard). */
export function countEvent(name: string) {
  window.goatcounter?.count?.({ path: name, title: name, event: true });
}

/** Sends a custom event to GA4 and GoatCounter; a no-op in development or if neither has loaded. */
export function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.("event", event, params);
  const detail = params ? Object.values(params).map((v) => String(v).replace(/^\/+/, "")).join("/") : "";
  countEvent(detail ? `${event}/${detail}` : event);
}

/** One GoatCounter page view per visit: the landing page, attributed to `?ref=`/`utm_source` when tagged. */
function countVisit() {
  if (!landing) return;
  const source = visitSource(landing.search);
  window.goatcounter?.count?.({ path: landing.path, ...(source ? { referrer: source } : {}) });
}

/**
 * Résumé downloads and clicks out to LinkedIn/GitHub, from any link on the page. GoatCounter only: GA4's enhanced
 * measurement already records file downloads and outbound clicks itself.
 */
function useLinkEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href) return;
      if (href.toLowerCase().endsWith(".pdf")) return countEvent("resume-download");
      if (/^https?:\/\//.test(href)) {
        const host = new URL(href).hostname;
        if (host !== window.location.hostname) countEvent(`outbound/${host}`);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

/** Loads analytics after the page is interactive. Production builds only, so local dev visits aren't counted. */
export function Analytics() {
  useLinkEvents();
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      {GOATCOUNTER_CODE && (
        <Script
          src="https://gc.zgo.at/count.js"
          strategy="afterInteractive"
          data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
          // We count ourselves (countVisit) so the landing page and ?ref= are captured before the URL changes.
          data-goatcounter-settings='{"no_onload": true}'
          onLoad={countVisit}
        />
      )}
    </>
  );
}
