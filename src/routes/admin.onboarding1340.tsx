import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listOnboardingResponses,
  type OnboardingRow,
} from "@/lib/admin-onboarding.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/onboarding1340")({
  head: () => ({
    meta: [
      { title: "Admin — Onboarding Responses" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminOnboardingPage,
});

const PAID_STATUSES = /paid|completed|received|submitted|otp taken/i;

function isPaidLike(status?: string | null) {
  if (!status) return false;
  return PAID_STATUSES.test(status);
}

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = Array.isArray(v) ? v.join(" | ") : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(rows: OnboardingRow[]) {
  const headers = [
    "Submitted At",
    "Name",
    "Email",
    "WhatsApp",
    "Specialty",
    "City",
    "Payment Status",
    "Order Total",
    "Purchase Date",
    "Primary Goals",
    "Tried Before",
    "Biggest Frustration",
    "Why Joined",
    "Skepticism",
    "Implementation Help",
    "DFY Interest",
    "Other Help",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.created_at,
        r.full_name ?? r.lead?.full_name ?? "",
        r.email,
        r.whatsapp,
        r.specialty ?? "",
        r.city ?? "",
        r.lead?.lead_status ?? "",
        r.lead?.total_amount ?? "",
        r.lead?.created_at ?? "",
        r.primary_goals,
        r.tried_before,
        r.biggest_frustration ?? "",
        r.decision_reasons,
        r.skepticism ?? "",
        r.implementation_help,
        r.done_for_you_interest ?? "",
        r.other_help ?? "",
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `onboarding-responses-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function mostCommon(items: string[]): string {
  if (!items.length) return "—";
  const counts = new Map<string, number>();
  for (const it of items) counts.set(it, (counts.get(it) ?? 0) + 1);
  let best = "—";
  let max = 0;
  for (const [k, v] of counts) {
    if (v > max) {
      max = v;
      best = k;
    }
  }
  return `${best} (${max})`;
}

function dfyBucket(v: string | null): "yes" | "maybe" | "no" | "unknown" {
  if (!v) return "unknown";
  const s = v.toLowerCase();
  if (s.startsWith("yes")) return "yes";
  if (s.startsWith("maybe")) return "maybe";
  if (s.startsWith("no")) return "no";
  return "unknown";
}

function AdminOnboardingPage() {
  const fetchAll = useServerFn(listOnboardingResponses);
  const [rows, setRows] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [dfyFilter, setDfyFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [goalFilter, setGoalFilter] = useState<string>("all");
  const [helpFilter, setHelpFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<OnboardingRow | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchAll()
      .then((d) => {
        if (alive) setRows(d);
      })
      .catch((e) => alive && setError(e?.message ?? "Failed to load"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fetchAll]);

  const specialties = useMemo(
    () => Array.from(new Set(rows.map((r) => r.specialty).filter(Boolean) as string[])).sort(),
    [rows],
  );
  const cities = useMemo(
    () => Array.from(new Set(rows.map((r) => r.city).filter(Boolean) as string[])).sort(),
    [rows],
  );
  const statuses = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.lead?.lead_status).filter(Boolean) as string[])).sort(),
    [rows],
  );
  const goals = useMemo(
    () => Array.from(new Set(rows.flatMap((r) => r.primary_goals))).sort(),
    [rows],
  );
  const helps = useMemo(
    () => Array.from(new Set(rows.flatMap((r) => r.implementation_help))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const qs = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (qs) {
        const hay = [r.full_name, r.email, r.whatsapp, r.specialty, r.city]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(qs)) return false;
      }
      if (dfyFilter !== "all" && dfyBucket(r.done_for_you_interest) !== dfyFilter) return false;
      if (specialtyFilter !== "all" && r.specialty !== specialtyFilter) return false;
      if (cityFilter !== "all" && r.city !== cityFilter) return false;
      if (statusFilter !== "all" && r.lead?.lead_status !== statusFilter) return false;
      if (goalFilter !== "all" && !r.primary_goals.includes(goalFilter)) return false;
      if (helpFilter !== "all" && !r.implementation_help.includes(helpFilter)) return false;
      if (from && new Date(r.created_at) < new Date(from)) return false;
      if (to && new Date(r.created_at) > new Date(to + "T23:59:59")) return false;
      return true;
    });
  }, [rows, q, dfyFilter, specialtyFilter, cityFilter, statusFilter, goalFilter, helpFilter, from, to]);

  const summary = useMemo(() => {
    const yes = filtered.filter((r) => dfyBucket(r.done_for_you_interest) === "yes").length;
    const maybe = filtered.filter((r) => dfyBucket(r.done_for_you_interest) === "maybe").length;
    const no = filtered.filter((r) => dfyBucket(r.done_for_you_interest) === "no").length;
    return {
      total: filtered.length,
      yes,
      maybe,
      no,
      topGoal: mostCommon(filtered.flatMap((r) => r.primary_goals)),
      topFrustration: mostCommon(
        filtered.map((r) => (r.biggest_frustration ?? "").trim()).filter(Boolean),
      ),
      topSkepticism: mostCommon(
        filtered.map((r) => (r.skepticism ?? "").trim()).filter(Boolean),
      ),
      topHelp: mostCommon(filtered.flatMap((r) => r.implementation_help)),
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Onboarding Responses</h1>
            <p className="text-sm text-muted-foreground">
              Survey answers from buyers after they complete payment.
            </p>
          </div>
          <Button onClick={() => downloadCsv(filtered)} disabled={!filtered.length}>
            Export CSV ({filtered.length})
          </Button>
        </div>

        {/* Summary */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-5">
          <SummaryCard label="Total submissions" value={summary.total} />
          <SummaryCard label="Want DFY services" value={summary.yes} accent="emerald" />
          <SummaryCard label="Maybe later" value={summary.maybe} accent="amber" />
          <SummaryCard label="Want to DIY" value={summary.no} accent="slate" />
          <SummaryCard label="Most common goal" value={summary.topGoal} small />
          <SummaryCard label="Most common frustration" value={summary.topFrustration} small />
          <SummaryCard label="Most common skepticism" value={summary.topSkepticism} small />
          <SummaryCard label="Most requested help" value={summary.topHelp} small />
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-xl p-3 mb-4 grid gap-2 md:grid-cols-4">
          <Input
            placeholder="Search name, email, WhatsApp, specialty, city"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:col-span-2"
          />
          <Select label="DFY interest" value={dfyFilter} onChange={setDfyFilter}
            options={[["all","All"],["yes","Yes"],["maybe","Maybe later"],["no","No"]]} />
          <Select label="Specialty" value={specialtyFilter} onChange={setSpecialtyFilter}
            options={[["all","All"], ...specialties.map((s) => [s, s] as [string, string])]} />
          <Select label="City" value={cityFilter} onChange={setCityFilter}
            options={[["all","All"], ...cities.map((s) => [s, s] as [string, string])]} />
          <Select label="Payment status" value={statusFilter} onChange={setStatusFilter}
            options={[["all","All"], ...statuses.map((s) => [s, s] as [string, string])]} />
          <Select label="Primary goal" value={goalFilter} onChange={setGoalFilter}
            options={[["all","All"], ...goals.map((s) => [s, s] as [string, string])]} />
          <Select label="Implementation help" value={helpFilter} onChange={setHelpFilter}
            options={[["all","All"], ...helps.map((s) => [s, s] as [string, string])]} />
          <div className="flex gap-2 items-end">
            <label className="text-xs text-slate-600 flex-1">
              From
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full h-9 rounded-md border px-2 text-sm" />
            </label>
            <label className="text-xs text-slate-600 flex-1">
              To
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full h-9 rounded-md border px-2 text-sm" />
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl overflow-auto">
          {loading ? (
            <div className="p-6 text-sm text-slate-600">Loading…</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : !filtered.length ? (
            <div className="p-6 text-sm text-slate-600">No responses match your filters.</div>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-slate-100 text-slate-700">
                <tr className="text-left">
                  <Th>Buyer</Th>
                  <Th>Contact</Th>
                  <Th>Specialty / City</Th>
                  <Th>Purchase</Th>
                  <Th>Biggest goal</Th>
                  <Th>Tried before</Th>
                  <Th>Frustration</Th>
                  <Th>Why joined</Th>
                  <Th>Skepticism</Th>
                  <Th>Implementation help</Th>
                  <Th>DFY interest</Th>
                  <Th>Other ask</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const bucket = dfyBucket(r.done_for_you_interest);
                  const dfyColor =
                    bucket === "yes" ? "bg-emerald-100 text-emerald-800"
                      : bucket === "maybe" ? "bg-amber-100 text-amber-800"
                      : bucket === "no" ? "bg-slate-100 text-slate-700"
                      : "bg-slate-50 text-slate-500";
                  return (
                    <tr key={r.id} className="border-t align-top hover:bg-slate-50">
                      <Td>
                        <div className="font-semibold">{r.full_name ?? r.lead?.full_name ?? "—"}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </Td>
                      <Td>
                        <div>{r.email}</div>
                        <div className="text-slate-500">{r.whatsapp}</div>
                      </Td>
                      <Td>
                        <div>{r.specialty ?? "—"}</div>
                        <div className="text-slate-500">{r.city ?? "—"}</div>
                      </Td>
                      <Td>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            isPaidLike(r.lead?.lead_status)
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.lead?.lead_status ?? "—"}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Rs. {r.lead?.total_amount ?? "—"} · {r.lead?.payment_method ?? ""}
                        </div>
                      </Td>
                      <Td><Chips items={r.primary_goals} /></Td>
                      <Td><Chips items={r.tried_before} /></Td>
                      <Td className="max-w-[220px]">
                        <Clamp>{r.biggest_frustration}</Clamp>
                      </Td>
                      <Td><Chips items={r.decision_reasons} /></Td>
                      <Td className="max-w-[220px]">
                        <Clamp>{r.skepticism}</Clamp>
                      </Td>
                      <Td><Chips items={r.implementation_help} /></Td>
                      <Td>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${dfyColor}`}>
                          {r.done_for_you_interest ?? "—"}
                        </span>
                      </Td>
                      <Td className="max-w-[200px]">
                        <Clamp>{r.other_help}</Clamp>
                      </Td>
                      <Td>
                        <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
                          View
                        </Button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && <DetailDrawer row={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "emerald" | "amber" | "slate";
  small?: boolean;
}) {
  const color =
    accent === "emerald" ? "text-emerald-700"
    : accent === "amber" ? "text-amber-700"
    : accent === "slate" ? "text-slate-700"
    : "text-slate-900";
  return (
    <div className="bg-white border rounded-xl p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 font-bold ${color} ${small ? "text-sm" : "text-2xl"}`}>{value}</div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="text-xs text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-9 rounded-md border bg-white px-2 text-sm"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-2 py-2 font-semibold whitespace-nowrap">{children}</th>;
}
function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-2 py-2 ${className ?? ""}`}>{children}</td>;
}
function Chips({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((i) => (
        <span key={i} className="bg-slate-100 text-slate-700 rounded px-1.5 py-0.5 text-[10px]">
          {i}
        </span>
      ))}
    </div>
  );
}
function Clamp({ children }: { children?: React.ReactNode }) {
  if (!children) return <span className="text-slate-400">—</span>;
  return <div className="line-clamp-3 whitespace-pre-wrap">{children}</div>;
}

function DetailDrawer({ row, onClose }: { row: OnboardingRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-xl h-full bg-white overflow-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{row.full_name ?? row.lead?.full_name ?? "Buyer"}</h2>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-900">
            Close
          </button>
        </div>
        <div className="text-xs text-slate-500 mb-4">
          Submitted {new Date(row.created_at).toLocaleString()}
        </div>

        <Section title="Buyer">
          <KV k="Email" v={row.email} />
          <KV k="WhatsApp" v={row.whatsapp} />
          <KV k="Specialty" v={row.specialty} />
          <KV k="City" v={row.city} />
          <KV k="Payment status" v={row.lead?.lead_status} />
          <KV k="Order total" v={row.lead?.total_amount ? `Rs. ${row.lead.total_amount}` : null} />
          <KV k="Payment method" v={row.lead?.payment_method} />
          <KV k="Purchase date"
            v={row.lead?.created_at ? new Date(row.lead.created_at).toLocaleString() : null} />
        </Section>

        <Section title="Biggest goal"><List items={row.primary_goals} /></Section>
        <Section title="Tried before"><List items={row.tried_before} /></Section>
        <Section title="Biggest frustration"><Para text={row.biggest_frustration} /></Section>
        <Section title="Why they joined"><List items={row.decision_reasons} /></Section>
        <Section title="Skepticism / uncertainty"><Para text={row.skepticism} /></Section>
        <Section title="Implementation help wanted"><List items={row.implementation_help} /></Section>
        <Section title="Interest in DFY services"><Para text={row.done_for_you_interest} /></Section>
        <Section title="Other training / tool / service requested"><Para text={row.other_help} /></Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
        {title}
      </div>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  );
}
function KV({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="flex gap-2 text-sm py-0.5">
      <span className="text-slate-500 w-32 shrink-0">{k}</span>
      <span className="text-slate-900">{v || "—"}</span>
    </div>
  );
}
function List({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-slate-400">—</span>;
  return (
    <ul className="list-disc pl-5 space-y-0.5">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}
function Para({ text }: { text?: string | null }) {
  if (!text) return <span className="text-slate-400">—</span>;
  return <p className="whitespace-pre-wrap">{text}</p>;
}
