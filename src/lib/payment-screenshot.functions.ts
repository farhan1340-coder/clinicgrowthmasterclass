import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createScreenshotSignedUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ path: z.string().min(1).max(300) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("payment-screenshots")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
    if (error) throw error;
    return { url: signed.signedUrl };
  });
