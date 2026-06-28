import { createServerFn } from "@tanstack/react-start";

type UpsertLeadInput = {
  full_name: string;
  email: string;
  whatsapp: string;
  specialty?: string;
  selected_order_bumps?: Array<{ id: string; title: string; price: number }>;
  total_amount?: number;
  payment_method?: string;
  lead_status: string;
  payment_screenshot_url?: string | null;
};

type SavedLeadResult = {
  id: string;
  updated: boolean;
  strategy_session_order_bump_selected: boolean;
};

function validate(data: unknown): UpsertLeadInput {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const full_name = String(d.full_name ?? "").trim();
  const email = String(d.email ?? "").trim().toLowerCase();
  const whatsapp = String(d.whatsapp ?? "").trim();
  const lead_status = String(d.lead_status ?? "").trim();
  const specialty = String(d.specialty ?? "").trim().slice(0, 120);
  if (full_name.length < 1 || full_name.length > 120) throw new Error("Invalid name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) throw new Error("Invalid email");
  if (whatsapp.length < 3 || whatsapp.length > 40) throw new Error("Invalid WhatsApp number");
  if (!lead_status) throw new Error("Missing lead_status");
  return {
    full_name,
    email,
    whatsapp,
    specialty: specialty || undefined,
    selected_order_bumps: Array.isArray(d.selected_order_bumps)
      ? (d.selected_order_bumps as UpsertLeadInput["selected_order_bumps"])
      : [],
    total_amount: typeof d.total_amount === "number" ? d.total_amount : 0,
    payment_method: typeof d.payment_method === "string" && d.payment_method.length > 0
      ? d.payment_method
      : "pending",
    lead_status,
    payment_screenshot_url:
      typeof d.payment_screenshot_url === "string" ? d.payment_screenshot_url : null,
  };
}

export const upsertLead = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }): Promise<SavedLeadResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing, error: selErr } = await supabaseAdmin
      .from("clinic_growth_leads")
      .select("id, lead_status, total_amount, payment_screenshot_url, selected_order_bumps, payment_method, strategy_session_order_bump_selected")
      .eq("email", data.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (selErr) throw selErr;

    const nowIso = new Date().toISOString();

    if (existing?.id) {
      // Preserve stronger payment data if a checkout was already completed
      const preservePayment = existing.lead_status.startsWith("Pending Payment") && data.lead_status === "Opted In - Checkout Not Completed";
      const payload = {
        full_name: data.full_name,
        email: data.email,
        whatsapp: data.whatsapp,
        ...(data.specialty ? { specialty: data.specialty } : {}),
        selected_order_bumps: preservePayment ? existing.selected_order_bumps : data.selected_order_bumps,
        total_amount: preservePayment ? existing.total_amount : data.total_amount,
        payment_method: preservePayment ? existing.payment_method : data.payment_method,
        lead_status: preservePayment ? existing.lead_status : data.lead_status,
        payment_screenshot_url: preservePayment
          ? existing.payment_screenshot_url
          : data.payment_screenshot_url,
        created_at: nowIso,
      };
      const { data: updated, error } = await supabaseAdmin
        .from("clinic_growth_leads")
        .update(payload)
        .eq("id", existing.id)
        .select("id, strategy_session_order_bump_selected")
        .single();
      if (error) throw error;
      return {
        id: updated.id as string,
        updated: true,
        strategy_session_order_bump_selected: updated.strategy_session_order_bump_selected === true,
      };
    }

    const { data: ins, error: insErr } = await supabaseAdmin
      .from("clinic_growth_leads")
      .insert({
        full_name: data.full_name,
        email: data.email,
        whatsapp: data.whatsapp,
        ...(data.specialty ? { specialty: data.specialty } : {}),
        selected_order_bumps: data.selected_order_bumps ?? [],
        total_amount: data.total_amount ?? 0,
        payment_method: data.payment_method ?? "pending",
        lead_status: data.lead_status,
        payment_screenshot_url: data.payment_screenshot_url ?? null,
      })
      .select("id, strategy_session_order_bump_selected")
      .single();
    if (insErr) throw insErr;
    return {
      id: ins.id as string,
      updated: false,
      strategy_session_order_bump_selected: ins.strategy_session_order_bump_selected === true,
    };
  });

