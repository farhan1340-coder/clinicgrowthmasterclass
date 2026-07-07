import { CheckCircle2, ShieldCheck, Wallet, Sparkles, Users2, PlayCircle, Handshake, HeartHandshake, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/site/CtaButton";

/* --------- 1. Is This For You? --------- */
export function IsThisForYouSection() {
  const bullets = [
    "How to attract local patients in your city",
    "How to create an offer for your specific specialty",
    "How to turn inquiries into booked appointments",
    "How to build trust even if you don't have a large social following",
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Will This Work for Your <span className="gradient-highlight">Specialty & City?</span>
        </h2>
        <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-700">
          Whether you're a doctor, dentist, nutritionist, physiotherapist, psychologist,
          dermatologist, gynecologist, or clinic owner…
        </p>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700">
          This masterclass is designed to help healthcare practitioners attract more local patient
          inquiries through Facebook, Instagram, Google, content, and WhatsApp.
        </p>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700">
          You'll learn principles that can be applied according to your specialty, services, city,
          and patient type.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border bg-secondary/40 px-4 py-3">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------- 2. What You Will Leave With --------- */
export function WhatYoullLeaveWithSection() {
  const outcomes = [
    "A clear patient-attraction strategy for your clinic",
    "A simple, irresistible offer idea for your specialty",
    "A plan to generate patient inquiries through Meta Ads",
    "A Google Business Profile strategy to get found locally",
    "A content system to build trust with potential patients",
    "A WhatsApp follow-up process to convert inquiries into appointments",
    "A low-ticket to high-ticket patient journey framework",
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          This Is Not Just Another <span className="gradient-highlight">Marketing Lecture</span>
        </h2>
        <p className="mt-4 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          By the end of the masterclass, you'll have clarity on exactly what to do next to grow your
          clinic.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {outcomes.map((o) => (
            <div key={o} className="flex items-start gap-3 rounded-xl bg-card border p-4 shadow-sm">
              <span className="mt-0.5 shrink-0 size-7 rounded-full bg-primary/10 text-primary grid place-items-center">
                <Sparkles className="size-4" />
              </span>
              <span className="text-sm md:text-base font-semibold text-slate-800">{o}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm md:text-base font-bold text-slate-900 bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-3 max-w-3xl mx-auto">
          You don't need to implement everything in one day. You'll leave knowing the next practical
          steps for your clinic.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <CtaButton subtitle="Live Masterclass — Rs. 999">Yes, I Want More Patient Appointments</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* --------- 3. No Marketing or Technical Experience Needed --------- */
export function NotTechnicalSection() {
  const items = [
    "What actually matters for getting more patient appointments",
    "What you can do yourself",
    "What you can delegate later",
    "Where not to waste money on random agencies or unnecessary marketing activities",
  ];
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          No Marketing or <span className="gradient-highlight">Technical Experience Needed</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed">
          You don't need to be an expert in Meta Ads, websites, pixels, automation, funnels, or
          Google Business Profile.
        </p>
        <p className="mt-3 text-base md:text-lg text-slate-700 leading-relaxed">
          Everything will be explained in simple, practical language specifically for healthcare
          practitioners. You will understand:
        </p>
        <ul className="mt-6 space-y-3">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border bg-secondary/40 p-4">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold text-slate-800">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------- 4. You Do Not Need a Huge Budget --------- */
export function BudgetSection() {
  const bullets = [
    "Start with the services you already offer",
    "Start with a manageable local ad budget",
    "Use simple tools before investing in advanced systems",
    "Focus on booked appointments, not vanity metrics like likes and followers",
  ];
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full bg-emerald-100 grid place-items-center">
            <Wallet className="size-7 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-black">
          You Don't Need a <span className="gradient-highlight">Huge Budget to Start</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
          The purpose of this masterclass is not to force you into spending a large amount on ads or
          software. You'll learn how to start with a simple patient acquisition system and scale
          only when you see what's working.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl bg-card border p-4">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold">{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm md:text-base font-bold text-emerald-900 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3 max-w-3xl mx-auto">
          The goal isn't to spend more. The goal is to make every rupee you spend on marketing more
          intentional.
        </p>
      </div>
    </section>
  );
}

/* --------- 5. Built For Healthcare Practitioners (patient journey flow) --------- */
export function CredibilitySection() {
  const flow = [
    "Offer",
    "Ads / Google / Content",
    "Patient Inquiry",
    "WhatsApp Follow-Up",
    "Booked Appointment",
    "Repeat Patient / Higher-Value Service",
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Built Specifically for <span className="gradient-highlight">Healthcare Practitioners</span>
        </h2>
        <p className="mt-5 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          Clinic Growth Masterclass is created for practitioners who want more than random posting,
          boosted posts, and agency promises.
        </p>
        <p className="mt-3 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          This training focuses on the complete patient journey:
        </p>

        <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {flow.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 md:gap-3">
                <div className="rounded-lg bg-white border-2 border-primary/30 px-3 py-2 md:px-4 md:py-2.5 shadow-sm">
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary">
                    Step {idx + 1}
                  </div>
                  <div className="text-xs md:text-sm font-black text-slate-900">{step}</div>
                </div>
                {idx < flow.length - 1 && (
                  <ArrowRight className="size-4 md:size-5 text-primary/60 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm md:text-base text-slate-700 max-w-3xl mx-auto">
          You'll learn the same framework that can be adapted for clinics, hospitals, private
          practices, aesthetic clinics, therapy practices, dental clinics, and wellness businesses.
        </p>
      </div>
    </section>
  );
}

/* --------- 6. Busy With Patients? Replay Access --------- */
export function LiveReplayAccessSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full bg-primary/10 grid place-items-center">
            <PlayCircle className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Busy With Patients? <span className="gradient-highlight">You'll Still Have Access</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
          The masterclass is conducted live so you can understand the strategy properly and ask
          questions. But if you can't attend the full live session, no problem.
        </p>
        <div className="mt-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 md:p-8 text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Included</div>
          <div className="mt-2 text-xl md:text-2xl font-black text-emerald-900">
            Every registered participant gets 7-day replay access.
          </div>
          <p className="mt-3 text-sm md:text-base text-emerald-900/80">
            Watch the session at your own pace and revisit the important parts after the live training.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------- 7. Not Generic Advice (specialty examples) --------- */
export function NotGenericSection() {
  const examples = [
    { s: "Dermatologist", f: "Skin analysis offer → treatment plan → procedures" },
    { s: "Gynecologist", f: "Consultation offer → follow-up → maternity / treatment services" },
    { s: "Dentist", f: "Check-up or smile consultation → treatment plan → dental procedures" },
    { s: "Nutritionist", f: "Assessment offer → personalized plan → long-term coaching" },
    { s: "Physiotherapist", f: "Pain assessment → treatment sessions → recovery plan" },
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Not Generic <span className="gradient-highlight">Marketing Advice</span>
        </h2>
        <p className="mt-5 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          This isn't a training filled with vague motivation like "post consistently" or "make better
          reels." You'll learn how to apply the system to your own specialty.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((e) => (
            <div key={e.s} className="rounded-xl border-2 border-slate-200 bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">{e.s}</div>
              <div className="mt-2 text-sm md:text-base font-semibold text-slate-800 leading-snug">
                {e.f}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- 8. Support / Community Section --------- */
export function SupportSection() {
  const bullets = [
    "Ask questions after the training",
    "Get practical reminders and implementation guidance",
    "Receive useful templates, ideas, and updates",
    "Learn alongside other healthcare practitioners",
  ];
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full bg-primary/10 grid place-items-center">
            <Users2 className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-black">
          You Won't Be Left <span className="gradient-highlight">Confused After the Session</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
          After enrolling, you'll also get access to the Clinic Growth community where you can stay
          connected, receive updates, and get support around the concepts taught in the masterclass.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl bg-card border p-4">
              <HeartHandshake className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------- 9. Transparency Section --------- */
export function TransparencySection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full bg-amber-100 grid place-items-center">
            <Handshake className="size-7 text-amber-600" />
          </div>
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Will You Be Pitched <span className="gradient-highlight">Another Service Later?</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed">
          Yes — there may be an option for doctors who want done-for-you implementation support
          after the masterclass.
        </p>
        <p className="mt-3 text-base md:text-lg text-slate-700 leading-relaxed">
          However, the Clinic Growth Masterclass itself is designed to give you real value,
          practical strategies, and a complete roadmap even if you never purchase any other service
          from us.
        </p>
        <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5 md:p-6">
          <p className="text-sm md:text-base font-bold text-amber-900 text-center">
            You can attend the masterclass, apply the strategies yourself, and still get full value
            from your registration.
          </p>
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <CtaButton subtitle="Live Masterclass — Rs. 999">Reserve My Masterclass Seat</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* --------- Checkout: Before You Register reassurance --------- */
export function BeforeYouRegisterBox() {
  const items = [
    "Live Clinic Growth Masterclass access",
    "7-day replay access",
    "Patient acquisition strategy for healthcare practitioners",
    "Offer creation framework for your specialty",
    "Meta Ads, Google Business Profile, content & WhatsApp booking guidance",
    "Access to the Clinic Growth community",
  ];
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="size-5 text-sky-600" />
        <h2 className="text-base font-black text-slate-900">Before You Register — Your Registration Includes:</h2>
      </div>
      <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-0.5 shrink-0 grid place-items-center size-5 rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="size-3.5" strokeWidth={3} />
            </span>
            <span className="font-semibold">{it}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg bg-sky-50 border border-sky-200 px-4 py-3 text-xs sm:text-sm font-bold text-sky-900 text-center">
        This is for healthcare practitioners who want more patient appointments — not just more followers.
      </p>
    </section>
  );
}

/* --------- Checkout: FAQ --------- */
export function CheckoutFAQ() {
  const faqs = [
    { q: "Is this only for doctors?", a: "No. It's suitable for doctors, dentists, nutritionists, physiotherapists, psychologists, aesthetic practitioners, clinic owners, and other healthcare professionals." },
    { q: "Do I need previous marketing experience?", a: "No. The training is designed for beginners and explained in simple language." },
    { q: "Will this work in my city?", a: "Yes. The strategies are built around attracting local patients in your city through Google, Meta Ads, content, and WhatsApp." },
    { q: "What if I can't attend live?", a: "Every registered participant gets 7-day replay access." },
    { q: "Will I need a big advertising budget?", a: "No. You'll learn how to start with a practical budget and scale based on results." },
    { q: "Is this only a sales pitch?", a: "No. The masterclass provides a complete actionable roadmap that you can apply yourself, whether or not you choose any future implementation service." },
  ];
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-lg border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-900 flex justify-between items-center">
              {f.q}
              <span className="ml-4 text-sky-600 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
