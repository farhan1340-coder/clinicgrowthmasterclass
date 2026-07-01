import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Upload,
  X,
  ArrowRight,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { fbqTrack } from "@/lib/fbpixel";
import { createScreenshotSignedUrl } from "@/lib/payment-screenshot.functions";
import { submitPatientAcquisitionOrder } from "@/lib/patient-acquisition.functions";
import offerStackAsset from "@/assets/pam/offer-stack.png.asset.json";
import systemDiagramAsset from "@/assets/pam/system-diagram.png.asset.json";
import gbpAsset from "@/assets/pam/gbp.png.asset.json";
import guaranteeAsset from "@/assets/pam/guarantee.png.asset.json";

export const Route = createFileRoute("/patient-acquisition-machine")({
  head: () => ({
    meta: [
      { title: "Patient Acquisition Machine™ — Special Offer for Healthcare Practitioners" },
      {
        name: "description",
        content:
          "Get your complete Patient Acquisition Machine™ built for you for only PKR 25,000 today (regularly PKR 75,000). Only ONE practitioner per specialty accepted.",
      },
      { property: "og:title", content: "Patient Acquisition Machine™ — PKR 25,000 Special Offer" },
      {
        property: "og:description",
        content:
          "Complete done-for-you patient acquisition system for doctors, dentists, nutritionists & healthcare practitioners in Pakistan.",
      },
      { property: "og:image", content: offerStackAsset.url },
    ],
  }),
  component: PatientAcquisitionPage,
});

const SPECIALTIES = [
  "Dentist",
  "General Practitioner",
  "Physician",
  "Gynecologist",
  "Child Specialist",
  "Nutritionist / Dietitian",
  "Psychologist",
  "Eye Specialist",
  "Aesthetic Physician",
  "Physiotherapist",
  "Other Healthcare Practitioner",
];

const OFFER_STACK = [
  { title: "Low-Ticket Irresistible Offer Creation", value: 8000 },
  { title: "High-Ticket Premium Service Creation", value: 8000 },
  { title: "High-Converting Sales Page", value: 10000 },
  { title: "Order Bumps Setup", value: 4000 },
  { title: "WhatsApp & Email Follow-Up Automation", value: 7000 },
  { title: "Meta Ads Setup, Run & Management", value: 12000 },
  { title: "Google Business Profile Setup & Optimization", value: 6000 },
  { title: "30–50 Days Google Business Profile Local SEO Work", value: 10000 },
  { title: "Patient Journey / Awareness Bridge", value: 5000 },
  { title: "Lead Tracking & Conversion System", value: 5000 },
];

const PAYMENT_ACCOUNTS = {
  easypaisa: { label: "Easypaisa", name: "Farhan Ali Rasheed", account: "03135944817" },
  jazzcash: { label: "JazzCash", name: "Farhan Ali Rasheed", account: "03135944817" },
} as const;
type PayMethod = keyof typeof PAYMENT_ACCOUNTS;

const PRICE = 25000;
const REGULAR_PRICE = 75000;
const PRICE_LABEL = "PKR 25,000";


