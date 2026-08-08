/**
 * GL-WEB-018 (Jul 2026) — Feature flags.
 *
 * `SUPERVISOR_KIT_ENABLED` was originally env-driven so the Supervisor Safety
 * OS could be toggled off on production without a redeploy. As of Aug 2026 the
 * kit is a permanent live product — hard-coded to `true` to eliminate the
 * Vercel env-var dependency that caused the route to redirect to `/services`
 * when the variable wasn't set on the deploy target.
 *
 * Backend has a matching flag (`SUPERVISOR_KIT_ENABLED` in backend/.env)
 * that still controls whether checkout endpoints are live. Keep that in sync
 * if the kit ever needs to be taken offline again.
 */

export const SUPERVISOR_KIT_ENABLED = true;
