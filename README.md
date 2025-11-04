# SmartWorld Employee Directory - Complete Application Guide

## 📋 Overview

This is a comprehensive Employee Directory Management System with both **Admin** and **User** access levels. The application includes employee management, meeting rooms booking, alerts system, policies, and much more.

## 🏗️ Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Excel Integration**: openpyxl for employee data import

## 📁 Project Structure

```
/app/
├── backend/              # FastAPI backend server
│   ├── server.py        # Main API server
│   ├── requirements.txt # Python dependencies
│   └── uploads/         # Uploaded files (images, banners)
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Authentication context
│   │   └── App.js       # Main application
│   ├── public/          # Static assets
│   └── package.json     # Node dependencies
├── Employee_latest_data.xlsx  # Employee data source
└── company policies/    # Policy PDF files
```

## 🚀 Installation & Setup

### Prerequisites

Make sure you have the following installed:
- Python 3.8+
- Node.js 14+ & Yarn
- MongoDB (running on localhost:27017)

### Step 1: Install Backend Dependencies

```bash
cd /app/backend
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies

```bash
cd /app/frontend
yarn install
```

### Step 3: Configure Environment Variables

**Backend (.env file location: `/app/backend/.env`)**
```
MONGO_URL=mongodb://localhost:27017/smartworld
```

**Frontend (.env file location: `/app/frontend/.env`)**
```
PORT=3000
REACT_APP_BACKEND_URL=https://run-modify.preview.emergentagent.com/api
```

**Note**: Update `REACT_APP_BACKEND_URL` to your actual backend URL if different.

## 🎬 Running the Application

### Option 1: Using Supervisor (Recommended for Production)

All services are managed by supervisor. Use these commands:

```bash
# Start all services
sudo supervisorctl restart all

# Check status of all services
sudo supervisorctl status

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart mongodb

# View logs
tail -f /var/log/supervisor/backend.*.log
tail -f /var/log/supervisor/frontend.*.log
```

### Option 2: Manual Start (Development)

**Terminal 1 - Start MongoDB:**
```bash
mongod --dbpath /data/db
```

**Terminal 2 - Start Backend:**
```bash
cd /app/backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - Start Frontend:**
```bash
cd /app/frontend
yarn start
```

## 🔑 Access Credentials

### Administrator Access
- **Username**: Admin
- **Password**: Smart@12345
- **Features**: Full access to all management features including employee management, alerts management, and banner management

### User Access
- **Username**: User (or any name)
- **Password**: No password required (click login directly)
- **Features**: Access to Home, Dashboard, Employee Directory, Policies, Meeting Rooms, Holiday Calendar, and Help

## 📊 Features Overview

### 🔐 Admin Features (3 Management Tabs)

1. **Banner Management**
   - Upload and manage homepage banners
   - Control banner display order
   - Multiple banner support

2. **Alerts Management**
   - Create system-wide alerts
   - Set priority levels (Low, Medium, High, Urgent)
   - Target specific audiences (All, Admin, User)
   - Set expiry dates for alerts
   - Full CRUD operations

3. **Employee Management**
   - Add new employees
   - Edit employee details (Name, Designation, Department, Location, etc.)
   - Upload employee photos
   - Delete employees
   - Export employees to Excel
   - Search and filter functionality

### 👤 User Features (7 Tabs)

1. **Home**
   - Company news and announcements
   - Quick access links
   - Latest updates

2. **Dashboard**
   - Power BI dashboards
   - PO Dashboard
   - QMS Dashboard
   - Assets Dashboard
   - Employee Attendance Dashboard
   - PR Dashboard

3. **Employee Directory**
   - Search employees by name, ID, department, location
   - View employee details and photos
   - Filter by department and location
   - Hierarchy visualization

4. **Policies**
   - Access company policies
   - PDF document viewer
   - Organized by categories (HR, IT, Admin)

5. **Meeting Rooms**
   - View all meeting rooms
   - Book meeting rooms
   - View room availability
   - Cancel bookings
   - Filter by location and floor

6. **Holiday Calendar**
   - View company holidays
   - Calendar view
   - Holiday details

7. **Help**
   - Submit support requests
   - Track request status
   - View responses

## 🗄️ Database Collections

The application uses MongoDB with the following collections:

- `employees` - Employee data
- `alerts` - System alerts
- `meeting_rooms` - Meeting room data
- `bookings` - Room bookings
- `news` - News and announcements
- `tasks` - Task management
- `knowledge` - Knowledge base
- `help` - Support requests
- `attendance` - Attendance records
- `policies` - Company policies
- `workflows` - Workflow management
- `hierarchy` - Organizational hierarchy
- `home_sliders` - Homepage banners

