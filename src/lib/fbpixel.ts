// Meta Pixel helper (client-only)
export const FB_PIXEL_ID = "766820093140670";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export function fbqTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", event, params);
    }
  } catch (e) {
    console.warn("fbq track failed", e);
  }
}
