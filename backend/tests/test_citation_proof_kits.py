"""Citation-Proof Kit Series — Stripe checkout regression tests (all 6 tier/kit combos)."""

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

ALL_SLUGS = ["loto-readiness-kit", "forklift-pit-readiness-kit"]
ALL_TIERS = ["digital", "control-system", "binder"]
BINDER_TIERS = {"binder"}


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.mark.parametrize("slug", ALL_SLUGS)
@pytest.mark.parametrize("tier", ALL_TIERS)
class TestCitationProofKitCheckoutAllTiers:
    def test_checkout_creates_stripe_session(self, api_client, slug, tier):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={
                "slug": slug,
                "tier": tier,
                "origin_url": "https://example.com",
                "email": f"test-{tier}@example.com",
            },
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["url"].startswith("https://checkout.stripe.com/"), data
        assert data["session_id"].startswith("cs_"), data

    def test_verify_unpaid_session(self, api_client, slug, tier):
        created = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={
                "slug": slug,
                "tier": tier,
                "origin_url": "https://example.com",
                "email": f"verify-{tier}@example.com",
            },
            timeout=15,
        )
        assert created.status_code == 200
        sid = created.json()["session_id"]
        r = api_client.get(
            f"{API}/citation-proof-kit/verify",
            params={"session_id": sid},
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json().get("verified") is False


class TestCitationProofKitCheckoutErrors:
    def test_unknown_tier_returns_400(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={
                "slug": "loto-readiness-kit",
                "tier": "platinum",
                "origin_url": "https://example.com",
            },
            timeout=15,
        )
        assert r.status_code == 400
        assert "platinum" in r.text

    def test_unsupported_kit_returns_400(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={
                "slug": "does-not-exist-kit",
                "tier": "digital",
                "origin_url": "https://example.com",
            },
            timeout=15,
        )
        assert r.status_code == 400
        assert "does-not-exist-kit" in r.text

    def test_missing_slug_returns_422(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={"tier": "digital", "origin_url": "https://example.com"},
            timeout=15,
        )
        assert r.status_code == 422

    def test_verify_garbage_session_soft_fails(self, api_client):
        r = api_client.get(
            f"{API}/citation-proof-kit/verify",
            params={"session_id": "cs_garbage_nonexistent_id_xxx"},
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json().get("verified") is False


class TestCitationProofKitBackCompat:
    """Ensures the original /citation-proof-kit-digital endpoint still works —
    critical because any external landing pages / email links may still point at it."""

    def test_digital_endpoint_defaults_to_digital_tier(self, api_client):
        r = api_client.post(
            f"{API}/checkout/citation-proof-kit-digital",
            json={
                "slug": "loto-readiness-kit",
                "origin_url": "https://example.com",
                "email": "backcompat@example.com",
            },
            timeout=15,
        )
        assert r.status_code == 200, r.text
        assert r.json()["session_id"].startswith("cs_")


class TestCitationProofKitPDFDeliverables:
    """All 4 branded PDFs must exist on disk with reasonable size."""

    @pytest.mark.parametrize("filename", [
        "GigLine_LOTO_Digital_Compliance_Kit_150.pdf",
        "GigLine_LOTO_Compliance_Control_System_300.pdf",
        "GigLine_PIT_Digital_Compliance_Kit_150.pdf",
        "GigLine_PIT_Compliance_Control_System_300.pdf",
    ])
    def test_branded_pdf_present(self, filename):
        path = f"/app/backend/kit_files/{filename}"
        assert os.path.isfile(path), f"Missing branded PDF: {path}"
        assert os.path.getsize(path) > 50_000, f"PDF suspiciously small: {path}"


class TestBinderShippingCollection:
    """Binder tier ($600) must trigger Stripe's shipping-address collection.
    We verify by inspecting the Stripe session directly via stripe SDK."""

    def test_binder_session_collects_shipping(self, api_client):
        import sys
        sys.path.insert(0, '/app/backend')
        import stripe as stripe_lib
        stripe_lib.api_key = os.environ.get('STRIPE_API_KEY', '')
        if not stripe_lib.api_key:
            pytest.skip("STRIPE_API_KEY not available in this environment")

        r = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={
                "slug": "loto-readiness-kit",
                "tier": "binder",
                "origin_url": "https://example.com",
                "email": "shipping-check@example.com",
            },
            timeout=15,
        )
        assert r.status_code == 200
        sid = r.json()["session_id"]
        session = stripe_lib.checkout.Session.retrieve(sid)
        assert session.shipping_address_collection is not None
        assert "US" in session.shipping_address_collection.allowed_countries
        assert session.phone_number_collection.enabled is True

    def test_digital_session_does_not_collect_shipping(self, api_client):
        import sys
        sys.path.insert(0, '/app/backend')
        import stripe as stripe_lib
        stripe_lib.api_key = os.environ.get('STRIPE_API_KEY', '')
        if not stripe_lib.api_key:
            pytest.skip("STRIPE_API_KEY not available in this environment")

        r = api_client.post(
            f"{API}/checkout/citation-proof-kit",
            json={
                "slug": "loto-readiness-kit",
                "tier": "digital",
                "origin_url": "https://example.com",
                "email": "no-shipping-check@example.com",
            },
            timeout=15,
        )
        assert r.status_code == 200
        sid = r.json()["session_id"]
        session = stripe_lib.checkout.Session.retrieve(sid)
        assert session.shipping_address_collection is None
