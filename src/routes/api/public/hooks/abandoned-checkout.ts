// Cron route — invoked every 5 minutes by pg_cron. Sends any abandoned
// checkout reminders whose scheduled_for is due. No auth required (public
// hook), but the handler does no destructive work other than enqueueing.
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/hooks/abandoned-checkout')({
  server: {
    handlers: {
      POST: async () => {
        try {
          const { processDueAbandonedReminders, ensureCohortDeadlineReminders } = await import(
            '@/lib/abandoned-checkout.server'
          )
          const backfilled = await ensureCohortDeadlineReminders()
          const result = await processDueAbandonedReminders({ limit: 100 })
          return Response.json({ ok: true, backfilled, ...result })
        } catch (err: any) {
          console.error('[cron abandoned-checkout] failed', err)
          return Response.json(
            { ok: false, error: err?.message ?? 'unknown' },
            { status: 500 },
          )
        }
      },
      GET: async () => Response.json({ ok: true, hint: 'POST to process queue' }),
    },
  },
})
