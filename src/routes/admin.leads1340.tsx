import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAllLeads } from "@/lib/admin-leads.functions";
import { sendRegistrationEmail } from "@/lib/registration-email.functions";
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
    <div className="border rounded-lg p-4 mb-6 bg-muted/30">
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

function AdminLeadsPage() {
  const fetchLeads = useServerFn(listAllLeads);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    fetchLeads()
      .then((d) => setLeads(d as Lead[]))
      .catch((e) => setError(e?.message ?? "Failed to load leads"));
  }
  useEffect(() => { reload(); }, [fetchLeads]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold mb-2">Leads — Payment Screenshots</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Unlisted admin view. {leads ? `${leads.length} total leads.` : ""}
        </p>

        <TestEmailPanel onSent={reload} />

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
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Screenshot</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t align-top">
                    <td className="p-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-3">{l.full_name}</td>
                    <td className="p-3">
                      <div>{l.email}</div>
                      <div className="text-muted-foreground">{l.whatsapp}</div>
                    </td>
                    <td className="p-3">{l.specialty ?? "—"}</td>
                    <td className="p-3 whitespace-nowrap">Rs. {l.total_amount}</td>
                    <td className="p-3">{l.payment_method}</td>
                    <td className="p-3">{l.lead_status}</td>
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
                    <td className="p-3"><ScreenshotCell url={l.payment_screenshot_url} /></td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">No leads yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

