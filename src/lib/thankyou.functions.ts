import { createServerFn } from "@tanstack/react-start";

type Entitlements = {
  promptVault: boolean;
};

function validate(data: unknown): { leadId: string } {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const leadId = String((data as Record<string, unknown>).leadId ?? "").trim();
  if (!/^[0-9a-f-]{10,}$/i.test(leadId)) throw new Error("Invalid leadId");
  return { leadId };
}

export const getThankYouEntitlements = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }): Promise<Entitlements> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .select("selected_order_bumps, lead_status")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error || !row) return { promptVault: false };

    const status = String(row.lead_status ?? "");
    // Only consider paid-like statuses (payment screenshot submitted).
    const paidLike =
      status.startsWith("Pending Payment") ||
      status.startsWith("Paid") ||
      status.startsWith("OTO Taken");
    if (!paidLike) return { promptVault: false };

    const bumps = Array.isArray(row.selected_order_bumps) ? row.selected_order_bumps : [];
    const promptVault = bumps.some(
      (b: any) => b && typeof b === "object" && String(b.id) === "prompts",
    );
    return { promptVault };
  });
