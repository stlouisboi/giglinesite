"""
GL-PORT-001 Section B API Tests
Tests for new features:
- POST /api/intake/submit returns clientToken
- GET /api/status/{token} returns 6 stages
- PUT /api/admin/intake/{token}/status updates status with admin auth
- POST /api/onboarding/sign-agreement generates PDF
- GET /api/agreement/{token}/download serves PDF
- GET /api/admin/portal-stats returns summary data
- GET /api/admin/intake-submissions returns list
- GET /api/admin/bookings returns list
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "gigline2026"


class TestIntakeSubmitClientToken:
    """Tests for POST /api/intake/submit returning clientToken"""
    
    def test_intake_submit_returns_client_token(self):
        """Verify intake submission returns clientToken in response"""
        payload = {
            "company": f"TEST_TokenCheck_{uuid.uuid4().hex[:8]}",
            "address": "123 Token Test Street",
            "contactName": "Token Test User",
            "email": "tokentest@example.com",
            "phone": "555-TOKEN-01",
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
        assert "clientToken" in data, "Response should include clientToken"
        assert len(data["clientToken"]) > 0, "clientToken should not be empty"
        print(f"✓ POST /api/intake/submit returns clientToken: {data['clientToken']}")
        return data["clientToken"]


class TestStatusEndpoint:
    """Tests for GET /api/status/{token} endpoint"""
    
    @pytest.fixture
    def client_token(self):
        """Create an intake submission and return the clientToken"""
        payload = {
            "company": f"TEST_StatusPage_{uuid.uuid4().hex[:8]}",
            "address": "456 Status Test Ave",
            "contactName": "Status Test User",
            "email": "statustest@example.com",
            "phone": "555-STATUS-01",
            "consentGiven": True
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        return response.json()["clientToken"]
    
    def test_status_endpoint_returns_200(self, client_token):
        """Verify status endpoint returns 200 for valid token"""
        response = requests.get(f"{BASE_URL}/api/status/{client_token}")
        assert response.status_code == 200
        print(f"✓ GET /api/status/{client_token[:8]}... returns 200")
    
    def test_status_returns_six_stages(self, client_token):
        """Verify status endpoint returns exactly 6 stages"""
        response = requests.get(f"{BASE_URL}/api/status/{client_token}")
        data = response.json()
        assert "stages" in data
        assert len(data["stages"]) == 6, f"Expected 6 stages, got {len(data['stages'])}"
        print("✓ GET /api/status/{token} returns 6 stages")
    
    def test_status_stages_have_correct_keys(self, client_token):
        """Verify each stage has required keys"""
        response = requests.get(f"{BASE_URL}/api/status/{client_token}")
        data = response.json()
        expected_stage_keys = ["intake_received", "proposal_sent", "agreement_signed", 
                              "payment_confirmed", "walkthrough_scheduled", "report_delivered"]
        actual_keys = [s["key"] for s in data["stages"]]
        assert actual_keys == expected_stage_keys, f"Stage keys mismatch: {actual_keys}"
        print("✓ Status stages have correct keys in order")
    
    def test_status_stages_have_correct_states(self, client_token):
        """Verify stages have correct state values (completed/current/upcoming)"""
        response = requests.get(f"{BASE_URL}/api/status/{client_token}")
        data = response.json()
        # For new submission, first stage should be current, rest upcoming
        states = [s["state"] for s in data["stages"]]
        assert states[0] == "current", "First stage should be 'current'"
        assert all(s == "upcoming" for s in states[1:]), "Remaining stages should be 'upcoming'"
        print("✓ Status stages have correct state values (current/upcoming)")
    
    def test_status_returns_company_name(self, client_token):
        """Verify status endpoint returns company name"""
        response = requests.get(f"{BASE_URL}/api/status/{client_token}")
        data = response.json()
        assert "company" in data
        assert data["company"].startswith("TEST_StatusPage_")
        print("✓ Status endpoint returns company name")
    
    def test_status_invalid_token_returns_404(self):
        """Verify status endpoint returns 404 for invalid token"""
        response = requests.get(f"{BASE_URL}/api/status/invalid_token_12345")
        assert response.status_code == 404
        print("✓ GET /api/status/{invalid_token} returns 404")


class TestAdminStatusUpdate:
    """Tests for PUT /api/admin/intake/{token}/status endpoint"""
    
    @pytest.fixture
    def client_token(self):
        """Create an intake submission and return the clientToken"""
        payload = {
            "company": f"TEST_AdminStatus_{uuid.uuid4().hex[:8]}",
            "address": "789 Admin Test Blvd",
            "contactName": "Admin Test User",
            "email": "admintest@example.com",
            "phone": "555-ADMIN-01",
            "consentGiven": True
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        return response.json()["clientToken"]
    
    def test_admin_status_update_requires_auth(self, client_token):
        """Verify status update requires admin auth"""
        response = requests.put(
            f"{BASE_URL}/api/admin/intake/{client_token}/status",
            json={"status": "proposal_sent"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        print("✓ PUT /api/admin/intake/{token}/status requires auth (401 without token)")
    
    def test_admin_status_update_with_auth(self, client_token):
        """Verify status update works with admin auth"""
        response = requests.put(
            f"{BASE_URL}/api/admin/intake/{client_token}/status?token={ADMIN_PASSWORD}",
            json={"status": "proposal_sent"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "updated"
        assert data["newStatus"] == "proposal_sent"
        print("✓ PUT /api/admin/intake/{token}/status updates status with admin auth")
    
    def test_admin_status_update_reflects_in_status_page(self, client_token):
        """Verify status update is reflected in status endpoint"""
        # Update status
        requests.put(
            f"{BASE_URL}/api/admin/intake/{client_token}/status?token={ADMIN_PASSWORD}",
            json={"status": "agreement_signed"},
            headers={"Content-Type": "application/json"}
        )
        # Check status page
        response = requests.get(f"{BASE_URL}/api/status/{client_token}")
        data = response.json()
        assert data["status"] == "agreement_signed"
        # First two stages should be completed, third current
        states = [s["state"] for s in data["stages"]]
        assert states[0] == "completed"
        assert states[1] == "completed"
        assert states[2] == "current"
        print("✓ Status update reflects correctly in status page")
    
    def test_admin_status_update_invalid_status(self, client_token):
        """Verify invalid status is rejected"""
        response = requests.put(
            f"{BASE_URL}/api/admin/intake/{client_token}/status?token={ADMIN_PASSWORD}",
            json={"status": "invalid_status"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        print("✓ PUT /api/admin/intake/{token}/status rejects invalid status (400)")


class TestAgreementSigning:
    """Tests for POST /api/onboarding/sign-agreement endpoint"""
    
    @pytest.fixture
    def client_token(self):
        """Create an intake submission and return the clientToken"""
        payload = {
            "company": f"TEST_Agreement_{uuid.uuid4().hex[:8]}",
            "address": "101 Agreement Test Lane",
            "contactName": "Agreement Test User",
            "email": "agreementtest@example.com",
            "phone": "555-AGREE-01",
            "consentGiven": True
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        return response.json()["clientToken"]
    
    def test_sign_agreement_generates_pdf(self, client_token):
        """Verify sign-agreement generates PDF and returns signed:true"""
        payload = {
            "clientToken": client_token,
            "typedName": "John Test Signer",
            "company": "TEST_Agreement_Company",
            "tier": "small",
            "addRetainer": False
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/sign-agreement",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["signed"] == True, "Response should have signed:true"
        assert "agreementUrl" in data, "Response should include agreementUrl"
        assert "signedAt" in data, "Response should include signedAt timestamp"
        print(f"✓ POST /api/onboarding/sign-agreement returns signed:true, agreementUrl: {data['agreementUrl']}")
        return data["agreementUrl"]
    
    def test_sign_agreement_with_retainer(self, client_token):
        """Verify sign-agreement works with retainer option"""
        payload = {
            "clientToken": client_token,
            "typedName": "Jane Retainer Signer",
            "company": "TEST_Retainer_Company",
            "tier": "medium",
            "addRetainer": True
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding/sign-agreement",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["signed"] == True
        print("✓ POST /api/onboarding/sign-agreement works with retainer option")


class TestAgreementDownload:
    """Tests for GET /api/agreement/{token}/download endpoint"""
    
    @pytest.fixture
    def signed_agreement_token(self):
        """Create intake, sign agreement, return token"""
        # Create intake
        payload = {
            "company": f"TEST_Download_{uuid.uuid4().hex[:8]}",
            "address": "202 Download Test Road",
            "contactName": "Download Test User",
            "email": "downloadtest@example.com",
            "phone": "555-DWNLD-01",
            "consentGiven": True
        }
        response = requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        client_token = response.json()["clientToken"]
        
        # Sign agreement
        sign_payload = {
            "clientToken": client_token,
            "typedName": "Download Test Signer",
            "company": "TEST_Download_Company",
            "tier": "small",
            "addRetainer": False
        }
        requests.post(
            f"{BASE_URL}/api/onboarding/sign-agreement",
            json=sign_payload,
            headers={"Content-Type": "application/json"}
        )
        return client_token
    
    def test_agreement_download_returns_pdf(self, signed_agreement_token):
        """Verify agreement download returns valid PDF"""
        response = requests.get(f"{BASE_URL}/api/agreement/{signed_agreement_token}/download")
        assert response.status_code == 200
        assert response.headers.get("content-type") == "application/pdf"
        # Check PDF magic bytes
        assert response.content[:4] == b'%PDF', "Response should be a valid PDF"
        print("✓ GET /api/agreement/{token}/download serves valid PDF")
    
    def test_agreement_download_invalid_token_returns_404(self):
        """Verify agreement download returns 404 for invalid token"""
        response = requests.get(f"{BASE_URL}/api/agreement/invalid_token_xyz/download")
        assert response.status_code == 404
        print("✓ GET /api/agreement/{invalid_token}/download returns 404")


class TestAdminPortalStats:
    """Tests for GET /api/admin/portal-stats endpoint"""
    
    def test_portal_stats_requires_auth(self):
        """Verify portal-stats requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/portal-stats")
        assert response.status_code == 401
        print("✓ GET /api/admin/portal-stats requires auth (401 without token)")
    
    def test_portal_stats_with_auth(self):
        """Verify portal-stats returns summary data with admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/portal-stats?token={ADMIN_PASSWORD}")
        assert response.status_code == 200
        data = response.json()
        # Check required fields
        assert "intakeThisMonth" in data
        assert "pendingProposals" in data
        assert "confirmedBookings" in data
        assert "reportsDelivered" in data
        assert "revenueThisMonth" in data
        # Check types
        assert isinstance(data["intakeThisMonth"], int)
        assert isinstance(data["pendingProposals"], int)
        assert isinstance(data["confirmedBookings"], int)
        assert isinstance(data["reportsDelivered"], int)
        assert isinstance(data["revenueThisMonth"], (int, float))
        print(f"✓ GET /api/admin/portal-stats returns summary: intake={data['intakeThisMonth']}, pending={data['pendingProposals']}")


class TestAdminIntakeSubmissions:
    """Tests for GET /api/admin/intake-submissions endpoint"""
    
    def test_intake_submissions_requires_auth(self):
        """Verify intake-submissions requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/intake-submissions")
        assert response.status_code == 401
        print("✓ GET /api/admin/intake-submissions requires auth (401 without token)")
    
    def test_intake_submissions_with_auth(self):
        """Verify intake-submissions returns list with admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/intake-submissions?token={ADMIN_PASSWORD}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ GET /api/admin/intake-submissions returns list with {len(data)} items")
    
    def test_intake_submissions_contains_test_data(self):
        """Verify intake-submissions contains our test submissions"""
        # First create a test submission
        payload = {
            "company": f"TEST_ListCheck_{uuid.uuid4().hex[:8]}",
            "address": "303 List Test Way",
            "contactName": "List Test User",
            "email": "listtest@example.com",
            "phone": "555-LIST-01",
            "consentGiven": True
        }
        requests.post(
            f"{BASE_URL}/api/intake/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        # Check it appears in list
        response = requests.get(f"{BASE_URL}/api/admin/intake-submissions?token={ADMIN_PASSWORD}")
        data = response.json()
        companies = [s.get("company", "") for s in data]
        assert any("TEST_ListCheck_" in c for c in companies), "Test submission should appear in list"
        print("✓ GET /api/admin/intake-submissions contains test submissions")


class TestAdminBookings:
    """Tests for GET /api/admin/bookings endpoint"""
    
    def test_bookings_requires_auth(self):
        """Verify bookings requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/bookings")
        assert response.status_code == 401
        print("✓ GET /api/admin/bookings requires auth (401 without token)")
    
    def test_bookings_with_auth(self):
        """Verify bookings returns list with admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/bookings?token={ADMIN_PASSWORD}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ GET /api/admin/bookings returns list with {len(data)} items")


class TestHealthCheck:
    """Basic health check"""
    
    def test_health_endpoint(self):
        """Verify health endpoint returns ok"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print("✓ GET /api/health returns {status: ok}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
