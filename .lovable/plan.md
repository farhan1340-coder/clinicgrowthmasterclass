## Goal

Send Farhanali13440@gmail.com two internal notification emails tied to the Clinic Growth Masterclass funnel:

1. **Immediate notification** when a new lead saves in Step 1 (deduped within 24h).
2. **Abandoned-checkout alert** 20 minutes later if the lead hasn't completed checkout.

All current funnel behavior (Step 1 form, checkout, order bumps, payment upload, Meta Lead/Purchase events, thank-you page) stays untouched.

## Email Provider

Use **Lovable Emails** (built-in, no API keys exposed). It requires a one-time sender domain setup before we can send. After you set up the sender domain, I'll scaffold app email templates and wire everything below.

If you'd rather use Resend specifically, say so and I'll swap the send layer to the Resend connector instead — rest of the plan stays the same.

## Database Changes

Add two columns to `clinic_growth_leads`:

- `last_notified_at timestamptz` — timestamp of the last "new lead" email sent. Used for 24h dedup.
- `abandoned_email_sent_at timestamptz` — set once the 20-min abandoned email is sent, to prevent repeats.

(No changes to existing columns, RLS, or grants.)

## Server Logic

### 1. New-lead notification (immediate)

Update `upsertLead` in `src/lib/leads.functions.ts`:

- After a successful insert OR update where `lead_status === "Opted In - Checkout Not Completed"`, check `last_notified_at`.
- Send the immediate email only if:
  - It's a brand-new insert, OR
  - The existing record's `last_notified_at` is null or older than 24 hours.
- On send success, set `last_notified_at = now()` and `abandoned_email_sent_at = null` (reset so the 20-min check applies to this new submission).
- If the DB save fails, no email is sent (already enforced by ordering).

### 2. Abandoned-checkout notification (20 min later)

Add a server route `src/routes/api/public/cron/check-abandoned-leads.ts` that:

- Selects leads where:
  - `lead_status = 'Opted In - Checkout Not Completed'`
  - `created_at` (or `last_notified_at`) is between 20 and ~60 minutes ago
  - `abandoned_email_sent_at IS NULL`
- For each, sends the "⏰ Checkout Abandoned" email and stamps `abandoned_email_sent_at = now()`.
- Authenticated via the `apikey` header (Supabase anon key) per the standard cron pattern. No custom secret.

Schedule via `pg_cron` + `pg_net` to run every 5 minutes hitting that route.

### 3. Email content

Both emails sent via Lovable Emails `sendTransactionalEmail` helper, with templates in `src/lib/email-templates/`:

- `new-lead-notification.tsx`
  - Subject: `🚨 New Clinic Growth Lead — {full_name}`
  - Body includes Full Name, Email, WhatsApp, Submitted At (formatted in `Asia/Karachi`), Lead Status, Source, and a clickable WhatsApp link (`https://wa.me/<digits>`).
- `abandoned-checkout-notification.tsx`
  - Subject: `⏰ Checkout Abandoned — Follow Up Now: {full_name}`
  - Body per spec, same WhatsApp link.

Recipient hardcoded to `Farhanali13440@gmail.com` in the server function (not exposed to client).

## Dedup Summary

| Scenario | Behavior |
|---|---|
| Brand-new email submits | Immediate email sent |
| Same email resubmits within 24h | Lead row updated, no new email |
| Same email resubmits after 24h | New immediate email sent, abandoned timer reset |
| Lead completes checkout before 20 min | No abandoned email (status no longer "Opted In - Checkout Not Completed") |
| Lead still pending after 20 min | One abandoned email, then never again for that submission |

## Files Touched

- **Migration**: add `last_notified_at`, `abandoned_email_sent_at` columns.
- **Edited**: `src/lib/leads.functions.ts` (post-save email + dedup logic).
- **New**: `src/lib/email/notify-internal.server.ts` (send helpers, recipient constant, WhatsApp link formatting, PKT time formatting).
- **New**: `src/lib/email-templates/new-lead-notification.tsx`, `abandoned-checkout-notification.tsx` (+ registry update).
- **New**: `src/routes/api/public/cron/check-abandoned-leads.ts`.
- **Migration**: pg_cron schedule calling the cron route every 5 min.

## Prerequisites You'll Need to Do

1. Set up the email sender domain (one-time, via the email setup dialog I'll surface).
2. Confirm provider choice (Lovable Emails default; say "use Resend" to switch).

## Verification

After build: submit a test lead → confirm immediate email arrives and `last_notified_at` is set. Resubmit same email → confirm no duplicate. Wait 20+ min without checking out → confirm abandoned email arrives once. Submit another test lead and complete checkout within 20 min → confirm no abandoned email.