## 📝 API Endpoints

### Employee Management
- `GET /api/employees` - Get all employees (with optional search/filter)
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `PUT /api/employees/{id}/image` - Update employee photo
- `GET /api/employees/export-excel` - Export to Excel

### Alerts Management
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/{id}` - Update alert
- `DELETE /api/alerts/{id}` - Delete alert

### Meeting Rooms
- `GET /api/meeting-rooms` - Get all meeting rooms
- `POST /api/meeting-rooms/{id}/book` - Book a room
- `DELETE /api/meeting-rooms/{id}/booking/{booking_id}` - Cancel booking
- `DELETE /api/meeting-rooms/clear-all-bookings` - Clear all bookings

### Utility Endpoints
- `GET /api/departments` - Get all departments
- `GET /api/locations` - Get all locations
- `GET /api/stats` - Get system statistics
- `POST /api/refresh-excel` - Refresh data from Excel

## 📦 Excel Data Import

The application automatically loads employee data from Excel files on startup. 

**Excel File Location Priority:**
1. `/app/frontend/public/employee_directory.xlsx`
2. `/app/employee_directory.xlsx`
3. `/app/Employee_latest_data.xlsx`
4. `/app/backend/build/employee_directory.xlsx`

**Required Excel Columns:**
- EMP ID (or Employee ID, EmpID)
- EMP NAME (or Employee Name)
- DEPARTMENT (or Dept)
- GRADE (mapped to both `grade` and `designation`)
- LOCATION (or Office Location)
- MOBILE (or Phone, Contact)
- EMAIL ID (or Email Address)
- DATE OF JOINING
- DATE OF BIRTH
- BLOOD GROUP
- EMERGENCY CONTACT
- REPORTING MANAGER
- REPORTING ID

## 🔧 Troubleshooting

### Backend not starting
```bash
# Check backend logs
tail -f /var/log/supervisor/backend.err.log

# Common issues:
# 1. MongoDB not running - Start with: sudo supervisorctl restart mongodb
# 2. Port already in use - Kill process: sudo lsof -t -i:8001 | xargs kill -9
# 3. Missing dependencies - Run: pip install -r /app/backend/requirements.txt
```

### Frontend not starting
```bash
# Check frontend logs
tail -f /var/log/supervisor/frontend.err.log

# Common issues:
# 1. Node modules not installed - Run: cd /app/frontend && yarn install
# 2. Port already in use - Kill process: sudo lsof -t -i:3000 | xargs kill -9
```

### MongoDB connection issues
```bash
# Check if MongoDB is running
sudo supervisorctl status mongodb

# Check MongoDB logs
tail -f /var/log/supervisor/mongodb.*.log

# Restart MongoDB
sudo supervisorctl restart mongodb
```

### Alerts not displaying
```bash
# 1. Check if backend URL is correctly configured in frontend/.env
# 2. Verify backend is running: curl http://localhost:8001/api/alerts
# 3. Check browser console for CORS or network errors
# 4. Ensure alerts exist in database or create new ones via Admin panel
```

### Employee designation not showing
```bash
# 1. Ensure Excel file has GRADE column
# 2. Restart backend to reload Excel data
# 3. Check if employees have designation field: curl http://localhost:8001/api/employees | grep designation
```

### Changes not persisting
```bash
# All add/delete operations should call backend APIs
# Verify in browser Network tab that API calls are being made
# Check if backend responds with success status (200/201)
# Ensure MongoDB is running and connected
```

## 🔄 Data Persistence

**Important**: All data operations (Add, Edit, Delete) are stored in MongoDB database, NOT in Excel files. 

- Excel files are used only for **initial data import** on server startup
- All subsequent changes are saved to MongoDB
- To update Excel data permanently, use the "Export to Excel" feature from Admin panel

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8001/redoc (ReDoc)

## 📱 Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge

## 🎨 Customization

### Changing Colors/Theme
Edit `/app/frontend/tailwind.config.js` to modify theme colors

### Adding New Features
1. Backend: Add endpoints in `/app/backend/server.py`
2. Frontend: Create components in `/app/frontend/src/components/`
3. Update App.js to include new routes/tabs

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs
3. Verify all services are running
4. Check MongoDB connection

## 📄 License

Proprietary - SmartWorld Developers

## 🔄 Version Information

- **Version**: 2.0
- **Last Updated**: October 2025
- **Employee Count**: 625
- **Meeting Rooms**: 15
- **Departments**: 20
- **Locations**: 12

---

**Note**: This application is designed for internal use within SmartWorld Developers organization. All data should be treated as confidential and secure.
