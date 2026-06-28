import { createFileRoute, Link, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ChevronRight, CircleCheckBig, Lock, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { getOtoEligibility, acceptOtoOffer, declineOtoOffer } from "@/lib/oto.functions";
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

function OtoPage() {
  const { leadId } = Route.useLoaderData();
  const navigate = useNavigate();
  const [pending, setPending] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setPending("accept");
    setError(null);
    try {
      await acceptOtoOffer({ data: { leadId } });
      await navigate({ to: "/thank-you" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add the offer right now.");
      setPending(null);
    }
  };

  const handleDecline = async () => {
    setPending("decline");
    setError(null);
    try {
      await declineOtoOffer({ data: { leadId } });
      await navigate({ to: "/thank-you" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not continue right now.");
      setPending(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Topbar />
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
                onClick={handleAccept}
                disabled={!!pending}
                text={pending === "accept" ? "ADDING YOUR SESSION..." : "YES! ADD MY 1-ON-1 SESSION →"}
                subtext="Get your personalized clinic growth plan + 15-day WhatsApp support"
              />
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
              onClick={handleAccept}
              disabled={!!pending}
              text={pending === "accept" ? "ADDING YOUR SESSION..." : "YES! I WANT MY PERSONALIZED CLINIC GROWTH PLAN →"}
            />
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
              onClick={handleAccept}
              disabled={!!pending}
              text={pending === "accept" ? "ADDING YOUR SESSION..." : "YES! ADD MY 1-ON-1 SESSION NOW →"}
              subtext="This one-time offer is available only on this page."
            />
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
                  onClick={handleAccept}
                  disabled={!!pending}
                  text={pending === "accept" ? "ADDING YOUR SESSION..." : "YES! ADD MY 1-ON-1 CLINIC GROWTH SESSION →"}
                  subtext="90-minute private session + customized plan + 15-day WhatsApp support + free website setup bonus"
                />
              </div>
              <button
                type="button"
                onClick={handleDecline}
                disabled={!!pending}
                className="mt-5 text-sm text-white/70 underline underline-offset-4 hover:text-white disabled:opacity-60"
              >
                {pending === "decline" ? "CONTINUING..." : "No thanks, I’ll continue with the masterclass only"}
              </button>
            </div>
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
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
  loader: async ({ deps }) => {
    if (!deps.lead) {
      throw redirect({ to: "/thank-you" });
    }
    const state = await getOtoEligibility({ data: { leadId: deps.lead } });
    if (!state.eligible) {
      throw redirect({ to: "/thank-you" });
    }
    return { leadId: state.leadId };
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
