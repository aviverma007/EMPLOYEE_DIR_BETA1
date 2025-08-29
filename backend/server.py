from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import os
import uuid
from pymongo import MongoClient
from dotenv import load_dotenv
import base64
import shutil
from pathlib import Path

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/smartworld')
try:
    client = MongoClient(MONGO_URL)
    db = client.smartworld
    print(f"Connected to MongoDB: {MONGO_URL}")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    db = None

# Collections
meeting_rooms_collection = db.meeting_rooms if db is not None else None
bookings_collection = db.bookings if db is not None else None
alerts_collection = db.alerts if db is not None else None

# Data Models
class MeetingRoomBooking(BaseModel):
    employee_name: str
    employee_id: str
    start_time: str
    end_time: str
    purpose: str

class Alert(BaseModel):
    title: str
    message: str
    priority: str = "medium"  # low, medium, high, urgent
    type: str = "general"     # general, system, announcement
    target_audience: str = "all"  # all, admin, user
    created_by: str
    expires_at: Optional[str] = None

class AlertUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    priority: Optional[str] = None
    type: Optional[str] = None
    target_audience: Optional[str] = None
    expires_at: Optional[str] = None

# ============================================================================
# HEALTH AND STATUS ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    return {"message": "SmartWorld Employee Directory API", "status": "running", "mode": "backend-persistent"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "mode": "backend-persistent", "mongodb": db is not None}

# ============================================================================
# MEETING ROOMS API - Backend Persistence
# ============================================================================

@app.get("/api/meeting-rooms")
def get_meeting_rooms():
    """Get all meeting rooms with their current booking status"""
    try:
        if meeting_rooms_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Initialize meeting rooms if collection is empty
        if meeting_rooms_collection.count_documents({}) == 0:
            initialize_meeting_rooms()
        
        # Get all meeting rooms
        rooms = list(meeting_rooms_collection.find({}, {"_id": 0}))
        
        # Get current bookings for all rooms
        current_time = datetime.utcnow().isoformat()
        for room in rooms:
            # Find active bookings for this room
            active_bookings = list(bookings_collection.find({
                "room_id": room["id"],
                "start_time": {"$lte": current_time},
                "end_time": {"$gte": current_time}
            }, {"_id": 0}))
            
            # Get all future bookings for this room
            all_bookings = list(bookings_collection.find({
                "room_id": room["id"],
                "end_time": {"$gte": current_time}
            }, {"_id": 0}).sort("start_time", 1))
            
            room["bookings"] = all_bookings
            room["current_booking"] = active_bookings[0] if active_bookings else None
            room["status"] = "occupied" if active_bookings else "vacant"
        
        return rooms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/meeting-rooms/{room_id}/book")
