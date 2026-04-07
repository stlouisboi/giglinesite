"""
HazCom Starter Pack API Tests
Tests for GL-WEB-008: HazCom product page checkout flow
- POST /api/hazcom/checkout - Creates Stripe checkout session
- GET /api/hazcom/verify - Verifies payment session
- GET /api/hazcom/download/{filename} - Protected download route
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHazComCheckoutAPI:
    """Tests for HazCom checkout endpoint"""
    
    def test_hazcom_checkout_returns_stripe_url(self):
        """POST /api/hazcom/checkout should return a Stripe checkout URL"""
        response = requests.post(
            f"{BASE_URL}/api/hazcom/checkout",
            json={"origin_url": "https://z-project-9.preview.emergentagent.com"},
            headers={"Content-Type": "application/json"}
        )
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert "url" in data, "Response should contain 'url' field"
        assert "session_id" in data, "Response should contain 'session_id' field"
        
        # Verify URL starts with Stripe checkout
        assert data["url"].startswith("https://checkout.stripe.com"), \
            f"URL should start with https://checkout.stripe.com, got: {data['url']}"
        
        # Verify session_id is a non-empty string
        assert isinstance(data["session_id"], str), "session_id should be a string"
        assert len(data["session_id"]) > 0, "session_id should not be empty"
        
        print(f"✓ HazCom checkout returns valid Stripe URL: {data['url'][:60]}...")
        print(f"✓ Session ID: {data['session_id'][:20]}...")


class TestHazComVerifyAPI:
    """Tests for HazCom verify endpoint"""
    
    def test_hazcom_verify_invalid_session_returns_false(self):
        """GET /api/hazcom/verify with invalid session_id should return verified:false"""
        response = requests.get(
            f"{BASE_URL}/api/hazcom/verify",
            params={"session_id": "invalid_session_id_12345"}
        )
        
        # Status code assertion - should return 200 even for invalid session
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert "verified" in data, "Response should contain 'verified' field"
        assert data["verified"] == False, f"Expected verified:false for invalid session, got: {data['verified']}"
        
        print("✓ HazCom verify returns verified:false for invalid session")
    
    def test_hazcom_verify_missing_session_id(self):
        """GET /api/hazcom/verify without session_id should return error or false"""
        response = requests.get(f"{BASE_URL}/api/hazcom/verify")
        
        # Should either return 422 (validation error) or 200 with verified:false
        assert response.status_code in [200, 422], f"Expected 200 or 422, got {response.status_code}"
        
        if response.status_code == 200:
            data = response.json()
            assert data.get("verified") == False, "Should return verified:false when session_id missing"
        
        print(f"✓ HazCom verify handles missing session_id (status: {response.status_code})")


class TestHazComDownloadAPI:
    """Tests for HazCom protected download endpoint"""
    
    def test_hazcom_download_without_session_returns_403(self):
        """GET /api/hazcom/download/{filename} without valid session should return 403"""
        response = requests.get(
            f"{BASE_URL}/api/hazcom/download/GL-HAZCOM-001_Written_Program.pdf",
            params={"session_id": "invalid_session_12345"}
        )
        
        # Status code assertion - should return 403 Forbidden
        assert response.status_code == 403, f"Expected 403, got {response.status_code}: {response.text}"
        
        print("✓ HazCom download returns 403 for invalid session")
    
    def test_hazcom_download_missing_session_returns_error(self):
        """GET /api/hazcom/download/{filename} without session_id should return error"""
        response = requests.get(
            f"{BASE_URL}/api/hazcom/download/GL-HAZCOM-001_Written_Program.pdf"
        )
        
        # Should return 422 (missing required param) or 403
        assert response.status_code in [403, 422], f"Expected 403 or 422, got {response.status_code}"
        
        print(f"✓ HazCom download handles missing session_id (status: {response.status_code})")
    
    def test_hazcom_download_invalid_filename_returns_404(self):
        """GET /api/hazcom/download/{invalid_filename} should return 404"""
        response = requests.get(
            f"{BASE_URL}/api/hazcom/download/nonexistent_file.pdf",
            params={"session_id": "some_session_id"}
        )
        
        # Status code assertion - should return 404 for invalid filename
        assert response.status_code == 404, f"Expected 404, got {response.status_code}: {response.text}"
        
        print("✓ HazCom download returns 404 for invalid filename")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root_accessible(self):
        """GET /api/ should return 200"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200, f"API root not accessible: {response.status_code}"
        print("✓ API root is accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
