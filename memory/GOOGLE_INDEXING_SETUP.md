# Google Indexing API — One-Time Setup

Ships URLs directly to Google for near-instant crawling. Used by the Admin
"SEO Indexing" tab (single-URL button + bulk push from `sitemap.xml`).

**Time required:** ~15 minutes. All one-time. Nothing to renew.

---

## 1. Create a Google Cloud project & enable the Indexing API

1. Go to <https://console.cloud.google.com/> and log in with the Google
   account that already owns Google Search Console for
   `giglinecompliance.com`.
2. Click the project selector (top bar) → **NEW PROJECT**.
   - Name: `GigLine Indexing` (or anything).
   - Location: no organization.
   - Click **CREATE** and wait 10-20 seconds.
3. With that project selected, open the **API Library**:
   <https://console.cloud.google.com/apis/library/indexing.googleapis.com>
4. Click **ENABLE**. Wait for it to flip to "API enabled".

---

## 2. Create a service account & download its JSON key

1. Open **IAM & Admin → Service Accounts**:
   <https://console.cloud.google.com/iam-admin/serviceaccounts>
2. Click **CREATE SERVICE ACCOUNT**.
   - Name: `gigline-indexing-bot`
   - Description: "Submits URLs to the Google Indexing API for
     giglinecompliance.com".
   - Click **CREATE AND CONTINUE**.
3. **Grant this service account access** step — click **CONTINUE** without
   picking any project role (Indexing API doesn't need one).
4. **Grant users access** step — click **DONE**.
5. On the Service Accounts list, click the new account → **KEYS** tab →
   **ADD KEY → Create new key → JSON → CREATE**.
6. A `.json` file downloads. Keep it somewhere safe on your computer.
   *(You cannot re-download the same key — you'd have to make a new one.)*

Also **copy the service account's email address** (looks like
`gigline-indexing-bot@<project-id>.iam.gserviceaccount.com`). You'll need
it in step 3.

---

## 3. Add the service account as an Owner in Google Search Console

Google will reject submissions unless the service account has verified
Owner permission for the property.

1. Open <https://search.google.com/search-console>.
2. Pick the `giglinecompliance.com` property.
3. **Settings → Users and permissions → ADD USER**.
4. Paste the service-account email from step 2.
5. Permission: **Owner** (required — Full or Restricted will 403 the API).
6. Save.

---

## 4. Base64-encode the JSON key & drop it into backend/.env

The backend reads credentials from the env var
`GOOGLE_INDEXING_SA_JSON_BASE64`. Encode the JSON file on your laptop:

```bash
# macOS / Linux
base64 -w0 gigline-indexing-bot-<hash>.json | pbcopy   # macOS
base64 -w0 gigline-indexing-bot-<hash>.json | xclip -selection clipboard  # Linux
```

Then paste the (very long) single-line string as the value in
`/app/backend/.env`:

```
GOOGLE_INDEXING_SA_JSON_BASE64=eyJ0eXAiOi...   (one long line, no quotes)
```

Restart the backend:

```bash
sudo supervisorctl restart backend
```

---

## 5. Verify from the Admin dashboard

1. Log in at `/admin`.
2. Open the **SEO Indexing** tab.
3. The "Connection status" card should say **Configured** and print the
   service-account email.
4. Test with any live URL — e.g., `https://www.giglinecompliance.com/`.
   A successful response looks like:
   ```json
   {"urlNotificationMetadata": {"url": "...", "latestUpdate": {...}}}
   ```
5. If you see `403 Permission denied`, the Search Console owner assignment
   in step 3 didn't propagate — re-check the email and permission level.

---

## 6. Daily quota — what to expect

- **Default quota: 200 requests / day** (roughly). Enough for a normal
  publish cadence. Google may reject with `429 RESOURCE_EXHAUSTED` if you
  push too many at once. The admin bulk push is hard-capped at 100 URLs
  per call for this reason.
- Higher quotas require a written request to Google. Ignore unless you're
  publishing >100 URLs/day.

---

## 7. When to use each notification type

| Situation | Use |
| :--- | :--- |
| New Field Note published | `URL_UPDATED` |
| Existing page significantly rewritten | `URL_UPDATED` |
| Page removed / 410'd / redirected permanently | `URL_DELETED` |
| Cosmetic copy tweak (no SEO value) | Don't submit — save the quota |

Google officially intends this API for `JobPosting` and `BroadcastEvent`
structured data. Submitting other pages works but is unofficial — treat
it as a "hint" rather than a guarantee.
