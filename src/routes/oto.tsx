import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, CircleCheckBig, Copy, Lock, ShieldCheck, Upload, ImageIcon } from "lucide-react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { getOtoEligibility, declineOtoOffer, submitOtoPayment } from "@/lib/oto.functions";
import { supabase } from "@/integrations/supabase/client";
import heroVisual from "@/assets/oto-hero-strategy-session.png.asset.json";
import growthPlanVisual from "@/assets/oto-growth-plan.png.asset.json";
import privateSessionVisual from "@/assets/oto-private-session.png.asset.json";
import whatsIncludedVisual from "@/assets/oto-whats-included.png.asset.json";
import websiteBonusVisual from "@/assets/oto-website-bonus.png.asset.json";
import whyTakeOfferVisual from "@/assets/oto-why-take-offer.png.asset.json";
import guidedByFarhanVisual from "@/assets/oto-guided-by-farhan.png.asset.json";
import proofBannerVisual from "@/assets/oto-proof-banner.png.asset.json";
import drManalReview from "@/assets/dr-manal-whatsapp-review.jpeg.asset.json";
import drJasimReview from "@/assets/dr-jasim-mumtaz-review.jpeg.asset.json";
import drMehwishReview from "@/assets/dr-mehwish-rasheed-review.jpeg.asset.json";
import payEasypaisa from "@/assets/proof/pay-easypaisa-1999.jpg.asset.json";
import payAlbaraka from "@/assets/proof/pay-albaraka-999.jpg.asset.json";
import payEpAdeel from "@/assets/proof/pay-easypaisa-adeel-999.jpg.asset.json";
import textDrAmnah from "@/assets/proof/text-dr-amnah.jpg.asset.json";
import textPatientJourney from "@/assets/proof/text-patient-journey.jpg.asset.json";

const OTO_REGULAR_PRICE = 7999;
const OTO_PRICE = 3999;

const BENEFITS = [
  "Identify what is blocking your clinic from getting more patient inquiries",
  "Create a customized patient-acquisition plan for your clinic",
  "Decide which services and offers to promote first",
  "Improve your Google Business Profile, content, social media, and ads direction",
  "Build a clear action plan instead of trying random marketing tactics",
  "Get direct guidance based on your specialty, city, and current situation",
];

const INCLUDED = [
  "90-Minute Personalized Strategy Call",
  "Customized Patient-Growth Plan",
  "Clinic Online Presence Review",
  "Meta Ads Guidance",
  "15-Day WhatsApp Support",
  "Free Professional Clinic Website Setup Bonus",
];

const FAQS = [
  {
    q: "1. Who is this session for?",
    a: "This is for doctors, nutritionists, physiotherapists, and healthcare practitioners who want a personalized patient-growth plan instead of generic marketing advice.",
  },
  {
    q: "2. Will this be personalized for my clinic?",
    a: "Yes. The strategy will be based on your specialty, city, services, patient goals, current online presence, and biggest challenges.",
  },
  {
    q: "3. What happens after I accept this offer?",
    a: "After your order is confirmed, you will receive instructions to schedule your 90-minute personalized strategy session.",
  },
  {
    q: "4. Is the clinic website included?",
    a: "Yes. A professional clinic website setup is included as a bonus with this paid 1-on-1 strategy session.",
  },
];

const PROOF_ITEMS = [
  { url: drManalReview.url, alt: "WhatsApp review from Dr. Manal" },
  { url: payEasypaisa.url, alt: "Real payment proof screenshot" },
  { url: drJasimReview.url, alt: "WhatsApp review from Dr. Jasim Mumtaz" },
  { url: payAlbaraka.url, alt: "Real payment proof from a participant" },
  { url: drMehwishReview.url, alt: "WhatsApp review from Dr. Mehwish Rasheed" },
  { url: payEpAdeel.url, alt: "Real Easypaisa payment proof screenshot" },
  { url: textDrAmnah.url, alt: "WhatsApp feedback from Dr. Amnah" },
  { url: textPatientJourney.url, alt: "WhatsApp feedback about patient journey strategy" },
];

type OtoSearch = { lead?: string };

function VisualCard({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[28px] border bg-card shadow-xl ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
    </div>
  );
}

