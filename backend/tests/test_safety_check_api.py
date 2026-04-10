"""
Backend API Tests for Safety Check Funnel
Tests the 3-phase Safety Check flow including:
- POST /api/safety-check/submit with role field
- HIGH risk email prefix verification
- Score level calculation
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSafetyCheckAPI:
    """Safety Check submission endpoint tests"""
    
    def test_safety_check_submit_high_risk(self):
        """Test submission with 4+ NO answers returns HIGH risk level"""
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json={
            "name": "Test High Risk",
            "company": "High Risk Company",
            "phone": "555-111-2222",
            "email": "test@example.com",
            "role": "Plant Manager",  # NEW: role field
            "operation_type": "Manufacturing",
            "employee_count": "50",
            "score_display": "4 of 6 questions answered No",
            "score_gaps": 4,
            "concerned_question": "HazCom & SDS",
            "what_pushed": "Testing HIGH risk",
            "answers": {"1": "no", "2": "no", "3": "yes", "4": "no", "5": "yes", "6": "no"}
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["status"] == "success"
        assert "submission_id" in data
        assert data["score_level"] == "HIGH", f"Expected HIGH, got {data['score_level']}"
        assert data["score_gaps"] == 4
        print(f"✓ HIGH risk submission: {data['submission_id']}")
    
    def test_safety_check_submit_medium_risk(self):
        """Test submission with 2-3 NO answers returns MEDIUM risk level"""
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json={
            "name": "Test Medium Risk",
            "company": "Medium Risk Company",
            "phone": "",
            "email": "test@example.com",
            "role": "Ops Manager",
            "operation_type": "Warehouse",
            "employee_count": "25",
            "score_display": "2 of 6 questions answered No",
            "score_gaps": 2,
            "concerned_question": "Forklift Certification",
            "what_pushed": "",
            "answers": {"1": "no", "2": "no", "3": "yes", "4": "yes", "5": "yes", "6": "yes"}
        })
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "success"
        assert data["score_level"] == "MEDIUM", f"Expected MEDIUM, got {data['score_level']}"
        assert data["score_gaps"] == 2
        print(f"✓ MEDIUM risk submission: {data['submission_id']}")
    
    def test_safety_check_submit_low_risk(self):
        """Test submission with 0-1 NO answers returns LOW risk level"""
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json={
            "name": "Test Low Risk",
            "company": "Low Risk Company",
            "phone": "555-333-4444",
            "email": "test@example.com",
            "role": "",  # Optional role can be empty
            "operation_type": "Fleet",
            "employee_count": "10",
            "score_display": "1 of 6 questions answered No",
            "score_gaps": 1,
            "concerned_question": "Training Records",
            "what_pushed": "Proactive check",
            "answers": {"1": "yes", "2": "yes", "3": "yes", "4": "yes", "5": "yes", "6": "no"}
        })
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "success"
        assert data["score_level"] == "LOW", f"Expected LOW, got {data['score_level']}"
        assert data["score_gaps"] == 1
        print(f"✓ LOW risk submission: {data['submission_id']}")
    
    def test_safety_check_submit_with_all_optional_fields(self):
        """Test submission with all optional fields populated"""
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json={
            "name": "Full Fields Test",
            "company": "Complete Company",
            "phone": "555-999-0000",
            "email": "test@example.com",
            "role": "Safety Coordinator",
            "operation_type": "Contractor",
            "employee_count": "100",
            "score_display": "3 of 6 questions answered No",
            "score_gaps": 3,
            "concerned_question": "Lockout-Tagout",
            "what_pushed": "Insurance requirement",
            "answers": {"1": "no", "2": "yes", "3": "no", "4": "no", "5": "yes", "6": "yes"}
        })
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "success"
        assert "submission_id" in data
        assert data["score_level"] == "MEDIUM"
        print(f"✓ Full fields submission: {data['submission_id']}")
    
    def test_safety_check_submit_minimal_fields(self):
        """Test submission with only required fields"""
        response = requests.post(f"{BASE_URL}/api/safety-check/submit", json={
            "name": "Minimal Test",
            "company": "Minimal Company",
            "phone": "",
            "email": "test@example.com",
            "role": "",
            "operation_type": "",
            "employee_count": "",
            "score_display": "0 of 6 questions answered No",
            "score_gaps": 0,
            "concerned_question": "",
            "what_pushed": "",
            "answers": {"1": "yes", "2": "yes", "3": "yes", "4": "yes", "5": "yes", "6": "yes"}
        })
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "success"
        assert data["score_level"] == "LOW"
        assert data["score_gaps"] == 0
        print(f"✓ Minimal fields submission: {data['submission_id']}")


class TestSafetyCheckReportAPI:
    """Safety Check report download endpoint tests"""
    
    def test_get_submissions_list(self):
        """Test getting list of all submissions"""
        response = requests.get(f"{BASE_URL}/api/safety-check/submissions")
        
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} submissions")
    
    def test_report_download_invalid_id(self):
        """Test report download with invalid submission ID returns 404"""
        response = requests.get(f"{BASE_URL}/api/safety-check/report/invalid-id-12345")
        
        # Should return 404 for non-existent submission
        assert response.status_code == 404
        print("✓ Invalid submission ID returns 404")


class TestEmailDripAPI:
    """Email drip sequence endpoint tests"""
    
    def test_get_drip_status(self):
        """Test getting email drip queue status"""
        response = requests.get(f"{BASE_URL}/api/email-drip/status")
        
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} drip sequences")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        print(f"✓ API root: {data['message']}")
    
    def test_services_endpoint(self):
        """Test services endpoint returns pricing"""
        response = requests.get(f"{BASE_URL}/api/services")
        
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, dict)
        assert "walkthrough_small" in data
        print(f"✓ Services endpoint: {len(data)} services available")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
