export const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb8sAOEGehEE9yFGor2F";

export const WHATSAPP_DISMISS_KEY = "hellolwd.whatsapp.dismissed";

type Gtag = (
  command: "event",
  name: "whatsapp_click",
  params: { placement: string },
) => void;

/** Queue a GA4 event. Matches the gtag stub so it still lands if the script is late. */
export function trackWhatsAppClick(placement: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[]; gtag?: Gtag };
  w.dataLayer = w.dataLayer ?? [];
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag() {
      // gtag.js reads the Arguments object from this stub.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer?.push(arguments);
    } as unknown as Gtag;
  }
  w.gtag("event", "whatsapp_click", { placement });
}
