"""Citation-Proof Kit Series ($150 Digital) Stripe checkout regression tests."""

import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


class TestCitationProofKitCheckout:
    def test_loto_digital_checkout_creates_session(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit-digital",
            json={
                "slug": "loto-readiness-kit",
                "origin_url": "https://example.com",
                "email": "loto-checkout-test@example.com",
            },
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and data["url"].startswith("https://checkout.stripe.com/")
        assert "session_id" in data and data["session_id"].startswith("cs_")

    def test_pit_digital_checkout_creates_session(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit-digital",
            json={
                "slug": "forklift-pit-readiness-kit",
                "origin_url": "https://example.com",
                "email": "pit-checkout-test@example.com",
            },
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["url"].startswith("https://checkout.stripe.com/")
        assert data["session_id"].startswith("cs_")

    def test_unsupported_slug_returns_400(self, api_client):
        # HazCom / Incident / New Hire kits are NOT wired for direct Stripe checkout;
        # they still route through /contact.
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit-digital",
            json={
                "slug": "hazcom-pro-kit",
                "origin_url": "https://example.com",
            },
            timeout=15,
        )
        assert r.status_code == 400, r.text
        assert "hazcom-pro-kit" in r.text

    def test_missing_slug_returns_422(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit-digital",
            json={"origin_url": "https://example.com"},
            timeout=15,
        )
        # FastAPI/pydantic returns 422 for missing required field
        assert r.status_code == 422, r.text

    def test_verify_unpaid_session(self, api_client):
        # Create session, then immediately verify — should return unpaid.
        create = api_client.post(
            f"{API}/checkout/citation-proof-kit-digital",
            json={
                "slug": "loto-readiness-kit",
                "origin_url": "https://example.com",
                "email": "verify-unpaid-test@example.com",
            },
            timeout=15,
        )
        assert create.status_code == 200
        sid = create.json()["session_id"]
        r = api_client.get(
            f"{API}/citation-proof-kit/verify",
            params={"session_id": sid},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("verified") is False
        assert data.get("payment_status") == "unpaid"

    def test_verify_garbage_session_soft_fails(self, api_client):
        # Bogus session id should still return 200 with verified=false (not 500).
        r = api_client.get(
            f"{API}/citation-proof-kit/verify",
            params={"session_id": "cs_garbage_nonexistent_id_xxx"},
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json().get("verified") is False


class TestCitationProofKitPDFDeliverables:
    """The auto-attach flow requires branded PDFs on disk. If these are missing
    the buyer email falls back to the manual-delivery copy and Vince gets an
    ACTION REQUIRED notification. Fail loudly in CI rather than let that ship."""

    def test_loto_digital_pdf_present(self):
        import os
        path = "/app/backend/kit_files/GigLine_LOTO_Digital_Compliance_Kit_150.pdf"
        assert os.path.isfile(path), f"Missing branded PDF: {path}"
        assert os.path.getsize(path) > 50_000, f"PDF suspiciously small: {path}"

    def test_pit_digital_pdf_present(self):
        import os
        path = "/app/backend/kit_files/GigLine_PIT_Digital_Compliance_Kit_150.pdf"
        assert os.path.isfile(path), f"Missing branded PDF: {path}"
        assert os.path.getsize(path) > 50_000, f"PDF suspiciously small: {path}"
