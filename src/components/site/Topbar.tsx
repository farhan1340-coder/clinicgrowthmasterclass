import { Phone, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Topbar() {
  return (
    <div className="w-full bg-topbar text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <Phone className="size-4" />
          <span>Call Farhan Directly: <a href="tel:+923390057379" className="underline">+92 339 0057379</a></span>
        </div>
        <Link to="/" className="font-extrabold tracking-widest text-base md:text-lg border border-white/40 rounded px-3 py-1">
          CLINIC&nbsp;GROWTH<span className="block text-[10px] tracking-[0.25em] font-medium">MASTERCLASS</span>
        </Link>
        <div className="flex items-center gap-2">
          <Mail className="size-4" />
          <span className="font-semibold">Need Help?</span>
          <a href="mailto:Farhanali13440@gmail.com" className="underline">Farhanali13440@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
