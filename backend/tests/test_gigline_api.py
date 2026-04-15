"""
GigLine Safety & Compliance - Backend API Tests
Tests all endpoints: health, services, walkthrough, safety-check, admin, payments, hazcom
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoints:
    """Health and root endpoint tests"""
    
    def test_health_check(self):
        """GET /api/health returns OK"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "gigline-backend"
        print("✓ Health check passed")
    
    def test_root_endpoint(self):
        """GET /api/ returns API message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "GigLine" in data["message"]
        print("✓ Root endpoint passed")


class TestServicesEndpoint:
    """Services listing tests"""
    
    def test_get_services_returns_packages(self):
        """GET /api/services returns 9 service packages"""
        response = requests.get(f"{BASE_URL}/api/services")
        assert response.status_code == 200
        data = response.json()
        # Should have 9 packages (3 walkthroughs, 2 documentation, 2 incident, 3 deposits)
        assert len(data) == 9, f"Expected 9 packages, got {len(data)}"
        
        # Verify key packages exist
        assert "walkthrough_small" in data
        assert "walkthrough_standard" in data
        assert "documentation_remote" in data
        assert "incident_standard" in data
        
        # Verify package structure
        walkthrough = data["walkthrough_small"]
        assert "name" in walkthrough
        assert "amount" in walkthrough
        assert "description" in walkthrough
        assert walkthrough["amount"] == 650.00
        print(f"✓ Services endpoint returned {len(data)} packages")


class TestWalkthroughRequest:
    """Walkthrough intake form tests"""
    
    def test_submit_walkthrough_request(self):
        """POST /api/walkthrough/request creates a new request"""
        test_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_User_{test_id}",
            "company": f"TEST_Company_{test_id}",
            "operation_type": "Manufacturing",
            "location": "Kernersville, NC",
            "description": "Test walkthrough request from automated testing",
            "utm_source": "test",
            "utm_medium": "pytest",
            "utm_campaign": "api_test"
        }
        
        response = requests.post(f"{BASE_URL}/api/walkthrough/request", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "id" in data
        assert len(data["id"]) > 0
        print(f"✓ Walkthrough request created with ID: {data['id']}")
        return data["id"]


class TestSafetyCheckSubmission:
    """Safety Check funnel tests"""
    
    def test_submit_safety_check_high_risk(self):
        """POST /api/safety-check/submit with 4+ gaps returns HIGH risk"""
        test_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_SafetyCheck_{test_id}",
            "company": f"TEST_Company_{test_id}",
            "phone": "336-555-1234",
            "email": f"test_{test_id}@example.com",
            "role": "Safety Manager",
            "operation_type": "Manufacturing",
            "employee_count": "10-25",
            "score_display": "4 of 6 areas flagged",
            "score_gaps": 4,
            "concerned_question": "Machine guarding",
            "what_pushed": "Recent near-miss",
            "answers": {
                "1": "no",
                "2": "no",
                "3": "yes",
                "4": "no",
                "5": "yes",
                "6": "no"
            }
        }
        
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["score_level"] == "HIGH"
        assert data["score_gaps"] == 4
        assert "submission_id" in data
        print(f"✓ Safety check HIGH risk submission created: {data['submission_id']}")
        return data["submission_id"]
    
    def test_submit_safety_check_medium_risk(self):
        """POST /api/safety-check/submit with 2-3 gaps returns MEDIUM risk"""
        test_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_SafetyCheck_{test_id}",
            "company": f"TEST_Company_{test_id}",
            "phone": "",
            "email": f"test_{test_id}@example.com",
            "role": "",
            "operation_type": "Warehouse",
            "employee_count": "5-10",
            "score_display": "2 of 6 areas flagged",
            "score_gaps": 2,
            "concerned_question": "",
            "what_pushed": "",
            "answers": {
                "1": "no",
                "2": "no",
                "3": "yes",
                "4": "yes",
                "5": "yes",
                "6": "yes"
            }
        }
        
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["score_level"] == "MEDIUM"
        assert data["score_gaps"] == 2
        print(f"✓ Safety check MEDIUM risk submission created")
    
    def test_submit_safety_check_low_risk(self):
        """POST /api/safety-check/submit with 0-1 gaps returns LOW risk"""
        test_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_SafetyCheck_{test_id}",
            "company": f"TEST_Company_{test_id}",
            "phone": "",
            "email": f"test_{test_id}@example.com",
            "role": "",
            "operation_type": "Contractor",
            "employee_count": "1-5",
            "score_display": "1 of 6 areas flagged",
            "score_gaps": 1,
            "concerned_question": "",
            "what_pushed": "",
            "answers": {
                "1": "no",
                "2": "yes",
                "3": "yes",
                "4": "yes",
                "5": "yes",
                "6": "yes"
            }
        }
        
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["score_level"] == "LOW"
        assert data["score_gaps"] == 1
        print(f"✓ Safety check LOW risk submission created")


class TestEmailDripStatus:
    """Email drip queue tests"""
    
    def test_get_drip_status(self):
        """GET /api/email-drip/status returns drip queue list"""
        response = requests.get(f"{BASE_URL}/api/email-drip/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Email drip status returned {len(data)} entries")


class TestAdminEndpoints:
    """Admin dashboard tests"""
    
    def test_admin_login_success(self):
        """POST /api/admin/login with correct password succeeds"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "gigline2026"})
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "token" in data
        print("✓ Admin login successful")
        return data["token"]
    
    def test_admin_login_failure(self):
        """POST /api/admin/login with wrong password fails"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "wrongpassword"})
        assert response.status_code == 401
        print("✓ Admin login correctly rejected invalid password")
    
    def test_admin_stats_with_auth(self):
        """GET /api/admin/stats with valid token returns dashboard data"""
        response = requests.get(f"{BASE_URL}/api/admin/stats?token=gigline2026")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "safety_checks" in data
        assert "risk_breakdown" in data
        assert "walkthrough_requests" in data
        assert "downloads" in data
        
        # Verify nested structure
        assert "total" in data["safety_checks"]
        assert "last_7d" in data["safety_checks"]
        assert "high" in data["risk_breakdown"]
        assert "medium" in data["risk_breakdown"]
        assert "low" in data["risk_breakdown"]
        
        print(f"✓ Admin stats returned - {data['safety_checks']['total']} total safety checks")
    
    def test_admin_stats_without_auth(self):
        """GET /api/admin/stats without token fails"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401
        print("✓ Admin stats correctly rejected without auth")
    
    def test_admin_leads_with_auth(self):
        """GET /api/admin/leads with valid token returns leads"""
        response = requests.get(f"{BASE_URL}/api/admin/leads?token=gigline2026")
        assert response.status_code == 200
        data = response.json()
        
        assert "safety_checks" in data
        assert "walkthrough_requests" in data
        assert "heat_guide_leads" in data
        assert isinstance(data["safety_checks"], list)
        assert isinstance(data["walkthrough_requests"], list)
        
        print(f"✓ Admin leads returned - {len(data['safety_checks'])} safety checks, {len(data['walkthrough_requests'])} walkthroughs")


