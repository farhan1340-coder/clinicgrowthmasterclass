import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";

function todayInPakistan(): string {
  // Get current date components in Asia/Karachi timezone
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const parts = fmt.formatToParts(new Date());
  const day = Number(parts.find((p) => p.type === "day")?.value ?? "1");
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const suffix = (d: number) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  return `${day}${suffix(day)} ${month} ${year}`;
}

export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("offerPopupShown") === "1") return;
    const t = setTimeout(() => {
      setDateLabel(todayInPakistan());
      setOpen(true);
      sessionStorage.setItem("offerPopupShown", "1");
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  const handleCta = () => {
    setOpen(false);
    if (location.pathname === "/order") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate({ to: "/order" });
    }
  };

  return (
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

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-5 text-center">
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Enjoy PKR 999 A Little Longer
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3 text-center">
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            After hearing from many doctors and healthcare practitioners, we've decided to keep
            our <span className="font-semibold">Clinic Growth Masterclass</span> at PKR 999 for a
            little longer.
          </p>
          <p className="text-sm text-slate-600">
            Price will adjust to <span className="font-bold">PKR 3,999</span> after the deadline due to the rising costs of managing a high number of students..
            <br />
          </p>

          {/* Price box */}
          <div className="mt-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
            <div className="text-3xl md:text-4xl font-black text-emerald-600">PKR 999</div>
            <div className="mt-1 text-base text-slate-500 line-through">PKR 3,999</div>
            <div className="mt-2 text-sm font-bold text-orange-600">
              Offer ends: {dateLabel}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCta}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-5 shadow-lg transition"
          >
            👉 Secure Your Seat Now
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-center text-xs text-slate-500">
          Clinic Growth Masterclass | 2026 Content
        </div>
      </div>
    </div>
  );
}
