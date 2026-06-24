import { Link } from "@tanstack/react-router";

export function Topbar() {
  return (
    <div className="w-full bg-topbar text-white text-xs">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-1.5 sm:py-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
        <Link to="/" className="font-extrabold tracking-widest text-[11px] sm:text-sm border border-white/40 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 leading-tight flex flex-col items-center shrink-0">
          <span>CLINIC&nbsp;GROWTH</span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.25em] font-medium">MASTERCLASS</span>
        </Link>

        <div className="flex flex-col items-end gap-0 leading-tight min-w-0">
          <span className="font-semibold text-[10px] sm:text-xs">Need Help?</span>
          <a href="mailto:Farhanali13440@gmail.com" className="underline text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">Farhanali13440@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
