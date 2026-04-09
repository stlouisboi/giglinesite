"""
Test suite for Walkthrough Request API endpoint
Tests the new /api/walkthrough/request endpoint for the intake form
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWalkthroughRequestAPI:
    """Tests for POST /api/walkthrough/request endpoint"""
    
    def test_walkthrough_request_success(self):
        """Test successful walkthrough request submission"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"Test User {unique_id}",
            "company": f"Test Company {unique_id}",
            "operation_type": "Small Manufacturing / Fabrication",
            "location": "Kernersville, NC",
            "description": "Automated test submission"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/walkthrough/request",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert "status" in data, "Response should contain 'status' field"
        assert data["status"] == "ok", f"Expected status 'ok', got '{data['status']}'"
        assert "id" in data, "Response should contain 'id' field"
        assert isinstance(data["id"], str), "ID should be a string"
        assert len(data["id"]) > 0, "ID should not be empty"
        
        print(f"✓ Walkthrough request created with ID: {data['id']}")
    
    def test_walkthrough_request_all_operation_types(self):
        """Test submission with all valid operation types"""
        operation_types = [
            "Small Manufacturing / Fabrication",
            "Warehouse / Distribution",
            "Contractor / Maintenance",
            "Fleet / Transportation",
            "Other"
        ]
        
        for op_type in operation_types:
            unique_id = str(uuid.uuid4())[:8]
            payload = {
                "name": f"Test User {unique_id}",
                "company": f"Test Company {unique_id}",
                "operation_type": op_type,
                "location": "Test Location, NC",
                "description": f"Testing {op_type}"
            }
            
            response = requests.post(
                f"{BASE_URL}/api/walkthrough/request",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 200, f"Failed for operation type: {op_type}"
            data = response.json()
            assert data["status"] == "ok"
            print(f"✓ Operation type '{op_type}' accepted")
    
    def test_walkthrough_request_optional_description(self):
        """Test submission with empty description (optional field)"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"Test User {unique_id}",
            "company": f"Test Company {unique_id}",
            "operation_type": "Warehouse / Distribution",
            "location": "Durham, NC",
            "description": ""  # Empty description
        }
        
        response = requests.post(
            f"{BASE_URL}/api/walkthrough/request",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print("✓ Empty description accepted (optional field)")
    
    def test_walkthrough_request_missing_required_fields(self):
        """Test submission with missing required fields returns error"""
        # Missing name
        payload = {
            "company": "Test Company",
            "operation_type": "Other",
            "location": "Test Location"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/walkthrough/request",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 422 Unprocessable Entity for validation error
        assert response.status_code == 422, f"Expected 422 for missing name, got {response.status_code}"
        print("✓ Missing 'name' field returns 422")
    
    def test_walkthrough_request_missing_company(self):
        """Test submission with missing company field"""
        payload = {
            "name": "Test User",
            "operation_type": "Other",
            "location": "Test Location"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/walkthrough/request",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
        print("✓ Missing 'company' field returns 422")
    
    def test_walkthrough_request_missing_operation_type(self):
        """Test submission with missing operation_type field"""
        payload = {
            "name": "Test User",
            "company": "Test Company",
            "location": "Test Location"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/walkthrough/request",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
        print("✓ Missing 'operation_type' field returns 422")
    
    def test_walkthrough_request_missing_location(self):
        """Test submission with missing location field"""
        payload = {
            "name": "Test User",
            "company": "Test Company",
            "operation_type": "Other"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/walkthrough/request",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
        print("✓ Missing 'location' field returns 422")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "GigLine" in data["message"]
        print("✓ API root endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
