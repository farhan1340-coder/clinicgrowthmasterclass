import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, Lock, ShieldCheck, Star, ArrowRight, Gift } from "lucide-react";

type OrderSearch = {
  full_name?: string;
  email?: string;
};

export const Route = createFileRoute("/order")({
  validateSearch: (search: Record<string, unknown>): OrderSearch => ({
    full_name: typeof search.full_name === "string" ? search.full_name : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
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
    id: "ads",
    title: "WINNING AD CAMPAIGN MASTERCLASS FOR DOCTORS",
    price: 499,
    image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/gEjfcPU9sJhDOS0NobUy/media/154734ed-87c6-4167-b764-75ba8cfbd41d.jpeg",
    copy: `SPECIAL ONE-TIME OFFER: A perfect clinic system means nothing if you can't get profitable patient traffic — and most doctors waste thousands on ads that don't convert because they're guessing instead of following a proven testing system. This Masterclass reveals the exact 3-phase methodology (Message → Creative → Audience) used to turn ad spend into a predictable patient machine. Check the box above to add it to your order now!`,
  },
  {
    id: "cro",
    title: "CLINIC FOLLOW-UP & BOOKING SECRETS CHECKLIST",
    price: 299,
    image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/gEjfcPU9sJhDOS0NobUy/media/bb687e48-f8b7-48cc-ac1e-a20f45a9136a.png",
    copy: `SPECIAL ONE-TIME OFFER: After helping 700+ clinics, I've compiled 30+ booking-rate optimizations across WhatsApp, calls, landing pages and reception that every clinic needs to turn inquiries into confirmed appointments. Includes a walkthrough video for every optimization so you leave no patients on the table. Check the box above to add it to your order now!`,
  },
] as const;

const MAIN_PRODUCT = { title: "Clinic Growth Masterclass", price: 999 };

function OrderPage() {
  const search = Route.useSearch();
  const [name, setName] = useState(search.full_name ?? "");
  const [email, setEmail] = useState(search.email ?? "");
  const [phone, setPhone] = useState("");
  const [bumps, setBumps] = useState<Record<string, boolean>>({});
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa" | "card">("jazzcash");
  const [submitted, setSubmitted] = useState(false);

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

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <div className="flex-1 grid place-items-center bg-secondary p-6">
          <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
            <div className="mx-auto size-16 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
              <CheckCircle2 className="size-10" />
            </div>
            <h1 className="mt-4 text-2xl font-black">You're In, {name || "Doctor"}! 🎉</h1>
            <p className="mt-3 text-muted-foreground">
              Your seat is reserved. Check your email at <span className="font-semibold text-foreground">{email}</span> —
              we've sent your Zoom link and bonuses.
            </p>
            <div className="mt-6 text-left bg-secondary rounded-lg p-4 text-sm">
              <div className="font-bold mb-2">Order Summary</div>
              {items.map((i) => (
                <div key={i.id} className="flex justify-between py-1">
                  <span className="truncate pr-2">{i.title}</span>
                  <span className="font-semibold">Rs. {i.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between border-t mt-2 pt-2 font-bold">
                <span>Total Paid</span><span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/" className="mt-6 inline-block btn-cta px-6 py-3 text-base">Back to home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      {/* Headline strip */}
      <div className="bg-secondary border-b">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <h1 className="text-2xl md:text-4xl font-black">
            You're <span className="gradient-highlight">One Step Away</span> From Filling Your Clinic
          </h1>
          <p className="mt-2 text-muted-foreground">Complete your order below to reserve your seat in the live masterclass.</p>
        </div>
      </div>

      <main className="bg-secondary flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-5 gap-8">
          {/* LEFT: form + bumps */}
          <form
            className="lg:col-span-3 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {/* Contact */}
            <section className="bg-card rounded-xl shadow-sm border">
              <div className="bg-primary text-primary-foreground px-5 py-3 rounded-t-xl font-bold text-center uppercase tracking-wider text-sm">
                Step 1 — Your Contact Info
              </div>
              <div className="p-5 space-y-3">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name*" className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email*" className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number (WhatsApp preferred)*" className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </section>

            {/* Payment */}
            <section className="bg-card rounded-xl shadow-sm border">
              <div className="bg-primary text-primary-foreground px-5 py-3 font-bold text-center uppercase tracking-wider text-sm">
                Step 2 — Payment Method
              </div>
              <div className="p-5 space-y-3">
                {[
                  { id: "jazzcash", label: "JazzCash" },
                  { id: "easypaisa", label: "Easypaisa" },
                  { id: "card", label: "Credit / Debit Card" },
                ].map((m) => (
                  <label key={m.id} className={`flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer ${paymentMethod === m.id ? "border-primary bg-primary/5" : "border-input"}`}>
                    <input type="radio" name="pm" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id as typeof paymentMethod)} className="accent-primary" />
                    <span className="font-semibold">{m.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Items table */}
            <section className="bg-card rounded-xl shadow-sm border p-5">
              <div className="text-sm font-bold uppercase tracking-wider mb-3">Your Order</div>
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-left">
                  <tr><th className="py-2">Item</th><th className="py-2 text-center">Qty</th><th className="py-2 text-right">Price</th></tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id} className="border-t">
                      <td className="py-3 pr-2">{i.title}</td>
                      <td className="py-3 text-center">{i.qty}</td>
                      <td className="py-3 text-right font-bold">Rs. {i.price.toLocaleString()}</td>
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
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <ArrowRight className="size-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-extrabold text-emerald-800 uppercase text-sm md:text-base">
                            ✅ YES! Add {b.title} for just Rs. {b.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-4">
                        <img src={b.image} alt="" className="size-20 rounded object-cover hidden sm:block" />
                        <p className="text-sm text-slate-800 leading-relaxed">
                          <span className="font-bold underline">SPECIAL ONE-TIME OFFER:</span>{" "}
                          {b.copy}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}

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

              <button type="submit" className="btn-cta w-full mt-5 px-6 py-4 text-lg">
                COMPLETE MY ORDER
                <div className="text-xs font-medium normal-case tracking-normal opacity-95">
                  Secure my seat in the Clinic Growth Masterclass
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
                src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/gEjfcPU9sJhDOS0NobUy/media/bb687e48-f8b7-48cc-ac1e-a20f45a9136a.png"
                alt="Clinic Growth Masterclass"
                className="w-full h-auto"
              />
              <div className="p-5 text-center">
                <div className="text-lg font-bold">Get Access For</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">Only Rs. 999 Today!</div>

                <div className="mt-5 text-left">
                  <div className="bg-primary text-primary-foreground text-center font-bold py-2 rounded">
                    Here's Everything You Get:
                  </div>
                  <ul className="mt-3 space-y-3 text-sm">
                    <Item title="Clinic Growth Masterclass (Live on Zoom)">
                      The complete patient-acquisition blueprint that eliminates months of guesswork.
                      Get the exact patient-getting system, ad strategy, and follow-up flow used by leading
                      Pakistani clinics — delivered live on Saturday, 20th June 2026.
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