def book_meeting_room(room_id: str, booking: MeetingRoomBooking):
    """Book a meeting room"""
    try:
        if meeting_rooms_collection is None or bookings_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Check if room exists
        room = meeting_rooms_collection.find_one({"id": room_id}, {"_id": 0})
        if not room:
            raise HTTPException(status_code=404, detail="Meeting room not found")
        
        # Validate booking times - normalize timezone handling
        def normalize_datetime(dt_str):
            """Convert datetime string to UTC datetime object"""
            if dt_str.endswith('Z'):
                dt_str = dt_str[:-1] + '+00:00'
            return datetime.fromisoformat(dt_str).replace(tzinfo=None)
        
        start_time = normalize_datetime(booking.start_time)
        end_time = normalize_datetime(booking.end_time)
        now = datetime.utcnow()
        
        if start_time < now:
            raise HTTPException(status_code=400, detail="Cannot book meeting room for past time")
        
        if end_time <= start_time:
            raise HTTPException(status_code=400, detail="End time must be after start time")
        
        # Check for conflicts with existing bookings
        start_time_str = start_time.isoformat()
        end_time_str = end_time.isoformat()
        
        conflict = bookings_collection.find_one({
            "room_id": room_id,
            "$or": [
                {
                    "start_time": {"$lte": start_time_str},
                    "end_time": {"$gt": start_time_str}
                },
                {
                    "start_time": {"$lt": end_time_str},
                    "end_time": {"$gte": end_time_str}
                },
                {
                    "start_time": {"$gte": start_time_str},
                    "end_time": {"$lte": end_time_str}
                }
            ]
        })
        
        if conflict:
            raise HTTPException(status_code=400, detail="Room is already booked for this time period")
        
        # Create booking record
        booking_record = {
            "id": str(uuid.uuid4()),
            "room_id": room_id,
            "room_name": room["name"],
            "employee_name": booking.employee_name,
            "employee_id": booking.employee_id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "purpose": booking.purpose,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Insert booking
        result = bookings_collection.insert_one(booking_record)
        
        if result.inserted_id:
            booking_record.pop("_id", None)
            return {"message": "Meeting room booked successfully", "booking": booking_record}
        else:
            raise HTTPException(status_code=500, detail="Failed to create booking")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/meeting-rooms/{room_id}/booking/{booking_id}")
def cancel_booking(room_id: str, booking_id: str):
    """Cancel a specific booking"""
    try:
        if bookings_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Find and delete the booking
        result = bookings_collection.delete_one({
            "id": booking_id,
            "room_id": room_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return {"message": "Booking cancelled successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/meeting-rooms/clear-all-bookings")
def clear_all_bookings():
    """Clear all bookings from all meeting rooms"""
    try:
        if bookings_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Delete all bookings
        result = bookings_collection.delete_many({})
        
        return {
            "message": "All bookings cleared successfully",
            "bookings_cleared": result.deleted_count
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ALERTS API - Backend Persistence  
# ============================================================================

@app.get("/api/alerts")
def get_alerts(target_audience: str = "all"):
    """Get all active alerts, optionally filtered by target audience"""
    try:
        if alerts_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Build filter query
        query = {}
        current_time = datetime.utcnow().isoformat()
        
        # Filter by target audience
        if target_audience != "all":
            query["$or"] = [
                {"target_audience": "all"},
                {"target_audience": target_audience}
            ]
        
        # Filter out expired alerts
        query["$or"] = [
            {"expires_at": {"$gte": current_time}},
            {"expires_at": None}
        ]
        
        alerts = list(alerts_collection.find(query, {"_id": 0}).sort("created_at", -1))
        return alerts
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/alerts")
def create_alert(alert: Alert):
    """Create a new alert"""
    try:
        if alerts_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        alert_record = {
            "id": str(uuid.uuid4()),
            **alert.dict(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = alerts_collection.insert_one(alert_record)
        
        if result.inserted_id:
            alert_record.pop("_id", None)
            return {"message": "Alert created successfully", "alert": alert_record}
        else:
            raise HTTPException(status_code=500, detail="Failed to create alert")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/alerts/{alert_id}")
def update_alert(alert_id: str, alert: AlertUpdate):
    """Update an existing alert"""
    try:
        if alerts_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Build update data (only include non-None fields)
        update_data = {k: v for k, v in alert.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = alerts_collection.update_one(
            {"id": alert_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        # Return updated alert
        updated_alert = alerts_collection.find_one({"id": alert_id}, {"_id": 0})
        return {"message": "Alert updated successfully", "alert": updated_alert}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/alerts/{alert_id}")
def delete_alert(alert_id: str):
    """Delete an alert"""
    try:
        if alerts_collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        result = alerts_collection.delete_one({"id": alert_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"message": "Alert deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def initialize_meeting_rooms():
    """Initialize meeting rooms data if collection is empty"""
    meeting_rooms_data = [
        {"id": "conf_11a", "name": "IFC Conference Room 11A", "location": "IFC", "floor": "11th Floor", "capacity": 8, "equipment": "Projector, Whiteboard"},
        {"id": "conf_12a", "name": "IFC Conference Room 12A", "location": "IFC", "floor": "12th Floor", "capacity": 12, "equipment": "Video Conference, Projector"},
        {"id": "oval", "name": "OVAL MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 10, "equipment": "Smart Board, Audio System"},
        {"id": "petronas", "name": "PETRONAS MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 5, "equipment": "Projector"},
        {"id": "global_center", "name": "GLOBAL CENTER MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 5, "equipment": "Whiteboard"},
        {"id": "louvre", "name": "LOUVRE MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 5, "equipment": "Projector"},
        {"id": "golden_gate", "name": "GOLDEN GATE MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 10, "equipment": "Video Conference"},
        {"id": "empire_state", "name": "EMPIRE STATE MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 5, "equipment": "Whiteboard"},
        {"id": "marina_bay", "name": "MARINA BAY MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 5, "equipment": "Projector"},
        {"id": "burj", "name": "BURJ MEETING ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 5, "equipment": "Smart Board"},
        {"id": "board", "name": "BOARD ROOM", "location": "IFC", "floor": "14th Floor", "capacity": 20, "equipment": "Video Conference, Projector, Audio System"},
        {"id": "central_75", "name": "Central Office 75 Meeting Room", "location": "Central Office 75", "floor": "1st Floor", "capacity": 6, "equipment": "Projector"},
        {"id": "office_75", "name": "Office 75 Meeting Room", "location": "Office 75", "floor": "1st Floor", "capacity": 8, "equipment": "Whiteboard"},
        {"id": "noida", "name": "Noida Meeting Room", "location": "Noida", "floor": "1st Floor", "capacity": 10, "equipment": "Video Conference"},
        {"id": "project_office", "name": "Project Office Meeting Room", "location": "Project Office", "floor": "1st Floor", "capacity": 4, "equipment": "Projector"}
    ]
    
    meeting_rooms_collection.insert_many(meeting_rooms_data)
    print(f"Initialized {len(meeting_rooms_data)} meeting rooms")


# ============================================================================
# STATIC FILE SERVING
# ============================================================================

# Serve uploaded files (images, etc.)
uploads_path = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_path, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=uploads_path), name="uploads")

# ---------- React Frontend Serving ----------
# Path to your React build folder
frontend_path = os.path.join(os.path.dirname(__file__), "build")

# Serve static files (JS, CSS, images, etc.)
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Catch-all route to serve React index.html for client-side routing
@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    return FileResponse(os.path.join(frontend_path, "index.html"))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