function PatientAcquisitionPage() {
  const [open, setOpen] = useState(false);
  const pixelPageViewFired = useRef(false);

  useEffect(() => {
    if (pixelPageViewFired.current) return;
    pixelPageViewFired.current = true;
    fbqTrack("PageView");
  }, []);

  function openOrder() {
    setOpen(true);
    fbqTrack("InitiateCheckout", {
      value: PRICE,
      currency: "PKR",
      content_name: "Patient Acquisition Machine",
    });
  }

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.04_265)] text-white">
      <Topbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[oklch(0.18_0.06_265)] to-[oklch(0.12_0.05_265)]">
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,oklch(0.55_0.2_260),transparent_50%),radial-gradient(circle_at_80%_30%,oklch(0.55_0.18_20),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5" /> Special Testimonial Offer
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            An Irresistible Offer for Doctors, Dentists, Nutritionists & Healthcare Practitioners{" "}
            <span className="text-yellow-300">You Simply Can't Refuse</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
            I'll personally help you build your complete{" "}
            <span className="font-bold text-white">Patient Acquisition Machine™</span> for only{" "}
            <span className="font-black text-yellow-300">PKR 25,000 today</span> instead of PKR
            75,000 — backed by our <span className="font-bold">Iron-Clad 100% Money-Back Guarantee</span>.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <button
              onClick={openOrder}
              className="btn-cta inline-flex items-center gap-2 px-7 py-4 text-base md:text-lg rounded-xl shadow-2xl shadow-yellow-500/20"
            >
              Claim My Specialty Slot Now
              <ArrowRight className="btn-cta-arrow size-5" />
            </button>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-500/15 border border-red-400/40 text-red-100 px-3 py-2 text-sm font-semibold">
            ⚠ Only ONE practitioner from each specialty will be accepted.
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-10">
          <h2 className="text-2xl md:text-4xl font-black text-center">Why I'm Doing This</h2>
          <p className="mt-4 text-white/85 text-center max-w-3xl mx-auto leading-relaxed">
            Normally, implementing your complete Patient Acquisition Machine™ costs{" "}
            <span className="font-bold">PKR 75,000</span>. But right now, I'm collecting real
            success stories and video testimonials from different healthcare specialties across
            Pakistan — so I'm offering it at{" "}
            <span className="font-bold text-yellow-300">implementation cost only</span>.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-sm uppercase tracking-widest text-white/60">Regular Investment</div>
              <div className="mt-2 text-3xl md:text-4xl font-black text-white/70 line-through">
                PKR 75,000
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-yellow-400/20 border-2 border-yellow-300/50 p-6 text-center">
              <div className="text-sm uppercase tracking-widest text-yellow-200">Today's Special Price</div>
              <div className="mt-2 text-3xl md:text-4xl font-black text-yellow-300">PKR 25,000</div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALTY SCARCITY */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-4xl font-black text-center">
          Only <span className="text-yellow-300">1 Slot Per Specialty</span>
        </h2>
        <p className="text-center text-white/80 mt-3 max-w-2xl mx-auto">
          Once a specialty is taken, this offer closes for that category — permanently.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SPECIALTIES.map((s) => (
            <div
              key={s}
              className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            >
              <Stethoscope className="size-5 text-yellow-300 shrink-0" />
              <span className="font-semibold">1 × {s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ADS DON'T FAIL */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[oklch(0.22_0.06_265)] to-[oklch(0.16_0.06_265)] border border-white/10 p-6 md:p-10">
          <h2 className="text-2xl md:text-4xl font-black">
            Ads Don't Fail. <span className="text-yellow-300">Incomplete Systems Fail.</span>
          </h2>
          <div className="mt-6 space-y-4 text-white/85 leading-relaxed text-[15px] md:text-base">
            <p>
              Many doctors, nutritionists, psychologists, and healthcare practitioners I've spoken
              to during 1-on-1 strategy sessions told me the same thing:
            </p>
            <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-white">
              "Farhan, I've already tried Facebook and Instagram Ads… they didn't work."
            </blockquote>
            <p>Recently, a psychologist from Rawalpindi told me:</p>
            <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-white">
              "Tell me something other than ads. I don't like Facebook Ads because they don't work for me."
            </blockquote>
            <p className="font-bold text-white">But the reality is: Ads aren't the problem.</p>
            <p>
              The problem is that most healthcare practitioners are only running ads{" "}
              <span className="font-bold">without a complete system.</span> They don't have:
            </p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {[
                "A low-ticket offer that attracts patients",
                "A high-converting sales page",
                "A proper patient acquisition funnel",
                "Automated WhatsApp/email follow-up",
                "A complete Patient Acquisition Machine™",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <X className="size-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p>So they run ads, hope, pray, and wait for patients to book.</p>
            <p className="text-lg font-bold text-yellow-300">
              That is not a system. That is gambling.
            </p>
            <p>
              A proper Patient Acquisition Machine™ removes the element of hoping and praying by
              giving patients a complete journey from{" "}
              <span className="font-semibold">awareness → purchase → follow-up → high-ticket conversion.</span>
            </p>
          </div>

          {/* System diagram — how the machine works */}
          <div className="mt-10 rounded-2xl bg-white/[0.03] border border-white/10 p-3 md:p-5 shadow-2xl shadow-black/40">
            <img
              src={systemDiagramAsset.url}
              alt="Patient Acquisition Machine system diagram — Low-ticket offer → Sales page → Meta ads → Buyers → WhatsApp & Email follow-up → High-ticket patients → Reinvest → Repeat & scale"
              loading="lazy"
              className="w-full h-auto rounded-xl block"
            />
          </div>
        </div>
      </section>

      {/* WHAT IS PAM */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-black">
            What Exactly Is The <span className="text-yellow-300">Patient Acquisition Machine™</span>?
          </h2>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto leading-relaxed">
            It's a complete, done-for-you growth system — not just ads, not just a website, not just
            SEO. Every piece is built and connected for you so patients flow in consistently.
          </p>
        </div>

        {/* Offer stack centerpiece image */}
        <div className="mt-10 rounded-3xl bg-white/[0.04] border border-white/10 p-3 md:p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
          <img
            src={offerStackAsset.url}
            alt="Patient Acquisition Machine™ complete offer stack — done-for-you implementation"
            loading="lazy"
            className="w-full h-auto rounded-2xl block"
          />
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto text-white/85">
          <p className="rounded-xl bg-white/5 border border-white/10 p-4">
            <span className="font-bold text-white">Not</span> just Facebook Ads.
          </p>
          <p className="rounded-xl bg-white/5 border border-white/10 p-4">
            <span className="font-bold text-white">Not</span> just a website.
          </p>
          <p className="rounded-xl bg-white/5 border border-white/10 p-4">
            <span className="font-bold text-white">Not</span> just Google Business Profile.
          </p>
          <p className="rounded-xl bg-yellow-400/10 border border-yellow-300/30 p-4 text-white">
            A <span className="font-bold">complete patient-generating system</span> that works together.
          </p>
        </div>
      </section>

      {/* OFFER STACK */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="rounded-3xl bg-gradient-to-br from-yellow-500/10 to-emerald-500/10 border-2 border-yellow-300/40 p-6 md:p-10">
          <div className="text-center">
            <div className="inline-block rounded-full bg-yellow-400/20 border border-yellow-300/40 px-4 py-1 text-xs font-black uppercase tracking-widest text-yellow-200">
              Complete Offer Stack
            </div>
            <h2 className="mt-3 text-2xl md:text-4xl font-black">
              Everything Included In Your Patient Acquisition Machine™
            </h2>
          </div>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {OFFER_STACK.map((s) => (
              <li
                key={s.title}
                className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/10 px-4 py-3 shadow-lg shadow-black/20"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-sm md:text-base break-words">{s.title}</span>
                </div>
                <span className="text-xs md:text-sm text-white/60 whitespace-nowrap shrink-0">
                  PKR {s.value.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-center">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="text-xs uppercase tracking-widest text-white/60">Total Value</div>
              <div className="mt-1 text-2xl md:text-3xl font-black text-white/70 line-through">
                PKR {REGULAR_PRICE.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl bg-yellow-400/15 border-2 border-yellow-300/50 p-5">
              <div className="text-xs uppercase tracking-widest text-yellow-200">Today's Price</div>
              <div className="mt-1 text-2xl md:text-3xl font-black text-yellow-300">
                PKR {PRICE.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={openOrder}
              className="btn-cta inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg rounded-xl"
            >
              Claim My Specialty Slot Now
              <ArrowRight className="btn-cta-arrow size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* GBP */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black">
            Dominate Your Local Area With <span className="text-yellow-300">Google Business Profile</span>
          </h2>
          <p className="mt-4 text-white/85 leading-relaxed">
            We set up and optimize your Google Business Profile, then keep working on it for the
            next <span className="font-bold">30–50 days</span> with local SEO — maximizing your
            chances of ranking in the <span className="font-bold">Top 3 Map results</span> in your city.
          </p>
        </div>

        <div className="mt-10 rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
          <img
            src={gbpAsset.url}
            alt="Dominate your local area with Google Business Profile — top 3 rankings, more calls, more appointments, more patients"
            loading="lazy"
            className="w-full h-auto block"
          />
        </div>

        <ul className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-white/85">
          {["Best Dentist Near Me", "Gynecologist in Lahore", "Nutritionist in Islamabad"].map(
            (x) => (
              <li
                key={x}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
              >
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" /> "{x}"
              </li>
            ),
          )}
        </ul>
      </section>

      {/* SIMPLE MATH */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-10">
          <h2 className="text-2xl md:text-4xl font-black text-center">The Simple Math</h2>
          <p className="mt-4 text-white/85 text-center max-w-3xl mx-auto leading-relaxed">
            If <span className="font-bold text-white">100 people</span> buy your introductory offer,
            and even <span className="font-bold text-white">15–20 upgrade</span> to your high-ticket
            service worth PKR 10,000, that can generate{" "}
            <span className="font-black text-yellow-300">PKR 150,000 – 200,000</span> in revenue.
          </p>
          <p className="mt-4 text-white/70 text-center max-w-2xl mx-auto">
            The low-ticket offer helps fund your advertising, so you are{" "}
            <span className="font-bold text-white">not constantly paying for ads out of your own pocket.</span>
          </p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 to-yellow-400/10 border-2 border-emerald-400/40 p-6 md:p-10 text-center">
          <div className="mx-auto max-w-xs">
            <PlaceholderImage label="Iron-Clad 100% Money-Back Guarantee badge" className="min-h-[180px]" />
          </div>
          <h2 className="mt-6 text-2xl md:text-4xl font-black text-emerald-300 inline-flex items-center gap-2 justify-center">
            <ShieldCheck className="size-8" /> Iron-Clad 100% Money-Back Guarantee
          </h2>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto leading-relaxed">
            If you don't get results, or you are genuinely not satisfied with our work, we will
            refund <span className="font-bold text-white">100% of your investment.</span>
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left">
            {[
              "No awkward conversations",
              "No lengthy forms",
              "No hidden conditions",
              "No chasing us",
            ].map((x) => (
              <li key={x} className="flex items-center gap-2 text-white/85">
                <CheckCircle2 className="size-4 text-emerald-400" /> {x}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold">Just send a message and get your money back.</p>
        </div>
      </section>

      {/* TESTIMONIALS PLACEHOLDER */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-4xl font-black text-center">Real Results From Real Doctors</h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <PlaceholderImage label="WhatsApp testimonial screenshot #1" />
          <PlaceholderImage label="Client result / masterclass feedback #2" />
          <PlaceholderImage label="Doctor testimonial screenshot #3" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-black leading-tight">
          Ready To Claim Your Specialty <span className="text-yellow-300">Before Someone Else Does?</span>
        </h2>
        <p className="mt-4 text-white/85">
          Only ONE practitioner accepted per specialty. Once claimed, this offer closes for that
          category.
        </p>
        <div className="mt-6">
          <button
            onClick={openOrder}
            className="btn-cta inline-flex items-center gap-2 px-8 py-4 text-lg md:text-xl rounded-xl"
          >
            Claim My Specialty Slot Now
            <ArrowRight className="btn-cta-arrow size-5" />
          </button>
        </div>
        <div className="mt-4 text-white/60 text-sm inline-flex items-center gap-2 justify-center">
          <Lock className="size-4" /> Secure order · PKR 25,000 (Reg. PKR 75,000)
        </div>
      </section>

      <Footer />

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[oklch(0.14_0.05_265)]/95 backdrop-blur border-t border-white/10 p-3 pb-[calc(env(safe-area-inset-bottom,0)+0.75rem)]">
        <button
          onClick={openOrder}
          className="btn-cta w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black"
        >
          Claim My Specialty Slot – PKR 25,000
          <ArrowRight className="btn-cta-arrow size-5" />
        </button>
      </div>

      {open && <OrderModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function OrderModal({ onClose }: { onClose: () => void }) {
  const [full_name, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic_name, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [optional_message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("easypaisa");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const firedRef = useRef(false);

  const paymentInfo = useMemo(() => PAYMENT_ACCOUNTS[paymentMethod], [paymentMethod]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setUploadError(null);
    if (!file) {
      setScreenshot(null);
      setScreenshotPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image must be smaller than 8MB.");
      return;
    }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!full_name || !specialty || !whatsapp || !email) {
      setUploadError("Please fill in all required fields.");
      return;
    }
    if (!screenshot) {
      setUploadError("Please upload your payment screenshot before submitting.");
      return;
    }
    setSubmitting(true);
    setUploadError(null);

    let screenshotUrl: string | null = null;
    try {
      const ext = screenshot.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeEmail = email.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
      const path = `pam-${Date.now()}-${safeEmail}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, screenshot, { contentType: screenshot.type, upsert: false });
      if (upErr) throw upErr;
      try {
        const { url } = await createScreenshotSignedUrl({ data: { path } });
        screenshotUrl = url;
      } catch {
        screenshotUrl = path;
      }
    } catch (err) {
      console.error("Screenshot upload failed", err);
      setUploadError("Failed to upload screenshot. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      await submitPatientAcquisitionOrder({
        data: {
          full_name,
          specialty,
          clinic_name: clinic_name || null,
          city: city || null,
          whatsapp,
          email,
          payment_method: PAYMENT_ACCOUNTS[paymentMethod].label,
          payment_screenshot_url: screenshotUrl,
          optional_message: optional_message || null,
          amount: PRICE,
        },
      });
    } catch (err) {
      console.error("Failed to save order", err);
      setUploadError("Payment uploaded, but we couldn't save your order. Please try again.");
      setSubmitting(false);
      return;
    }

    if (!firedRef.current) {
      firedRef.current = true;
      fbqTrack("SubmitApplication", {
        value: PRICE,
        currency: "PKR",
        content_name: "Patient Acquisition Machine",
      });
      fbqTrack("Purchase", {
        value: PRICE,
        currency: "PKR",
        content_name: "Patient Acquisition Machine",
      });
      console.log("Meta Pixel Purchase fired — Patient Acquisition Machine order");
    }

    setSuccess(true);
    setSubmitting(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-2 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative mx-auto my-4 max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 size-9 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <X className="size-4" />
        </button>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
            <h3 className="mt-4 text-2xl font-black">Payment Screenshot Submitted</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Your payment screenshot has been submitted. Our team will verify it and contact you on
              WhatsApp shortly to begin building your Patient Acquisition Machine™.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-slate-900 text-white font-bold px-6 py-3"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 md:p-7 space-y-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-yellow-600 font-black">
                Special Offer — PKR 25,000
              </div>
              <h3 className="mt-1 text-xl md:text-2xl font-black">
                Claim Your Patient Acquisition Machine™ Slot
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Fill in your details, send payment, upload the screenshot, and our team will verify
                and contact you on WhatsApp.
              </p>
            </div>

            {/* Payment details */}
            <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="font-black text-slate-900">Payment Details</div>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PayMethod)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold"
                >
                  <option value="easypaisa">Easypaisa</option>
                  <option value="jazzcash">JazzCash</option>
                </select>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-y-2 text-sm">
                <dt className="text-slate-600">Account Title</dt>
                <dd className="col-span-2 font-semibold">{paymentInfo.name}</dd>
                <dt className="text-slate-600">Account Number</dt>
                <dd className="col-span-2 font-semibold font-mono">{paymentInfo.account}</dd>
                <dt className="text-slate-600">Method</dt>
                <dd className="col-span-2 font-semibold">{paymentInfo.label}</dd>
                <dt className="text-slate-600">Amount</dt>
                <dd className="col-span-2 font-black text-emerald-600">PKR 25,000</dd>
              </dl>
              <ol className="mt-3 text-xs text-slate-700 space-y-1 list-decimal list-inside">
                <li>Send payment of PKR 25,000 to the account above.</li>
                <li>Take a screenshot of the successful payment.</li>
                <li>Upload the screenshot below.</li>
                <li>Submit your order.</li>
                <li>Our team will verify and contact you on WhatsApp.</li>
              </ol>
            </div>

            {/* Form fields */}
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name *" value={full_name} onChange={setFullName} required />
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Specialty *
                </label>
                <select
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select your specialty…</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Clinic / Hospital Name" value={clinic_name} onChange={setClinicName} />
              <Field label="City" value={city} onChange={setCity} />
              <Field label="WhatsApp Number *" value={whatsapp} onChange={setWhatsapp} required />
              <Field label="Email Address *" type="email" value={email} onChange={setEmail} required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Optional Message
              </label>
              <textarea
                value={optional_message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Anything you'd like our team to know…"
              />
            </div>

            {/* Screenshot upload */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Payment Screenshot *
              </label>
              <label className="mt-1 flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 cursor-pointer hover:border-yellow-400">
                <Upload className="size-5 text-slate-600" />
                <span className="text-sm text-slate-700">
                  {screenshot ? screenshot.name : "Click to upload payment screenshot (JPG/PNG)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
              {screenshotPreview && (
                <img
                  src={screenshotPreview}
                  alt="Payment screenshot preview"
                  className="mt-3 rounded-lg border border-slate-200 max-h-48 object-contain"
                />
              )}
            </div>

            {uploadError && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {uploadError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-cta w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base md:text-lg font-black disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "Submit & Claim My Slot"}
              <ArrowRight className="btn-cta-arrow size-5" />
            </button>
            <div className="text-center text-xs text-slate-500 inline-flex items-center gap-1 justify-center w-full">
              <Lock className="size-3.5" /> Your details are secure and never shared.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      />
    </div>
  );
}
