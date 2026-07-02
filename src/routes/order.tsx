import { createFileRoute, useNavigate } from "@tanstack/react-router";
import productStack from "@/assets/product-stack.png.asset.json";
import { useMemo, useState, useEffect, useRef } from "react";
import { Footer } from "@/components/site/Footer";
import { Lock, ShieldCheck, ArrowRight, ChevronDown, CreditCard, Upload, ImageIcon, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fbqTrack } from "@/lib/fbpixel";
import { createScreenshotSignedUrl } from "@/lib/payment-screenshot.functions";

type OrderSearch = {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
};

function pickStr(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return undefined;
}

export const Route = createFileRoute("/order")({
  validateSearch: (search: Record<string, unknown>): OrderSearch => ({
    name: pickStr(search.name, search.full_name, search.fullname),
    email: pickStr(search.email),
    phone: pickStr(search.phone, search.whatsapp, search.mobile),
    specialty: pickStr(search.specialty, search.speciality, search.field),
  }),
  head: () => ({
    meta: [
      { title: "Checkout — Clinic Growth Masterclass" },
      { name: "description", content: "Secure your seat in the Clinic Growth Masterclass for Rs. 999. Add high-converting order bumps to maximize your results." },
    ],
  }),
  component: OrderPage,
});

const BUMPS = [
  {
    id: "strategy",
    title: "1-on-1 Personalized Digital Marketing Strategy Session",
    price: 3999,
    badge: "Most Popular",
    description: "90-min private strategy call, custom patient growth plan, Meta Ads guidance, website review, and 15 days WhatsApp support.",
  },
  {
    id: "prompts",
    title: "AI Content Prompt Vault for Doctors",
    price: 699,
    badge: "Recommended",
    description: "Ready-to-use AI prompts for social posts, patient education, and lead generation — save hours every week.",
  },
] as const;

const PAYMENT_ACCOUNTS = {
  easypaisa: { label: "Easypaisa", name: "Farhan Ali Rasheed", account: "03135944817" },
  jazzcash: { label: "JazzCash", name: "Farhan Ali Rasheed", account: "03135944817" },
} as const;
type PayMethod = keyof typeof PAYMENT_ACCOUNTS;

const MAIN_PRODUCT = { title: "Clinic Growth Masterclass", price: 999 };

function OrderPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const ghlName = (search.name ?? "").trim();
  const ghlEmail = (search.email ?? "").trim().toLowerCase();
  const ghlPhone = (search.phone ?? "").trim();
  const ghlSpecialty = (search.specialty ?? "").trim();
  const hasGhlContact = !!(ghlName && ghlEmail && ghlPhone);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (hasGhlContact) {
        sessionStorage.setItem(
          "ghl_lead",
          JSON.stringify({ name: ghlName, email: ghlEmail, phone: ghlPhone, specialty: ghlSpecialty }),
        );
      }
    } catch {
      /* ignore */
    }
  }, [hasGhlContact, ghlName, ghlEmail, ghlPhone, ghlSpecialty]);

  function getLead() {
    if (hasGhlContact) {
      return {
        full_name: ghlName,
        email: ghlEmail,
        whatsapp: ghlPhone,
        specialty: ghlSpecialty || undefined,
        source: "GHL Opt-In",
      };
    }
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("ghl_lead");
        if (raw) {
          const p = JSON.parse(raw) as { name?: string; email?: string; phone?: string; specialty?: string };
          if (p.name && p.email && p.phone) {
            return {
              full_name: p.name,
              email: p.email.toLowerCase(),
              whatsapp: p.phone,
              specialty: p.specialty || undefined,
              source: "GHL Opt-In",
            };
          }
        }
      } catch {
        /* ignore */
      }
    }
    return null;
  }

  const [bumps, setBumps] = useState<Record<string, boolean>>({});
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("easypaisa");
  const [submitting, setSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const purchaseFiredRef = useRef(false);

  useEffect(() => {
    fbqTrack("InitiateCheckout", { value: 999, currency: "PKR" });
  }, []);

  const items = useMemo(() => {
    const list: { id: string; title: string; price: number; qty: number }[] = [
      { id: "main", title: MAIN_PRODUCT.title, price: MAIN_PRODUCT.price, qty: 1 },
    ];
    for (const b of BUMPS) {
      if (bumps[b.id]) list.push({ id: b.id, title: b.title, price: b.price, qty: 1 });
    }
    return list;
  }, [bumps]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

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
    if (!screenshot) {
      setUploadError("Please upload your payment screenshot before submitting.");
      return;
    }
    setSubmitting(true);

    const selectedBumps = BUMPS.filter((b) => bumps[b.id]).map((b) => ({
      id: b.id,
      title: b.title,
      price: b.price,
    }));

    const stored = getLead();
    const isDirect = !stored;
    const leadFullName = stored?.full_name ?? "Direct Visitor";
    const leadEmail = stored?.email ?? `direct-${Date.now()}@unknown.local`;
    const leadWhatsapp = stored?.whatsapp ?? "unknown";
    const leadSpecialty = stored?.specialty;
    const leadStatus = isDirect
      ? "Direct Checkout / Missing GHL Details"
      : "Pending Payment";

    let screenshotPath: string | null = null;
    try {
      const ext = screenshot.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeEmail = leadEmail.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
      const path = `${Date.now()}-${safeEmail}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, screenshot, { contentType: screenshot.type, upsert: false });
      if (upErr) throw upErr;
      try {
        const { url } = await createScreenshotSignedUrl({ data: { path } });
        screenshotPath = url;
      } catch (e) {
        console.error("Signed URL creation failed", e);
        screenshotPath = path;
      }
    } catch (err) {
      console.error("Screenshot upload failed", err);
      setUploadError("Failed to upload screenshot. Please try again.");
      setSubmitting(false);
      return;
    }

    let savedLeadId: string | null = null;
    let savedOrder: { strategy_session_order_bump_selected: unknown } | null = null;
    try {
      const { upsertLead } = await import("@/lib/leads.functions");
      const saved = await upsertLead({
        data: {
          full_name: leadFullName,
          email: leadEmail,
          whatsapp: leadWhatsapp,
          specialty: leadSpecialty,
          selected_order_bumps: selectedBumps,
          total_amount: total,
          payment_method: PAYMENT_ACCOUNTS[paymentMethod].label,
          lead_status: leadStatus,
          payment_screenshot_url: screenshotPath,
        },
      });
      savedLeadId = saved.id;
      savedOrder = saved;
    } catch (err) {
      console.error("Failed to save lead", err);
    }

    if (!savedLeadId || !savedOrder) {
      console.warn("[FINAL CHECKOUT REDIRECT] missing saved order — stopping redirect", { savedLeadId });
      setUploadError("Payment proof uploaded, but we couldn't save your order details. Please submit again.");
      setSubmitting(false);
      return;
    }

    if (!purchaseFiredRef.current) {
      purchaseFiredRef.current = true;
      fbqTrack("Purchase", {
        value: 999,
        currency: "PKR",
        content_name: "Clinic Growth Masterclass",
      });
      console.log("Meta Pixel Purchase fired after payment screenshot submit");
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cgm_last_lead", savedLeadId);
      }
    } catch {}

    navigate({ to: "/onboarding", search: { lead: savedLeadId }, replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      {/* Top blue bar */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <Lock className="size-3.5 sm:size-4" />
        <span>Secure Checkout • Clinic Growth Masterclass</span>
      </div>

      {/* Headline */}
      <div className="px-4 pt-8 pb-6 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          You're One Step Away From <span className="text-sky-600">Filling Your Clinic</span>
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Complete your order below to confirm your seat.
        </p>
      </div>

      <main className="flex-1 px-4 pb-16">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-5 gap-6">
          {/* LEFT */}
          <form className="lg:col-span-3 space-y-5 min-w-0" onSubmit={handleSubmit}>
            {/* Your Order */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 mb-4">Your Order</h2>
              <div className="divide-y divide-slate-100">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 text-sm text-slate-700 break-words">{i.title}</div>
                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">Rs. {i.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Bumps */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-black text-slate-900">Upgrade Your Order</h2>
                <span className="text-xs font-bold uppercase tracking-wide text-sky-600 bg-sky-50 rounded-full px-2 py-0.5">Optional</span>
              </div>
              <div className="space-y-3">
                {BUMPS.map((b) => {
                  const checked = !!bumps[b.id];
                  return (
                    <label
                      key={b.id}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition ${
                        checked
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setBumps((s) => ({ ...s, [b.id]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <span className={`grid place-items-center size-5 rounded border-2 transition ${
                          checked ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-300"
                        }`}>
                          {checked && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{b.title}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            checked ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"
                          }`}>{b.badge}</span>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{b.description}</p>
                        <div className="mt-2 text-sm font-black text-emerald-700">
                          + Rs. {b.price.toLocaleString()}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <CreditCard className="size-4 text-sky-600" /> Payment Method
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                Select method, send payment, then upload screenshot below.
              </p>

              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PayMethod)}
                  className="appearance-none w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-11 text-sm font-bold text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 cursor-pointer"
                >
                  <option value="easypaisa">📱 Easypaisa</option>
                  <option value="jazzcash">📲 JazzCash</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              </div>

              <div className="mt-4 rounded-xl bg-sky-50 border border-sky-100 p-4 text-sm space-y-2">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Account Name</span>
                  <span className="font-bold text-slate-900">{PAYMENT_ACCOUNTS[paymentMethod].name}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Account Number</span>
                  <span className="font-bold text-slate-900 tracking-wider">{PAYMENT_ACCOUNTS[paymentMethod].account}</span>
                </div>
              </div>
            </section>

            {/* Screenshot upload */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="size-4 text-sky-600" /> Upload Payment Screenshot
                <span className="text-red-500">*</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Attach a clear screenshot of your payment confirmation (JPG or PNG, max 8MB).
              </p>

              <label
                htmlFor="screenshot"
                className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-sky-50 hover:border-sky-400 transition cursor-pointer px-4 py-8 text-center"
              >
                {screenshotPreview ? (
                  <>
                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot preview"
                      className="max-h-44 rounded-lg border border-slate-200"
                    />
                    <span className="text-xs text-slate-500 truncate max-w-full">
                      {screenshot?.name} — tap to change
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="size-7 text-sky-600" />
                    <span className="text-sm font-bold text-slate-800">Tap to upload screenshot</span>
                    <span className="text-xs text-slate-500">PNG, JPG up to 8MB</span>
                  </>
                )}
                <input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {uploadError && (
                <p className="mt-3 text-xs font-semibold text-red-600">{uploadError}</p>
              )}
            </section>

            {/* Mobile submit inline (desktop uses sticky sidebar) */}
            <div className="lg:hidden">
              <SubmitButton submitting={submitting} total={total} />
            </div>
          </form>

          {/* RIGHT — sticky summary */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-center py-2.5 font-black uppercase tracking-wider text-xs">
                  Order Summary
                </div>
                <img
                  src={productStack.url}
                  alt="Clinic Growth Masterclass"
                  className="w-full h-auto"
                />
                <div className="p-5">
                  <div className="space-y-2 text-sm">
                    {items.map((i) => (
                      <div key={i.id} className="flex justify-between gap-3">
                        <span className="text-slate-700 truncate">{i.title}</span>
                        <span className="font-bold text-slate-900 whitespace-nowrap">Rs. {i.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase text-slate-500 tracking-wider">Total</span>
                    <span className="text-2xl font-black text-emerald-600">Rs. {total.toLocaleString()}</span>
                  </div>

                  {/* Desktop submit (form submit via native form pairing) */}
                  <div className="hidden lg:block mt-5">
                    <SubmitButton
                      submitting={submitting}
                      total={total}
                      onClick={() => {
                        (document.querySelector("form") as HTMLFormElement | null)?.requestSubmit();
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="size-3.5" /> 100% Secure &amp; Safe Payments
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
                <div className="size-10 rounded-full bg-amber-100 grid place-items-center shrink-0">
                  <ShieldCheck className="size-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">30-Day Money-Back Guarantee</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Attend, implement — if it doesn't help, email us within 30 days for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SubmitButton({ submitting, total, onClick }: { submitting: boolean; total: number; onClick?: () => void }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={submitting}
      className="w-full rounded-xl px-6 py-4 text-white font-black uppercase tracking-wide shadow-lg bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span className="inline-flex items-center justify-center gap-2 text-sm sm:text-base">
        {submitting ? "SUBMITTING..." : `PAY RS. ${total.toLocaleString()} & GET ACCESS`}
        <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
      </span>
    </button>
  );
}
