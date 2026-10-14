# Deploying Fig for friends (Netlify)

`site/` is the app (plain static files); `netlify/functions/ask.js` is the AI proxy.

1. In Netlify: **Add new site → Import from Git**, pick this repo and the branch, and set **Base directory** to `fig`.
   Build command: none. Publish directory and functions are read from `fig/netlify.toml`.
2. **Site settings → Environment variables**: add `ANTHROPIC_API_KEY`. Optional: `FIG_MODEL`.
3. Deploy. Open the URL on a phone and use *Add to Home Screen* to install it.

Notes
- Without the key the AI falls back to the built-in library answers (the app still works).
- Limits are enforced on the server: 3 AI answers per device per day (40 if the device claims Pro), 60 per IP per day. Edit the constants at the top of `ask.js`.
- Everyone's data stays in their own browser. Use the in-app backup to move it.
- Local preview: `cd site && python3 -m http.server 8000`. The AI call only works on Netlify (`netlify dev` from `fig/` also works).
- `design/` and the original handoff files are kept as reference. `site/` is now the source of truth.
