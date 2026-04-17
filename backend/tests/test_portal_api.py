"""
GL-PORT-001 Portal API Tests
Tests for /api/intake and /api/onboarding endpoints
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestOnboardingTiers:
    """Tests for GET /api/onboarding/tiers endpoint"""
    
    def test_get_tiers_returns_200(self):
        """Verify tiers endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/onboarding/tiers")
        assert response.status_code == 200
        print("✓ GET /api/onboarding/tiers returns 200")
    
    def test_get_tiers_returns_three_tiers(self):
        """Verify tiers endpoint returns exactly 3 tiers"""
        response = requests.get(f"{BASE_URL}/api/onboarding/tiers")
        data = response.json()
        assert len(data) == 3
        assert "small" in data
        assert "medium" in data
        assert "large" in data
        print("✓ GET /api/onboarding/tiers returns 3 tiers (small, medium, large)")
    
    def test_small_tier_price(self):
        """Verify small tier has correct walkthrough price"""
        response = requests.get(f"{BASE_URL}/api/onboarding/tiers")
        data = response.json()
        assert data["small"]["walkthroughPrice"] == 650
        assert data["small"]["label"] == "Small"
        assert data["small"]["headcount"] == "1–75"
        print("✓ Small tier: $650, 1-75 employees")
    
    def test_medium_tier_price(self):
        """Verify medium tier has correct walkthrough price"""
        response = requests.get(f"{BASE_URL}/api/onboarding/tiers")
        data = response.json()
        assert data["medium"]["walkthroughPrice"] == 750
        assert data["medium"]["label"] == "Medium"
        assert data["medium"]["headcount"] == "75–250"
        print("✓ Medium tier: $750, 75-250 employees")
    
    def test_large_tier_price(self):
        """Verify large tier has correct walkthrough price"""
        response = requests.get(f"{BASE_URL}/api/onboarding/tiers")
        data = response.json()
        assert data["large"]["walkthroughPrice"] == 900
        assert data["large"]["label"] == "Large"
        assert data["large"]["headcount"] == "250+"
        print("✓ Large tier: $900, 250+ employees")


