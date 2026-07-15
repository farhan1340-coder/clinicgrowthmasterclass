import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
    navigate({
      to: "/thank-you",
      search: leadId ? ({ lead: leadId } as any) : undefined,
      replace: true,
    });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      <main className="bg-secondary flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-6">
          {/* Section 1: Confirmation banner */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 md:p-5 flex items-start gap-3">
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

          {/* Section 2: Main headline */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10 text-center">
            <span className="inline-block text-[11px] md:text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              Optional Next Step
            </span>
            <h1 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
              Want to Shortcut the Entire Process?
            </h1>
            <p className="mt-4 text-sm md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
              The Clinic Growth Masterclass gives you the strategy and roadmap.
              But if you want personalized help — or would rather let an
              experienced team help you implement the system — you can book a
              free strategy call below.
            </p>
          </section>

          {/* Section 3: Problem awareness */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
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

          {/* Section 4: What we'll discuss */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
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

          {/* Section 5: Who this call is for */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
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

          {/* Section 6: Primary CTA */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-lg p-6 md:p-10 text-center">
            <Calendar className="mx-auto size-10 text-amber-300" />
            <h2 className="mt-4 text-xl md:text-3xl font-black leading-tight">
              Book Your Free Clinic Growth Strategy Call
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-200 max-w-xl mx-auto">
              Choose a convenient time to discuss your clinic, goals and current
              marketing challenges with Farhan Ali.
            </p>

            <a
              href={BOOKING_URL}
              onClick={handleBookClick}
              className="btn-cta mt-6 w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg"
            >
              <span>Yes, I Want to Book My Free Call</span>
              <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
            </a>

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

          <p className="text-center text-xs text-muted-foreground">
            This call is completely optional. Your masterclass access is not
            affected by this choice.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
