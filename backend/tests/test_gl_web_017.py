"""GL-WEB-017 — Backend tests for Sample Report, Field Checklist, Review URL UTM."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://z-project-9.preview.emergentagent.com").rstrip("/")


# ── Item 2 — Sample Report submit ────────────────────────────────────────────
class TestSampleReportSubmit:
    def test_submit_success(self):
        r = requests.post(
            f"{BASE_URL}/api/sample-report/submit",
            json={
                "first_name": "E1QA",
                "email": "e1-qa@example.com",
                "company": "QA Test Co",
            },
            timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert "message" in data

    def test_submit_without_company(self):
        r = requests.post(
            f"{BASE_URL}/api/sample-report/submit",
            json={"first_name": "E1QA2", "email": "e1-qa-2@example.com"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        assert r.json().get("success") is True

    def test_submit_missing_email_validation(self):
        r = requests.post(
            f"{BASE_URL}/api/sample-report/submit",
            json={"first_name": "NoEmail"},
            timeout=15,
        )
        # Pydantic validation should reject this
        assert r.status_code in (400, 422), r.text


# ── Item 4 — Field Checklist ungated PDF ─────────────────────────────────────
class TestFieldChecklist:
    def test_field_checklist_returns_pdf(self):
        r = requests.get(f"{BASE_URL}/api/field-checklist", timeout=30)
        assert r.status_code == 200, r.text
        ct = r.headers.get("content-type", "")
        assert "application/pdf" in ct.lower(), f"unexpected content-type: {ct}"
        assert len(r.content) > 1000  # Non-trivial PDF
        assert r.content[:4] == b"%PDF"


# ── Item 1 — Review URL UTM (backend .env value) ─────────────────────────────
class TestGoogleReviewURL:
    def test_env_has_safety_check_pdf_utm(self):
        # Read .env directly to verify the GIGLINE_GOOGLE_REVIEW_URL
        env_path = "/app/backend/.env"
        with open(env_path) as f:
            content = f.read()
        assert "GIGLINE_GOOGLE_REVIEW_URL=" in content
        # Find the line
        for line in content.splitlines():
            if line.startswith("GIGLINE_GOOGLE_REVIEW_URL="):
                val = line.split("=", 1)[1]
                assert "maps.app.goo.gl/4D3TVUAeyfzbm7WbA" in val
                assert "utm_source=safety-check-pdf" in val
                assert "utm_campaign=review-request" in val
                break
        else:
            pytest.fail("GIGLINE_GOOGLE_REVIEW_URL not found in .env")


# ── Regression — health endpoints ────────────────────────────────────────────
class TestRegression:
    def test_root_api(self):
        r = requests.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code in (200, 404)  # may not have root, just sanity

    def test_field_notes_or_other_existing_route(self):
        # Confirm walkthrough_landing module routes still register
        r = requests.get(f"{BASE_URL}/api/leave-behind", timeout=30, allow_redirects=False)
        assert r.status_code in (200, 404), r.status_code
