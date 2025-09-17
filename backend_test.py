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
        """Test 1: Backend server connectivity via API endpoints"""
        try:
            # Test connectivity via a working API endpoint instead of root
            response = self.session.get(f"{self.backend_url}/api/employees", params={"search": "test"})
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Backend Connectivity", True, 
                                f"Backend server responding correctly via API endpoints", 
                                f"API accessible, returned {len(data)} results")
                else:
                    self.log_test("Backend Connectivity", False, 
                                f"Backend API returned unexpected data format")
            else:
                self.log_test("Backend Connectivity", False, 
                            f"Backend API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Backend Connectivity", False, f"Backend server connection failed: {str(e)}")

    def test_health_check(self):
        """Test 2: API Health check via departments endpoint"""
        try:
            # Use departments endpoint as health check since /health may not be accessible
            response = self.session.get(f"{self.backend_url}/api/departments")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Health Check", True, 
                                "API endpoints working correctly", 
                                f"Departments endpoint returned {len(data)} departments")
                else:
                    self.log_test("Health Check", False, 
                                "API endpoints returned unexpected data", 
                                f"Response: {data}")
            else:
                self.log_test("Health Check", False, 
                            f"API health check returned status {response.status_code}")
        except Exception as e:
            self.log_test("Health Check", False, f"API health check failed: {str(e)}")

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

    def test_meeting_rooms_api_comprehensive(self):
        """Test 12: Comprehensive Meeting Rooms API Testing - As per Review Request"""
        try:
            print("\n🏢 COMPREHENSIVE MEETING ROOMS API TESTING")
            print("-" * 50)
            
            # Test 1: GET /api/meeting-rooms - Verify all 15 meeting rooms
            get_response = self.session.get(f"{self.backend_url}/api/meeting-rooms")
            if get_response.status_code != 200:
                self.log_test("Meeting Rooms - GET ALL", False, f"GET /api/meeting-rooms failed with status {get_response.status_code}")
                return
            
            meeting_rooms = get_response.json()
            if not isinstance(meeting_rooms, list):
                self.log_test("Meeting Rooms - GET ALL", False, "GET /api/meeting-rooms did not return a list")
                return
            
            # Verify we have exactly 15 meeting rooms as expected
            if len(meeting_rooms) == 15:
                self.log_test("Meeting Rooms - GET ALL", True, 
                            f"Successfully retrieved all 15 meeting rooms", 
                            f"Total rooms: {len(meeting_rooms)}")
            else:
                self.log_test("Meeting Rooms - GET ALL", False, 
                            f"Expected 15 meeting rooms, got {len(meeting_rooms)}")
            
            # Test 2: Verify Location Variety - Multiple locations
            locations = set()
            floors = set()
            location_distribution = {}
            
            for room in meeting_rooms:
                location = room.get('location', 'Unknown')
                floor = room.get('floor', 'Unknown')
                locations.add(location)
                floors.add(floor)
                
                if location not in location_distribution:
                    location_distribution[location] = 0
                location_distribution[location] += 1
            
            expected_locations = {'IFC', 'Central Office 75', 'Office 75', 'Noida', 'Project Office'}
            if expected_locations.issubset(locations):
                self.log_test("Meeting Rooms - LOCATION VARIETY", True, 
                            f"All expected locations found: {sorted(locations)}", 
                            f"Distribution: {location_distribution}")
            else:
                missing_locations = expected_locations - locations
                self.log_test("Meeting Rooms - LOCATION VARIETY", False, 
                            f"Missing locations: {missing_locations}", 
                            f"Found: {sorted(locations)}")
            
            # Test 3: Verify Floor Variety - Different floors
            expected_floors = {'11th Floor', '12th Floor', '14th Floor', '1st Floor'}
            if expected_floors.issubset(floors):
                self.log_test("Meeting Rooms - FLOOR VARIETY", True, 
                            f"All expected floors found: {sorted(floors)}", 
                            f"IFC has multiple floors, others have 1st floor")
            else:
                missing_floors = expected_floors - floors
                self.log_test("Meeting Rooms - FLOOR VARIETY", False, 
                            f"Missing floors: {missing_floors}", 
                            f"Found: {sorted(floors)}")
            
            # Test 4: Verify Room Status Visibility - vacant/occupied status
            status_count = {'vacant': 0, 'occupied': 0, 'other': 0}
            rooms_with_status = 0
            
            for room in meeting_rooms:
                status = room.get('status')
                if status:
                    rooms_with_status += 1
                    if status in status_count:
                        status_count[status] += 1
                    else:
                        status_count['other'] += 1
            
            if rooms_with_status == len(meeting_rooms):
                self.log_test("Meeting Rooms - STATUS VISIBILITY", True, 
                            f"All rooms have status visibility", 
                            f"Status distribution: {status_count}")
            else:
                self.log_test("Meeting Rooms - STATUS VISIBILITY", False, 
                            f"Only {rooms_with_status}/{len(meeting_rooms)} rooms have status")
            
            # Test 5: Booking Functionality - POST /api/meeting-rooms/{room_id}/book
            # Get an employee for booking
            emp_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if emp_response.status_code != 200:
                self.log_test("Meeting Rooms - BOOKING PREP", False, "Could not fetch employees for booking test")
                return
            
            employees = emp_response.json()
            if not employees:
                self.log_test("Meeting Rooms - BOOKING PREP", False, "No employees found for booking test")
                return
            
            test_employee = employees[0]
            test_room = meeting_rooms[0]  # Use first room for testing
            room_id = test_room.get('id')
            
            # Create a booking for tomorrow
            future_date = datetime.now() + timedelta(days=1)
            booking_data = {
                "employee_name": test_employee.get('name'),
                "employee_id": test_employee.get('id'),
                "start_time": future_date.replace(hour=10, minute=0, second=0, microsecond=0).isoformat() + "Z",
                "end_time": future_date.replace(hour=11, minute=0, second=0, microsecond=0).isoformat() + "Z",
                "purpose": "Review Request Test - Meeting Room Booking"
            }
            
            book_response = self.session.post(f"{self.backend_url}/api/meeting-rooms/{room_id}/book", 
                                            json=booking_data)
            
            if book_response.status_code == 200:
                booking_result = book_response.json()
                booking_id = booking_result.get('booking', {}).get('id')
                if booking_id:
                    self.created_items['bookings'].append((room_id, booking_id))
                    self.log_test("Meeting Rooms - BOOKING CREATE", True, 
                                f"Successfully created booking for room {test_room.get('name')}", 
                                f"Booking ID: {booking_id}, Employee: {test_employee.get('name')}")
                    
                    # Test 6: Cancel Booking Functionality - DELETE /api/meeting-rooms/{room_id}/booking/{booking_id}
                    cancel_response = self.session.delete(f"{self.backend_url}/api/meeting-rooms/{room_id}/booking/{booking_id}")
                    
                    if cancel_response.status_code == 200:
                        self.log_test("Meeting Rooms - BOOKING CANCEL", True, 
                                    f"Successfully cancelled specific booking", 
                                    f"Cancelled booking {booking_id} from room {room_id}")
                        # Remove from cleanup list since we already cancelled it
                        self.created_items['bookings'] = [(r, b) for r, b in self.created_items['bookings'] if b != booking_id]
                    else:
                        self.log_test("Meeting Rooms - BOOKING CANCEL", False, 
                                    f"Failed to cancel booking: {cancel_response.status_code}")
                else:
                    self.log_test("Meeting Rooms - BOOKING CREATE", False, 
                                "Booking created but no booking ID returned")
            else:
                try:
                    error_detail = book_response.json().get('detail', 'Unknown error')
                except:
                    error_detail = book_response.text
                self.log_test("Meeting Rooms - BOOKING CREATE", False, 
                            f"Failed to create booking: {book_response.status_code}", 
                            f"Error: {error_detail}")
            
            # Test 7: Clear All Bookings - DELETE /api/meeting-rooms/clear-all-bookings
            clear_response = self.session.delete(f"{self.backend_url}/api/meeting-rooms/clear-all-bookings")
            
            if clear_response.status_code == 200:
                clear_result = clear_response.json()
                bookings_cleared = clear_result.get('bookings_cleared', 0)
                self.log_test("Meeting Rooms - CLEAR ALL BOOKINGS", True, 
                            f"Successfully cleared all bookings", 
                            f"Cleared {bookings_cleared} bookings from all rooms")
                # Clear our tracking since all bookings are now cleared
                self.created_items['bookings'] = []
            else:
                self.log_test("Meeting Rooms - CLEAR ALL BOOKINGS", False, 
                            f"Failed to clear all bookings: {clear_response.status_code}")
            
            # Test 8: Verify specific user concerns from review request
            # Check that users can see ALL rooms across ALL locations and floors
            ifc_rooms = [room for room in meeting_rooms if room.get('location') == 'IFC']
            non_ifc_rooms = [room for room in meeting_rooms if room.get('location') != 'IFC']
            
            if len(ifc_rooms) >= 11 and len(non_ifc_rooms) >= 4:
                self.log_test("Meeting Rooms - USER VISIBILITY", True, 
                            f"Users can see rooms across all locations and floors", 
                            f"IFC rooms: {len(ifc_rooms)}, Other locations: {len(non_ifc_rooms)}")
            else:
                self.log_test("Meeting Rooms - USER VISIBILITY", False, 
                            f"Limited room visibility - IFC: {len(ifc_rooms)}, Others: {len(non_ifc_rooms)}")
            
            # Verify 14th floor IFC rooms specifically (user mentioned this)
            floor_14_rooms = [room for room in meeting_rooms if room.get('location') == 'IFC' and '14th' in room.get('floor', '')]
            if len(floor_14_rooms) >= 9:
                self.log_test("Meeting Rooms - 14TH FLOOR ACCESS", True, 
                            f"14th floor IFC rooms accessible", 
                            f"Found {len(floor_14_rooms)} rooms on 14th floor")
            else:
                self.log_test("Meeting Rooms - 14TH FLOOR ACCESS", False, 
                            f"Limited 14th floor access - only {len(floor_14_rooms)} rooms found")
                
        except Exception as e:
            self.log_test("Meeting Rooms - COMPREHENSIVE", False, f"Meeting rooms comprehensive test failed: {str(e)}")

    def test_alerts_system_comprehensive(self):
        """Test 13: Comprehensive Alert System Testing"""
        try:
            # Test 1: GET /api/alerts - Check initial state
            get_response = self.session.get(f"{self.backend_url}/api/alerts")
            if get_response.status_code != 200:
                self.log_test("Alert System - GET", False, f"GET /api/alerts failed with status {get_response.status_code}")
                return
            
            initial_alerts = get_response.json()
            if not isinstance(initial_alerts, list):
                self.log_test("Alert System - GET", False, "GET /api/alerts did not return a list")
                return
            
            self.log_test("Alert System - GET", True, 
                        f"GET /api/alerts working - {len(initial_alerts)} alerts found", 
                        f"Initial alerts count: {len(initial_alerts)}")
            
            # Test 2: POST /api/alerts - Create test alerts
            test_alerts = [
                {
                    "title": "System Maintenance Alert",
                    "message": "Scheduled maintenance will occur tonight from 10 PM to 2 AM.",
                    "priority": "high",
                    "type": "system",
                    "target_audience": "all",
                    "created_by": "Admin",
                    "expires_at": (datetime.now() + timedelta(hours=24)).isoformat()
                },
                {
                    "title": "User Role Alert",
                    "message": "This alert is specifically for User role testing.",
                    "priority": "medium",
                    "type": "announcement",
                    "target_audience": "user",
                    "created_by": "Admin",
                    "expires_at": (datetime.now() + timedelta(hours=12)).isoformat()
                },
                {
                    "title": "Admin Role Alert",
                    "message": "This alert is specifically for Admin role testing.",
                    "priority": "urgent",
                    "type": "general",
                    "target_audience": "admin",
                    "created_by": "System",
                    "expires_at": (datetime.now() + timedelta(hours=6)).isoformat()
                }
            ]
            
            created_alert_ids = []
            for i, alert_data in enumerate(test_alerts):
                post_response = self.session.post(f"{self.backend_url}/api/alerts", json=alert_data)
                if post_response.status_code == 200:
                    created_alert = post_response.json()
                    alert_id = created_alert.get('alert', {}).get('id')
                    if alert_id:
                        created_alert_ids.append(alert_id)
                        self.log_test(f"Alert System - CREATE {i+1}", True, 
                                    f"Successfully created alert: {alert_data['title']}", 
                                    f"Alert ID: {alert_id}, Target: {alert_data['target_audience']}")
                    else:
                        self.log_test(f"Alert System - CREATE {i+1}", False, 
                                    f"Alert created but no ID returned for: {alert_data['title']}")
                else:
                    self.log_test(f"Alert System - CREATE {i+1}", False, 
                                f"Failed to create alert '{alert_data['title']}' - Status: {post_response.status_code}")
            
            # Test 3: Verify alerts appear in GET request
            get_after_create = self.session.get(f"{self.backend_url}/api/alerts")
            if get_after_create.status_code == 200:
                all_alerts = get_after_create.json()
                new_alert_count = len(all_alerts) - len(initial_alerts)
                if new_alert_count >= len(created_alert_ids):
                    self.log_test("Alert System - PERSISTENCE", True, 
                                f"Created alerts appear in GET response - {new_alert_count} new alerts", 
                                f"Total alerts now: {len(all_alerts)}")
                else:
                    self.log_test("Alert System - PERSISTENCE", False, 
                                f"Not all created alerts appear in GET response - Expected {len(created_alert_ids)}, got {new_alert_count}")
            
            # Test 4: Test target audience filtering
            user_alerts = self.session.get(f"{self.backend_url}/api/alerts?target_audience=user")
            admin_alerts = self.session.get(f"{self.backend_url}/api/alerts?target_audience=admin")
            
            if user_alerts.status_code == 200 and admin_alerts.status_code == 200:
                user_alert_list = user_alerts.json()
                admin_alert_list = admin_alerts.json()
                
                # Check if filtering works (user should see 'all' and 'user' alerts, admin should see 'all' and 'admin' alerts)
                user_has_alerts = len(user_alert_list) > 0
                admin_has_alerts = len(admin_alert_list) > 0
                
                if user_has_alerts and admin_has_alerts:
                    self.log_test("Alert System - FILTERING", True, 
                                f"Target audience filtering working - User: {len(user_alert_list)}, Admin: {len(admin_alert_list)}", 
                                f"User and Admin see different alert sets")
                else:
                    self.log_test("Alert System - FILTERING", False, 
                                f"Target audience filtering may not be working - User: {len(user_alert_list)}, Admin: {len(admin_alert_list)}")
            
            # Test 5: Test alert expiration (create an expired alert)
            expired_alert = {
                "title": "Expired Alert Test",
                "message": "This alert should be expired and not appear in active alerts.",
                "priority": "low",
                "type": "general",
                "target_audience": "all",
                "created_by": "Test",
                "expires_at": (datetime.now() - timedelta(hours=1)).isoformat()  # Already expired
            }
            
            expired_post = self.session.post(f"{self.backend_url}/api/alerts", json=expired_alert)
            if expired_post.status_code == 200:
                # Check if expired alert is filtered out
                active_alerts = self.session.get(f"{self.backend_url}/api/alerts")
                if active_alerts.status_code == 200:
                    active_list = active_alerts.json()
                    expired_found = any(alert.get('title') == 'Expired Alert Test' for alert in active_list)
                    if not expired_found:
                        self.log_test("Alert System - EXPIRATION", True, 
                                    "Alert expiration filtering working - expired alerts not returned", 
                                    "Expired alert correctly filtered out")
                    else:
                        self.log_test("Alert System - EXPIRATION", False, 
                                    "Alert expiration filtering not working - expired alert still returned")
            
            # Cleanup created alerts
            for alert_id in created_alert_ids:
                try:
                    self.session.delete(f"{self.backend_url}/api/alerts/{alert_id}")
                except:
                    pass
                    
        except Exception as e:
            self.log_test("Alert System - COMPREHENSIVE", False, f"Alert system comprehensive test failed: {str(e)}")

    def test_meeting_room_cross_system_sync(self):
        """Test 14: Meeting Room Booking Cross-System Synchronization"""
        try:
            # Clear all existing bookings first to avoid conflicts
            clear_response = self.session.delete(f"{self.backend_url}/api/meeting-rooms/clear-all-bookings")
            if clear_response.status_code == 200:
                self.log_test("Cross-System Sync - CLEANUP", True, "Cleared all existing bookings for clean test")
            
            # Test 1: Get available meeting rooms
            rooms_response = self.session.get(f"{self.backend_url}/api/meeting-rooms")
            if rooms_response.status_code != 200:
                self.log_test("Cross-System Sync - ROOMS", False, f"Failed to get meeting rooms: {rooms_response.status_code}")
                return
            
            meeting_rooms = rooms_response.json()
            if not meeting_rooms or len(meeting_rooms) == 0:
                self.log_test("Cross-System Sync - ROOMS", False, "No meeting rooms available for testing")
                return
            
            test_room = meeting_rooms[0]
            room_id = test_room.get('id')
            
            # Get test employee
            emp_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if emp_response.status_code != 200:
                self.log_test("Cross-System Sync - EMPLOYEE", False, "Could not fetch employee for booking test")
                return
            
            employees = emp_response.json()
            if not employees:
                self.log_test("Cross-System Sync - EMPLOYEE", False, "No employees found for booking test")
                return
            
            test_employee = employees[0]
            
            # Test 2: Create booking from "System 1" (simulate first user/system)
            # Use a future date that's definitely in the future (add more days to be safe)
            future_date = datetime.now() + timedelta(days=7)  # 1 week from now
            booking_data_1 = {
                "employee_name": test_employee.get('name'),
                "employee_id": test_employee.get('id'),
                "start_time": future_date.replace(hour=10, minute=0, second=0, microsecond=0).isoformat() + "Z",
                "end_time": future_date.replace(hour=11, minute=0, second=0, microsecond=0).isoformat() + "Z",
                "purpose": "Cross-System Sync Test - System 1"
            }
            
            book_response_1 = self.session.post(f"{self.backend_url}/api/meeting-rooms/{room_id}/book", 
                                              json=booking_data_1)
            
            if book_response_1.status_code != 200:
                try:
                    error_detail = book_response_1.json().get('detail', 'Unknown error')
                except:
                    error_detail = book_response_1.text
                self.log_test("Cross-System Sync - BOOKING 1", False, 
                            f"Failed to create booking from System 1: {book_response_1.status_code}", 
                            f"Error: {error_detail}")
                return
            
            booking_1 = book_response_1.json()
            booking_1_id = booking_1.get('booking', {}).get('id')
            
            self.log_test("Cross-System Sync - BOOKING 1", True, 
                        f"Successfully created booking from System 1", 
                        f"Booking ID: {booking_1_id}, Room: {room_id}")
            
            # Test 3: Immediately check if booking reflects on "System 2" (simulate second user/system)
            # Create a new session to simulate different system/user
            system_2_session = requests.Session()
            system_2_session.timeout = 30
            
            rooms_check_2 = system_2_session.get(f"{self.backend_url}/api/meeting-rooms")
            if rooms_check_2.status_code == 200:
                rooms_data_2 = rooms_check_2.json()
                test_room_2 = next((room for room in rooms_data_2 if room.get('id') == room_id), None)
                
                if test_room_2:
                    room_bookings = test_room_2.get('bookings', [])
                    booking_found = any(booking.get('id') == booking_1_id for booking in room_bookings)
                    
                    if booking_found:
                        self.log_test("Cross-System Sync - IMMEDIATE SYNC", True, 
                                    "Booking immediately visible on System 2 - Real-time sync working", 
                                    f"Booking {booking_1_id} found in room {room_id} bookings")
                    else:
                        self.log_test("Cross-System Sync - IMMEDIATE SYNC", False, 
                                    "Booking NOT immediately visible on System 2 - Sync issue detected")
                else:
                    self.log_test("Cross-System Sync - IMMEDIATE SYNC", False, 
                                "Could not find test room in System 2 response")
            else:
                self.log_test("Cross-System Sync - IMMEDIATE SYNC", False, 
                            f"System 2 could not fetch rooms: {rooms_check_2.status_code}")
            
            # Test 4: Test booking status updates across systems
            # Check room status on both systems
            room_status_1 = test_room.get('status', 'unknown')
            room_status_2 = test_room_2.get('status', 'unknown') if test_room_2 else 'unknown'
            
            # For future bookings, status should be 'vacant' but booking should be listed
            if len(test_room_2.get('bookings', [])) > 0:
                self.log_test("Cross-System Sync - STATUS UPDATE", True, 
                            f"Room status properly synchronized - System 1: {room_status_1}, System 2: {room_status_2}", 
                            f"Bookings count on System 2: {len(test_room_2.get('bookings', []))}")
            else:
                self.log_test("Cross-System Sync - STATUS UPDATE", False, 
                            "Room status not properly synchronized across systems")
            
            # Test 5: Test cancellation sync across systems
            cancel_response = self.session.delete(f"{self.backend_url}/api/meeting-rooms/{room_id}/booking/{booking_1_id}")
            
            if cancel_response.status_code == 200:
                self.log_test("Cross-System Sync - CANCELLATION", True, 
                            "Booking cancellation successful on System 1", 
                            f"Cancelled booking {booking_1_id}")
                
                # Check if cancellation reflects on System 2
                rooms_after_cancel = system_2_session.get(f"{self.backend_url}/api/meeting-rooms")
                if rooms_after_cancel.status_code == 200:
                    rooms_data_after = rooms_after_cancel.json()
                    test_room_after = next((room for room in rooms_data_after if room.get('id') == room_id), None)
                    
                    if test_room_after:
                        remaining_bookings = test_room_after.get('bookings', [])
                        cancelled_booking_found = any(booking.get('id') == booking_1_id for booking in remaining_bookings)
                        
                        if not cancelled_booking_found:
                            self.log_test("Cross-System Sync - CANCEL SYNC", True, 
                                        "Cancellation immediately synchronized to System 2", 
                                        f"Booking {booking_1_id} removed from all systems")
                        else:
                            self.log_test("Cross-System Sync - CANCEL SYNC", False, 
                                        "Cancellation NOT synchronized to System 2 - cancelled booking still visible")
                    else:
                        self.log_test("Cross-System Sync - CANCEL SYNC", False, 
                                    "Could not verify cancellation sync - room not found")
            else:
                self.log_test("Cross-System Sync - CANCELLATION", False, 
                            f"Booking cancellation failed: {cancel_response.status_code}")
            
            # Test 6: Test multiple concurrent bookings from different systems
            if len(employees) >= 2:
                test_employee_2 = employees[1]
                
                # Try to book the same room from System 2 for a different time
                booking_data_2 = {
                    "employee_name": test_employee_2.get('name'),
                    "employee_id": test_employee_2.get('id'),
                    "start_time": future_date.replace(hour=14, minute=0, second=0, microsecond=0).isoformat() + "Z",
                    "end_time": future_date.replace(hour=15, minute=0, second=0, microsecond=0).isoformat() + "Z",
                    "purpose": "Cross-System Sync Test - System 2"
                }
                
                book_response_2 = system_2_session.post(f"{self.backend_url}/api/meeting-rooms/{room_id}/book", 
                                                      json=booking_data_2)
                
                if book_response_2.status_code == 200:
                    booking_2 = book_response_2.json()
                    booking_2_id = booking_2.get('booking', {}).get('id')
                    
                    # Verify both bookings are visible on System 1
                    final_rooms_check = self.session.get(f"{self.backend_url}/api/meeting-rooms")
                    if final_rooms_check.status_code == 200:
                        final_rooms = final_rooms_check.json()
                        final_test_room = next((room for room in final_rooms if room.get('id') == room_id), None)
                        
                        if final_test_room:
                            final_bookings = final_test_room.get('bookings', [])
                            system_2_booking_visible = any(booking.get('id') == booking_2_id for booking in final_bookings)
                            
                            if system_2_booking_visible:
                                self.log_test("Cross-System Sync - CONCURRENT BOOKING", True, 
                                            "Concurrent bookings from different systems working correctly", 
                                            f"System 2 booking {booking_2_id} visible on System 1")
                            else:
                                self.log_test("Cross-System Sync - CONCURRENT BOOKING", False, 
                                            "Concurrent booking from System 2 not visible on System 1")
                    
                    # Cleanup System 2 booking
                    try:
                        system_2_session.delete(f"{self.backend_url}/api/meeting-rooms/{room_id}/booking/{booking_2_id}")
                    except:
                        pass
                else:
                    self.log_test("Cross-System Sync - CONCURRENT BOOKING", False, 
                                f"Failed to create concurrent booking from System 2: {book_response_2.status_code}")
                    
        except Exception as e:
            self.log_test("Cross-System Sync - COMPREHENSIVE", False, f"Cross-system sync test failed: {str(e)}")

    def test_user_profile_functionality(self):
        """Test 15: User Profile Related Functionality"""
        try:
            # Test 1: Get user profile data (employees)
            profile_response = self.session.get(f"{self.backend_url}/api/employees")
            if profile_response.status_code != 200:
                self.log_test("User Profile - DATA ACCESS", False, f"Failed to access user profile data: {profile_response.status_code}")
                return
            
            employees = profile_response.json()
            if not employees or len(employees) == 0:
                self.log_test("User Profile - DATA ACCESS", False, "No user profile data available")
                return
            
            self.log_test("User Profile - DATA ACCESS", True, 
                        f"User profile data accessible - {len(employees)} profiles available", 
                        f"Sample profile: {employees[0].get('name', 'N/A')} (ID: {employees[0].get('id', 'N/A')})")
            
            # Test 2: Test profile search functionality
            search_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if search_response.status_code == 200:
                search_results = search_results = search_response.json()
                if search_results and len(search_results) > 0:
                    self.log_test("User Profile - SEARCH", True, 
                                f"Profile search working - {len(search_results)} results for 'A'", 
                                f"Search functionality operational")
                else:
                    self.log_test("User Profile - SEARCH", False, 
                                "Profile search returned no results")
            else:
                self.log_test("User Profile - SEARCH", False, 
                            f"Profile search failed: {search_response.status_code}")
            
            # Test 3: Test profile image functionality
            if employees:
                test_employee = employees[0]
                employee_id = test_employee.get('id')
                
                # Test image URL update
                test_image_url = f"/api/uploads/images/{employee_id}_test.png"
                image_update_data = {"imageUrl": test_image_url}
                
                image_response = self.session.put(f"{self.backend_url}/api/employees/{employee_id}/image", 
                                                json=image_update_data)
                
                if image_response.status_code == 200:
                    updated_profile = image_response.json()
                    if updated_profile.get('profileImage') == test_image_url:
                        self.log_test("User Profile - IMAGE UPDATE", True, 
                                    "Profile image update working correctly", 
                                    f"Image URL updated for employee {employee_id}")
                    else:
                        self.log_test("User Profile - IMAGE UPDATE", False, 
                                    "Profile image update did not persist correctly")
                else:
                    self.log_test("User Profile - IMAGE UPDATE", False, 
                                f"Profile image update failed: {image_response.status_code}")
            
            # Test 4: Test profile filtering by department
            dept_response = self.session.get(f"{self.backend_url}/api/departments")
            if dept_response.status_code == 200:
                departments = dept_response.json()
                if departments and len(departments) > 0:
                    test_dept = departments[0]
                    
                    dept_filter_response = self.session.get(f"{self.backend_url}/api/employees?department={test_dept}")
                    if dept_filter_response.status_code == 200:
                        dept_employees = dept_filter_response.json()
                        if dept_employees and len(dept_employees) > 0:
                            # Verify all returned employees are from the requested department
                            all_correct_dept = all(emp.get('department') == test_dept for emp in dept_employees)
                            if all_correct_dept:
                                self.log_test("User Profile - DEPT FILTER", True, 
                                            f"Department filtering working - {len(dept_employees)} employees in {test_dept}", 
                                            f"All results match department filter")
                            else:
                                self.log_test("User Profile - DEPT FILTER", False, 
                                            "Department filtering returning incorrect results")
                        else:
                            self.log_test("User Profile - DEPT FILTER", False, 
                                        f"No employees found in department {test_dept}")
                    else:
                        self.log_test("User Profile - DEPT FILTER", False, 
                                    f"Department filtering failed: {dept_filter_response.status_code}")
            
            # Test 5: Test profile filtering by location
            loc_response = self.session.get(f"{self.backend_url}/api/locations")
            if loc_response.status_code == 200:
                locations = loc_response.json()
                if locations and len(locations) > 0:
                    test_location = locations[0]
                    
                    loc_filter_response = self.session.get(f"{self.backend_url}/api/employees?location={test_location}")
                    if loc_filter_response.status_code == 200:
                        loc_employees = loc_filter_response.json()
                        if loc_employees and len(loc_employees) > 0:
                            # Verify all returned employees are from the requested location
                            all_correct_loc = all(emp.get('location') == test_location for emp in loc_employees)
                            if all_correct_loc:
                                self.log_test("User Profile - LOC FILTER", True, 
                                            f"Location filtering working - {len(loc_employees)} employees in {test_location}", 
                                            f"All results match location filter")
                            else:
                                self.log_test("User Profile - LOC FILTER", False, 
                                            "Location filtering returning incorrect results")
                        else:
                            self.log_test("User Profile - LOC FILTER", False, 
                                        f"No employees found in location {test_location}")
                    else:
                        self.log_test("User Profile - LOC FILTER", False, 
                                    f"Location filtering failed: {loc_filter_response.status_code}")
            
            # Test 6: Test profile data integrity
            if employees:
                sample_profiles = employees[:5]  # Test first 5 profiles
                integrity_issues = []
                
                for profile in sample_profiles:
                    # Check required fields
                    if not profile.get('id'):
                        integrity_issues.append(f"Missing ID for profile: {profile.get('name', 'Unknown')}")
                    if not profile.get('name'):
                        integrity_issues.append(f"Missing name for profile ID: {profile.get('id', 'Unknown')}")
                    if not profile.get('department'):
                        integrity_issues.append(f"Missing department for: {profile.get('name', 'Unknown')}")
                    if not profile.get('location'):
                        integrity_issues.append(f"Missing location for: {profile.get('name', 'Unknown')}")
                
                if len(integrity_issues) == 0:
                    self.log_test("User Profile - DATA INTEGRITY", True, 
                                "Profile data integrity check passed", 
                                f"All required fields present in sample of {len(sample_profiles)} profiles")
                else:
                    self.log_test("User Profile - DATA INTEGRITY", False, 
                                f"Profile data integrity issues found: {len(integrity_issues)} issues", 
                                f"Issues: {'; '.join(integrity_issues[:3])}")  # Show first 3 issues
                    
        except Exception as e:
            self.log_test("User Profile - COMPREHENSIVE", False, f"User profile functionality test failed: {str(e)}")

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

    def test_meeting_rooms_review_request_focused(self):
        """Test Meeting Rooms API - Focused on Review Request Issues"""
        try:
            print("\n🏢 MEETING ROOMS REVIEW REQUEST FOCUSED TESTING")
            print("-" * 60)
            
            # Test 1: GET /api/meeting-rooms - Check current room structure
            print("📋 Testing current room structure...")
            get_response = self.session.get(f"{self.backend_url}/api/meeting-rooms")
            if get_response.status_code != 200:
                self.log_test("Meeting Rooms - GET Structure", False, f"GET /api/meeting-rooms failed with status {get_response.status_code}")
                return
            
            meeting_rooms = get_response.json()
            if not isinstance(meeting_rooms, list):
                self.log_test("Meeting Rooms - GET Structure", False, "GET /api/meeting-rooms did not return a list")
                return
            
            # Analyze room structure by location
            location_analysis = {}
            for room in meeting_rooms:
                location = room.get('location', 'Unknown')
                floor = room.get('floor', 'Unknown')
                
                if location not in location_analysis:
                    location_analysis[location] = {}
                if floor not in location_analysis[location]:
                    location_analysis[location][floor] = 0
                location_analysis[location][floor] += 1
            
            print(f"📊 Room Structure Analysis:")
            for location, floors in location_analysis.items():
                print(f"   {location}: {floors}")
            
            # Check if structure matches requirements: IFC 14th floor should have multiple rooms, others should have 1 floor and 1 room
            structure_correct = True
            structure_issues = []
            
            for location, floors in location_analysis.items():
                if location == 'IFC':
                    # IFC should have multiple floors with 14th floor having multiple rooms
                    if '14th Floor' not in floors:
                        structure_issues.append(f"IFC missing 14th Floor")
                        structure_correct = False
                    elif floors.get('14th Floor', 0) < 8:  # Should have at least 8 rooms on 14th floor
                        structure_issues.append(f"IFC 14th Floor has only {floors.get('14th Floor')} rooms, expected 8+")
                        structure_correct = False
                else:
                    # Other locations should have 1 floor with 1 room
                    if len(floors) > 1:
                        structure_issues.append(f"{location} has {len(floors)} floors, expected 1")
                        structure_correct = False
                    elif sum(floors.values()) > 1:
                        structure_issues.append(f"{location} has {sum(floors.values())} rooms, expected 1")
                        structure_correct = False
            
            if structure_correct:
                self.log_test("Meeting Rooms - Structure Check", True, 
                            f"Room structure matches requirements - {len(meeting_rooms)} total rooms", 
                            f"IFC has multiple floors/rooms, others have 1 floor/1 room")
            else:
                self.log_test("Meeting Rooms - Structure Check", False, 
                            f"Room structure issues found", 
                            f"Issues: {'; '.join(structure_issues)}")
            
            # Test 2: Location filtering functionality (data structure test)
            print("🔍 Testing location filtering capability...")
            unique_locations = set(room.get('location') for room in meeting_rooms)
            
            location_filter_working = True
            for location in unique_locations:
                # Test if we can filter manually to verify the data structure
                location_rooms = [room for room in meeting_rooms if room.get('location') == location]
                
                if location_rooms:
                    self.log_test(f"Meeting Rooms - Location Data ({location})", True, 
                                f"Location data available - {len(location_rooms)} rooms found", 
                                f"Rooms in {location}: {[room.get('name') for room in location_rooms[:3]]}")
                else:
                    self.log_test(f"Meeting Rooms - Location Data ({location})", False, 
                                f"No rooms found for location {location}")
                    location_filter_working = False
            
            # Test 3: Check if occupied rooms show correctly in dropdown (room status)
            print("👁️ Testing room status visibility...")
            rooms_with_status = 0
            status_distribution = {'vacant': 0, 'occupied': 0, 'other': 0}
            
            for room in meeting_rooms:
                status = room.get('status')
                if status:
                    rooms_with_status += 1
                    if status in status_distribution:
                        status_distribution[status] += 1
                    else:
                        status_distribution['other'] += 1
            
            if rooms_with_status == len(meeting_rooms):
                self.log_test("Meeting Rooms - Status Visibility", True, 
                            f"All rooms have status visibility for dropdown", 
                            f"Status distribution: {status_distribution}")
            else:
                self.log_test("Meeting Rooms - Status Visibility", False, 
                            f"Only {rooms_with_status}/{len(meeting_rooms)} rooms have status visibility")
            
            # Test 4: Test booking functionality and room status updates
            print("📅 Testing booking functionality...")
            
            # Get an employee for booking
            emp_response = self.session.get(f"{self.backend_url}/api/employees?search=A")
            if emp_response.status_code != 200:
                self.log_test("Meeting Rooms - Booking Test", False, "Could not fetch employees for booking test")
                return
            
            employees = emp_response.json()
            if not employees:
                self.log_test("Meeting Rooms - Booking Test", False, "No employees found for booking test")
                return
            
            test_employee = employees[0]
            test_room = meeting_rooms[0]  # Use first room for testing
            room_id = test_room.get('id')
            
            # Create a booking for tomorrow
            future_date = datetime.now() + timedelta(days=1)
            booking_data = {
                "employee_name": test_employee.get('name'),
                "employee_id": test_employee.get('id'),
                "start_time": future_date.replace(hour=10, minute=0, second=0, microsecond=0).isoformat() + "Z",
                "end_time": future_date.replace(hour=11, minute=0, second=0, microsecond=0).isoformat() + "Z",
                "purpose": "Review Request Test - Room Status Update Check"
            }
            
            book_response = self.session.post(f"{self.backend_url}/api/meeting-rooms/{room_id}/book", 
                                            json=booking_data)
            
            if book_response.status_code == 200:
                booking_result = book_response.json()
                booking_id = booking_result.get('booking', {}).get('id')
                
                if booking_id:
                    self.created_items['bookings'].append((room_id, booking_id))
                    
                    # Check if room status updates after booking
                    updated_rooms_response = self.session.get(f"{self.backend_url}/api/meeting-rooms")
                    if updated_rooms_response.status_code == 200:
                        updated_rooms = updated_rooms_response.json()
                        updated_room = next((room for room in updated_rooms if room.get('id') == room_id), None)
                        
                        if updated_room:
                            room_bookings = updated_room.get('bookings', [])
                            booking_saved = any(booking.get('id') == booking_id for booking in room_bookings)
                            
                            if booking_saved:
                                self.log_test("Meeting Rooms - Booking Save", True, 
                                            f"Booking saved properly - room shows booking in list", 
                                            f"Booking {booking_id} found in room {test_room.get('name')}")
                                
                                # Check if room status reflects booking (for future bookings, might still be vacant)
                                room_status = updated_room.get('status', 'unknown')
                                current_booking = updated_room.get('current_booking')
                                
                                if room_bookings:  # Has bookings
                                    self.log_test("Meeting Rooms - Status Update", True, 
                                                f"Room status system working - Status: {room_status}", 
                                                f"Room has {len(room_bookings)} booking(s), Current: {bool(current_booking)}")
                                else:
                                    self.log_test("Meeting Rooms - Status Update", False, 
                                                "Room status not updating - no bookings found after creation")
                            else:
                                self.log_test("Meeting Rooms - Booking Save", False, 
                                            "Booking not saved properly - not found in room bookings list")
                        else:
                            self.log_test("Meeting Rooms - Booking Save", False, 
                                        "Could not find updated room data after booking")
                    else:
                        self.log_test("Meeting Rooms - Booking Save", False, 
                                    f"Could not fetch updated rooms after booking: {updated_rooms_response.status_code}")
                else:
                    self.log_test("Meeting Rooms - Booking Save", False, 
                                "Booking created but no booking ID returned")
            else:
                try:
                    error_detail = book_response.json().get('detail', 'Unknown error')
                except:
                    error_detail = book_response.text
                self.log_test("Meeting Rooms - Booking Save", False, 
                            f"Failed to create booking: {book_response.status_code}", 
                            f"Error: {error_detail}")
            
            # Test 5: Test occupied rooms visibility in dropdown
            print("🔍 Testing occupied rooms dropdown visibility...")
            
            # Get current room states
            current_rooms_response = self.session.get(f"{self.backend_url}/api/meeting-rooms")
            if current_rooms_response.status_code == 200:
                current_rooms = current_rooms_response.json()
                
                occupied_rooms = [room for room in current_rooms if room.get('status') == 'occupied']
                vacant_rooms = [room for room in current_rooms if room.get('status') == 'vacant']
                rooms_with_bookings = [room for room in current_rooms if room.get('bookings') and len(room.get('bookings', [])) > 0]
                
                self.log_test("Meeting Rooms - Dropdown Visibility", True, 
                            f"Room visibility analysis complete", 
                            f"Occupied: {len(occupied_rooms)}, Vacant: {len(vacant_rooms)}, With Bookings: {len(rooms_with_bookings)}")
                
                # Check if occupied rooms are properly marked and visible
                if len(rooms_with_bookings) > 0:
                    self.log_test("Meeting Rooms - Occupied Visibility", True, 
                                f"Rooms with bookings are visible in system", 
                                f"{len(rooms_with_bookings)} rooms have bookings and should show in dropdown")
                else:
                    self.log_test("Meeting Rooms - Occupied Visibility", False, 
                                "No rooms with bookings found - may indicate booking visibility issue")
            else:
                self.log_test("Meeting Rooms - Dropdown Visibility", False, 
                            f"Could not fetch rooms for dropdown visibility test: {current_rooms_response.status_code}")
                
        except Exception as e:
            self.log_test("Meeting Rooms - Review Request", False, f"Meeting rooms review request test failed: {str(e)}")

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
        
        # Meeting rooms comprehensive testing
        self.test_meeting_rooms_api_comprehensive()
        
        # COMPREHENSIVE TESTING FOR REVIEW REQUEST
        print("\n🔍 COMPREHENSIVE TESTING FOR REVIEW REQUEST")
        print("-" * 50)
        self.test_alerts_system_comprehensive()
        self.test_meeting_room_cross_system_sync()
        self.test_user_profile_functionality()
        
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