class TestIntakeSubmit:
    """Tests for POST /api/intake/submit endpoint"""
    
    def test_intake_submit_success(self):
        """Verify intake submission with valid data returns success"""
        payload = {
            "company": f"TEST_Company_{uuid.uuid4().hex[:8]}",
            "address": "123 Test Street",
            "contactName": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "consentGiven": True
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "submissionId" in data
        assert len(data["submissionId"]) > 0
        print(f"✓ POST /api/intake/submit returns success with submissionId: {data['submissionId'][:8]}...")
    
    def test_intake_submit_requires_consent(self):
        """Verify intake submission fails without consent"""
        payload = {
            "company": "TEST_NoConsent",
            "address": "123 Test Street",
            "contactName": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "consentGiven": False
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        data = response.json()
        assert "consent" in data.get("detail", "").lower()
        print("✓ POST /api/intake/submit rejects submission without consent (400)")
    
    def test_intake_submit_with_full_data(self):
        """Verify intake submission with all fields"""
        payload = {
            "company": f"TEST_FullData_{uuid.uuid4().hex[:8]}",
            "dba": "Test DBA",
            "address": "456 Full Data Ave",
            "additionalLocations": "2-3",
            "contactName": "Jane Doe",
            "jobTitle": "Safety Manager",
            "email": "jane@test.com",
            "phone": "555-987-6543",
            "totalEmployees": 100,
            "siteEmployees": 75,
            "schedule": "2_shifts",
            "scheduleDetail": {"empPerShift": 40, "sameOps": "yes"},
            "industry": "manufacturing",
            "dayToDay": "CNC machining and assembly",
            "operations": ["Forklifts or powered industrial trucks", "Machine tools (lathes, mills, presses, saws)"],
            "topHazards": "Forklift traffic and machine guarding",
            "safetyProgram": "outdated",
            "safetyOwner": "part_of_job",
            "requiredPrograms": {"hazcom": "yes", "loto": "no", "ppe": "yes"},
            "oshaLogs": "yes",
            "oshaInspections": "no",
            "recordableInjuries": "1-2",
            "existingDocs": {"safety_manual": "yes", "hazcom_program": "no"},
            "helpNeeded": ["Safety walkthrough / \"fresh eyes\" on the shop", "Build or clean up written safety programs"],
            "ninetyDayProblem": "Get LOTO procedures documented",
            "urgency": "30_days",
            "budget": "2500_5000",
            "approver": "Plant Manager",
            "preferredDays": ["Tuesday", "Wednesday"],
            "preferredTime": "early_morning",
            "referralSource": "referral",
            "consentGiven": True
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        print("✓ POST /api/intake/submit handles full data payload correctly")


class TestOnboardingCheckout:
    """Tests for POST /api/onboarding/checkout endpoint"""
    
    def test_checkout_creates_stripe_url(self):
        """Verify checkout creates valid Stripe URL"""
        payload = {
            "company": f"TEST_Checkout_{uuid.uuid4().hex[:8]}",
            "contactName": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "employeeCount": 50,
            "tier": "small",
            "addRetainer": False,
            "preferredDate": "May 2026",
            "originUrl": "https://z-project-9.preview.emergentagent.com"
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/checkout",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "url" in data
        assert data["url"].startswith("https://checkout.stripe.com")
        assert "sessionId" in data
        assert "bookingId" in data
        print(f"✓ POST /api/onboarding/checkout creates Stripe URL: {data['url'][:50]}...")
    
    def test_checkout_small_tier_walkthrough(self):
        """Verify checkout for small tier walkthrough only"""
        payload = {
            "company": f"TEST_SmallWalk_{uuid.uuid4().hex[:8]}",
            "contactName": "Small Tier User",
            "email": "small@test.com",
            "phone": "555-111-1111",
            "employeeCount": 50,
            "tier": "small",
            "addRetainer": False,
            "preferredDate": "June 2026",
            "originUrl": "https://z-project-9.preview.emergentagent.com"
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/checkout",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["url"].startswith("https://checkout.stripe.com")
        print("✓ Small tier walkthrough checkout creates valid Stripe session")
    
    def test_checkout_medium_tier_retainer(self):
        """Verify checkout for medium tier with retainer"""
        payload = {
            "company": f"TEST_MedRetainer_{uuid.uuid4().hex[:8]}",
            "contactName": "Medium Tier User",
            "email": "medium@test.com",
            "phone": "555-222-2222",
            "employeeCount": 150,
            "tier": "medium",
            "addRetainer": True,
            "preferredDate": "July 2026",
            "originUrl": "https://z-project-9.preview.emergentagent.com"
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/checkout",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["url"].startswith("https://checkout.stripe.com")
        print("✓ Medium tier retainer checkout creates valid Stripe session")
    
    def test_checkout_large_tier(self):
        """Verify checkout for large tier"""
        payload = {
            "company": f"TEST_LargeTier_{uuid.uuid4().hex[:8]}",
            "contactName": "Large Tier User",
            "email": "large@test.com",
            "phone": "555-333-3333",
            "employeeCount": 500,
            "tier": "large",
            "addRetainer": False,
            "preferredDate": "August 2026",
            "originUrl": "https://z-project-9.preview.emergentagent.com"
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/checkout",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["url"].startswith("https://checkout.stripe.com")
        print("✓ Large tier checkout creates valid Stripe session")
    
    def test_checkout_invalid_tier_fails(self):
        """Verify checkout fails with invalid tier"""
        payload = {
            "company": "TEST_InvalidTier",
            "contactName": "Invalid User",
            "email": "invalid@test.com",
            "phone": "555-000-0000",
            "employeeCount": 50,
            "tier": "invalid_tier",
            "addRetainer": False,
            "preferredDate": "May 2026",
            "originUrl": "https://z-project-9.preview.emergentagent.com"
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/checkout",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        print("✓ POST /api/onboarding/checkout rejects invalid tier (400)")


class TestHealthCheck:
    """Basic health check to ensure API is running"""
    
    def test_health_endpoint(self):
        """Verify health endpoint returns ok"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print("✓ GET /api/health returns {status: ok}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
