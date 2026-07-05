import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";

// Cohort date/time is defined in src/lib/cohort.ts (single source of truth).
export { MASTERCLASS_DATE_ISO, MASTERCLASS_DATE_LABEL } from "@/lib/cohort";
import { MASTERCLASS_DATE_ISO } from "@/lib/cohort";


function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

type Props = {
  variant?: "dark" | "light";
  showDateLine?: boolean;
  className?: string;
};

export function MasterclassCountdown({
  variant = "dark",
  showDateLine = true,
  className = "",
}: Props) {
  const target = new Date(MASTERCLASS_DATE_ISO).getTime();
  const [t, setT] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const isDark = variant === "dark";
  const wrap = isDark
    ? "bg-[#0b1735] text-white ring-1 ring-white/10"
    : "bg-white text-[#0b1735] ring-1 ring-[#0b1735]/10 shadow-md";
  const cellBg = isDark
    ? "bg-white/5 ring-1 ring-white/10"
    : "bg-[#0b1735] text-white";
  const labelClr = isDark ? "text-white/70" : "text-white/80";
  const subClr = isDark ? "text-white/70" : "text-[#0b1735]/70";

  const items: [number, string][] = [
    [t.days, "Days"],
    [t.hours, "Hours"],
    [t.minutes, "Minutes"],
    [t.seconds, "Seconds"],
  ];

  return (
    <div className={`rounded-2xl p-4 sm:p-5 ${wrap} ${className}`}>
      {showDateLine && (
        <div className="flex items-center justify-center gap-2 text-center font-bold text-sm sm:text-base">
          <Calendar className="size-4 sm:size-5 text-yellow-300 shrink-0" />
          <span>
            Live Masterclass:{" "}
            <span className="gradient-highlight">12th (Sun) July</span> at{" "}
            <span className="gradient-highlight">5 PM – 8 PM</span> Pakistan Standard Time
          </span>
        </div>
      )}

      <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-2 sm:gap-3">
        {items.map(([val, label]) => (
          <div
            key={label}
            className={`rounded-xl ${cellBg} px-1 py-3 sm:py-4 text-center`}
          >
            <div className="text-2xl sm:text-4xl font-black tabular-nums leading-none">
              {String(val).padStart(2, "0")}
            </div>
            <div className={`mt-1 text-[10px] sm:text-xs uppercase tracking-wider font-bold ${labelClr}`}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <p className={`mt-3 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 ${subClr}`}>
        <Clock className="size-3.5 sm:size-4" />
        Seats are limited. Registration closes when the timer hits zero.
      </p>
    </div>
  );
}
