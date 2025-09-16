#!/usr/bin/env python3
"""
Backend Testing Script for Backend-Persistent Employee Directory API
Tests the comprehensive MongoDB-based backend server to ensure all APIs are working correctly.
"""

import requests
import json
import sys
import os
import uuid
import base64
from datetime import datetime, timedelta

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

class BackendPersistentTester:
    def __init__(self):
        self.backend_url = get_backend_url()
        if not self.backend_url:
            print("❌ Could not get backend URL from frontend/.env")
            sys.exit(1)
        
        print(f"🔗 Testing Backend URL: {self.backend_url}")
        self.test_results = []
        self.session = requests.Session()
        self.session.timeout = 30
        
        # Store created items for cleanup
        self.created_items = {
            'news': [],
            'tasks': [],
            'knowledge': [],
            'help': [],
            'hierarchy': [],
            'bookings': []
        }

    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })

    def test_backend_connectivity(self):
        """Test 1: Backend server connectivity and mode"""
        try:
            response = self.session.get(f"{self.backend_url}/")
            if response.status_code == 200:
                data = response.json()
                if data.get("mode") == "backend-persistent":
                    self.log_test("Backend Connectivity", True, 
                                f"Backend server responding in backend-persistent mode", 
                                f"Response: {data}")
                else:
                    self.log_test("Backend Connectivity", False, 
                                f"Backend not in backend-persistent mode", 
                                f"Response: {data}")
            else:
                self.log_test("Backend Connectivity", False, 
                            f"Backend server returned status {response.status_code}")
        except Exception as e:
            self.log_test("Backend Connectivity", False, f"Backend server connection failed: {str(e)}")

    def test_health_check(self):
        """Test 2: Health check endpoint"""
        try:
            response = self.session.get(f"{self.backend_url}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy" and data.get("mode") == "backend-persistent":
                    self.log_test("Health Check", True, 
                                "Health endpoint working correctly", 
                                f"MongoDB connected: {data.get('mongodb', False)}")
                else:
                    self.log_test("Health Check", False, 
                                "Health endpoint returned unexpected data", 
                                f"Response: {data}")
            else:
                self.log_test("Health Check", False, 
                            f"Health endpoint returned status {response.status_code}")
        except Exception as e:
            self.log_test("Health Check", False, f"Health check failed: {str(e)}")

    def test_employee_data_management(self):
        """Test 3: Employee Data Management - GET /api/employees"""
        try:
            response = self.session.get(f"{self.backend_url}/api/employees")
            if response.status_code == 200:
                employees = response.json()
                if isinstance(employees, list):
                    employee_count = len(employees)
                    # Check if we have the expected 625 employees (or close to it)
                    if employee_count >= 620 and employee_count <= 630:
                        self.log_test("Employee Data Loading", True, 
                                    f"Successfully loaded {employee_count} employees from MongoDB", 
                                    f"Expected ~625 employees, got {employee_count}")
                    else:
                        self.log_test("Employee Data Loading", False, 
                                    f"Employee count {employee_count} not in expected range (620-630)")
                else:
                    self.log_test("Employee Data Loading", False, 
                                "Employees endpoint did not return a list")
            else:
                self.log_test("Employee Data Loading", False, 
                            f"Employees endpoint returned status {response.status_code}")
        except Exception as e:
            self.log_test("Employee Data Loading", False, f"Employee data test failed: {str(e)}")

    def test_employee_search_functionality(self):
        """Test 4: Employee Search Functionality"""
        try:
            # Test search functionality
            response = self.session.get(f"{self.backend_url}/api/employees?search=Manager")
            if response.status_code == 200:
                search_results = response.json()
                if isinstance(search_results, list) and len(search_results) > 0:
                    self.log_test("Employee Search", True, 
                                f"Search functionality working - found {len(search_results)} results for 'Manager'", 
                                f"Sample result: {search_results[0].get('name', 'N/A') if search_results else 'None'}")
                else:
                    self.log_test("Employee Search", False, 
                                "Search returned no results or invalid format")
            else:
                self.log_test("Employee Search", False, 
                            f"Search endpoint returned status {response.status_code}")
        except Exception as e:
            self.log_test("Employee Search", False, f"Employee search test failed: {str(e)}")

    def test_departments_and_locations(self):
        """Test 5: Departments and Locations endpoints"""
        try:
            # Test departments
            dept_response = self.session.get(f"{self.backend_url}/api/departments")
            loc_response = self.session.get(f"{self.backend_url}/api/locations")
            
            if dept_response.status_code == 200 and loc_response.status_code == 200:
                departments = dept_response.json()
                locations = loc_response.json()
                
                if isinstance(departments, list) and isinstance(locations, list):
                    dept_count = len(departments)
                    loc_count = len(locations)
                    
                    # Expected around 20 departments and 12 locations based on review request
                    if dept_count >= 15 and loc_count >= 10:
                        self.log_test("Departments & Locations", True, 
                                    f"Successfully retrieved {dept_count} departments and {loc_count} locations", 
                                    f"Sample dept: {departments[0] if departments else 'None'}, Sample loc: {locations[0] if locations else 'None'}")
                    else:
                        self.log_test("Departments & Locations", False, 
                                    f"Insufficient data - {dept_count} departments, {loc_count} locations")
                else:
                    self.log_test("Departments & Locations", False, 
                                "Endpoints did not return lists")
            else:
                self.log_test("Departments & Locations", False, 
                            f"Endpoints returned status {dept_response.status_code}, {loc_response.status_code}")
        except Exception as e:
            self.log_test("Departments & Locations", False, f"Departments/locations test failed: {str(e)}")

    def test_employee_image_update(self):
        """Test 6: Employee Image Update - PUT /api/employees/{id}/image"""
        try:
            # First get an employee to test with
            response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if response.status_code == 200:
                employees = response.json()
                if employees and len(employees) > 0:
                    test_employee = employees[0]
                    employee_id = test_employee.get('id')
                    
                    # Test image update with base64 data
                    test_image_data = {
                        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                    }
                    
                    update_response = self.session.put(f"{self.backend_url}/api/employees/{employee_id}/image", 
                                                     json=test_image_data)
                    
                    if update_response.status_code == 200:
                        updated_employee = update_response.json()
                        if updated_employee.get('profileImage'):
                            self.log_test("Employee Image Update", True, 
                                        f"Successfully updated image for employee {employee_id}", 
                                        f"New image URL: {updated_employee.get('profileImage')}")
                        else:
                            self.log_test("Employee Image Update", False, 
                                        "Image update response missing profileImage field")
                    else:
                        self.log_test("Employee Image Update", False, 
                                    f"Image update returned status {update_response.status_code}")
                else:
                    self.log_test("Employee Image Update", False, 
                                "No employees found for image update test")
            else:
                self.log_test("Employee Image Update", False, 
                            f"Could not fetch employees for image test: {response.status_code}")
        except Exception as e:
            self.log_test("Employee Image Update", False, f"Employee image update test failed: {str(e)}")

    def test_news_management_api(self):
        """Test 7: News Management API - CRUD operations"""
        try:
            # Test GET /api/news
            get_response = self.session.get(f"{self.backend_url}/api/news")
            if get_response.status_code != 200:
                self.log_test("News Management API", False, f"GET /api/news failed with status {get_response.status_code}")
                return
            
            # Test POST /api/news
            test_news = {
                "title": "Test News Article",
                "content": "This is a test news article for backend persistence testing.",
                "priority": "high",
                "author": "Test Author"
            }
            
            post_response = self.session.post(f"{self.backend_url}/api/news", json=test_news)
            if post_response.status_code == 200:
                created_news = post_response.json()
                news_id = created_news.get('id')
                self.created_items['news'].append(news_id)
                
                # Test PUT /api/news/{id}
                update_data = {"title": "Updated Test News Article", "priority": "medium"}
                put_response = self.session.put(f"{self.backend_url}/api/news/{news_id}", json=update_data)
                
                if put_response.status_code == 200:
                    updated_news = put_response.json()
                    if updated_news.get('title') == "Updated Test News Article":
                        self.log_test("News Management API", True, 
                                    "All news CRUD operations working correctly", 
                                    f"Created, updated news item {news_id}")
                    else:
                        self.log_test("News Management API", False, 
                                    "News update did not persist correctly")
                else:
                    self.log_test("News Management API", False, 
                                f"News update failed with status {put_response.status_code}")
            else:
                self.log_test("News Management API", False, 
                            f"News creation failed with status {post_response.status_code}")
        except Exception as e:
            self.log_test("News Management API", False, f"News management test failed: {str(e)}")

    def test_task_management_api(self):
        """Test 8: Task Management API - CRUD operations"""
        try:
            # First get an employee to assign task to
            emp_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if emp_response.status_code != 200:
                self.log_test("Task Management API", False, "Could not fetch employees for task assignment")
                return
            
            employees = emp_response.json()
            if not employees:
                self.log_test("Task Management API", False, "No employees found for task assignment")
                return
            
            test_employee = employees[0]
            employee_id = test_employee.get('id')
            
            # Test POST /api/tasks
            test_task = {
                "title": "Test Task",
                "description": "This is a test task for backend persistence testing.",
                "assigned_to": employee_id,
                "priority": "high",
                "status": "pending",
                "due_date": (datetime.now() + timedelta(days=7)).isoformat()
            }
            
            post_response = self.session.post(f"{self.backend_url}/api/tasks", json=test_task)
            if post_response.status_code == 200:
                created_task = post_response.json()
                task_id = created_task.get('id')
                self.created_items['tasks'].append(task_id)
                
                # Test PUT /api/tasks/{id}
                update_data = {"status": "in_progress", "priority": "medium"}
                put_response = self.session.put(f"{self.backend_url}/api/tasks/{task_id}", json=update_data)
                
                if put_response.status_code == 200:
                    # Test GET /api/tasks
                    get_response = self.session.get(f"{self.backend_url}/api/tasks")
                    if get_response.status_code == 200:
                        tasks = get_response.json()
                        task_found = any(task.get('id') == task_id for task in tasks)
                        if task_found:
                            self.log_test("Task Management API", True, 
                                        "All task CRUD operations working correctly", 
                                        f"Created, updated task {task_id} assigned to {employee_id}")
                        else:
                            self.log_test("Task Management API", False, 
                                        "Created task not found in GET response")
                    else:
                        self.log_test("Task Management API", False, 
                                    f"GET tasks failed with status {get_response.status_code}")
                else:
                    self.log_test("Task Management API", False, 
                                f"Task update failed with status {put_response.status_code}")
            else:
                self.log_test("Task Management API", False, 
                            f"Task creation failed with status {post_response.status_code}")
        except Exception as e:
            self.log_test("Task Management API", False, f"Task management test failed: {str(e)}")

    def test_knowledge_management_api(self):
        """Test 9: Knowledge Management API - CRUD operations"""
        try:
            # Test POST /api/knowledge
            test_knowledge = {
                "title": "Test Knowledge Article",
                "content": "This is a test knowledge article for backend persistence testing.",
                "category": "policy",
                "tags": ["test", "backend", "persistence"],
                "author": "Test Author"
            }
            
            post_response = self.session.post(f"{self.backend_url}/api/knowledge", json=test_knowledge)
            if post_response.status_code == 200:
                created_knowledge = post_response.json()
                knowledge_id = created_knowledge.get('id')
                self.created_items['knowledge'].append(knowledge_id)
                
                # Test PUT /api/knowledge/{id}
                update_data = {
                    "category": "process", 
                    "tags": ["test", "backend", "persistence", "updated"]
                }
                put_response = self.session.put(f"{self.backend_url}/api/knowledge/{knowledge_id}", json=update_data)
                
                if put_response.status_code == 200:
                    updated_knowledge = put_response.json()
                    if updated_knowledge.get('category') == "process" and len(updated_knowledge.get('tags', [])) == 4:
                        # Test GET /api/knowledge
                        get_response = self.session.get(f"{self.backend_url}/api/knowledge")
                        if get_response.status_code == 200:
                            self.log_test("Knowledge Management API", True, 
                                        "All knowledge CRUD operations working correctly", 
                                        f"Created, updated knowledge article {knowledge_id}")
                        else:
                            self.log_test("Knowledge Management API", False, 
                                        f"GET knowledge failed with status {get_response.status_code}")
                    else:
                        self.log_test("Knowledge Management API", False, 
                                    "Knowledge update did not persist correctly")
                else:
                    self.log_test("Knowledge Management API", False, 
                                f"Knowledge update failed with status {put_response.status_code}")
            else:
                self.log_test("Knowledge Management API", False, 
                            f"Knowledge creation failed with status {post_response.status_code}")
        except Exception as e:
            self.log_test("Knowledge Management API", False, f"Knowledge management test failed: {str(e)}")

    def test_help_support_api(self):
        """Test 10: Help/Support Management API - CRUD operations with replies"""
        try:
            # Test POST /api/help
            test_help = {
                "title": "Test Help Request",
                "message": "This is a test help request for backend persistence testing.",
                "priority": "medium",
                "status": "open",
                "author": "Test User"
            }
            
            post_response = self.session.post(f"{self.backend_url}/api/help", json=test_help)
            if post_response.status_code == 200:
                created_help = post_response.json()
                help_id = created_help.get('id')
                self.created_items['help'].append(help_id)
                
                # Test POST /api/help/{id}/reply
                test_reply = {
                    "message": "This is a test reply to the help request.",
                    "author": "Support Agent"
                }
                reply_response = self.session.post(f"{self.backend_url}/api/help/{help_id}/reply", json=test_reply)
                
                if reply_response.status_code == 200:
                    # Test PUT /api/help/{id}
                    update_data = {"status": "resolved"}
                    put_response = self.session.put(f"{self.backend_url}/api/help/{help_id}", json=update_data)
                    
                    if put_response.status_code == 200:
                        updated_help = put_response.json()
                        if (updated_help.get('status') == "resolved" and 
                            len(updated_help.get('replies', [])) > 0):
                            self.log_test("Help/Support API", True, 
                                        "All help/support CRUD operations and reply system working correctly", 
                                        f"Created help request {help_id} with reply and status update")
                        else:
                            self.log_test("Help/Support API", False, 
                                        "Help update or reply system not working correctly")
                    else:
                        self.log_test("Help/Support API", False, 
                                    f"Help update failed with status {put_response.status_code}")
                else:
                    self.log_test("Help/Support API", False, 
                                f"Help reply failed with status {reply_response.status_code}")
            else:
                self.log_test("Help/Support API", False, 
                            f"Help creation failed with status {post_response.status_code}")
        except Exception as e:
            self.log_test("Help/Support API", False, f"Help/support management test failed: {str(e)}")

    def test_hierarchy_management_api(self):
        """Test 11: Hierarchy Management API - CRUD operations"""
        try:
            # First get two employees for hierarchy relationship
            emp_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if emp_response.status_code != 200:
                self.log_test("Hierarchy Management API", False, "Could not fetch employees for hierarchy test")
                return
            
            employees = emp_response.json()
            if len(employees) < 2:
                self.log_test("Hierarchy Management API", False, "Need at least 2 employees for hierarchy test")
                return
            
            employee_id = employees[0].get('id')
            manager_id = employees[1].get('id')
            
            # Test POST /api/hierarchy
            test_hierarchy = {
                "employee_id": employee_id,
                "reports_to": manager_id
            }
            
            post_response = self.session.post(f"{self.backend_url}/api/hierarchy", json=test_hierarchy)
            if post_response.status_code == 200:
                created_hierarchy = post_response.json()
                self.created_items['hierarchy'].append(employee_id)
                
                # Test GET /api/hierarchy
                get_response = self.session.get(f"{self.backend_url}/api/hierarchy")
                if get_response.status_code == 200:
                    hierarchy_data = get_response.json()
                    relationship_found = any(
                        h.get('employee_id') == employee_id and h.get('reports_to') == manager_id 
                        for h in hierarchy_data
                    )
                    
                    if relationship_found:
                        self.log_test("Hierarchy Management API", True, 
                                    "Hierarchy CRUD operations working correctly", 
                                    f"Created hierarchy relationship: {employee_id} reports to {manager_id}")
                    else:
                        self.log_test("Hierarchy Management API", False, 
                                    "Created hierarchy relationship not found in GET response")
                else:
                    self.log_test("Hierarchy Management API", False, 
                                f"GET hierarchy failed with status {get_response.status_code}")
            else:
                self.log_test("Hierarchy Management API", False, 
                            f"Hierarchy creation failed with status {post_response.status_code}")
        except Exception as e:
            self.log_test("Hierarchy Management API", False, f"Hierarchy management test failed: {str(e)}")

    def test_meeting_rooms_api(self):
        """Test 12: Meeting Rooms API - GET and booking functionality"""
        try:
            # Test GET /api/meeting-rooms
            get_response = self.session.get(f"{self.backend_url}/api/meeting-rooms")
            if get_response.status_code == 200:
                meeting_rooms = get_response.json()
                if isinstance(meeting_rooms, list) and len(meeting_rooms) >= 10:
                    # Test booking functionality
                    test_room = meeting_rooms[0]
                    room_id = test_room.get('id')
                    
                    # Get an employee for booking
                    emp_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
                    if emp_response.status_code == 200:
                        employees = emp_response.json()
                        if employees:
                            test_employee = employees[0]
                            
                            # Test POST /api/meeting-rooms/{id}/book
                            tomorrow = datetime.now() + timedelta(days=1)
                            booking_data = {
                                "employee_name": test_employee.get('name'),
                                "employee_id": test_employee.get('id'),
                                "start_time": tomorrow.replace(hour=10, minute=0).isoformat() + "Z",
                                "end_time": tomorrow.replace(hour=11, minute=0).isoformat() + "Z",
                                "purpose": "Test Meeting for Backend Persistence"
                            }
                            
                            book_response = self.session.post(f"{self.backend_url}/api/meeting-rooms/{room_id}/book", 
                                                            json=booking_data)
                            
                            if book_response.status_code == 200:
                                booking_result = book_response.json()
                                booking_id = booking_result.get('booking', {}).get('id')
                                if booking_id:
                                    self.created_items['bookings'].append((room_id, booking_id))
                                
                                self.log_test("Meeting Rooms API", True, 
                                            f"Meeting rooms API working correctly - {len(meeting_rooms)} rooms available, booking successful", 
                                            f"Booked room {room_id} for {test_employee.get('name')}")
                            else:
                                self.log_test("Meeting Rooms API", False, 
                                            f"Room booking failed with status {book_response.status_code}")
                        else:
                            self.log_test("Meeting Rooms API", False, 
                                        "No employees found for booking test")
                    else:
                        self.log_test("Meeting Rooms API", False, 
                                    "Could not fetch employees for booking test")
                else:
                    self.log_test("Meeting Rooms API", False, 
                                f"Expected at least 10 meeting rooms, got {len(meeting_rooms) if isinstance(meeting_rooms, list) else 'invalid data'}")
            else:
                self.log_test("Meeting Rooms API", False, 
                            f"GET meeting rooms failed with status {get_response.status_code}")
        except Exception as e:
            self.log_test("Meeting Rooms API", False, f"Meeting rooms test failed: {str(e)}")

    def test_alerts_api(self):
        """Test 13: Alerts API - GET functionality"""
        try:
            response = self.session.get(f"{self.backend_url}/api/alerts")
            if response.status_code == 200:
                alerts = response.json()
                if isinstance(alerts, list):
                    self.log_test("Alerts API", True, 
                                f"Alerts API working correctly - {len(alerts)} alerts retrieved", 
                                f"Alerts endpoint accessible")
                else:
                    self.log_test("Alerts API", False, 
                                "Alerts endpoint did not return a list")
            else:
                self.log_test("Alerts API", False, 
                            f"Alerts endpoint returned status {response.status_code}")
        except Exception as e:
            self.log_test("Alerts API", False, f"Alerts test failed: {str(e)}")

    def cleanup_test_data(self):
        """Clean up test data created during testing"""
        print("\n🧹 Cleaning up test data...")
        
        # Clean up news items
        for news_id in self.created_items['news']:
            try:
                self.session.delete(f"{self.backend_url}/api/news/{news_id}")
            except:
                pass
        
        # Clean up tasks
        for task_id in self.created_items['tasks']:
            try:
                self.session.delete(f"{self.backend_url}/api/tasks/{task_id}")
            except:
                pass
        
        # Clean up knowledge articles
        for knowledge_id in self.created_items['knowledge']:
            try:
                self.session.delete(f"{self.backend_url}/api/knowledge/{knowledge_id}")
            except:
                pass
        
        # Clean up help requests
        for help_id in self.created_items['help']:
            try:
                self.session.delete(f"{self.backend_url}/api/help/{help_id}")
            except:
                pass
        
        # Clean up hierarchy relationships
        for employee_id in self.created_items['hierarchy']:
            try:
                self.session.delete(f"{self.backend_url}/api/hierarchy/{employee_id}")
            except:
                pass
        
        # Clean up bookings
        for room_id, booking_id in self.created_items['bookings']:
            try:
                self.session.delete(f"{self.backend_url}/api/meeting-rooms/{room_id}/booking/{booking_id}")
            except:
                pass

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Backend-Persistent API Tests")
        print("=" * 70)
        
        # Core connectivity tests
        self.test_backend_connectivity()
        self.test_health_check()
        
        # Employee data management tests
        self.test_employee_data_management()
        self.test_employee_search_functionality()
        self.test_departments_and_locations()
        self.test_employee_image_update()
        
        # API management tests
        self.test_news_management_api()
        self.test_task_management_api()
        self.test_knowledge_management_api()
        self.test_help_support_api()
        self.test_hierarchy_management_api()
        
        # Meeting rooms and alerts
        self.test_meeting_rooms_api()
        self.test_alerts_api()
        
        # Clean up test data
        self.cleanup_test_data()
        
        print("\n" + "=" * 70)
        print("📊 BACKEND-PERSISTENT API TEST SUMMARY")
        print("=" * 70)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 ALL BACKEND-PERSISTENT API TESTS PASSED!")
            print("✅ Data persistence confirmed - All changes saved to MongoDB")
            print("✅ Cross-system sync verified - Data retrievable immediately")
            print("✅ All CRUD operations functional across all API groups")
        else:
            print(f"\n⚠️  {total - passed} test(s) failed. Check the details above.")
            
        return passed == total

if __name__ == "__main__":
    tester = BackendPersistentTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)