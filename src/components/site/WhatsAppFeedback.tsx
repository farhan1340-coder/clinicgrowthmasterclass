import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CtaButton } from "@/components/site/CtaButton";
import wa1 from "@/assets/wa-feedback-1.jpg.asset.json";
import wa2 from "@/assets/wa-feedback-2.jpg.asset.json";
import wa3 from "@/assets/wa-feedback-3.jpg.asset.json";

const SHOTS = [
  { src: wa1.url, alt: "WhatsApp feedback: Course is amazing everyone should enroll" },
  { src: wa2.url, alt: "WhatsApp feedback: Zabardast lagi training Farhan bhai" },
  { src: wa3.url, alt: "WhatsApp feedback: Bohat zabardast aur acha session hua" },
];

export function WhatsAppFeedback() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="bg-hero-deep text-white py-10 md:py-16 relative overflow-hidden">
      {/* subtle green glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.5), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #25D366 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative">
        <div className="text-center mb-8 md:mb-12">
          <div className="text-[11px] md:text-xs tracking-[0.2em] font-semibold text-[#25D366] mb-3">
            REAL ATTENDEE FEEDBACK
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
            What Healthcare Professionals Are Saying
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-xl mx-auto">
            Real WhatsApp feedback from Clinic Growth Masterclass attendees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {SHOTS.map((s) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setOpen(s.src)}
              className="group relative rounded-2xl overflow-hidden bg-black/40 ring-1 ring-white/10 hover:ring-[#25D366]/50 shadow-xl hover:shadow-2xl transition-all duration-300 md:hover:-translate-y-1 cursor-zoom-in"
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="w-full h-auto block max-h-[520px] md:max-h-[600px] object-contain bg-black"
              />
            </button>
          ))}
        </div>

        <p className="text-center text-xs md:text-sm text-white/70 mt-8 md:mt-10 max-w-2xl mx-auto px-2">
          Join doctors, nutritionists, physiotherapists, and clinic owners learning practical patient-growth systems.
        </p>

        <div className="mt-5 md:mt-6 max-w-md mx-auto">
          <CtaButton subtitle="Live on Zoom — limited seats">
            YES! I Want To Join The Next Masterclass
          </CtaButton>
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-md p-2 bg-black border-white/10">
          {open && (
            <img src={open} alt="WhatsApp feedback screenshot" className="w-full h-auto rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
