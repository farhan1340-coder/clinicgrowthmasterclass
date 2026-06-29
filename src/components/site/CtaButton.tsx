import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";


export function CtaButton({
  children,
  subtitle,
  targetId = "lead-form",
}: {
  children: ReactNode;
  subtitle?: string;
  targetId?: string;
  /** @deprecated kept for backward compatibility — buttons now always route to the lead form */
  to?: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof document === "undefined") return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Focus the first input for a smooth keyboard flow
      const firstInput = el.querySelector<HTMLInputElement>("input");
      setTimeout(() => firstInput?.focus({ preventScroll: true }), 600);
    } else {
      // Fallback — go to home page anchor
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick} className="block w-full">
      <div className="btn-cta w-full px-6 py-4 text-center">
        <div className="text-xl md:text-2xl inline-flex items-center justify-center gap-2">
          <span>{children}</span>
          <ArrowRight className="btn-cta-arrow size-5 md:size-6" aria-hidden="true" />
        </div>
        {subtitle && (
          <div className="text-xs md:text-sm font-medium normal-case tracking-normal opacity-95 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </a>
  );
}
