import { Phone, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Topbar() {
  return (
    <div className="w-full bg-topbar text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
        <div className="hidden">
          <div className="flex items-center gap-2 font-semibold">
            <Phone className="size-4" />
            <span>Call Farhan Directly:</span>
          </div>
          <a href="tel:+923390057379" className="underline font-bold">+92 339 0057379</a>
        </div>
        
        <Link to="/" className="font-extrabold tracking-widest text-base md:text-lg border border-white/40 rounded px-3 py-2 leading-tight flex flex-col items-center">
          <span>CLINIC&nbsp;GROWTH</span>
          <span className="text-[10px] tracking-[0.25em] font-medium">MASTERCLASS</span>
        </Link>
        
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="size-4" />
            <span>Need Help?</span>
          </div>
          <a href="mailto:Farhanali13440@gmail.com" className="underline">Farhanali13440@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