function PrimaryAction({
  onClick,
  text,
  subtext,
  disabled,
}: {
  onClick: () => void;
  text: string;
  subtext?: string;
  disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="w-full">
      <div className="btn-cta w-full px-6 py-4 text-center">
        <div className="text-lg md:text-2xl">{text}</div>
        {subtext ? (
          <div className="mt-1 text-xs md:text-sm font-medium normal-case tracking-normal opacity-95">{subtext}</div>
        ) : null}
      </div>
    </button>
  );
}

function ContentSection({
  title,
  children,
  dark = false,
}: {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`py-12 md:py-16 ${dark ? "bg-[oklch(0.16_0.05_272)] text-white" : "bg-secondary text-foreground"}`}>
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-center max-w-4xl mx-auto">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function OtoError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-lg rounded-3xl border bg-card p-8 text-center shadow-xl">
        <ShieldCheck className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-2xl font-black">Couldn’t Load This Offer</h1>
        <p className="mt-3 text-muted-foreground">{error.message || "Please continue to your confirmation page."}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="btn-cta px-6 py-3"
            onClick={async () => {
              await router.invalidate();
              reset();
            }}
          >
            Try Again
          </button>
          <Link to="/thank-you" className="inline-flex items-center justify-center rounded-md border px-6 py-3 font-semibold">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

function OtoNotFound() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-lg rounded-3xl border bg-card p-8 text-center shadow-xl">
        <h1 className="text-2xl font-black">Offer Not Available</h1>
        <p className="mt-3 text-muted-foreground">This page is no longer available for this order.</p>
        <Link to="/thank-you" className="btn-cta inline-flex mt-6 px-6 py-3">
          Continue To Thank You
        </Link>
      </div>
    </div>
  );
}

const DECISION_KEY = (leadId: string) => `oto_decision_${leadId}`;

function readDecision(leadId: string): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(DECISION_KEY(leadId));
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

function writeDecision(leadId: string, decision: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DECISION_KEY(leadId), decision);
  } catch {
    /* ignore */
  }
}

type EligibilityDebug = {
  attempts: number;
  lastError?: string;
  result?: { eligible: boolean; accepted: boolean; declined: boolean };
  source: "pending" | "backend" | "local-decision" | "missing-lead" | "fallback-show";
};

const IS_DEV =
  typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.DEV === true;

function dbg(...args: unknown[]) {
  if (IS_DEV) console.log("[OTO]", ...args);
}

