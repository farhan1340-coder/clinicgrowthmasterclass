import { Link } from "@tanstack/react-router";

export function Topbar() {
  return (
    <div className="w-full bg-topbar text-white text-xs">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-row items-center justify-between gap-3 text-center">
        <Link to="/" className="font-extrabold tracking-widest text-sm border border-white/40 rounded px-2 py-1 leading-tight flex flex-col items-center">
          <span>CLINIC&nbsp;GROWTH</span>
          <span className="text-[9px] tracking-[0.25em] font-medium">MASTERCLASS</span>
        </Link>

        <div className="flex flex-col items-end sm:items-center gap-0 leading-tight">
          <span className="font-semibold">Need Help?</span>
          <a href="mailto:Farhanali13440@gmail.com" className="underline text-[11px] sm:text-xs break-all">Farhanali13440@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
