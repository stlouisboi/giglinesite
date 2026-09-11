/**
 * Admin auth helper (SEC-002 header migration).
 *
 * Wraps `fetch` so every admin request carries `Authorization: Bearer <token>`
 * instead of `?token=...` in the URL. The admin password is never appended to
 * a URL and therefore never lands in browser history, Referer headers,
 * Railway/Vercel access logs, or third-party analytics.
 *
 * Downloads (which browsers cannot decorate with headers when the user clicks
 * a plain <a href>) use `authDownload` — it fetches the file as a Blob, then
 * triggers a client-side download via a temporary object URL.
 */

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Compose fetch args with an Authorization: Bearer header.
 * Accepts either a full URL or an `/api/...` path.
 */
export const authFetch = (token, path, init = {}) => {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(url, { ...init, headers });
};

/**
 * Trigger a file download with Bearer auth. Fetches the resource as a Blob so
 * the header can be sent, then hands the browser an object URL to save.
 */
export const authDownload = async (token, path, suggestedFilename) => {
  const res = await authFetch(token, path);
  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }
  const blob = await res.blob();
  // Prefer server-provided Content-Disposition filename if available.
  let filename = suggestedFilename || 'download';
  const disp = res.headers.get('Content-Disposition') || '';
  const m = /filename="?([^";]+)"?/i.exec(disp);
  if (m && m[1]) filename = m[1];
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
