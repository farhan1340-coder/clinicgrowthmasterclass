import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import {
  CheckCircle2,
  Calendar,
  ArrowRight,
  Target,
  Compass,
  Zap,
  Users,
  Rocket,
} from "lucide-react";
import diyImg from "@/assets/strategy/diy-vs-support.png.asset.json";
import systemImg from "@/assets/strategy/clinic-growth-system.png.asset.json";
import farhanImg from "@/assets/strategy/farhan-strategy-call.png.asset.json";
import processImg from "@/assets/strategy/three-step-process.png.asset.json";

type Search = { lead?: string };

// TODO: replace with the real booking link when available.
const BOOKING_URL = "https://calendly.com/farhan-ali-clinic-growth/strategy-call";

export const Route = createFileRoute("/strategy-call")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    lead: typeof s.lead === "string" ? s.lead : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Optional — Book Your Free Clinic Growth Strategy Call" },
      {
        name: "description",
        content:
          "Optional free strategy call with Farhan Ali to discuss implementing the Clinic Growth Masterclass system for your clinic.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StrategyCallPage,
});

function StrategyCallPage() {
  const navigate = useNavigate();
  const { lead } = Route.useSearch();
  const [leadId, setLeadId] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);

  useEffect(() => {
    let id = lead ?? null;
    if (!id && typeof window !== "undefined") {
      try {
        id = localStorage.getItem("cgm_last_lead");
      } catch {}
    }
    if (!id) {
      navigate({ to: "/", replace: true });
      return;
    }
    setLeadId(id);
    setGateChecked(true);
  }, [lead, navigate]);

  function handleBookClick() {
    try {
      if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
        (window as any).fbq("trackCustom", "StrategyCallBooked", { lead_id: leadId });
      }
    } catch {}
  }

  function goToThankYou() {
    if (typeof window !== "undefined") {
      const qs = leadId ? `?lead=${encodeURIComponent(leadId)}` : "";
      window.location.href = `/thank-you${qs}`;
    }
  }

  if (!gateChecked) {
    return (
      <div className="min-h-screen grid place-items-center bg-secondary">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const discussPoints = [
    "Your clinic's current marketing situation",
    "The services you want to grow",
    "Your offer and patient acquisition strategy",
    "The biggest bottlenecks slowing your growth",
    "A possible implementation roadmap for your clinic",
  ];

  const fitPoints = [
    "Want to attract more consistent patient inquiries",
    "Do not have time to build everything yourself",
    "Have tried ads but only received temporary results",
    "Need a personalized strategy for your clinic",
    "Want expert help implementing the complete system",
  ];

  const PrimaryCta = ({ label = "Yes, I Want to Book My Free Call" }: { label?: string }) => (
    <a
      href={BOOKING_URL}
      onClick={handleBookClick}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-cta w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg"
    >
      <span>{label}</span>
      <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
    </a>
  );

  const SkipLink = () => (
    <button
      type="button"
      onClick={goToThankYou}
      className="text-sm md:text-base text-slate-600 hover:text-slate-900 underline underline-offset-4"
    >
      No Thanks, Continue to the Confirmation Page
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      <main className="bg-secondary flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-10 md:space-y-14">
          {/* 1. Confirmation banner */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 md:p-5 flex items-start gap-3 max-w-4xl mx-auto w-full">
            <CheckCircle2 className="size-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm md:text-base font-bold text-emerald-900">
                Your Masterclass Registration Has Been Submitted Successfully
              </h2>
              <p className="mt-1 text-xs md:text-sm text-emerald-800/90">
                We are reviewing your payment details. You will also receive the
                masterclass access and important updates through WhatsApp.
              </p>
            </div>
          </section>

          {/* 2-5. Hero — headline + DIY vs Support image */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <div className="grid gap-8 md:gap-10 md:grid-cols-[45fr_55fr] items-center">
              <div className="order-1 md:order-1 text-center md:text-left">
                <span className="inline-block text-[11px] md:text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Optional Next Step
                </span>
                <h1 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
                  Want to Shortcut the Entire Process?
                </h1>
                <p className="mt-4 text-sm md:text-lg text-slate-700 leading-relaxed">
                  The Clinic Growth Masterclass gives you the strategy and
                  roadmap. If you would rather implement it faster with
                  personalized help, book a free strategy call below.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-start gap-3">
                  <PrimaryCta />
                </div>
                <div className="mt-4">
                  <SkipLink />
                </div>
              </div>

              <div className="order-2 md:order-2">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-amber-200/60 bg-white"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={diyImg.url}
                    alt="Doctor comparing doing clinic marketing alone with implementing a patient acquisition system with professional support."
                    width={1200}
                    height={900}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 6. Problem awareness */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-lg md:text-2xl font-black text-slate-900">
              Knowing What to Do Is Different From Getting It Implemented
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
              Many doctors understand the strategy but still get stuck while
              creating their offer, building the funnel, setting up ads,
              improving their Google presence or converting inquiries into
              appointments.
            </p>
            <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
              Instead of spending months testing everything through trial and
              error, you can discuss your clinic with us and see what the
              fastest implementation path could look like.
            </p>
          </section>

          {/* 7. Clinic Growth System image */}
          <section className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg md:text-2xl font-black text-slate-900">
                We Look at the Complete System — Not Just Your Ads
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                Your clinic's growth usually depends on several connected
                parts. During the call, we identify what is working, what is
                missing and what should be fixed first.
              </p>
            </div>
            <div className="mt-6 md:mt-8 mx-auto" style={{ maxWidth: "1100px" }}>
              <div
                className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200/60 bg-white"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={systemImg.url}
                  alt="Clinic Growth System connecting clinic offer, sales funnel, Meta Ads, Google Business Profile and WhatsApp follow-up."
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </section>

          {/* 8. What we'll discuss */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-lg md:text-2xl font-black text-slate-900">
              During This Free Strategy Call, We Can Look At:
            </h2>
            <ul className="mt-4 grid gap-3">
              {discussPoints.map((p, i) => {
                const Icon = [Target, Rocket, Compass, Zap, Users][i] ?? Target;
                return (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm md:text-base text-slate-800 leading-snug">
                      {p}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 9. Who this call is for */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-lg md:text-2xl font-black text-slate-900">
              This Call May Be Helpful If You:
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {fitPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm md:text-base text-slate-800 leading-snug">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 10. Farhan trust section */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <div className="grid gap-8 md:gap-10 md:grid-cols-[58fr_42fr] items-center">
              <div className="order-2 md:order-1">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-amber-200/60 bg-white"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={farhanImg.url}
                    alt="Farhan Ali conducting a personalized clinic growth strategy call."
                    width={1400}
                    height={1050}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-xl md:text-3xl font-black leading-tight text-slate-900">
                  Your Personalized Strategy Call With Farhan Ali
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                  This is not a generic agency consultation. We will discuss
                  your clinic, your current bottlenecks and the most practical
                  next step for your situation.
                </p>
                <ul className="mt-5 grid gap-2.5">
                  {[
                    "Personalized clinic audit",
                    "Practical implementation direction",
                    "Recommendations based on your clinic's situation",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                      <span className="text-sm md:text-base text-slate-800 leading-snug">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <PrimaryCta label="Book My Free Clinic Growth Strategy Call" />
                </div>
                <div className="mt-3">
                  <SkipLink />
                </div>
              </div>
            </div>
          </section>

          {/* 11-12. What happens next + process image */}
          <section className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg md:text-2xl font-black text-slate-900">
                Here's What Happens Next
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                Book a suitable time, let us review your clinic and leave the
                call with clearer next steps.
              </p>
            </div>
            <div className="mt-6 md:mt-8 mx-auto" style={{ maxWidth: "1050px" }}>
              <div
                className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200/60 bg-white"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={processImg.url}
                  alt="Three-step Clinic Growth Strategy Call process: book the call, audit the clinic and receive a growth roadmap."
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </section>

          {/* 13-14. Final CTA */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-lg p-6 md:p-10 text-center max-w-4xl mx-auto w-full">
            <Calendar className="mx-auto size-10 text-amber-300" />
            <h2 className="mt-4 text-xl md:text-3xl font-black leading-tight">
              Book Your Free Clinic Growth Strategy Call
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-200 max-w-xl mx-auto">
              Choose a convenient time to discuss your clinic, goals and
              current marketing challenges with Farhan Ali.
            </p>

            <div className="mt-6 flex justify-center">
              <PrimaryCta />
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={goToThankYou}
                className="text-sm md:text-base text-slate-300 hover:text-white underline underline-offset-4"
              >
                No Thanks, Take Me to the Masterclass Confirmation Page
              </button>
            </div>
          </section>

          {/* 15. Reassurance */}
          <p className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            The strategy call is completely optional. Your Clinic Growth
            Masterclass registration is already submitted.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
