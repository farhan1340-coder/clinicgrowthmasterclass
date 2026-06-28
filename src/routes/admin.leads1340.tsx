import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAllLeads } from "@/lib/admin-leads.functions";
import { sendRegistrationEmail } from "@/lib/registration-email.functions";
import {
  listAbandonedRemindersAll,
  sendAbandonedReminderNow,
  cancelAbandonedRemindersForLead,
  startAbandonedTestFlow,
  processAbandonedNow,
} from "@/lib/abandoned-checkout.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads1340")({
  head: () => ({ meta: [{ title: "Admin — Leads" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLeadsPage,
});

type Lead = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  specialty: string | null;
  selected_order_bumps: unknown;
  total_amount: number;
  payment_method: string;
  lead_status: string;
  payment_screenshot_url: string | null;
  created_at: string;
  registration_email_sent?: boolean | null;
  registration_email_sent_at?: string | null;
  registration_email_error?: string | null;
};

type Reminder = {
  id: string;
  lead_id: string;
  sequence_number: number;
  scheduled_for: string;
  sent_at: string | null;
  status: "pending" | "sent" | "skipped" | "failed" | "cancelled";
  error_message: string | null;
};

const SEQ_LABEL: Record<number, string> = {
  1: "5 min",
  2: "1 hr",
  3: "24 hr",
  4: "48 hr",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  sent: "bg-emerald-100 text-emerald-700",
  skipped: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-zinc-200 text-zinc-600",
};

function copy(text: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success("Copied to clipboard"),
    () => toast.error("Copy failed"),
  );
}

function ScreenshotCell({ url }: { url: string | null }) {
  if (!url) return <span className="text-muted-foreground italic">No screenshot uploaded.</span>;
  return (
    <div className="flex flex-col gap-2 min-w-[260px]">
      <div className="flex gap-2">
        <Button asChild size="sm" variant="default">
          <a href={url} target="_blank" rel="noopener noreferrer">View Screenshot</a>
        </Button>
        <Button size="sm" variant="outline" onClick={() => copy(url)}>Copy URL</Button>
      </div>
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full text-xs px-2 py-1 border rounded bg-muted/40 font-mono"
      />
    </div>
  );
}

function TestEmailPanel({ onSent }: { onSent: () => void }) {
  const sendFn = useServerFn(sendRegistrationEmail);
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  async function handle() {
    if (!to.trim()) { toast.error("Email required"); return; }
    setBusy(true);
    try {
      const res = await sendFn({ data: { to: to.trim(), name: name.trim() || undefined, force: true } });
      if ((res as any)?.ok) toast.success("Test email queued");
      else toast.error(`Failed: ${(res as any)?.reason ?? "unknown"}`);
      onSent();
    } catch (e: any) {
      toast.error(e?.message ?? "Send failed");
    } finally { setBusy(false); }
  }
  return (
    <div className="border rounded-lg p-4 mb-4 bg-muted/30">
      <div className="font-bold mb-2">Send test registration email</div>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs text-muted-foreground">Recipient email</label>
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-muted-foreground">Name (optional)</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Test" />
        </div>
        <Button onClick={handle} disabled={busy}>{busy ? "Sending…" : "Send Test"}</Button>
      </div>
    </div>
  );
}

function AbandonedTestPanel({ onSeeded }: { onSeeded: () => void }) {
  const startFn = useServerFn(startAbandonedTestFlow);
  const processFn = useServerFn(processAbandonedNow);
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [accelerate, setAccelerate] = useState(true);
  const [busy, setBusy] = useState(false);

  async function handleStart() {
    if (!to.trim()) { toast.error("Email required"); return; }
    setBusy(true);
    try {
      const res = await startFn({ data: { email: to.trim(), name: name.trim() || undefined, accelerate } });
      if ((res as any)?.ok) {
        toast.success(
          accelerate
            ? "Test flow scheduled at 1, 2, 5, 10 minutes"
            : "Test flow scheduled at 5 min / 1 hr / 24 hr / 48 hr",
        );
        onSeeded();
      } else {
        toast.error("Failed to schedule test flow");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally { setBusy(false); }
  }

  async function handleProcessNow() {
    setBusy(true);
    try {
      const res = await processFn({ data: undefined as any });
      toast.success(`Processed ${(res as any).processed} (sent ${(res as any).sent}, skipped ${(res as any).skipped}, failed ${(res as any).failed})`);
      onSeeded();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="border rounded-lg p-4 mb-6 bg-amber-50/60 border-amber-200">
      <div className="font-bold mb-1">Test abandoned-checkout sequence</div>
      <p className="text-xs text-muted-foreground mb-3">
        Schedules all 4 follow-up emails for the address below. Accelerated mode compresses the
        flow to 1 / 2 / 5 / 10 minutes for quick end-to-end testing.
      </p>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs text-muted-foreground">Recipient email</label>
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-muted-foreground">Name (optional)</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Test" />
        </div>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={accelerate} onChange={(e) => setAccelerate(e.target.checked)} />
          Accelerate (1/2/5/10 min)
        </label>
        <Button onClick={handleStart} disabled={busy}>{busy ? "…" : "Start test flow"}</Button>
        <Button variant="outline" onClick={handleProcessNow} disabled={busy}>
          Process due now
        </Button>
      </div>
    </div>
  );
}

function ResendCell({ leadId, sent, onDone }: { leadId: string; sent: boolean; onDone: () => void }) {
  const sendFn = useServerFn(sendRegistrationEmail);
  const [busy, setBusy] = useState(false);
  async function handle() {
    setBusy(true);
    try {
      const res = await sendFn({ data: { leadId, force: true } });
      if ((res as any)?.ok) toast.success("Email queued");
      else toast.error(`Failed: ${(res as any)?.reason ?? "unknown"}`);
      onDone();
    } catch (e: any) { toast.error(e?.message ?? "Send failed"); }
    finally { setBusy(false); }
  }
  return (
    <Button size="sm" variant={sent ? "outline" : "default"} onClick={handle} disabled={busy}>
      {busy ? "…" : sent ? "Resend" : "Send"}
    </Button>
  );
}

function FollowupsCell({
  leadId,
  reminders,
  onChanged,
}: {
  leadId: string;
  reminders: Reminder[];
  onChanged: () => void;
}) {
  const sendNow = useServerFn(sendAbandonedReminderNow);
  const cancelAll = useServerFn(cancelAbandonedRemindersForLead);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleSend(id: string) {
    setBusy(id);
    try {
      const r = await sendNow({ data: { queueId: id } });
      if ((r as any).ok) toast.success("Reminder queued");
      else toast.warning(`Skipped: ${(r as any).reason}`);
      onChanged();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(null); }
  }
  async function handleCancel() {
    setBusy("cancel");
    try {
      const r = await cancelAll({ data: { leadId } });
      toast.success(`Cancelled ${(r as any).cancelled} pending reminders`);
      onChanged();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(null); }
  }

  if (reminders.length === 0) {
    return <span className="text-muted-foreground italic text-xs">No follow-ups scheduled.</span>;
  }
  const hasPending = reminders.some((r) => r.status === "pending");
  return (
    <div className="flex flex-col gap-1 min-w-[260px]">
      {reminders.map((r) => (
        <div key={r.id} className="flex items-center gap-2 text-xs">
          <span className="font-mono w-12">#{r.sequence_number}</span>
          <span className="w-12 text-muted-foreground">{SEQ_LABEL[r.sequence_number]}</span>
          <span className={`px-2 py-0.5 rounded ${STATUS_COLOR[r.status] ?? ""}`}>{r.status}</span>
          <span className="text-muted-foreground">
            {r.sent_at
              ? new Date(r.sent_at).toLocaleString()
              : new Date(r.scheduled_for).toLocaleString()}
          </span>
          <Button size="sm" variant="ghost" className="h-6 px-2"
            disabled={busy === r.id}
            onClick={() => handleSend(r.id)}>
            {busy === r.id ? "…" : "Send now"}
          </Button>
        </div>
      ))}
      {reminders.some((r) => r.error_message) && (
        <div className="text-[11px] text-red-600 mt-1">
          {reminders.filter((r) => r.error_message).map((r) => `#${r.sequence_number}: ${r.error_message}`).join(" • ")}
        </div>
      )}
      {hasPending && (
        <Button size="sm" variant="outline" className="mt-1 w-fit"
          disabled={busy === "cancel"}
          onClick={handleCancel}>
          Cancel remaining
        </Button>
      )}
    </div>
  );
}

function AdminLeadsPage() {
  const fetchLeads = useServerFn(listAllLeads);
  const fetchReminders = useServerFn(listAbandonedRemindersAll);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    Promise.all([fetchLeads(), fetchReminders()])
      .then(([l, r]) => {
        setLeads(l as Lead[]);
        setReminders(r as Reminder[]);
      })
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

  const remindersByLead = useMemo(() => {
    const map = new Map<string, Reminder[]>();
    for (const r of reminders) {
      const arr = map.get(r.lead_id) ?? [];
      arr.push(r);
      map.set(r.lead_id, arr);
    }
    return map;
  }, [reminders]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl font-bold mb-2">Leads — Payment Screenshots & Follow-ups</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Unlisted admin view. {leads ? `${leads.length} total leads.` : ""}
        </p>

        <TestEmailPanel onSent={reload} />
        <AbandonedTestPanel onSeeded={reload} />

        {error && <div className="text-destructive mb-4">{error}</div>}
        {!leads && !error && <div>Loading…</div>}

        {leads && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Confirmation Email</th>
                  <th className="p-3">Abandoned Follow-ups</th>
                  <th className="p-3">Screenshot</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t align-top">
                    <td className="p-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <div>{l.full_name}</div>
                      <div className="text-xs text-muted-foreground">{l.specialty ?? ""}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs">{l.email}</div>
                      <div className="text-xs text-muted-foreground">{l.whatsapp}</div>
                    </td>
                    <td className="p-3">{l.lead_status}</td>
                    <td className="p-3 whitespace-nowrap">Rs. {l.total_amount}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1 min-w-[140px]">
                        {l.registration_email_sent ? (
                          <span className="text-xs text-emerald-700 font-semibold">
                            ✅ Sent{l.registration_email_sent_at ? ` ${new Date(l.registration_email_sent_at).toLocaleString()}` : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not sent</span>
                        )}
                        {l.registration_email_error && (
                          <span className="text-xs text-destructive">{l.registration_email_error}</span>
                        )}
                        <ResendCell leadId={l.id} sent={!!l.registration_email_sent} onDone={reload} />
                      </div>
                    </td>
                    <td className="p-3">
                      <FollowupsCell
                        leadId={l.id}
                        reminders={remindersByLead.get(l.id) ?? []}
                        onChanged={reload}
                      />
                    </td>
                    <td className="p-3"><ScreenshotCell url={l.payment_screenshot_url} /></td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No leads yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
