import { createFileRoute, useNavigate } from "@tanstack/react-router";
import productStack from "@/assets/product-stack.png.asset.json";
import bumpWorkbookImg from "@/assets/bump-workbook.png.asset.json";
import bumpPromptsImg from "@/assets/bump-prompts.png.asset.json";
import { useMemo, useState, useEffect, useRef } from "react";
import { Footer } from "@/components/site/Footer";
import { PROOFS } from "@/components/site/ProofGallery";
import { Lock, ShieldCheck, ArrowRight, ChevronDown, CreditCard, Upload, ImageIcon, Check, Gift, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fbqTrack } from "@/lib/fbpixel";
import { createScreenshotSignedUrl } from "@/lib/payment-screenshot.functions";
import { BeforeYouRegisterBox, CheckoutFAQ } from "@/components/site/ObjectionSections";

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

type Bump = {
  id: "strategy" | "prompts";
  title: string;
  shortTitle: string;
  price: number;
  badge: string;
  image: string;
  description: string;
  checklist: string[];
};

const BUMPS: readonly Bump[] = [
  {
    id: "strategy",
    title: "Clinic Offer Workbook",
    shortTitle: "Clinic Offer Workbook",
    price: 999,
    badge: "Best For Quick Wins",
    image: bumpWorkbookImg.url,
    description:
      "Build an irresistible clinic offer that patients actually want to book — stand out from competitors and increase appointment bookings.",
    checklist: [
      "The Clinic Offer Formula",
      "High-Converting Offer Templates",
      "Value Stack Worksheet",
      "Pricing & Positioning Framework",
      "Fill-in-the-Blank Workbook",
      "Real Healthcare Examples",
    ],
  },
  {
    id: "prompts",
    title: "AI Content Prompt Vault for Doctors",
    shortTitle: "AI Prompt Vault",
    price: 699,
    badge: "Special Offer",
    image: bumpPromptsImg.url,
    description:
      "Ready-to-use AI prompts for social posts, patient education, and lead generation — save hours every week.",
    checklist: [
      "100+ Doctor-Specific Prompts",
      "Social Media Post Templates",
      "Patient Education Scripts",
      "Lead Generation Prompts",
      "Ad Copy & Hooks Library",
      "Plug-and-Play Format",
    ],
  },
] as const;

const INCLUDED_ITEMS: { label: string; highlight?: boolean }[] = [
  { label: "Complete Clinic Growth Masterclass Training" },
  { label: "Local Patient Domination System" },
  { label: "Doctor Personal Brand Blueprint" },
  { label: "2-Hour Content Creation System" },
  { label: "Patient Acquisition via Meta Ads" },
  { label: "Irresistible Clinic Offer Framework" },
  { label: "Patient Acquisition Machine" },
  { label: "4+ Additional Bonuses", highlight: true },
  { label: "Chance To Win A FREE Professional Clinic Website", highlight: true },
];


const PAYMENT_ACCOUNTS = {
  easypaisa: { label: "Easypaisa", name: "Farhan Ali Rasheed", account: "03135944817" },
  jazzcash: { label: "JazzCash", name: "Farhan Ali Rasheed", account: "03135944817" },
} as const;
type PayMethod = keyof typeof PAYMENT_ACCOUNTS;

const MAIN_PRODUCT = { title: "Clinic Growth Masterclass", price: 999 };

// TEMPORARY: hide both order bumps for a 7-day checkout conversion test.
// Set back to `true` to restore both order bumps unchanged.
const SHOW_ORDER_BUMPS = false;

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
    if (SHOW_ORDER_BUMPS) {
      for (const b of BUMPS) {
        if (bumps[b.id]) list.push({ id: b.id, title: b.shortTitle, price: b.price, qty: 1 });
      }
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
    <div className="min-h-screen flex flex-col bg-sky-50 overflow-x-hidden max-w-full">
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
            {/* Here's What You'll Get */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="size-5 text-orange-500" />
                <h2 className="text-base font-black text-slate-900">Here's What You'll Get</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {INCLUDED_ITEMS.map((it) => (
                  <li
                    key={it.label}
                    className={`flex items-start gap-2 text-sm ${
                      it.highlight
                        ? "text-orange-700 font-black bg-orange-50 border border-orange-200 rounded-lg px-2 py-1.5"
                        : "text-slate-700"
                    }`}
                  >
                    <span className={`mt-0.5 shrink-0 grid place-items-center size-5 rounded-full text-white ${
                      it.highlight ? "bg-orange-500" : "bg-emerald-500"
                    }`}>
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className={it.highlight ? "font-black" : "font-semibold"}>{it.label}</span>
                  </li>
                ))}
              </ul>

            </section>

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

            {/* Order Bumps — TEMPORARILY HIDDEN (7-day conversion test). Toggle SHOW_ORDER_BUMPS above to restore. */}
            {SHOW_ORDER_BUMPS && (
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
                      className={`box-border block w-full max-w-full min-w-0 rounded-xl border-2 p-4 cursor-pointer transition ${
                        checked
                          ? "border-orange-500 border-dashed bg-orange-50/70"
                          : "border-slate-200 border-solid hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 w-full min-w-0 max-w-full">
                        <div className="w-full sm:w-28 max-w-full shrink-0 min-w-0">
                          <img
                            src={b.image}
                            alt={b.title}
                            loading="lazy"
                            className="block w-full max-w-full h-auto sm:h-24 sm:object-cover object-contain rounded-lg border border-slate-200 bg-slate-50"
                          />
                        </div>
                        <div className="flex-1 min-w-0 max-w-full w-full">
                          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 items-start w-full min-w-0 max-w-full">
                            <div className="mt-0.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setBumps((s) => ({ ...s, [b.id]: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <span className={`grid place-items-center size-5 rounded border-2 transition ${
                                checked ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-slate-300"
                              }`}>
                                {checked && <Check className="size-3.5" strokeWidth={3} />}
                              </span>
                            </div>
                            <span
                              className="text-sm font-black text-slate-900 leading-snug min-w-0 max-w-full whitespace-normal break-words"
                              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                            >
                              {b.title}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full max-w-full break-words ${
                              checked ? "bg-orange-500 text-white" : "bg-amber-100 text-amber-800"
                            }`}>{b.badge}</span>
                          </div>
                          <p
                            className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed min-w-0 max-w-full break-words"
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {b.description}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {b.checklist.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 min-w-0 max-w-full break-words" style={{ overflowWrap: "anywhere" }}>
                                <Check className="size-4 shrink-0 text-green-600 mt-0.5" strokeWidth={3} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 text-lg sm:text-xl font-black text-orange-600">
                            + Rs. {b.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
            )}





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

      {/* Reused sales-page testimonials */}
      <section className="bg-sky-50 pb-16 pt-4 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Real Reviews From <span className="text-sky-600">Masterclass Attendees</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Feedback and payment proofs from doctors who joined the Clinic Growth Masterclass.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {PROOFS.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={p.url}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 sm:h-72 object-contain bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <CheckoutFAQ />
        </div>
      </section>

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
