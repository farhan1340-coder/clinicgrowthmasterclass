import { createFileRoute, useNavigate } from "@tanstack/react-router";
import productStack from "@/assets/product-stack.png.asset.json";
import bumpStrategy from "@/assets/bump-strategy.png.asset.json";
import bumpPrompts from "@/assets/bump-prompts.png.asset.json";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { Lock, ShieldCheck, Star, ArrowRight, Gift, ChevronDown, CreditCard, Upload, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fbqTrack } from "@/lib/fbpixel";
import { createScreenshotSignedUrl } from "@/lib/payment-screenshot.functions";
import { useEffect, useRef } from "react";

type OrderSearch = {
  full_name?: string;
  email?: string;
  whatsapp?: string;
  specialty?: string;
};

export const Route = createFileRoute("/order")({
  validateSearch: (search: Record<string, unknown>): OrderSearch => ({
    full_name: typeof search.full_name === "string" ? search.full_name : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
    whatsapp: typeof search.whatsapp === "string" ? search.whatsapp : undefined,
    specialty: typeof search.specialty === "string" ? search.specialty : undefined,
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
    image: bumpStrategy.url,
    badge: "Most Popular (8/10 Members Add This)",
    bullets: [
      "90-Minute Private Strategy Session",
      "Customized Patient Growth Plan",
      "Meta Ads & Digital Marketing Guidance",
      "Website & Online Presence Review",
      "15 Days WhatsApp Support",
    ],
    bonus: "Bonus: Professional Clinic Website Setup",
  },
  {
    id: "prompts",
    title: "AI Content Prompt Vault for Doctors",
    price: 699,
    image: bumpPrompts.url,
    badge: "Recommended (7/10 Members Add This)",
    bullets: [
      "Ready-to-use AI prompts for doctors",
      "Content ideas for social media",
      "Patient education content prompts",
      "Engagement and lead generation prompts",
      "Save hours of content creation time",
    ],
    bonus: null as string | null,
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
  const [name, setName] = useState((search.full_name ?? "").trim());
  const [email, setEmail] = useState((search.email ?? "").trim().toLowerCase());
  const [phone, setPhone] = useState((search.whatsapp ?? "").trim());
  const [specialty, setSpecialty] = useState((search.specialty ?? "").trim());
  const hasContact = !!(name && email && phone);
  const [miniName, setMiniName] = useState("");
  const [miniEmail, setMiniEmail] = useState("");
  const [miniPhone, setMiniPhone] = useState("");
  const [miniSpecialty, setMiniSpecialty] = useState("");
  const [miniError, setMiniError] = useState<string | null>(null);
  const [miniSubmitting, setMiniSubmitting] = useState(false);
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

  async function handleMiniSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (miniSubmitting) return;
    setMiniError(null);
    const n = miniName.trim();
    const em = miniEmail.trim().toLowerCase();
    const ph = miniPhone.trim();
    const sp = miniSpecialty.trim();
    if (n.length < 1) return setMiniError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return setMiniError("Please enter a valid email.");
    if (ph.length < 3) return setMiniError("Please enter your WhatsApp number.");
    if (sp.length < 1) return setMiniError("Please enter your medical speciality.");
    setMiniSubmitting(true);
    try {
      const { upsertLead } = await import("@/lib/leads.functions");
      await upsertLead({
        data: {
          full_name: n,
          email: em,
          whatsapp: ph,
          specialty: sp,
          lead_status: "Opted In - Checkout Not Completed",
        },
      });
      setName(n);
      setEmail(em);
      setPhone(ph);
      setSpecialty(sp);
      fbqTrack("Lead");
    } catch (err) {
      console.error("Mini opt-in save failed", err);
      setMiniError("Something went wrong. Please try again.");
    } finally {
      setMiniSubmitting(false);
    }
  }




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

    let screenshotPath: string | null = null;
    try {
      const ext = screenshot.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeEmail = email.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
      const path = `${Date.now()}-${safeEmail}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, screenshot, { contentType: screenshot.type, upsert: false });
      if (upErr) throw upErr;
      // Create a long-lived signed URL server-side so it's clickable from DB
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

    try {
      const { upsertLead } = await import("@/lib/leads.functions");
      await upsertLead({
        data: {
          full_name: name,
          email,
          whatsapp: phone,
          specialty: specialty || undefined,
          selected_order_bumps: selectedBumps,
          total_amount: total,
          payment_method: PAYMENT_ACCOUNTS[paymentMethod].label,
          lead_status: "Pending Payment",
          payment_screenshot_url: screenshotPath,
        },
      });
    } catch (err) {
      console.error("Failed to save lead", err);
    }


    if (!purchaseFiredRef.current) {
      purchaseFiredRef.current = true;
      fbqTrack("Purchase", { value: 999, currency: "PKR" });
    }

    await new Promise((r) => setTimeout(r, 350));

    navigate({ to: "/thank-you" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      {/* Headline strip */}
      <div className="bg-secondary border-b">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 text-center">
          <h1 className="text-2xl md:text-4xl font-black">
            You're <span className="gradient-highlight">One Step Away</span> From Filling Your Clinic
          </h1>
          <p className="mt-2 text-muted-foreground">Complete your order below to confirm your seat.</p>
          {name && (
            <p className="mt-3 text-sm text-muted-foreground">
              Checking out as <span className="font-bold text-foreground">{name}</span> · {email}
            </p>
          )}
        </div>
      </div>


      <main className="bg-secondary flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-5 gap-8">
          {/* LEFT: form + bumps */}
          <form className="lg:col-span-3 space-y-6 min-w-0" onSubmit={handleSubmit}>


            {/* Items table */}
            <section className="bg-card rounded-xl shadow-sm border p-5">
              <div className="text-sm font-bold uppercase tracking-wider mb-3">Your Order</div>
              <table className="w-full text-sm table-fixed">
                <thead className="text-muted-foreground text-left">
                  <tr>
                    <th className="py-2 w-auto">Item</th>
                    <th className="py-2 text-center w-12">Qty</th>
                    <th className="py-2 text-right w-24">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id} className="border-t">
                      <td className="py-3 pr-2 break-words">{i.title}</td>
                      <td className="py-3 text-center">{i.qty}</td>
                      <td className="py-3 text-right font-bold whitespace-nowrap">Rs. {i.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Order Bumps */}
            {BUMPS.map((b) => {
              const checked = !!bumps[b.id];
              return (
                <label
                  key={b.id}
                  className={`block rounded-xl border-2 border-dashed cursor-pointer p-4 transition ${checked ? "border-emerald-500 bg-emerald-50" : "border-yellow-500 bg-yellow-50"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setBumps((s) => ({ ...s, [b.id]: e.target.checked }))}
                      className="mt-1 size-5 accent-emerald-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="size-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="font-extrabold text-emerald-800 uppercase text-sm md:text-base">
                          ✅ YES! Add {b.title} for just PKR {b.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-3">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-auto rounded-lg object-cover border border-emerald-200"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1 shadow-sm">
                          <span className="size-2 rounded-full bg-white/90" aria-hidden />
                          {b.badge}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-slate-800 leading-relaxed">
                        <p className="font-bold underline mb-2">SPECIAL ONE-TIME OFFER:</p>
                        <ul className="space-y-1">
                          {b.bullets.map((line) => (
                            <li key={line}>✅ {line}</li>
                          ))}
                          {b.bonus && <li className="font-semibold text-emerald-800 mt-1">🎁 {b.bonus}</li>}
                        </ul>
                      </div>
                    </div>

                  </div>
                </label>
              );
            })}

            {/* Payment */}
            <section className="bg-card rounded-xl shadow-lg border-2 border-primary/40 ring-2 ring-primary/10 overflow-hidden">
              <div className="bg-primary text-primary-foreground px-5 py-3 font-bold text-center uppercase tracking-wider text-sm">
                Step 2 — Payment Method
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label htmlFor="paymethod" className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wide">
                    <CreditCard className="size-4" /> Select Your Payment Method
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="paymethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PayMethod)}
                      className="appearance-none w-full rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 px-4 py-4 pr-12 text-base font-bold text-foreground shadow-md outline-none focus:ring-4 focus:ring-primary/30 hover:shadow-lg transition cursor-pointer"
                    >
                      <option value="easypaisa">📱 Easypaisa</option>
                      <option value="jazzcash">📲 JazzCash</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
                    <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/20 animate-pulse" aria-hidden />
                  </div>
                </div>

                <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    {PAYMENT_ACCOUNTS[paymentMethod].label} Payment Details
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Account Title</span>
                      <span className="font-bold">{PAYMENT_ACCOUNTS[paymentMethod].name}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-bold tracking-wider">{PAYMENT_ACCOUNTS[paymentMethod].account}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 text-sm text-slate-800">
                  <p className="font-bold mb-1">📌 Important Instructions</p>
                  <p>
                    Please send your payment to the selected account above, then upload the payment screenshot
                    in the field below and click submit. Your access will be processed after payment verification.
                  </p>
                </div>
              </div>
            </section>

            {/* Summary + submit */}
            <section className="bg-card rounded-xl shadow-sm border p-5">
              <div className="text-sm font-bold uppercase tracking-wider mb-3">Order Summary</div>
              <div className="space-y-2 text-sm">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between gap-3">
                    <span className="truncate">{i.title}</span>
                    <span className="font-semibold">Rs. {i.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-lg font-black">
                  <span>Total</span>
                  <span className="text-destructive">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Upload Payment Screenshot — required, visually prominent, just above submit */}
              <div className="mt-6 rounded-xl border-2 border-dashed border-primary/60 bg-primary/5 p-4">
                <label className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary">
                  <ImageIcon className="size-4" /> Upload Payment Screenshot <span className="text-destructive">*</span>
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Attach a clear screenshot of your payment confirmation (JPG or PNG, max 8MB).
                </p>

                <label
                  htmlFor="screenshot"
                  className="mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 bg-background hover:bg-primary/5 transition cursor-pointer px-4 py-6 text-center"
                >
                  {screenshotPreview ? (
                    <>
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot preview"
                        className="max-h-40 rounded-md border"
                      />
                      <span className="text-xs text-muted-foreground truncate max-w-full">
                        {screenshot?.name} — tap to change
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-7 text-primary" />
                      <span className="text-sm font-bold text-primary">Tap to upload screenshot</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG up to 8MB</span>
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
                  <p className="mt-2 text-xs font-semibold text-destructive">{uploadError}</p>
                )}
              </div>

              <button type="submit" disabled={submitting} className="btn-cta w-full mt-5 px-6 py-4 text-base md:text-lg">
                {submitting ? "SUBMITTING..." : "SUBMIT & GET ACCESS"}
                <div className="text-xs font-medium normal-case tracking-normal opacity-95">
                  Submit your details and screenshot to receive masterclass access.
                </div>
              </button>



              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> 100% Secure &amp; Safe Payments
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <strong>Your information is secure</strong> and will not be shared. By providing your information you consent to the
                collection and use of your information per our Terms of Use and Privacy Policy. Opt-out anytime.
              </p>
            </section>
          </form>

          {/* RIGHT: product card */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center py-3 font-black uppercase tracking-wider">
                Clinic Growth Masterclass
              </div>
              <img
                src={productStack.url}
                alt="Clinic Growth Masterclass"
                className="w-full h-auto"
              />
              <div className="p-5 text-center">
                <div className="text-lg font-bold">Get Access For</div>
                <div className="text-3xl font-black text-emerald-600 mt-1 whitespace-pre-line">{"Only\nRs. 999 Today!"}</div>

                <div className="mt-5 text-left">
                  <div className="bg-primary text-primary-foreground text-center font-bold py-2 rounded">
                    Here's Everything You Get:
                  </div>
                  <ul className="mt-3 space-y-3 text-sm">
                    <Item title="Clinic Growth Masterclass">
                      The complete patient-acquisition blueprint that eliminates months of guesswork.
                      Get the exact patient-getting system, ad strategy, and follow-up flow used by leading
                      Pakistani clinics.
                    </Item>


                    <div className="bg-emerald-600 text-white text-center font-bold py-2 rounded mt-4">
                      You'll Also Receive 4 Bonuses:
                    </div>
                    <Item title="Bonus #1 — Authority Content Cheat Sheet for Doctors">
                      30 ready-to-use post ideas to position you as the go-to specialist online.
                    </Item>
                    <Item title="Bonus #2 — Doctor Personal Brand Positioning Worksheet">
                      Define your niche and unique angle so patients instantly trust and pick you.
                    </Item>
                    <Item title="Bonus #3 — Clinic WhatsApp Follow-Up Scripts">
                      Plug-and-play scripts that turn inquiries into booked appointments — fast.
                    </Item>
                    <Item title="Bonus #4 — Private Doctor Growth Community">
                      Ongoing support, case studies and Q&amp;A with ambitious doctors growing their clinics.
                    </Item>
                  </ul>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-card rounded-xl border p-5 flex items-start gap-4">
              <div className="size-14 rounded-full bg-yellow-400 grid place-items-center shrink-0">
                <ShieldCheck className="size-7 text-hero-deep" />
              </div>
              <div>
                <h3 className="font-extrabold">30-Day Money-Back Guarantee</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Attend, take notes, implement — and if you feel it didn't help, email us within 30 days for a 100% refund.
                </p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-card rounded-xl border p-5">
              <div className="font-bold mb-3">Reviews From Happy Doctors</div>
              {[
                { n: "Dr. Sara K., Dentist", t: "We went from 8 to 26 booked appointments per week." },
                { n: "Dr. Bilal R., Cardiologist", t: "Finally a Pakistan-specific marketing system. No fluff." },
                { n: "Dr. Hina M., Dietitian", t: "My DMs are full of qualified patients. Worth 10x the price." },
              ].map((r) => (
                <div key={r.n} className="border-t first:border-t-0 py-3">
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-yellow-500" />)}
                  </div>
                  <p className="text-sm italic mt-1">"{r.t}"</p>
                  <p className="text-xs font-bold mt-1">{r.n}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <Gift className="size-4 text-emerald-600 shrink-0 mt-1" />
      <div>
        <div className="font-bold">{title}</div>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