class TestStripePaymentEndpoints:
    """Stripe payment checkout tests"""
    
    def test_checkout_walkthrough_small(self):
        """POST /api/payments/checkout for walkthrough_small returns valid Stripe URL"""
        payload = {
            "service_type": "walkthrough_small",
            "origin_url": "https://z-project-9.preview.emergentagent.com",
            "customer_email": "test@example.com",
            "customer_name": "Test User"
        }
        
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        assert "url" in data
        assert "session_id" in data
        assert data["url"].startswith("https://checkout.stripe.com")
        assert len(data["session_id"]) > 0
        
        print(f"✓ Walkthrough checkout URL: {data['url'][:60]}...")
        return data["session_id"]
    
    def test_checkout_invalid_service(self):
        """POST /api/payments/checkout with invalid service type fails"""
        payload = {
            "service_type": "invalid_service",
            "origin_url": "https://z-project-9.preview.emergentagent.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert response.status_code == 400
        print("✓ Checkout correctly rejected invalid service type")


class TestHazComEndpoints:
    """HazCom checkout tests"""
    
    def test_hazcom_checkout(self):
        """POST /api/hazcom/checkout returns valid Stripe URL"""
        payload = {
            "origin_url": "https://z-project-9.preview.emergentagent.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/hazcom/checkout", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        assert "url" in data
        assert "session_id" in data
        assert data["url"].startswith("https://checkout.stripe.com")
        
        print(f"✓ HazCom checkout URL: {data['url'][:60]}...")


class TestStatusEndpoints:
    """Status check endpoints"""
    
    def test_create_status_check(self):
        """POST /api/status creates a status check"""
        test_id = str(uuid.uuid4())[:8]
        payload = {"client_name": f"TEST_Client_{test_id}"}
        
        response = requests.post(f"{BASE_URL}/api/status", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert data["client_name"] == payload["client_name"]
        assert "timestamp" in data
        
        print(f"✓ Status check created: {data['id']}")
    
    def test_get_status_checks(self):
        """GET /api/status returns list of status checks"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"✓ Status checks returned: {len(data)} entries")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
