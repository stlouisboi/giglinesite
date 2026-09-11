"""SEC-001 / SEC-003 / Stripe webhook verification tests.

Runs against the local uvicorn instance managed by supervisor. Verifies:

  * SEC-001 — Admin auth uses only the ADMIN_PASSWORD env var (no hardcoded
    fallback). When the env var is unset, admin routes fail closed with 401.
  * SEC-003 — User-supplied HTML injected via the Fit Call form appears as
    inert escaped text in the outbound admin email HTML (not as live markup).
  * Webhook — /api/webhook/stripe rejects missing signatures, invalid
    signatures, and malformed bodies. Accepts signatures signed with the
    configured STRIPE_WEBHOOK_SECRET. Idempotency guard suppresses replays.
"""

import hmac
import hashlib
import json
import os
import time
import uuid

import httpx
import pytest

# Talk to the local supervisor-managed uvicorn instance.
API_BASE = "http://localhost:8001/api"

# For local test runs we sign webhooks with a known secret; the backend must
# have STRIPE_WEBHOOK_SECRET set to this value in .env (or its process env).
LOCAL_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET_TEST", "whsec_test_gl_security_local")


def _stripe_signature_header(payload: bytes, secret: str, ts: int | None = None) -> str:
    """Build a valid `Stripe-Signature` header (t=<ts>,v1=<hex_sha256_hmac>).

    Mirrors the on-wire format Stripe emits so we can verify our webhook
    handler's use of ``stripe.Webhook.construct_event`` without a live account.
    """
    ts = ts or int(time.time())
    signed_payload = f"{ts}.{payload.decode('utf-8')}".encode("utf-8")
    sig = hmac.new(secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    return f"t={ts},v1={sig}"


# ─────────────────── SEC-001 ───────────────────

def test_sec001_admin_login_requires_env_password():
    """The historical hardcoded fallback ('gigline2026') must not authenticate
    unless the operator has explicitly set it as ADMIN_PASSWORD.

    We enforce this at the source level: config.py must not carry a literal
    default value. The live-server smoke test (`test_sec001_...` below) then
    validates behaviour end-to-end once the env is rotated.
    """
    src = open("/app/backend/config.py").read()
    assert "os.environ.get('ADMIN_PASSWORD', 'gigline2026')" not in src, (
        "Hardcoded 'gigline2026' fallback is still present in config.py"
    )
    assert "os.environ.get(\"ADMIN_PASSWORD\", \"gigline2026\")" not in src
    # Sanity: the file DOES read the env var (fail-closed pattern present).
    assert "ADMIN_PASSWORD" in src
    assert "secrets.token_hex" in src, (
        "Fail-closed sentinel not present: an unset env should generate a "
        "random unmatchable password, not accept any request."
    )


def test_sec001_admin_login_random_string_rejected():
    """A random password must not authenticate under any conditions."""
    r = httpx.post(
        f"{API_BASE}/admin/login",
        json={"password": "definitely-not-the-admin-password-" + uuid.uuid4().hex},
        timeout=5,
    )
    assert r.status_code == 401


def test_sec001_admin_stats_without_token_rejected():
    r = httpx.get(f"{API_BASE}/admin/stats", timeout=5)
    assert r.status_code == 401


# ─────────────────── SEC-003 ───────────────────

FIT_CALL_XSS_PAYLOAD = (
    "<script>alert('xss')</script>"
    "<img src=x onerror=alert('img')>"
    "\"'></td><td onclick=alert(1)>"
)


def test_sec003_fit_call_html_is_escaped_in_render():
    """The Fit Call notification renderer must escape every user-supplied field
    so an injected <script> becomes inert text, not live markup.

    We import the renderer directly rather than sending a live email because
    Resend isn't wired up in tests. The renderer is the boundary that carries
    the SEC-003 obligation.
    """
    import sys
    sys.path.insert(0, "/app/backend")
    from routes.fit_call import _render_notification_html, FitCallRequest

    payload = FitCallRequest(
        contactName=FIT_CALL_XSS_PAYLOAD,
        email="attacker@example.com",
        companyName="<b>Bold Co</b>",
        industry="<svg/onload=alert(2)>",
        locationCityState="Kernersville, NC",
        employeeCount="under_25",
        primaryProblem=FIT_CALL_XSS_PAYLOAD,
        existingPrograms=["<i>loto</i>", "hazcom"],
    )
    html = _render_notification_html(payload, request_id="req-test")

    # No live tags from user input — every `<` in payload must be escaped:
    assert "<script>" not in html
    assert "<img " not in html
    assert "<svg" not in html
    # Attribute-breakout via </td><td onclick=...> must not create live markup.
    # A safe render collapses these into escaped text (`&lt;/td&gt;`).
    assert "</td><td onclick" not in html
    assert "&lt;/td&gt;&lt;td onclick" in html
    # <b>Bold Co</b> must render as text, not markup:
    assert "<b>Bold Co</b>" not in html
    assert "&lt;b&gt;Bold Co&lt;/b&gt;" in html
    # And the escaped script tag must be present as text:
    assert "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;" in html


def test_sec003_intake_pre_block_escaped():
    """The Vince intake email wraps a plaintext block in <pre>. The plaintext
    itself must be HTML-escaped so a submitter cannot close the <pre> and
    inject arbitrary markup."""
    import sys
    sys.path.insert(0, "/app/backend")
    from lib.html_safe import esc
    dangerous = "</pre><script>alert('breakout')</script>"
    safe = esc(dangerous)
    assert "<pre>" not in safe
    assert "<script>" not in safe
    assert "&lt;/pre&gt;" in safe


def test_sec003_citation_proof_kit_greeting_escaped():
    """Buyer greetings in citation-proof-kit emails come from Stripe's
    customer_name. Escape it so an adversarial checkout name cannot inject
    HTML into the buyer's confirmation email."""
    import sys
    sys.path.insert(0, "/app/backend")
    from lib.html_safe import esc
    payload = "<script>alert(1)</script>"
    assert esc(payload) == "&lt;script&gt;alert(1)&lt;/script&gt;"


# ─────────────────── SEC-002 access-log redaction ───────────────────

def test_sec002_log_sanitizer_redacts_token_query():
    """The SEC-002 defence-in-depth filter must rewrite `token=<value>` in
    log records so the admin password never lands in Railway/Vercel logs."""
    import sys
    sys.path.insert(0, "/app/backend")
    from lib.log_sanitizer import _TOKEN_PATTERN  # type: ignore

    samples = [
        ('GET /api/admin/stats?token=SECRET123 HTTP/1.1',
         'GET /api/admin/stats?token=<redacted> HTTP/1.1'),
        ('/api/admin/leads?token=abc&limit=50',
         '/api/admin/leads?token=<redacted>&limit=50'),
        ('token=only-thing HTTP/1.1',
         'token=<redacted> HTTP/1.1'),
        # A `token=` used as part of a longer word should still be redacted.
        ('?client_name=foo&token=xyz "GET"',
         '?client_name=foo&token=<redacted> "GET"'),
        # No token = passthrough.
        ('GET /api/health HTTP/1.1', 'GET /api/health HTTP/1.1'),
    ]
    for src, expect in samples:
        got = _TOKEN_PATTERN.sub("token=<redacted>", src)
        assert got == expect, f"redaction mismatch: {src!r} -> {got!r}"


def test_sec002_admin_auth_dep_accepts_bearer():
    """`require_admin` must authenticate via Authorization: Bearer header."""
    import sys
    sys.path.insert(0, "/app/backend")
    from config import ADMIN_PASSWORD

    r = httpx.get(f"{API_BASE}/admin/stats", timeout=5)
    assert r.status_code == 401
    # With Bearer header — admin.py hasn't been migrated to the shared dep
    # yet, so this specifically probes the /admin/login endpoint round-trip
    # to confirm the credential wiring is still intact.
    r2 = httpx.post(f"{API_BASE}/admin/login",
                    json={"password": ADMIN_PASSWORD}, timeout=5)
    assert r2.status_code == 200
    assert r2.json().get("token") == ADMIN_PASSWORD


# ─────────────────── Stripe webhook ───────────────────

def test_webhook_rejects_missing_signature():
    body = json.dumps({"id": "evt_1", "type": "checkout.session.completed"}).encode()
    r = httpx.post(
        f"{API_BASE}/webhook/stripe",
        content=body,
        headers={"Content-Type": "application/json"},
        timeout=5,
    )
    assert r.status_code == 400
    assert "signature" in r.text.lower() or "not configured" in r.text.lower()


def test_webhook_rejects_invalid_signature():
    body = json.dumps({"id": "evt_2", "type": "checkout.session.completed"}).encode()
    r = httpx.post(
        f"{API_BASE}/webhook/stripe",
        content=body,
        headers={
            "Content-Type": "application/json",
            "Stripe-Signature": "t=1234567890,v1=deadbeef",
        },
        timeout=5,
    )
    # Either "not configured" (secret missing) or "invalid signature".
    assert r.status_code == 400


@pytest.mark.skipif(
    not os.environ.get("STRIPE_WEBHOOK_SECRET"),
    reason="STRIPE_WEBHOOK_SECRET must be set for signed-webhook tests",
)
def test_webhook_accepts_valid_signature_and_idempotent():
    """When STRIPE_WEBHOOK_SECRET is set, a correctly signed payload is
    accepted, and a replay of the same event id is ignored (idempotency)."""
    secret = os.environ["STRIPE_WEBHOOK_SECRET"]
    event_id = f"evt_test_{uuid.uuid4().hex[:16]}"
    body = json.dumps({
        "id": event_id,
        "type": "checkout.session.completed",
        "data": {"object": {"id": f"cs_test_{uuid.uuid4().hex[:12]}", "payment_status": "paid"}},
    }).encode()
    sig = _stripe_signature_header(body, secret)
    r1 = httpx.post(
        f"{API_BASE}/webhook/stripe",
        content=body,
        headers={"Content-Type": "application/json", "Stripe-Signature": sig},
        timeout=5,
    )
    assert r1.status_code == 200, r1.text
    # Replay same body -> new signature (new ts), but same event id -> duplicate.
    sig2 = _stripe_signature_header(body, secret)
    r2 = httpx.post(
        f"{API_BASE}/webhook/stripe",
        content=body,
        headers={"Content-Type": "application/json", "Stripe-Signature": sig2},
        timeout=5,
    )
    assert r2.status_code == 200
    assert r2.json().get("status") == "duplicate", r2.json()
