import payEasypaisa from "@/assets/proof/pay-easypaisa-1999.jpg.asset.json";
import payMcb from "@/assets/proof/pay-mcb-1000.jpg.asset.json";
import payAlbaraka from "@/assets/proof/pay-albaraka-999.jpg.asset.json";
import textKhalid from "@/assets/proof/text-khalid.jpg.asset.json";
import textDanish from "@/assets/proof/text-danish.jpg.asset.json";
import textChavid from "@/assets/proof/text-chavid.jpg.asset.json";
import textAlii from "@/assets/proof/text-alii.jpg.asset.json";
import textAhmadMunir from "@/assets/proof/text-ahmad-munir.jpg.asset.json";
import textThankyou from "@/assets/proof/text-thankyou.jpg.asset.json";
import textTanveer from "@/assets/proof/text-tanveer.jpg.asset.json";

type Proof = { url: string; kind: "text" | "payment"; alt: string };

// Alternating text → payment → text → payment ...
const PROOFS: Proof[] = [
  { url: textKhalid.url, kind: "text", alt: "WhatsApp feedback: Course is amazing, everyone should enroll" },
  { url: payEasypaisa.url, kind: "payment", alt: "Easypaisa payment proof Rs. 1,999" },
  { url: textDanish.url, kind: "text", alt: "WhatsApp feedback from Danish: Zabardast lagi training" },
  { url: payMcb.url, kind: "payment", alt: "MCB Live payment proof PKR 1,000" },
  { url: textChavid.url, kind: "text", alt: "WhatsApp feedback: Bohot zabardast session" },
  { url: payAlbaraka.url, kind: "payment", alt: "alBaraka Bank fund transfer proof PKR 999" },
  { url: textAlii.url, kind: "text", alt: "WhatsApp feedback from Ali: Amazing session, useful tips" },
  { url: textAhmadMunir.url, kind: "text", alt: "WhatsApp feedback from Ahmad Munir: Session was amazing" },
  { url: textThankyou.url, kind: "text", alt: "Messenger feedback: Session was outstanding, worth thousands of rupees" },
  { url: textTanveer.url, kind: "text", alt: "WhatsApp feedback from Tanveer Ahmad: Way of teaching is excellent" },
];

function ProofCard({ p }: { p: Proof }) {
  const badge = p.kind === "payment" ? "Payment Proof" : "Feedback";
  const badgeClass =
    p.kind === "payment"
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
      : "bg-sky-500/15 text-sky-300 ring-sky-400/30";
  return (
    <div className="snap-start shrink-0 w-[260px] sm:w-[280px] md:w-[300px] rounded-2xl bg-[oklch(0.18_0.04_270)] ring-1 ring-white/10 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ring-1 ${badgeClass}`}>
          {badge}
        </span>
        <span className="text-[10px] text-white/50">Verified</span>
      </div>
      <div className="bg-black/30 flex items-center justify-center p-2">
        <img
          src={p.url}
          alt={p.alt}
          loading="lazy"
          className="w-full h-[380px] sm:h-[420px] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}

export function ProofGallery() {
  return (
    <section className="py-14 md:py-20 bg-[oklch(0.13_0.06_275)] text-white">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="font-bold uppercase text-xs tracking-widest text-[oklch(0.82_0.18_80)]">
          Real Proof Gallery
        </p>
        <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">
          More Real Reviews From{" "}
          <span className="text-[oklch(0.82_0.18_80)]">Masterclass Attendees</span>
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/70 max-w-2xl mx-auto">
          Feedback, payment proofs, and real responses from doctors and healthcare practitioners who joined the Clinic Growth Masterclass.
        </p>
      </div>

      {/* Horizontal scroll strip */}
      <div className="mt-10 group relative">
        <div
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory px-4 md:px-10 pb-6 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {PROOFS.map((p, i) => (
            <ProofCard key={i} p={p} />
          ))}
          <div className="shrink-0 w-4" aria-hidden />
        </div>
        <p className="mt-2 text-center text-xs text-white/50 md:hidden">← swipe to see more →</p>
      </div>
    </section>
  );
}

export default ProofGallery;
