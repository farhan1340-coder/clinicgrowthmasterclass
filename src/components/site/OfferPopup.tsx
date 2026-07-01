import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DEADLINE_LABEL = "16th June 2026";

export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Desktop: exit-intent OR 45s timer
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobile) return;
    if (sessionStorage.getItem("offerPopupShown") === "1") return;

    const trigger = () => {
      if (sessionStorage.getItem("offerPopupShown") === "1") return;
      setOpen(true);
      sessionStorage.setItem("offerPopupShown", "1");
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseleave", onMouseLeave);
    const timer = setTimeout(trigger, 45000);

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Mobile: sticky bottom bar after 10s
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobile) return;
    if (sessionStorage.getItem("offerBarDismissed") === "1") return;
    const t = setTimeout(() => setShowBar(true), 10000);
    return () => clearTimeout(t);
  }, [isMobile]);

  const goToOrder = () => {
    setOpen(false);
    setShowBar(false);
    // Route every CTA to the Step 1 lead-capture form, not directly to checkout
    if (location.pathname === "/") {
      const el = document.getElementById("lead-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const firstInput = el.querySelector<HTMLInputElement>("input");
        setTimeout(() => firstInput?.focus({ preventScroll: true }), 600);
        return;
      }
    }
    navigate({ to: "/", hash: "lead-form" });
  };


  // Hide sticky bar on the order page
  const showStickyBar = showBar && isMobile && location.pathname !== "/order";

  return (
    <>
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-[90] bg-[#0b1735] text-white border-t-2 border-yellow-400 shadow-2xl px-3 py-2.5 flex items-center gap-2 animate-in slide-in-from-bottom">
          <button
            aria-label="Close"
            onClick={() => {
              setShowBar(false);
              sessionStorage.setItem("offerBarDismissed", "1");
            }}
            className="shrink-0 size-7 grid place-items-center rounded-full bg-white/10 text-white"
          >
            <X className="size-3.5" />
          </button>
          <div className="flex-1 text-[12px] leading-tight font-semibold">
            <div>Live Masterclass: 12 July, 5–8 PM PKT</div>
            <div className="text-yellow-300"><span className="line-through opacity-70 mr-1">Rs. 999</span>Rs. 199 Today</div>
          </div>
          <button
            onClick={goToOrder}
            className="shrink-0 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-[#0b1735] font-extrabold text-sm px-3 py-2 shadow"
          >
            Reserve Seat
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 size-8 grid place-items-center rounded-full bg-white/90 text-slate-700 hover:bg-white shadow z-10"
            >
              <X className="size-4" />
            </button>

            <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-5 text-center">
              <h2 className="text-xl md:text-2xl font-black leading-tight">
                Special PKR 199 Offer
              </h2>
            </div>

            <div className="px-6 py-5 space-y-3 text-center">
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                After hearing from many doctors and healthcare practitioners, we've dropped
                the <span className="font-semibold">Clinic Growth Masterclass</span> to just PKR 199
                for a limited time.
              </p>
              <p className="text-sm text-slate-600">
                Price will adjust to <span className="font-bold">PKR 999</span> after the deadline due to the rising costs of managing a high number of students..
              </p>

              <div className="mt-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                <div className="text-3xl md:text-4xl font-black text-emerald-600">PKR 199</div>
                <div className="mt-1 text-base text-slate-500 line-through">Original: PKR 999</div>
                <div className="mt-2 text-sm font-bold text-orange-600">
                  Early-bird Rs. 199 offer ends: {DEADLINE_LABEL}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Live Masterclass: Sunday, 12th July 2026, 5:00 PM – 8:00 PM PKT
                </div>
              </div>

              <button
                onClick={goToOrder}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-5 shadow-lg transition"
              >
                👉 Secure Your Seat Now
              </button>
            </div>

            <div className="px-6 pb-4 text-center text-xs text-slate-500">
              Clinic Growth Masterclass | 2026 Content
            </div>
          </div>
        </div>
      )}
    </>
  );
}
