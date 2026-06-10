import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function CtaButton({
  children,
  subtitle,
  to = "/order",
}: {
  children: ReactNode;
  subtitle?: string;
  to?: string;
}) {
  return (
    <Link to={to} className="block w-full">
      <div className="btn-cta w-full px-6 py-4 text-center">
        <div className="text-xl md:text-2xl">{children}</div>
        {subtitle && <div className="text-xs md:text-sm font-medium normal-case tracking-normal opacity-95 mt-1">{subtitle}</div>}
      </div>
    </Link>
  );
}
