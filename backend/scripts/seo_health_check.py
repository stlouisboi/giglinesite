"""
GigLine — SEO / AI-engine Health Check
=======================================

Hits every public URL on the production site, validates HTTP status,
JSON-LD schema integrity, and presence of expected schema types per route.

Run manually:
    python /app/backend/scripts/seo_health_check.py
    python /app/backend/scripts/seo_health_check.py --quiet           # no email even if issues
    python /app/backend/scripts/seo_health_check.py --force-email     # email even if clean

Run weekly via cron (suggested — Mondays 7am):
    0 7 * * 1 cd /app && /usr/bin/python3 /app/backend/scripts/seo_health_check.py >> /var/log/giglinecompliance/seo_health.log 2>&1

Behavior:
    - Saves a timestamped JSON report to /app/backend/seo_reports/.
    - Sends an email to VINCE_EMAIL via Resend ONLY when issues are found
      (so a clean week is silent — no inbox noise).
"""
import os
import sys
import json
import re
import ssl
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

# Allow this script to be run standalone without booting FastAPI
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

import resend  # noqa: E402

resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
VINCE_EMAIL = os.environ.get("VINCE_EMAIL", "vince@giglinecompliance.com")

BASE = "https://www.giglinecompliance.com"
REPORTS_DIR = Path(__file__).resolve().parent.parent / "seo_reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# ── Routes to monitor ─────────────────────────────────────────────────────
# Each entry: (path, expected_schema_types_or_None)
# None = no schema requirement (assets like sitemap.xml, robots.txt)
ROUTES = [
    ("/", ["LocalBusiness", "Person", "FAQPage", "BreadcrumbList"]),
    ("/services", ["ItemList", "FAQPage", "BreadcrumbList"]),
    ("/about", ["Person", "BreadcrumbList"]),
    ("/contact", ["LocalBusiness", "BreadcrumbList"]),
    ("/faq", ["FAQPage", "BreadcrumbList"]),
    ("/safety-check", ["LocalBusiness"]),
    ("/hazcom", ["LocalBusiness"]),
    ("/heat-guide", ["LocalBusiness"]),
    ("/request-walkthrough", ["LocalBusiness"]),
    ("/field-notes", ["LocalBusiness"]),
    ("/blog/top-5-osha-violations-small-manufacturing", ["Article", "BreadcrumbList"]),
    ("/blog/hazcom-requirements-small-business", ["Article", "BreadcrumbList"]),
    # All 13 city pages
    *[
        (f"/safety-walkthrough/{c}", ["Service", "FAQPage", "BreadcrumbList"])
        for c in [
            "winston-salem", "greensboro", "high-point", "burlington",
            "charlotte", "raleigh", "kernersville", "lexington",
            "thomasville", "clemmons", "mocksville", "salisbury", "asheboro",
        ]
    ],
    # SEO assets
    ("/sitemap.xml", None),
    ("/robots.txt", None),
    ("/llms.txt", None),
]

CITY_SLUGS_IN_SITEMAP = [
    "winston-salem", "greensboro", "high-point", "burlington", "charlotte",
    "raleigh", "kernersville", "lexington", "thomasville", "clemmons",
    "mocksville", "salisbury", "asheboro",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GigLineHealthCheck/1.0; +https://www.giglinecompliance.com)"
}
SSL_CTX = ssl.create_default_context()


def fetch(url: str, timeout: int = 20):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=SSL_CTX, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, f"FETCH_ERROR: {e}"


def parse_schemas(html: str):
    """Return (list_of_types, count_of_invalid_blocks)."""
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    types, invalid = [], 0
    for raw in blocks:
        try:
            obj = json.loads(raw.strip())
        except json.JSONDecodeError:
            invalid += 1
            continue
        if isinstance(obj, dict):
            types.append(obj.get("@type", "?"))
        elif isinstance(obj, list):
            types.extend(o.get("@type", "?") if isinstance(o, dict) else "?" for o in obj)
    return types, invalid


def check_route(path: str, expected_schemas):
    url = BASE + path
    status, body = fetch(url)
    issues = []

    if status != 200:
        issues.append(f"HTTP {status}")
        return {"path": path, "status": status, "issues": issues, "schemas": []}

    schemas, invalid = parse_schemas(body)
    if invalid:
        issues.append(f"{invalid} invalid JSON-LD block(s)")

    if expected_schemas is not None:
        for required in expected_schemas:
            if required not in schemas:
                issues.append(f"missing schema: {required}")

    # Lightweight HTML signals
    if expected_schemas is not None:
        if "<title>" not in body:
            issues.append("missing <title>")
        if 'name="description"' not in body:
            issues.append("missing meta description")
        if "<h1" not in body and "<H1" not in body:
            issues.append("missing <h1>")

    return {
        "path": path,
        "status": status,
        "issues": issues,
        "schemas": schemas,
    }