function OtoPage() {
  const { leadId } = Route.useLoaderData();
  const navigate = useNavigate();
  const [pending, setPending] = useState<"decline" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [debug, setDebug] = useState<EligibilityDebug>({ attempts: 0, source: "pending" });
  const submittedRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [otoFile, setOtoFile] = useState<File | null>(null);
  const [otoPreview, setOtoPreview] = useState<string | null>(null);
  const [otoErr, setOtoErr] = useState<string | null>(null);

  // Eligibility gate.
  // NEVER auto-redirect to /thank-you on timeout. Only redirect when the backend
  // POSITIVELY confirms the strategy bump is already on the order, or that an
  // OTO decision (accepted/declined) was already saved.
  useEffect(() => {
    let cancelled = false;

    async function run() {
      dbg("eligibility start", { leadId });

      if (!leadId) {
        dbg("no leadId — sending to /thank-you (cannot show OTO without a lead)");
        setDebug({ attempts: 0, source: "missing-lead" });
        navigate({ to: "/thank-you", replace: true });
        return;
      }

      const localPrior = readDecision(leadId);
      if (localPrior) {
        dbg("local prior decision found", localPrior, "— sending to /thank-you");
        setDebug({ attempts: 0, source: "local-decision" });
        navigate({ to: "/thank-you", replace: true });
        return;
      }

      // Try backend up to 2 times. Never timeout-to-thank-you.
      let attempt = 0;
      let lastErr: unknown = null;
      while (attempt < 2 && !cancelled) {
        attempt++;
        try {
          const state = await getOtoEligibility({ data: { leadId } });
          if (cancelled) return;
          dbg("eligibility result", state, "attempt", attempt);
          setDebug({ attempts: attempt, result: state, source: "backend" });

          if (state.accepted) {
            writeDecision(leadId, "accepted");
            navigate({ to: "/thank-you", replace: true });
            return;
          }
          if (state.declined) {
            writeDecision(leadId, "declined");
            navigate({ to: "/thank-you", replace: true });
            return;
          }
          if (!state.eligible) {
            navigate({ to: "/thank-you", replace: true });
            return;
          }
          // eligible === true → show OTO
          setChecking(false);
          return;
        } catch (e) {
          lastErr = e;
          dbg("eligibility error", e, "attempt", attempt);
          if (attempt < 2) await new Promise((r) => setTimeout(r, 800));
        }
      }

      if (cancelled) return;
      const msg = lastErr instanceof Error ? lastErr.message : String(lastErr ?? "unknown");
      dbg("backend unavailable after retry — showing OTO safely (not redirecting)");
      setDebug({ attempts: attempt, lastError: msg, source: "fallback-show" });
      setChecking(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [leadId, navigate]);

  const scrollToPayment = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById("oto-payment");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const input = el.querySelector<HTMLInputElement>("input[type='file']");
        input?.focus({ preventScroll: true });
      }, 600);
    }
  };

  const handleCopyAccount = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText("03135944817");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleOtoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setOtoErr(null);
    if (!f) {
      setOtoFile(null);
      setOtoPreview(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      setOtoErr("Please upload an image file (JPG or PNG).");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setOtoErr("Image must be smaller than 8MB.");
      return;
    }
    setOtoFile(f);
    setOtoPreview(URL.createObjectURL(f));
  };

  const handleOtoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || submittedRef.current) return;
    setOtoErr(null);
    if (!leadId) {
      setOtoErr("Missing order reference. Please return to checkout.");
      return;
    }
    if (!otoFile) return setOtoErr("Please upload your payment screenshot.");
    setPending("submit");
    try {
      const ext = otoFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `oto-${Date.now()}-${leadId}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, otoFile, { contentType: otoFile.type, upsert: false });
      if (upErr) throw upErr;

      let screenshotUrl: string = path;
      try {
        const { createScreenshotSignedUrl } = await import("@/lib/payment-screenshot.functions");
        const { url } = await createScreenshotSignedUrl({ data: { path } });
        screenshotUrl = url;
      } catch (err) {
        console.error("OTO signed url failed", err);
      }

      await submitOtoPayment({
        data: {
          leadId,
          screenshot_url: screenshotUrl,
        },
      });
      submittedRef.current = true;
      writeDecision(leadId, "accepted");
      try {
        localStorage.setItem(`oto_submitted_${leadId}`, "1");
        localStorage.setItem("oto_last_submitted", leadId);
      } catch {
        /* ignore */
      }
      await navigate({ to: "/thank-you", replace: true });
    } catch (err) {
      console.error("OTO submit failed", err);
      setOtoErr("Couldn't submit payment. Please try again.");
      setPending(null);
    }
  };

  const handleDecline = async () => {
    if (submittedRef.current || pending) return;
    submittedRef.current = true;
    setPending("decline");
    setError(null);
    writeDecision(leadId, "declined");
    dbg("decline clicked", { leadId });
    try {
      await declineOtoOffer({ data: { leadId } });
    } catch (e) {
      console.error("OTO decline failed", e);
    }
    await navigate({ to: "/thank-you", replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="mt-4 text-sm text-muted-foreground">Please wait while we prepare your bonus offer…</p>
          {IS_DEV && (
            <pre className="mt-4 mx-auto max-w-md text-left text-[11px] bg-black/80 text-green-200 p-3 rounded-md overflow-auto">
{`leadId: ${leadId || "(none)"}
attempts: ${debug.attempts}
source: ${debug.source}
lastError: ${debug.lastError ?? "-"}`}
            </pre>
          )}
        </div>
      </div>
    );
  }

  const debugBanner = IS_DEV ? (
    <div className="bg-black/90 text-green-200 text-[11px] font-mono px-4 py-2 text-center">
      leadId: {leadId} · order bump selected: {String(debug.result?.accepted ?? false)} ·
      OTO decision: {debug.result?.accepted ? "accepted" : debug.result?.declined ? "declined" : "none"} ·
      eligibility: {debug.source}
      {debug.lastError ? ` · err: ${debug.lastError}` : ""}
    </div>
  ) : null;

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Topbar />
      {debugBanner}

      <main className="flex-1 overflow-x-hidden">
        <section className="hero-bg text-white border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14 text-center">
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.24em] text-yellow-300">
              Special One-Time Offer
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-tight">
              You’re Enrolled In The Clinic Growth Masterclass…
              <span className="block mt-3 text-yellow-300">
                But Before You Go, Get A Personalized Growth Plan For Your Own Clinic
              </span>
            </h1>
            <p className="mt-4 md:mt-5 max-w-3xl mx-auto text-sm md:text-lg text-white/80 leading-relaxed">
              The masterclass gives you the strategies. This private 90-minute session helps you apply them specifically to your specialty, city, services, clinic goals, and current online situation.
            </p>
            <VisualCard src={heroVisual.url} alt="1-on-1 Personalized Digital Marketing Strategy Session visual" className="mt-7" />
            <div className="mt-6 max-w-2xl mx-auto">
              <PrimaryAction
                onClick={scrollToPayment}
                disabled={!!pending}
                text={"YES! ADD MY 1-ON-1 SESSION →"}
                subtext="Get your personalized clinic growth plan + 15-day WhatsApp support"
              />
              <button type="button" onClick={handleDecline} disabled={!!pending} className="mt-4 block mx-auto text-xs md:text-sm text-white/70 underline underline-offset-4 hover:text-white disabled:opacity-60">
                ← No Thanks, I’ll Go With Clinic Growth Masterclass Only
              </button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60">
              <Lock className="size-3.5" /> Your masterclass order stays intact either way.
            </p>
          </div>
        </section>

        <ContentSection title="This Is Not Generic Marketing Advice">
          <div className="max-w-3xl space-y-4 text-sm md:text-lg text-foreground/80 leading-relaxed">
            <p>You will not leave with random tips that may or may not work for your clinic.</p>
            <p>
              During this session, we will build a patient-growth direction around your own specialty, city, services, current online presence, and patient goals.
            </p>
          </div>
          <VisualCard src={growthPlanVisual.url} alt="Your Personalized Clinic Growth Plan visual" className="mt-6" />
        </ContentSection>

        <ContentSection title="In Your 90-Minute Session, We Will Help You:" dark>
          <div className="grid gap-3 md:grid-cols-2">
            {BENEFITS.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-yellow-300/20 text-yellow-300">
                  <CheckCircle2 className="size-4" />
                </span>
                <p className="text-sm md:text-base text-white/88">{item}</p>
              </div>
            ))}
          </div>
          <VisualCard src={privateSessionVisual.url} alt="Private 90-Minute Strategy Session visual" className="mt-6" />
          <div className="mt-6 max-w-2xl mx-auto">
            <PrimaryAction
              onClick={scrollToPayment}
              disabled={!!pending}
              text={"YES! I WANT MY PERSONALIZED CLINIC GROWTH PLAN →"}
            />
            <button type="button" onClick={handleDecline} disabled={!!pending} className="mt-4 block mx-auto text-xs md:text-sm text-white/70 underline underline-offset-4 hover:text-white disabled:opacity-60">
              ← No Thanks, I’ll Go With Clinic Growth Masterclass Only
            </button>
          </div>
        </ContentSection>

        <ContentSection title="Everything You Need To Move Forward With Clarity">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <div key={item} className="rounded-xl border bg-card px-4 py-4 shadow-sm flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CircleCheckBig className="size-4" />
                </span>
                <p className="text-sm md:text-base font-semibold leading-snug">{item}</p>
              </div>
            ))}
          </div>
          <VisualCard src={whatsIncludedVisual.url} alt="What's Included visual" className="mt-6" />
        </ContentSection>

        <ContentSection title="Plus, You Will Receive A Free Professional Clinic Website Setup" dark>
          <div className="max-w-3xl space-y-4 text-sm md:text-lg text-white/85 leading-relaxed">
            <p>
              Your website setup will give your clinic a more professional online presence and make it easier for potential patients to understand your services and contact your clinic.
            </p>
            <p>This is included as a bonus when you add the 1-on-1 session today.</p>
          </div>
          <VisualCard src={websiteBonusVisual.url} alt="Free Professional Clinic Website Setup visual" className="mt-6" />
        </ContentSection>

        <ContentSection title="The Masterclass Gives You The Strategy. This Session Helps You Apply It To Your Clinic.">
          <div className="max-w-3xl text-sm md:text-lg text-foreground/80 leading-relaxed">
            Instead of trying to figure out every step alone, you get direct guidance on what to prioritize first, what to ignore, and how to build a practical plan for your specific clinic.
          </div>
          <VisualCard src={whyTakeOfferVisual.url} alt="Why Take This One-Time Offer visual" className="mt-6" />
          <div className="mt-6 max-w-2xl mx-auto">
            <PrimaryAction
              onClick={scrollToPayment}
              disabled={!!pending}
              text={"YES! ADD MY 1-ON-1 SESSION NOW →"}
              subtext="This one-time offer is available only on this page."
            />
            <button type="button" onClick={handleDecline} disabled={!!pending} className="mt-4 block mx-auto text-xs md:text-sm text-foreground/60 underline underline-offset-4 hover:text-foreground disabled:opacity-60">
              ← No Thanks, I’ll Go With Clinic Growth Masterclass Only
            </button>
          </div>
        </ContentSection>

        <ContentSection title="Get Direct Guidance From Farhan Ali" dark>
          <div className="max-w-3xl text-sm md:text-lg text-white/85 leading-relaxed">
            Farhan Ali helps doctors and healthcare practitioners build stronger patient-acquisition systems through practical digital marketing strategies, clinic positioning, offers, content, local visibility, and patient-growth plans.
          </div>
          <VisualCard src={guidedByFarhanVisual.url} alt="Guided By Farhan Ali visual using the uploaded personal photo" className="mt-6" />
        </ContentSection>

        <ContentSection title="Real Proof From Healthcare Practitioners">
          <VisualCard src={proofBannerVisual.url} alt="Real Proof. Real Value. section banner" />
          <div className="mt-6 -mx-1 overflow-x-auto pb-2">
            <div className="flex gap-4 px-1">
              {PROOF_ITEMS.map((item) => (
                <div key={item.url} className="w-[220px] shrink-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <img src={item.url} alt={item.alt} className="h-[360px] w-full object-contain bg-black/5" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">← swipe to see more →</p>
        </ContentSection>

        <section className="py-12 md:py-16 bg-[oklch(0.15_0.05_272)] text-white border-y border-white/10">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-300">One-Time Offer Pricing</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
              Add The Personalized Clinic Growth Session Today
            </h2>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl">
              <div className="text-sm uppercase tracking-widest text-white/60">Regular Price</div>
              <div className="mt-2 text-2xl md:text-3xl font-black text-white/45 line-through">
                PKR {OTO_REGULAR_PRICE.toLocaleString()}
              </div>
              <div className="mt-5 text-sm uppercase tracking-widest text-yellow-300">Today’s One-Time Offer Price</div>
              <div className="mt-2 text-4xl md:text-6xl font-black text-yellow-300">
                PKR {OTO_PRICE.toLocaleString()}
              </div>
              <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                This special price is available only on this page. Once you continue, this offer will not be shown again.
              </p>
              <div className="mt-6 max-w-2xl mx-auto">
                <PrimaryAction
                  onClick={scrollToPayment}
                  disabled={!!pending}
                  text={"YES! ADD MY 1-ON-1 CLINIC GROWTH SESSION →"}
                  subtext="90-minute private session + customized plan + 15-day WhatsApp support + free website setup bonus"
                />
              </div>
              <button
                type="button"
                onClick={handleDecline}
                disabled={!!pending}
                className="mt-5 text-sm text-white/70 underline underline-offset-4 hover:text-white disabled:opacity-60"
              >
                {pending === "decline" ? "CONTINUING..." : "← No Thanks, I’ll Go With Clinic Growth Masterclass Only"}
              </button>
            </div>
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </div>
        </section>

        {/* ============= OTO PAYMENT SECTION ============= */}
        <section id="oto-payment" className="py-12 md:py-16 bg-[oklch(0.16_0.05_272)] text-white scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-300">Final Step</p>
              <h2 className="mt-3 text-2xl md:text-4xl font-black tracking-tight">
                Complete Your 1-on-1 Session Upgrade
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mx-auto">
                You are one step away from getting your personalized 90-minute clinic growth strategy session.
                Complete your payment of <span className="font-bold text-yellow-300">PKR 3,999</span> and upload the screenshot below to confirm your upgrade.
              </p>
              <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-yellow-300/10 border border-yellow-300/30 px-6 py-4">
                <div className="text-xs uppercase tracking-widest text-yellow-300/90">One-Time Offer Price</div>
                <div className="mt-1 text-3xl md:text-5xl font-black text-yellow-300">PKR 3,999</div>
              </div>
            </div>

            {/* Payment account card */}
            <div className="mt-8 rounded-2xl bg-white text-foreground p-5 md:p-6 shadow-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Easypaisa / JazzCash
              </div>
              <dl className="mt-4 space-y-3 text-sm md:text-base">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Account Title</dt>
                  <dd className="font-bold text-right">Farhan Ali Rasheed</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Account Number</dt>
                  <dd className="font-bold text-right tracking-wider">03135944817</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-bold text-right">PKR 3,999</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="mt-4 inline-flex items-center gap-2 rounded-md border-2 border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                <Copy className="size-4" />
                {copied ? "Number copied successfully" : "Copy Number"}
              </button>

              <div className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm">
                <div className="font-bold mb-2">Payment Instructions</div>
                <ol className="list-decimal pl-5 space-y-1 text-foreground/80">
                  <li>Send PKR 3,999 through Easypaisa or JazzCash.</li>
                  <li>Take a screenshot of the successful payment.</li>
                  <li>Upload the screenshot below.</li>
                  <li>Submit to confirm your 1-on-1 strategy session upgrade.</li>
                </ol>
              </div>
            </div>

            {/* Confirmation form */}
            <form onSubmit={handleOtoSubmit} className="mt-6 rounded-2xl bg-white text-foreground p-5 md:p-6 shadow-2xl space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Screenshot *</label>
                <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-md border-2 border-dashed border-muted-foreground/40 px-4 py-4 text-sm hover:border-primary transition">
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-foreground/80">
                    {otoFile ? otoFile.name : "Tap to upload payment screenshot (JPG/PNG, max 8MB)"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleOtoFile} className="hidden" />
                </label>
                <p className="mt-2 text-xs text-foreground/80">
                  Upload your PKR 3,999 payment screenshot to confirm your 1-on-1 session upgrade.
                </p>
                {otoPreview && (
                  <div className="mt-3 rounded-md border overflow-hidden">
                    <img src={otoPreview} alt="Payment screenshot preview" className="max-h-64 w-full object-contain bg-muted" />
                  </div>
                )}
                {!otoPreview && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="size-3.5" /> Required to confirm your 1-on-1 upgrade.
                  </p>
                )}
              </div>

              {otoErr && <p className="text-sm font-medium text-destructive">{otoErr}</p>}

              <button
                type="submit"
                disabled={pending === "submit"}
                className="btn-cta w-full px-6 py-4 text-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="text-lg md:text-xl">
                  {pending === "submit" ? "SUBMITTING…" : "CONFIRM MY 1-ON-1 SESSION UPGRADE →"}
                </div>
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Your upgrade will be confirmed after payment verification.
              </p>
            </form>
          </div>
        </section>



        <ContentSection title="Frequently Asked Questions">
          <div className="space-y-3">
            {FAQS.map((item) => (
              <details key={item.q} className="group rounded-2xl border bg-card p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-left">
                  <span>{item.q}</span>
                  <ChevronRight className="size-5 text-muted-foreground transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </ContentSection>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/oto")({
  validateSearch: (search: Record<string, unknown>): OtoSearch => ({
    lead: typeof search.lead === "string" ? search.lead : undefined,
  }),
  loaderDeps: ({ search }) => ({ lead: search.lead }),
  // Loader stays cheap (no server call) so SSR/build prerender never blocks on the eligibility lookup.
  // Real eligibility + decision check happens client-side with a timeout fallback in OtoPage.
  loader: ({ deps }) => {
    if (!deps.lead) {
      // No lead id — just go to thank-you on the client.
      return { leadId: "" };
    }
    return { leadId: deps.lead };
  },
  head: () => ({
    meta: [
      { title: "One-Time Offer — 1-on-1 Personalized Strategy Session" },
      {
        name: "description",
        content:
          "Upgrade your Clinic Growth Masterclass order with a 1-on-1 personalized digital marketing strategy session for your clinic.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OtoPage,
  errorComponent: OtoError,
  notFoundComponent: OtoNotFound,
});
