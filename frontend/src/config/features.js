/**
 * GL-WEB-018 (Jul 2026) — Feature flags.
 *
 * `SUPERVISOR_KIT_ENABLED` toggles all UI + routing for the Supervisor Safety
 * Starter System. When false: hides tiles/links, redirects `/supervisor-kit`
 * to `/services`, hides cross-sell blocks in blogs & field notes.
 *
 * Backend has a matching flag (`SUPERVISOR_KIT_ENABLED` in backend/.env)
 * that returns 503 on checkout endpoints while keeping /verify functional
 * for any in-flight paid orders.
 *
 * Flip via `REACT_APP_SUPERVISOR_KIT_ENABLED=true` in frontend/.env + rebuild.
 */

export const SUPERVISOR_KIT_ENABLED =
  (process.env.REACT_APP_SUPERVISOR_KIT_ENABLED || '').toLowerCase() === 'true';