def check_sitemap():
    """Make sure sitemap is reachable and contains all city slugs + /faq."""
    status, body = fetch(BASE + "/sitemap.xml")
    issues = []
    if status != 200:
        issues.append(f"sitemap returned HTTP {status}")
        return {"status": status, "url_count": 0, "issues": issues}

    url_count = body.count("<loc>")
    missing = [c for c in CITY_SLUGS_IN_SITEMAP if f"/safety-walkthrough/{c}" not in body]
    if missing:
        issues.append(f"sitemap missing cities: {', '.join(missing)}")
    if "/faq" not in body:
        issues.append("sitemap missing /faq")
    return {"status": status, "url_count": url_count, "issues": issues}


def email_report(results, sitemap_info, total_issues):
    if not resend.api_key:
        print("[seo-health] RESEND_API_KEY not configured — skipping email.")
        return False

    rows = []
    for r in results:
        bg = "#fff" if not r["issues"] else "#FFF5F5"
        status_color = "#16A34A" if r["status"] == 200 and not r["issues"] else "#DC2626"
        issues_html = "<br>".join(r["issues"]) if r["issues"] else "OK"
        rows.append(
            f"<tr style='background:{bg}'>"
            f"<td style='padding:6px 10px;font-family:monospace;font-size:12px'>{r['path']}</td>"
            f"<td style='padding:6px 10px;color:{status_color};font-weight:bold'>{r['status']}</td>"
            f"<td style='padding:6px 10px;font-size:12px'>{issues_html}</td>"
            f"</tr>"
        )

    sitemap_html = (
        f"<p>Sitemap: <strong>{sitemap_info['url_count']}</strong> URLs · "
        f"{'OK' if not sitemap_info['issues'] else '<span style=color:#DC2626>' + '; '.join(sitemap_info['issues']) + '</span>'}</p>"
    )

    html = f"""
    <h2>GigLine SEO Health Check — {total_issues} issue(s) found</h2>
    <p>Run at {datetime.now(timezone.utc).isoformat()}</p>
    {sitemap_html}
    <table style='border-collapse:collapse;width:100%;border:1px solid #E5E7EB;font-size:13px'>
      <thead>
        <tr style='background:#F9FAFB;text-align:left'>
          <th style='padding:8px 10px;border-bottom:1px solid #E5E7EB'>Path</th>
          <th style='padding:8px 10px;border-bottom:1px solid #E5E7EB'>HTTP</th>
          <th style='padding:8px 10px;border-bottom:1px solid #E5E7EB'>Issues</th>
        </tr>
      </thead>
      <tbody>{''.join(rows)}</tbody>
    </table>
    <p style='margin-top:20px;color:#6B7280;font-size:12px'>
      Automated check from /app/backend/scripts/seo_health_check.py.
      You only get this email when issues are detected.
    </p>
    """

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"⚠️ GigLine SEO Health: {total_issues} issue(s) found",
            "html": html,
        })
        print(f"[seo-health] Email sent to {VINCE_EMAIL}")
        return True
    except Exception as e:
        print(f"[seo-health] Email send failed: {e}")
        return False


def main():
    quiet = "--quiet" in sys.argv
    force_email = "--force-email" in sys.argv

    print(f"[seo-health] Checking {len(ROUTES)} routes against {BASE}")
    results = [check_route(p, sch) for p, sch in ROUTES]
    sitemap_info = check_sitemap()

    total_issues = sum(len(r["issues"]) for r in results) + len(sitemap_info["issues"])

    # Console output
    print(f"{'PATH':<55} {'HTTP':<6} {'ISSUES'}")
    print("-" * 110)
    for r in results:
        issues = "; ".join(r["issues"]) if r["issues"] else "OK"
        print(f"{r['path']:<55} {r['status']:<6} {issues}")
    print("-" * 110)
    print(f"Sitemap: {sitemap_info['url_count']} URLs · "
          f"{'OK' if not sitemap_info['issues'] else '; '.join(sitemap_info['issues'])}")
    print(f"\nTOTAL ISSUES: {total_issues}")

    # Save report
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    report_path = REPORTS_DIR / f"seo_health_{timestamp}.json"
    with open(report_path, "w") as f:
        json.dump({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "base_url": BASE,
            "total_issues": total_issues,
            "sitemap": sitemap_info,
            "routes": results,
        }, f, indent=2)
    print(f"[seo-health] Report saved to {report_path}")

    # Send email if issues exist (or forced)
    should_email = (total_issues > 0 or force_email) and not quiet
    if should_email:
        email_report(results, sitemap_info, total_issues)
    elif total_issues == 0:
        print("[seo-health] No issues — email skipped (clean run).")

    sys.exit(0 if total_issues == 0 else 1)


if __name__ == "__main__":
    main()
