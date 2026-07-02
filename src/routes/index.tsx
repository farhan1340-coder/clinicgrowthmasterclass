import { createFileRoute, useNavigate } from "@tanstack/react-router";
import productStack from "@/assets/product-stack.png.asset.json";
import clinicGrowthHeroStack from "@/assets/masterclass-banner.png.asset.json";
import bonus1 from "@/assets/bonus-1-cheatsheet.png.asset.json";
import bonus2 from "@/assets/bonus-2-worksheet.png.asset.json";
import bonus3 from "@/assets/bonus-3-whatsapp.png.asset.json";
import bonus4 from "@/assets/bonus-4-community.png.asset.json";
import emanLogo from "@/assets/eman-medical-tower-logo.jpg.asset.json";
import drManalReview from "@/assets/dr-manal-whatsapp-review.jpeg.asset.json";
import drManalFatimahReview from "@/assets/dr-manal-fatimah-review.jpeg.asset.json";
import drJasimReview from "@/assets/dr-jasim-mumtaz-review.jpeg.asset.json";
import drMehwishReview from "@/assets/dr-mehwish-rasheed-review.jpeg.asset.json";
import { useEffect, useState } from "react";
import { fbqTrack } from "@/lib/fbpixel";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { CtaButton } from "@/components/site/CtaButton";
import { ProofGallery } from "@/components/site/ProofGallery";
import {
  Star, ShieldCheck, CheckCircle2, PlayCircle, Lock, BadgeCheck, Volume2,
  Stethoscope, Users, TrendingUp, Calendar, Gift, Play, ChevronDown, ArrowRight,
} from "lucide-react";
import farhanInstructor from "@/assets/farhan-instructor.jpeg.asset.json";
import doctorBeforeAfter from "@/assets/doctor-before-after.png.asset.json";
import { MasterclassCountdown } from "@/components/site/MasterclassCountdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clinic Growth Masterclass — Get 20–25 Patients Every Week" },
      { name: "description", content: "Live masterclass by Farhan Ali for Pakistani doctors. Get 20–25 new patients every week without spending hours on digital marketing. Only Rs. 999." },
      { property: "og:title", content: "Clinic Growth Masterclass — Farhan Ali" },
      { property: "og:description", content: "Discover how busy doctors are getting 20–25 patients every week — without ads, social media, or personal branding headaches." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  useEffect(() => {
    fbqTrack("ViewContent", {
      content_name: "Clinic Growth Masterclass",
      content_category: "Masterclass",
      value: 999,
      currency: "PKR",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      
      <Topbar />
      <Hero />
      <SocialProofBar />

      <WhatIsItSection />
      <WebsiteGiveawaySection />
      <BonusesSection />
      <HowItWorks />
      
      <ProofGallery />
      <WhoFor />
      <TrainerSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ---------------- ANNOUNCEMENT BAR ---------------- */

function AnnouncementBar() {
  const scrollToGiveaway = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("free-website-giveaway");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="sticky top-0 z-50 w-full bg-[#0b1735] text-white border-b border-white/10 shadow-md">
      <div className="mx-auto max-w-7xl px-3 py-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center text-[12px] sm:text-sm">
        <span className="flex items-center gap-2 leading-snug">
          <span className="bg-yellow-400 text-[#0b1735] font-extrabold px-2 py-0.5 rounded tracking-wider text-[11px] sm:text-xs whitespace-nowrap">
            🎁 SPECIAL BONUS
          </span>
          <span className="text-white/95">
            <span className="font-extrabold text-yellow-300">2 Doctors</span>, Nutritionists &amp; Healthcare Practitioners Will Be Selected For A <span className="font-bold">FREE Professional Clinic Website Setup</span>
          </span>
        </span>
        <a
          href="#free-website-giveaway"
          onClick={scrollToGiveaway}
          className="text-emerald-300 hover:text-emerald-200 underline font-bold whitespace-nowrap"
        >
          See Bonus Details →
        </a>
      </div>
    </div>
  );
}

/* ---------------- WEBSITE GIVEAWAY ---------------- */

function WebsiteGiveawaySection() {
  const benefits = [
    "Professional Clinic Website",
    "Mobile-Friendly Design",
    "WhatsApp Integration",
    "Appointment Booking Form",
    "Services & About Pages",
    "Basic SEO Setup",
  ];
  return (
    <section id="free-website-giveaway" className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <div className="relative rounded-3xl border-2 border-yellow-400/70 bg-gradient-to-br from-[#0b1735] via-[#101f47] to-[#0b1735] text-white p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(250,204,21,0.35)] overflow-hidden">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#0b1735] font-extrabold px-3 py-1 rounded-full text-xs tracking-widest uppercase shadow">
              <Gift className="size-4" /> Special Bonus Opportunity
            </div>
            <h2 className="mt-5 text-3xl md:text-5xl font-black leading-tight">
              <span className="text-yellow-300">2 Doctors</span> Will Receive A <span className="text-yellow-300">FREE Professional Clinic Website</span> Setup
            </h2>
            <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed">
              At the end of the Clinic Growth Masterclass, only <span className="font-extrabold text-yellow-300">2 doctors</span>, nutritionists, or healthcare practitioners will be selected to receive a professionally designed clinic website — completely FREE.

            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 backdrop-blur-sm">
                  <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 inline-block bg-yellow-400 text-[#0b1735] font-black px-4 py-2 rounded-lg shadow text-sm md:text-base">
              Estimated Value: PKR 30,000+
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-400/60 bg-yellow-400/10 p-5 md:p-6">
              <p className="text-sm md:text-base text-white/95 leading-relaxed">
                <span className="font-extrabold text-yellow-300">🎁 FREE Website Giveaway:</span>{" "}
                At the end of this masterclass, only <span className="font-extrabold text-yellow-300">2 doctors</span>, nutritionists, or healthcare practitioners will be selected to receive a FREE professional clinic website setup (Value: PKR 30,000+).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Reserve Your Seat + Bonus Chance">YES! I Want In</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section className="hero-bg text-white">
      <div className="mx-auto max-w-[380px] sm:max-w-2xl md:max-w-7xl px-3 sm:px-4 pt-4 pb-8 md:pt-10 md:pb-16">
        {/* Trust badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md pl-1.5 pr-3 py-1 sm:pl-2 sm:pr-5 sm:py-2 shadow-sm">
            <span className="flex items-center justify-center size-5 sm:size-7 rounded-full bg-yellow-300/20 ring-1 ring-yellow-300/40 shrink-0">
              <BadgeCheck className="size-3 sm:size-4 text-yellow-300" />
            </span>
            <span className="text-[10px] sm:text-sm font-semibold tracking-wide text-white/95 leading-snug text-center">
              Attended by Doctors, Nutritionists &amp; Clinic owners across Pakistan
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-4 md:mt-8 text-center text-[22px] leading-[1.15] sm:text-3xl md:text-5xl lg:text-6xl font-black md:leading-[1.05] uppercase">
          Discover How Busy Doctors Are Getting{" "}
          <span className="gradient-highlight">20–25 Patients</span>{" "}
          Every Week Without Spending Hours On{" "}
          <span className="gradient-highlight">Digital Marketing</span>!
        </h1>
        <p className="mt-3 md:mt-6 text-center max-w-3xl mx-auto text-sm md:text-xl text-white/85 leading-snug">
          Even if you've struggled with ads, social media, or personal branding before.
        </p>


        {/* Two column: Video + Order card */}
        <div className="mt-5 md:mt-10 grid md:grid-cols-5 gap-5 md:gap-6 items-start">
          {/* Video */}
          <div className="md:col-span-3">
            <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
              <div className="bg-topbar text-white text-center py-1.5 md:py-2 px-3 text-[11px] md:text-sm font-semibold leading-snug">
                What Medical Schools Missed: Patient Acquisition, Authority & Clinic Growth
              </div>
              <div className="relative bg-black" style={{ paddingTop: "100%" }}>
                <img
                  src={doctorBeforeAfter.url}
                  alt="Doctor before and after clinic growth — empty office vs. busy clinic with patients"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-4 md:mt-6">
              <MasterclassCountdown variant="dark" className="mb-3 md:mb-4" />
              <CtaButton subtitle="Enroll in just 999 PKR">
                YES! I Want My Patient-Getting System
              </CtaButton>
            </div>

            <TopTestimonials />



            <div className="mt-5 md:mt-8 rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 p-2 md:p-3 shadow-2xl">
              <img
                src={clinicGrowthHeroStack.url}
                alt="Clinic Growth Masterclass product stack"
                className="w-full h-auto rounded-xl"
              />
            </div>




          </div>


          {/* Order summary card */}
          <aside className="md:col-span-2 bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-5 border-b">
              <img
                src={productStack.url}
                alt="Clinic Growth Masterclass product mockup"
                className="w-full h-auto"
              />
            </div>
            <div className="p-6 text-center">
              <div className="text-lg font-extrabold">ONLY A FEW SPOTS LEFT</div>
              <div className="mt-2 text-3xl font-black text-destructive">
                ONLY <span>Rs. 999</span>
              </div>

              <p className="mt-4 text-sm">
                Get Your Seat For just <span className="font-bold">Rs. 999!</span><br />
                Live on Zoom — Sunday, 12th July 2026.
              </p>

              <InlineLeadForm />

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> 100% Secure 256-Bit Encrypted Checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}


function InlineLeadForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      id="lead-form"
      className="mt-5 space-y-3 text-left scroll-mt-24"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);

        const fullName = name.trim();
        const emailNorm = email.trim().toLowerCase();
        const wa = whatsapp.trim();
        const spec = specialty.trim();

        if (fullName.length < 2) {
          setError("Please enter your full name.");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
          setError("Please enter a valid email address.");
          return;
        }
        const digits = wa.replace(/\D/g, "");
        if (digits.length < 10) {
          setError("Please enter a valid WhatsApp number (e.g. 03XX XXXXXXX).");
          return;
        }
        if (!spec) {
          setError("Please enter your medical speciality / field of practice.");
          return;
        }

        setSubmitting(true);

        // Fire pixel immediately so it isn't blocked by the network round trip.
        try {
          fbqTrack("Lead", {
            content_name: "Clinic Growth Masterclass — Step 1 Opt-In",
            value: 0,
            currency: "PKR",
          });
        } catch {}

        // Save lead in the background — do NOT block navigation on the server function.
        // Checkout receives all fields via URL search params, so the DB row is not
        // required to render the next page. If the request fails we log and move on.
        void (async () => {
          try {
            const { upsertLead } = await import("@/lib/leads.functions");
            await upsertLead({
              data: {
                full_name: fullName,
                email: emailNorm,
                whatsapp: wa,
                specialty: spec,
                lead_status: "Opted In - Checkout Not Completed",
              },
            });
          } catch (err) {
            console.error("Background lead upsert failed", err);
          }
        })();

        const params = new URLSearchParams();
        params.set("full_name", fullName);
        params.set("email", emailNorm);
        params.set("whatsapp", wa);
        params.set("specialty", spec);
        navigate({ to: "/order", search: Object.fromEntries(params) });

      }}
    >
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name*"
        autoComplete="name"
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email*"
        autoComplete="email"
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="tel"
        inputMode="tel"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        placeholder="WhatsApp Number* (e.g. 03XX XXXXXXX)"
        autoComplete="tel"
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="text"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        placeholder="Medical Speciality / Field of Practice*"
        maxLength={120}
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="btn-cta w-full px-4 py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span>{submitting ? "SAVING..." : "GO TO STEP #2"}</span>
          <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
        </span>
        <div className="text-xs font-medium normal-case tracking-normal opacity-95">
          Reserve Your Spot Now
        </div>
      </button>
      <p className="text-[11px] text-center text-muted-foreground">
        Your details are saved securely. Payment is on the next step.
      </p>
    </form>
  );
}

function ReviewCard() {
  return (
    <>
      <div className="mt-6 rounded-lg bg-white/5 ring-1 ring-white/10 p-3 sm:p-4 text-white/95">
        <img
          src={drManalFatimahReview.url}
          alt="WhatsApp review screenshot from Dr. Manal Fatimah about the Clinic Growth Masterclass"
          className="w-full h-auto rounded-md ring-1 ring-white/10 shadow-md object-contain"
          loading="lazy"
        />
        <div className="mt-3 px-1">
          <p className="font-bold leading-tight">- Dr. Manal Fatimah</p>
          <p className="text-xs sm:text-sm text-white/80 leading-snug">Lahore, Pakistan</p>
        </div>
      </div>
      <div className="mt-5 rounded-lg bg-white/5 ring-1 ring-white/10 p-3 sm:p-4 text-white/95">
        <img
          src={drJasimReview.url}
          alt="WhatsApp review screenshot from Dr. Jasim Mumtaz about the Clinic Growth Masterclass"
          className="w-full h-auto rounded-md ring-1 ring-white/10 shadow-md object-contain"
          loading="lazy"
        />
        <div className="mt-3 px-1">
          <p className="font-bold leading-tight">- Dr. Jasim Mumtaz</p>
          <p className="text-xs sm:text-sm text-white/80 leading-snug">Peshawar</p>
        </div>
      </div>
      <div className="mt-5 rounded-lg bg-white/5 ring-1 ring-white/10 p-3 sm:p-4 text-white/95">
        <img
          src={drMehwishReview.url}
          alt="WhatsApp review screenshot from Dr. Mehwish Rasheed about the Clinic Growth Masterclass"
          className="w-full h-auto rounded-md ring-1 ring-white/10 shadow-md object-contain"
          loading="lazy"
        />
        <div className="mt-3 px-1">
          <p className="font-bold leading-tight">- Dr. Mehwish Rasheed</p>
        </div>
      </div>
      <div className="mt-7 mb-2 max-w-md mx-auto">
        <CtaButton>YES! I WANT TO ENROLL NOW →</CtaButton>
      </div>
    </>
  );
}


function TopTestimonials() {
  return (
    <div className="mt-6 md:mt-8">
      <div className="text-center mb-5 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          What Our <span className="text-yellow-400">Masterclass Attendees</span> Say
        </h2>
        <p className="mt-2 text-white/70 text-sm md:text-base">
          Real feedback from doctors and healthcare practitioners who attended the masterclass.
        </p>
      </div>
      <ReviewCard />
    </div>
  );
}


/* ---------------- SOCIAL PROOF BAR ---------------- */

function SocialProofBar() {
  return (
    <section className="bg-white py-10 border-b">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold mb-8">Trusted By Leading Clinics &amp; Doctors Across Pakistan</h2>
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="marquee-track" aria-hidden={dup === 1}>
              {[
                "The Diabetes Centre",
                "Diabetics Pakistan",
                "Sara Dietitian",
                "Emaan Gynecology Centre",
                "Kulsoom International Hospital",
                "Naqaish Hospital I-8",
              ].map((n) => (
                <div key={n} className="font-bold tracking-widest uppercase text-sm md:text-base text-muted-foreground whitespace-nowrap flex items-center">
                  {n}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHAT IS IT ---------------- */

function WhatIsItSection() {
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl md:text-5xl font-black text-center">
          What is the <br className="md:hidden" />
          <span className="gradient-highlight">Clinic Growth Masterclass?</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed">
          The Clinic Growth Masterclass is the fastest way to get a fully mapped patient-acquisition system,
          tailored to your clinic.
          <br /><br />
          without spending hours on YouTube tutorials, expensive agencies, or
          gambling on ads that don't convert.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          Because let's face it - you already know digital marketing works.&nbsp;
          <br /><br />
          You've seen other doctors blow up on Instagram. You've heard the gurus preach personal branding.
          You've probably even tried running an ad or two yourself…
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <span className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded-md ring-2 ring-red-700/40 shadow-sm">
            But the part nobody talks about? What to actually do.
          </span>
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          What should your offer be… your hook… your follow-up… your booking process?
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <span className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded-md ring-2 ring-red-700/40 shadow-sm">
            The Clinic Growth Masterclass flips the script.
          </span>
          <br /><br />
          I've eliminated months of guesswork so you can get a predictable flow of 20–25 patients every week.
        </p>

        <CurriculumAccordion />


        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Live Masterclass — Limited Seats">YES! Reserve My Seat Now</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BONUSES ---------------- */

function BonusesSection() {
  const bonuses = [
    {
      tag: "Fast Start Bonus #1",
      title: "Authority Content Cheat Sheet for Doctors",
      copy: "30 ready-to-use post ideas to position yourself as the go-to authority in your specialty — paste, post, and grow.",
      value: "Rs. 15,000",
      image: bonus1.url,
    },
    {
      tag: "Fast Start Bonus #2",
      title: "Doctor Personal Brand Positioning Worksheet",
      copy: "Define your niche, unique angle and patient promise so the right patients pick you instantly.",
      value: "Rs. 10,000",
      image: bonus2.url,
    },
    {
      tag: "Fast Start Bonus #3",
      title: "Clinic WhatsApp Follow-Up Scripts",
      copy: "Plug-and-play scripts that turn website inquiries into booked appointments — no more ghosting.",
      value: "Rs. 8,000",
      image: bonus3.url,
    },
    {
      tag: "Fast Start Bonus #4",
      title: "Private Doctor Growth Community",
      copy: "Get ongoing support, case studies, and updates with other ambitious doctors growing their practice.",
      value: "Rs. 12,000",
      image: bonus4.url,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          You Also Unlock Instant Access To<br />
          <span className="gradient-highlight">4 Additional Bonuses!</span>
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {bonuses.map((b) => (
            <div key={b.title} className="rounded-2xl border bg-card overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-secondary">
                <img src={b.image} alt={b.title} className="w-full h-auto block" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Gift className="size-4" /> {b.tag}
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-extrabold">{b.title}</h3>
                <p className="mt-3 text-muted-foreground">{b.copy}</p>
                <div className="mt-4 inline-block bg-accent text-accent-foreground font-bold px-3 py-1 rounded">
                  Value: {b.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-semibold">
          Total Bonus Value: <span className="line-through">Rs. 45,000</span> —{" "}
          <span className="text-destructive">included FREE with your seat today.</span>
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Get Your Seat + All 4 Bonuses For Rs. 999">YES! I Want The Bonuses</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    { icon: Calendar, title: "Step 1 — Reserve Your Seat", text: "Lock in your Rs. 999 spot and get the Zoom link instantly in your email." },
    { icon: Stethoscope, title: "Step 2 — Attend Live on Zoom", text: "Join the 3-hour deep-dive on Sunday, 12th July 2026 — interactive and personal." },
    { icon: TrendingUp, title: "Step 3 — Get 20–25 New Patients/Week", text: "Implement the system the same week and watch your appointment book fill up." },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          How Does The <span className="gradient-highlight">Clinic Growth Masterclass</span> Work?
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          A predictable patient-getting system mapped out for you in just 3 steps…
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl bg-card border p-8 text-center shadow-sm">
              <div className="mx-auto size-14 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <s.icon className="size-7" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */

function TestimonialsWall() {
  const reviews = [
    { name: "Dr. Sara K.", spec: "Dentist, Lahore", text: "We went from 8 to 26 booked appointments per week in 3 weeks. The system just works." },
    { name: "Dr. Bilal R.", spec: "Cardiologist, Karachi", text: "Finally a Pakistan-specific marketing system. No fluff. I implemented Module 1 the same day." },
    { name: "Dr. Hina M.", spec: "Dietitian, Islamabad", text: "My DMs are full of qualified patients. The content cheat sheet alone is worth 10x the price." },
    { name: "Dr. Junaid A.", spec: "Orthopedic, Rawalpindi", text: "I stopped wasting money on the wrong ads. ROI is finally positive — and predictable." },
    { name: "Dr. Ayesha Z.", spec: "Psychologist, Lahore", text: "Loved the live Q&A. Farhan diagnosed my bottleneck in 5 minutes." },
    { name: "Dr. Faisal H.", spec: "IVF Specialist, Karachi", text: "We crossed 100 new patient inquiries in 30 days. Strongly recommended." },
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center font-bold uppercase text-sm text-primary">Excellent — based on dozens of reviews</p>
        <h2 className="mt-3 text-center text-3xl md:text-5xl font-black tracking-tight">
          What Our <span className="text-primary">Masterclass Attendees</span> Say
        </h2>
        <p className="mt-3 text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Real feedback from doctors and healthcare practitioners who attended the masterclass.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card p-3 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              src={drManalReview.url}
              alt="WhatsApp review screenshot from Dr. Manal about the Clinic Growth Masterclass"
              className="w-full h-auto rounded-lg ring-1 ring-border shadow-md object-contain"
              loading="lazy"
            />
          </div>
          {reviews.slice(1).map((r) => (
            <div key={r.name} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex gap-0.5 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-yellow-500" />)}
              </div>
              <p className="mt-3 italic">"{r.text}"</p>
              <p className="mt-3 font-bold">{r.name}</p>
              <p className="text-sm text-muted-foreground">{r.spec}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHO FOR ---------------- */

function WhoFor() {
  const list = [
    "Doctors (MBBS, specialists, consultants)",
    "Dental clinic owners",
    "Nutritionists & dietitians",
    "Psychologists & therapists",
    "Eye specialists / ophthalmologists",
    "Orthopedic doctors",
    "Homeopathy & alternative medicine",
    "IVF & fertility specialists",
    "Physiotherapists",
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          Who's This <span className="gradient-highlight">Perfect For?</span>
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {list.map((l) => (
            <div key={l} className="flex items-center gap-3 rounded-lg bg-card border p-4">
              <Users className="size-5 text-primary shrink-0" />
              <span className="font-semibold">{l}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Only Rs. 999 — Limited Seats">Register Now</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRAINER ---------------- */

function TrainerSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
          <img
            src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/gEjfcPU9sJhDOS0NobUy/media/b28682be-8ac2-41b4-9a64-ad8c57ac0bb7.jpeg"
            alt="Farhan Ali — Healthcare Digital Marketing Expert"
            className="w-full h-auto"
          />
        </div>
        <div>
          <p className="uppercase tracking-widest text-primary font-bold text-sm">Meet Your Trainer</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-black">Farhan Ali</h2>
          <p className="mt-2 text-lg font-semibold text-muted-foreground">
            Digital Marketing Expert for Doctors, Clinics &amp; Hospitals
          </p>
          <p className="mt-4 leading-relaxed">
            Farhan is a Healthcare Digital Marketing Expert with 3+ years of hands-on experience helping
            doctors and clinic owners grow their practice through proven, Pakistan-specific patient acquisition
            systems.
          </p>
          <p className="mt-3 leading-relaxed">He has worked closely with:</p>
          <ul className="mt-3 grid grid-cols-2 gap-y-2">
            {["Diabetologists","Nutritionists","Psychologists","Cardiologists","Dentists","Endocrinologists"].map((s) => (
              <li key={s} className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" />{s}</li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed">
            Farhan specializes in patient acquisition systems, clinic branding, and lead generation designed
            specifically for healthcare professionals in Pakistan — without wasting money on ads or relying on
            complicated tactics.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- GUARANTEE ---------------- */

function GuaranteeSection() {
  const accessPoints: { title: string; desc: string }[] = [
    { title: "Local Patient Domination System", desc: "Get found by more local patients." },
    { title: "Doctor Personal Brand Blueprint", desc: "Build trust and stand out online." },
    { title: "2-Hour Content Creation System", desc: "Create weeks of content faster with AI." },
    { title: "Patient Acquisition Through Digital Marketing", desc: "Attract patients with simple Meta ad strategies." },
    { title: "Irresistible Clinic Offer Framework", desc: "Create offers patients actually respond to." },
    { title: "Patient Acquisition Machine", desc: "Turn visibility into inquiries and appointments." },
  ];


  const reassurance = [
    "No complicated forms.",
    "No awkward questioning.",
    "No unnecessary back-and-forth.",
    "You can keep the training resources and bonuses.",
  ];
  return (
    <section className="py-12 md:py-20 bg-hero-deep">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 bg-[#FFF8E7]">
          {/* Headline box */}
          <div
            className="relative px-5 py-8 md:px-10 md:py-10 text-center text-white"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--cta-from), oklch(0.62 0.24 25))",
            }}
          >
            <div className="mx-auto mb-4 size-16 md:size-20 rounded-full bg-white/15 ring-4 ring-white/30 grid place-items-center backdrop-blur-sm">
              <ShieldCheck className="size-9 md:size-11" />
            </div>
            <p className="uppercase tracking-widest text-xs md:text-sm font-bold opacity-95">
              7-Day Money-Back Guarantee
            </p>
            <h2 className="mt-2 text-2xl md:text-4xl font-black leading-tight">
              The Best Money-Back Guarantee for Doctors Who Want More Patients
            </h2>
          </div>

          {/* Body */}
          <div className="px-5 py-8 md:px-10 md:py-12 text-foreground">
            <div className="space-y-4 text-base md:text-lg leading-relaxed">
              <p>Before enrolling in any training, you deserve to know exactly what you are getting.</p>
              <p>And more importantly…</p>
              <p className="font-bold">You deserve to know that your investment is protected.</p>
              <p>
                I want you to feel completely comfortable joining the Clinic Growth Masterclass.
              </p>
              <p>Even though the investment is only <span className="font-bold">PKR 999</span>.</p>
              <p>
                Because this is not another motivational webinar where you leave with notes but no clear
                action plan.
              </p>
            </div>

            {/* Access list */}
            <h3 className="mt-10 text-xl md:text-2xl font-black">Here Is What You Will Learn Inside the Clinic Growth Masterclass:</h3>
            <ul className="mt-5 space-y-2.5">
              {accessPoints.map((p) => (
                <li key={p.title} className="flex items-start gap-2.5 rounded-lg bg-white/60 border border-emerald-100 px-3 py-2">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base leading-snug">
                    <span className="font-bold">{p.title}</span>
                    <span className="text-slate-700"> — {p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>



            {/* Guarantee copy */}
            <div className="mt-10 space-y-4 text-base md:text-lg leading-relaxed">
              <p>Watch the training.</p>
              <p>Apply the strategies.</p>
              <p>Choose at least one action step for your clinic.</p>
              <p className="font-bold">Then make up your own mind.</p>
              <p>
                If you genuinely feel that the masterclass did not give you practical, useful ideas to
                help you attract more patients and grow your clinic…
              </p>
              <p>
                Simply message us within <span className="font-bold">7 days</span> of joining and ask for
                a refund.
              </p>
              <p className="font-bold text-emerald-700">We will return your PKR 999.</p>
            </div>

            {/* Reassurance box */}
            <div className="mt-8 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-50 p-5 md:p-6">
              <ul className="space-y-2.5">
                {reassurance.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-1" />
                    <span className="font-semibold">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 text-center text-base md:text-lg italic text-muted-foreground">
              That is how confident we are that this masterclass can help you build a stronger, more
              independent patient-acquisition system.
            </p>

            {/* CTA */}
            <div className="mt-8 max-w-md mx-auto">
              <CtaButton subtitle="Only Rs. 999 — Live on Sunday, 12th July">
                Join Clinic Growth Masterclass Risk-Free →
              </CtaButton>
              <p className="mt-3 text-center text-xs md:text-sm text-muted-foreground font-medium">
                7-Day Money-Back Guarantee • Secure Payment • Instant Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQSection() {
  const faqs = [
    {
      q: "1. How will the training be conducted?",
      a: "The training will be conducted LIVE on Zoom. You'll receive the meeting link in your email immediately after registration.",
    },
    {
      q: "2. Do I need any prior marketing experience?",
      a: "Not at all. This masterclass is designed for busy doctors with zero marketing experience. We teach the system step-by-step.",
    },
    {
      q: "3. Will I get the recording of the program?",
      a: "Yes. A recording will be shared with participants who are genuinely unable to attend live.\n\nHowever, we strongly recommend joining live because that is where you will get the most value. You can follow the strategies in real time, stay focused, participate in discussions, and take action while the training is happening.\n\nAlso, live attendees may get access to special opportunities during the session — including the chance to receive a free clinic website. This opportunity is only available for people attending live and will not apply to those watching the recording later.\n\nThe recording is there as a backup, but attending live gives you the complete experience and the best chance to benefit from everything included.",

    },
    {
      q: "4. When is the masterclass?",
      a: "Sunday, 12th July 2026 — from 5:00 PM to 8:00 PM (PKT). Block your calendar now.",
    },
    {
      q: "5. Is this only for Pakistani doctors?",
      a: "Yes — every example, ad strategy and follow-up flow is built specifically for the Pakistani healthcare market.",
    },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">FAQs</h2>
        <p className="text-center text-muted-foreground mt-2">
          Find answers to commonly asked questions about the Clinic Growth Masterclass.
        </p>
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-lg border bg-card p-5">
              <summary className="cursor-pointer list-none font-bold text-lg flex justify-between items-center">
                {f.q}
                <span className="ml-4 text-primary group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground whitespace-pre-line">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCta() {
  return (
    <section className="hero-bg text-white py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="uppercase tracking-widest text-yellow-300 font-bold">Limited-Time Offer</p>
        <h2 className="mt-2 text-2xl md:text-5xl font-black">
          Reserve your spot before all seats fill.
        </h2>
        <p className="mt-4 text-lg text-white/85">
          Price will increase soon — lock in your seat for just <span className="font-bold">Rs. 999</span> today.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <MasterclassCountdown variant="dark" className="mb-6" />
          <CtaButton subtitle="Enroll Now — Only Rs. 999">YES! Reserve My Seat</CtaButton>
        </div>

        <p className="mt-6 text-sm text-white/70">
          Questions? Email{" "}
          <a className="underline" href="mailto:Farhanali13440@gmail.com">Farhanali13440@gmail.com</a>{" "}
          or call <a className="underline" href="tel:+923390057379">+92 339 0057379</a>
        </p>
      </div>
    </section>
  );
}

/* ---------------- CURRICULUM ACCORDION ---------------- */

function CurriculumAccordion() {
  const modules = [
    {
      label: "MODULE #1",
      title: "Local Patient Domination System",
      desc: "Position your clinic as the obvious choice in your city using Google Business Profile, local visibility strategies and patient trust signals.",
      duration: "Module 01",
      intro: "Become the #1 search result patients see when they're looking for your specialty in your city.",
      points: [
        "Google Business Profile optimization for clinics",
        "Local visibility strategies that compound weekly",
        "Patient trust signals that turn views into bookings",
      ],
    },
    {
      label: "MODULE #2",
      title: "Doctor Personal Brand Blueprint",
      desc: "How doctors and healthcare practitioners can build trust online, stand out from competitors and become the first choice for patients.",
      duration: "Module 02",
      intro: "Build a doctor-brand patients trust on sight — and pre-choose before they ever call.",
      points: [
        "Stand out from every other doctor in your city",
        "The trust-building content patients actually consume",
        "Position yourself as the obvious specialist of choice",
      ],
    },
    {
      label: "MODULE #3",
      title: "2-Hour Content Creation System",
      desc: "Create weeks of educational content in a single sitting using patient FAQs, content frameworks and AI-assisted workflows.",
      duration: "Module 03",
      intro: "Stop staring at a blank screen. Batch a month of content in one focused session.",
      points: [
        "Patient-FAQ content framework that always converts",
        "AI-assisted workflows tailored for doctors",
        "Repurpose 1 idea into 10 high-trust pieces",
      ],
    },
    {
      label: "MODULE #4",
      title: "Patient Acquisition Through Digital Marketing",
      desc: "The simple strategy to reach local patients consistently using Meta Ads and digital marketing — without wasting money on random tactics.",
      duration: "Module 04",
      intro: "A predictable patient-flow system using Meta Ads — built for Pakistani healthcare.",
      points: [
        "Meta Ads setup that targets real local patients",
        "Ad creatives proven to work for clinics",
        "Track every rupee back to a booked appointment",
      ],
    },
    {
      label: "MODULE #5",
      title: "Irresistible Clinic Offer Framework",
      desc: "Create offers patients actually respond to — instead of promoting generic consultations and services.",
      duration: "Module 05",
      intro: "The exact offer structure that gets your phone ringing this week.",
      points: [
        "The Irresistible Offer formula for clinics",
        "Pricing & positioning that doesn't cheapen your brand",
        "Hook patients without discounting your services",
      ],
    },
    {
      label: "MODULE #6",
      title: "Patient Acquisition Machine",
      desc: "Build a simple patient acquisition system that turns strangers into inquiries, inquiries into appointments, and appointments into long-term patients.",
      duration: "Module 06",
      intro: "Connect every piece into one self-running machine that fills your appointment book weekly.",
      points: [
        "End-to-end patient journey mapping",
        "WhatsApp + booking automation that converts",
        "Retain patients for long-term clinic growth",
      ],
    },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <div className="inline-block text-xs font-bold tracking-[0.25em] text-primary uppercase">
          Training Curriculum
        </div>
        <h3 className="mt-2 text-2xl md:text-4xl font-black uppercase tracking-tight">
          What You'll Learn Inside The Clinic Growth Masterclass
        </h3>
      </div>

      <div className="space-y-4">
        {modules.map((m, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={m.title}
              className={`group rounded-2xl border bg-[#0f172a] text-white shadow-lg overflow-hidden transition-all duration-300 hover:border-primary/60 ${
                isOpen ? "border-primary/70 shadow-primary/20" : "border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
              >
                <img
                  src={farhanInstructor.url}
                  alt="Farhan Ali — Instructor"
                  className="size-16 md:size-20 rounded-xl object-cover ring-2 ring-primary/40 shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] md:text-xs font-bold tracking-[0.18em] text-primary uppercase">
                    {m.label}
                  </div>
                  <h4 className="mt-1 text-base md:text-xl font-extrabold leading-tight">
                    {m.title}
                  </h4>
                  <p className="mt-1 text-xs md:text-sm text-white/70 line-clamp-2">
                    {m.desc}
                  </p>
                  <span className="mt-2 inline-block bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-2 py-0.5 rounded">
                    Farhan Ali
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {m.duration}
                  </span>
                  <ChevronDown
                    className={`size-6 text-white/80 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <ChevronDown
                  className={`sm:hidden size-5 text-white/80 transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 md:px-5 pb-5 pt-1 border-t border-white/10">
                    <p className="mt-4 text-sm md:text-base text-white/75">
                      {m.intro}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {m.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm md:text-base">
                          <span className="mt-0.5 size-6 rounded-full bg-primary/20 text-primary grid place-items-center shrink-0 ring-1 ring-primary/40">
                            <Play className="size-3 fill-primary" />
                          </span>
                          <span className="text-white/90">{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="sm:hidden mt-4">
                      <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                        {m.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

