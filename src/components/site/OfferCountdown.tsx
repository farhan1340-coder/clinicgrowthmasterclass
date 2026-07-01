import { useEffect, useState } from "react";

// Deadline: Friday, July 3, 2026 at 11:59 PM Pakistan Time (UTC+5)
export const OFFER_DEADLINE = new Date("2026-07-03T18:59:00Z");

export function useOfferExpired() {
  const [expired, setExpired] = useState(() => Date.now() >= OFFER_DEADLINE.getTime());
  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => {
      if (Date.now() >= OFFER_DEADLINE.getTime()) setExpired(true);
    }, 1000);
    return () => clearInterval(id);
  }, [expired]);
  return expired;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useTimeLeft() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, OFFER_DEADLINE.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { diff, days, hours, minutes, seconds };
}

type Variant = "hero" | "final" | "compact";

export function OfferCountdown({ variant = "hero" }: { variant?: Variant }) {
  const { diff, days, hours, minutes, seconds } = useTimeLeft();
  const expired = diff <= 0;

  if (expired) {
    return (
      <div className="mx-auto inline-flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-3 text-red-100 font-black uppercase tracking-wider">
        ⛔ Offer Closed
      </div>
    );
  }

  const cells = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const compact = variant === "compact";

  return (
    <div
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-lg border border-sky-400/40 bg-slate-900/60 px-3 py-1.5 text-white shadow-inner"
          : "relative mx-auto max-w-md rounded-2xl border border-sky-400/40 bg-gradient-to-br from-[#0b1530]/90 to-[#070b1c]/90 backdrop-blur-md p-4 md:p-5 shadow-[0_10px_40px_-10px_rgba(56,189,248,0.35)]"
      }
    >
      {!compact && (
        <div className="text-center text-[11px] md:text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
          Offer Ends Friday at 11:59 PM
        </div>
      )}
      <div
        className={
          compact
            ? "flex items-center gap-1 font-mono text-sm font-black tabular-nums"
            : "mt-3 grid grid-cols-4 gap-2 md:gap-3"
        }
      >
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={
              compact
                ? "flex items-baseline gap-0.5"
                : "rounded-xl border border-white/10 bg-white/[0.04] py-2 md:py-3 text-center"
            }
          >
            {compact ? (
              <>
                <span className="text-emerald-300">{pad(c.value)}</span>
                {i < 3 && <span className="text-white/50">:</span>}
              </>
            ) : (
              <>
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums leading-none">
                  {pad(c.value)}
                </div>
                <div className="mt-1 text-[10px] md:text-[11px] uppercase tracking-wider text-white/60">
                  {c.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {!compact && (
        <div className="mt-3 text-center text-[11px] md:text-xs text-white/70">
          Pakistan Standard Time · Only 1 practitioner per specialty
        </div>
      )}
    </div>
  );
}
