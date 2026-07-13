import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, Calendar, Users, MessageCircle, ShieldCheck, Gift, ArrowRight } from "lucide-react";
import { getThankYouEntitlements } from "@/lib/thankyou.functions";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Payment Screenshot Received" },
      { name: "description", content: "Your payment screenshot has been received. Join the WhatsApp community for masterclass details, Zoom link, and reminders." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const navigate = useNavigate();
  const waCommunity = "https://chat.whatsapp.com/DhlRVO5yfviAusaRw7bKCT";
  const waSupport = `https://wa.me/923135944817?text=${encodeURIComponent(
    "Assalam-o-Alaikum, I need help with my Clinic Growth Masterclass order.",
  )}`;

  
  const [promptVaultUnlocked, setPromptVaultUnlocked] = useState(false);
  const [gateChecked, setGateChecked] = useState(false);

  useEffect(() => {
    // GATE: only real buyers (with a lead id from checkout) may see this page.
    // Anyone hitting /thank-you directly is bounced to the sales page.
    let leadId: string | null = null;
    try {
      const url = new URL(window.location.href);
      leadId = url.searchParams.get("lead") || localStorage.getItem("cgm_last_lead");
    } catch {}

    if (!leadId) {
      navigate({ to: "/", replace: true });
      return;
    }
    setGateChecked(true);


    getThankYouEntitlements({ data: { leadId } })
      .then((res) => {
        if (res?.promptVault) setPromptVaultUnlocked(true);
      })
      .catch(() => {
        /* silently ignore — no bonus shown */
      });
  }, [navigate]);

  if (!gateChecked) {
    return (
      <div className="min-h-screen grid place-items-center bg-secondary">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      <main className="bg-secondary flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
          {/* Success */}
          <section className="bg-card rounded-2xl border shadow-sm p-8 text-center">
            <div className="mx-auto size-16 rounded-full bg-emerald-100 grid place-items-center">
              <CheckCircle2 className="size-10 text-emerald-600" />
            </div>
            <h1 className="mt-4 text-2xl md:text-3xl font-black">
              ✅ Payment Screenshot Received
            </h1>
            <p className="mt-3 text-muted-foreground">
              Thank you for submitting your payment screenshot. Our team will verify your
              payment and process your access shortly.
            </p>
          </section>


          {/* Prompt Vault bonus — only when purchased */}
          {promptVaultUnlocked && (
            <section className="bg-card rounded-2xl border-2 border-emerald-200 shadow-sm p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="size-10 rounded-full bg-emerald-100 grid place-items-center">
                  <Gift className="size-5 text-emerald-600" />
                </div>
                <h2 className="text-lg md:text-xl font-extrabold">🎁 Your Bonus Is Ready</h2>
              </div>
              <p className="mt-3 font-semibold text-slate-900">
                You have unlocked the AI Content Prompt Vault for Doctors &amp; Healthcare Practitioners.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Use these ready-made prompts to create Facebook and Instagram video ads, Reels,
                patient education posts, captions, WhatsApp follow-ups, and 7-day / 30-day content
                plans in minutes.
              </p>
              <a
                href="https://docs.google.com/document/d/1hoBs3fP65ta11gwvugQ_MrRMBUBVxPDiJT9AZizdgYE/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta inline-flex items-center gap-2 w-full md:w-auto mt-5 px-6 py-4 text-base md:text-lg justify-center"
              >
                <span>Access My AI Content Prompt Vault</span>
                <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
              </a>
            </section>
          )}

          {/* Masterclass details */}
          <section className="bg-card rounded-2xl border shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 grid place-items-center">
                <Calendar className="size-5 text-primary" />
              </div>
              <h2 className="text-lg font-extrabold uppercase tracking-wide">📅 Masterclass Details</h2>
            </div>
            <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 text-center">
              <div className="text-sm uppercase tracking-widest opacity-90">Live on Zoom</div>
              <div className="mt-1 text-2xl md:text-3xl font-black">Sunday, 26th July 2026</div>
              <div className="mt-1 text-lg font-bold">5:30 PM – 8:00 PM (Pakistan Time)</div>
            </div>
          </section>

          {/* WhatsApp community */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="size-10 rounded-full bg-emerald-100 grid place-items-center">
                <Users className="size-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-extrabold uppercase tracking-wide">👥 Join WhatsApp Community</h2>
            </div>
            <a
              href={waCommunity}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta inline-flex items-center gap-2 w-full md:w-auto mt-5 px-6 py-4 text-base md:text-lg justify-center"
            >
              <span>Join WhatsApp Community</span>
              <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              In this community, you will receive the Zoom link, reminders, important
              announcements, and all training updates.
            </p>
          </section>

          {/* Support */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="size-10 rounded-full bg-emerald-100 grid place-items-center">
                <MessageCircle className="size-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-extrabold uppercase tracking-wide">💬 Need Help?</h2>
            </div>
            <a
              href={waSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full md:w-auto mt-5 px-6 py-3 rounded-md border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 justify-center"
            >
              Contact Support on WhatsApp
            </a>
          </section>

          {/* Notice */}
          <section className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-5 flex gap-3">
            <ShieldCheck className="size-6 text-yellow-700 shrink-0 mt-0.5" />
            <div className="text-sm text-slate-800">
              <div className="font-bold mb-1">🔒 Access Processing Notice</div>
              <p>
                Our team will verify your payment screenshot and process your access shortly.
                Please keep an eye on your WhatsApp and email for updates.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
