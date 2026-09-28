import Script from "next/script";

// Google Analytics 4 measurement ID (public by design; it identifies the property, not a secret).
const GA_ID = "G-CSC26DCGT1";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 event; a no-op in development or if GA hasn't loaded. */
export function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.("event", event, params);
}

/** Loads gtag after the page is interactive. Production builds only, so local dev visits aren't counted. */
export function Analytics() {
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
    </>
  );
}
