# 🏢 SmartWorld Employee Directory System

**BUILDING FUTURE HOMES** - A comprehensive full-stack employee management system built with React, FastAPI, and MongoDB.

## 📋 Table of Contents
- [🎯 Quick Start](#quick-start)
- [🏗️ System Overview](#system-overview)  
- [⚙️ Prerequisites](#prerequisites)
- [🛠️ Local Installation](#local-installation)
- [🚀 Running the Application](#running-the-application)
- [📊 Features & Navigation](#features-navigation)
- [🔧 Configuration](#configuration)
- [🛠️ Troubleshooting](#troubleshooting)
- [📚 API Documentation](#api-documentation)

## 🎯 Quick Start

### 1. Clone & Setup
```bash
git clone <your-repository-url>
cd smartworld-employee-directory
```

### 2. Install Dependencies
```bash
# Backend (Python 3.8+)
cd backend
pip install -r requirements.txt

# Frontend (Node.js 16+)  
cd ../frontend
yarn install  # or npm install --legacy-peer-deps
```

### 3. Configure Environment
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URL

# Frontend environment  
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > frontend/.env
```

### 4. Start Services
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend  
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 3 - Start Frontend
cd frontend  
yarn start  # or npm start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001  
- **API Docs**: http://localhost:8001/docs

## 🏗️ System Overview

### Modern Employee Management Platform
This system provides comprehensive employee directory management with advanced features for organizations to manage their workforce effectively.

**Key Components:**
- **Employee Directory** (625+ employees from Excel integration)
- **Hierarchy Builder** for organizational structure visualization
- **Meeting Room Booking** system with backend persistence
- **Alert Management** system with backend persistence  
- **Task Management** and assignment system
- **News Feed** for company updates
- **Knowledge Base** for company policies and procedures
- **Help/Support** system with threaded messaging
- **User Dashboard** with 5 configurable quick-access buttons

## 🛠️ Technology Stack

- **Frontend**: React 19 with Tailwind CSS & Radix UI
- **Backend**: FastAPI (Python 3.8+) with async/await  
- **Database**: MongoDB with persistent data storage
- **UI Framework**: Modern component-based architecture
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS with custom design system
- **Excel Integration**: openpyxl for employee data import
- **Authentication**: Role-based access (Admin/User)
- **Real-time Features**: Live data synchronization

## ⚙️ Prerequisites

### Required Software

#### For All Platforms:
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Python 3.8+** - [Download here](https://python.org/)
- **MongoDB 4.4+** - [Download here](https://www.mongodb.com/download-center/community)
- **Git** - [Download here](https://git-scm.com/)

#### Package Managers:
- **npm** (comes with Node.js) or **Yarn** (recommended)
- **pip** (comes with Python)

### System Requirements:
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

## 🛠️ Local Installation

### Step 1: Clone Repository
```bash
git clone <your-repository-url>
cd smartworld-employee-directory
```

### Step 2: Backend Setup

#### Install Python Dependencies
```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Configure Backend Environment
```bash
# Create environment file
cp .env.example .env

# Edit .env file with your settings:
# MONGO_URL=mongodb://localhost:27017/smartworld
```

#### Required Python Packages:
```txt
fastapi==0.104.1
uvicorn==0.24.0  
python-multipart==0.0.6
pymongo==4.5.0
openpyxl>=3.0.0
et_xmlfile>=2.0.0
python-dotenv==1.1.1
```

### Step 3: Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
yarn install
# OR if you prefer npm:
# npm install --legacy-peer-deps
```

#### Configure Frontend Environment  
```bash
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
```

#### Key Frontend Dependencies:
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0", 
  "axios": "^1.8.4",
  "react-router-dom": "^7.5.1",
  "tailwindcss": "^3.4.17",
  "@radix-ui/react-*": "Various UI components"
}
```

### Step 4: Database Setup

#### Start MongoDB
```bash
# Method 1: Using MongoDB service
sudo systemctl start mongodb  # Linux
brew services start mongodb   # macOS  
net start MongoDB            # Windows (as Administrator)

# Method 2: Direct command
mongod --dbpath /data/db
```

#### Verify MongoDB Connection
```bash
# Test connection
mongo --eval "db.runCommand({connectionStatus: 1})"
# Should return: "ok" : 1
```

## 🚀 Running the Application

### Development Mode (Recommended)

#### Option 1: Manual Start (3 Terminals)
```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend API Server  
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 3 - Frontend Development Server
cd frontend
yarn start
```

#### Option 2: Using Scripts
```bash
# Backend (with auto-reload)
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Frontend (with hot reload)
cd frontend  
yarn dev  # or npm run dev
```

### Production Mode

#### Backend Production
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

#### Frontend Production
```bash
cd frontend
yarn build
# Serve the build folder with your preferred web server
```

### Verification Steps

1. **Backend Health Check**: Visit http://localhost:8001/health
2. **API Documentation**: Visit http://localhost:8001/docs  
3. **Frontend Application**: Visit http://localhost:3000
4. **Database Connection**: Check logs for "Connected to MongoDB" message

## 📊 Features & Navigation

### Main Navigation (Tab System)

#### For All Users:
1. **🏠 Home** - Company news, project banners, employee highlights
2. **👥 Employee Directory** - Complete employee database with search/filters  
3. **📋 Policies** - Company policies and documentation
4. **🏢 Meeting Rooms** - Room booking system with real-time status
5. **📅 Holiday Calendar** - Company holidays and observances

#### Additional for Users:
6. **📊 Dashboard** - Quick access buttons to external tools and services

#### Admin-Only Features:
- **💼 Work** - Task management and assignment system
- **📚 Knowledge** - Knowledge base management
- **🆘 Help** - Support ticket system with threaded replies  
- **🔔 Alerts** - System-wide alert management
- **📊 Attendance** - Employee attendance tracking

### Core System Features

#### 🗄️ Employee Management
- **625+ Employee Records** loaded from Excel
- **Advanced Search** with "starts with" pattern matching
- **Department & Location Filters** (23+ departments, 22+ locations)  
- **Profile Image Management** with upload capabilities
- **Hierarchy Visualization** with org chart builder

#### 🏢 Meeting Room System  
- **Backend Persistent Storage** - Bookings saved to MongoDB
- **32 Meeting Rooms** across multiple locations
- **Real-time Status** - Vacant/Occupied tracking
- **Single Booking Policy** - One booking per room  
- **Automatic Cleanup** - Expired bookings removed
- **Location-based Filtering** - Filter by IFC, Noida, Central Office, etc.

#### 🔔 Alert Management
- **Backend Persistent Storage** - Alerts saved to MongoDB
- **Priority Levels** - Low, Medium, High, Urgent
- **Target Audiences** - All, Admin, User-specific
- **Expiration Dates** - Auto-expire functionality
- **Real-time Notifications** - Floating alert system

#### 📊 User Dashboard  
- **5 Quick Access Buttons** - Configurable external links
- **Professional Design** - Color-coded categories
- **Easy Configuration** - Admin can update URLs manually
- **Categories Available**:
  - Analytics - Business reports and data  
  - Team Management - HR and team tools
  - Project Planning - Planning and tracking tools
  - Documentation - Document management systems
  - System Settings - Configuration portals

## 🚨 **Excel Data Loading - Complete Solution**

### **The Problem:**
Your backend shows: `"Database already has 640 employees, skipping Excel load"`

### **💡 Solution 1: Force Reload Script (Recommended)**

```cmd
cd backend
python force_excel_load.py
```

**What this does:**
- Clears all existing data (employees, attendance, etc.)
- Reloads fresh data from Excel files
- Initializes meeting rooms and other data
- Provides detailed logging

### **💡 Solution 2: Environment Variable**

**Windows:**
```cmd  
cd backend
.venv\Scripts\activate
set FORCE_EXCEL_RELOAD=true
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Linux/Mac:**
```bash
cd backend
source venv/bin/activate
export FORCE_EXCEL_RELOAD=true
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### **💡 Solution 3: Quick Batch File (Windows)**

```cmd
cd backend
run_server.bat
```

### **💡 Solution 4: Check Setup & Force Load**

```cmd
cd backend
python check_setup.py      # Verify all dependencies
python force_excel_load.py # Clear & reload Excel data  
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

## 🚀 **Running the Application**

### **Windows - Method 1 (Automated)**

```cmd
# Terminal 1 - Backend
cd backend
run_server.bat

# Terminal 2 - Frontend  
cd frontend
simple_start.bat
```

### **Windows - Method 2 (Manual)**

```cmd  
# Terminal 1 - Backend
cd backend
.venv\Scripts\activate
set FORCE_EXCEL_RELOAD=true
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2 - Frontend
cd frontend
npm start
```

### **Linux/Mac**

```bash
# Terminal 1 - Backend  
cd backend
source venv/bin/activate
export FORCE_EXCEL_RELOAD=true
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔧 **Frontend Dependency Issues (Windows)**

### **Problem:** 
NPM errors with React 19, ESLint 9, date-fns conflicts

### **Solutions:**

#### **Method 1: Legacy Peer Dependencies**
```cmd
cd frontend
rmdir /S /Q node_modules
del package-lock.json  
npm install --legacy-peer-deps
npm start
```

#### **Method 2: Force Install**
```cmd
cd frontend
npm install --force
npm start
```

#### **Method 3: Use Yarn**  
```cmd
cd frontend
npm install -g yarn
yarn install
yarn start
```

#### **Method 4: Nuclear Fix (Guaranteed)**
```cmd
cd frontend
nuclear_fix.bat
```

#### **Method 5: Minimal Dependencies**
```cmd
cd frontend
copy package_minimal.json package.json
npm install
npm start
```

## 📁 **Project Structure**

```
employee-directory/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main application
│   ├── models.py              # Database models
│   ├── excel_parser.py        # Excel data processing  
│   ├── attendance_parser.py   # Attendance processing
│   ├── force_excel_load.py    # Force data reload
│   ├── check_setup.py         # Setup verification
│   ├── run_server.bat         # Windows server starter
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── employee_directory.xlsx # Employee data (640 records)
│   └── attendance_data.xlsx   # Attendance data
├── frontend/                   # React Frontend  
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Authentication context
│   │   └── App.js            # Main app with 5-tab layout
│   ├── package.json          # Dependencies
│   ├── package_minimal.json  # Minimal dependencies backup
│   ├── nuclear_fix.bat       # Windows dependency fix
│   ├── simple_start.bat      # Windows starter
│   └── .env                  # Frontend environment
├── setup_windows.bat         # Complete Windows setup
├── WINDOWS_SETUP_GUIDE.md    # Detailed Windows guide
├── QUICK_START_WINDOWS.md    # Quick start instructions
└── README.md                # This file
```

## 🌐 **Accessing the Application**

Once everything is running:

- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Admin Login**: Use "Admin Access" button (no password required)

## 📊 **System Features**

### **5-Tab Navigation System**
1. **Home** - Daily news management and company updates
2. **Employee Directory** - 640+ employees with search, filters, hierarchy builder
3. **Work** - Task management and assignment system  
4. **Knowledge** - Company policies, procedures, and documentation
5. **Help** - Support ticketing system with threaded replies

### **Advanced Features**
- **Excel Integration** - 640 employees loaded from `employee_directory.xlsx`
- **Meeting Room Booking** - 32 rooms across multiple locations (IFC, Noida, etc.)
- **Attendance Tracking** - Punch in/out with location tracking
- **Image Upload** - Profile pictures with base64 and file upload support
- **Hierarchy Management** - Organizational structure visualization
- **Search Functionality** - "Starts with" pattern across all fields
- **Real-time Updates** - Live data synchronization

### **Meeting Room System**
- **IFC Location**: 11 rooms (floors 11, 12, 14)
  - Floor 14: 9 conference rooms (OVAL, PETRONAS, BOARD ROOM, etc.)
- **Other Locations**: Noida, Central Office, Project Offices
- **Single Booking Policy** - One booking per room at a time
- **Status Tracking** - Real-time vacant/occupied status

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database Configuration
MONGO_URL=mongodb://localhost:27017/smartworld

# Server Configuration  
HOST=0.0.0.0
PORT=8001
DEBUG=true

# Optional: Force data reload
FORCE_EXCEL_RELOAD=false
```

#### Frontend (.env)
```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Development Configuration
PORT=3000
WDS_SOCKET_PORT=3000
GENERATE_SOURCEMAP=false
```

### Application Configuration

#### User Roles & Permissions
- **Admin Access**: Full system access including management features
- **User Access**: Core features with dashboard and standard navigation

#### Dashboard Button Configuration
The 5 dashboard buttons can be configured by editing `/frontend/src/components/Dashboard.jsx`:

```javascript
// Update URLs in the buttons array:
{
  id: 1,
  title: "Analytics", 
  url: "https://your-analytics-url.com", // Update this
  // ... other properties
}
```

#### Meeting Room Configuration
Meeting rooms are initialized automatically with the following structure:
- **IFC Location**: 11 rooms (floors 11, 12, 14)
- **Other Locations**: Noida, Central Office, Project Office
- Room capacity ranges from 4-20 people

#### Excel Data Configuration
Employee data is loaded from `employee_directory.xlsx` in the backend folder.
Format requirements:
- Employee ID, Name, Department, Location, Grade
- Mobile, Email, Date of Joining
- Additional fields as needed

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. **Frontend Won't Start**
```bash
# Problem: Dependency conflicts with React 19
# Solution 1: Use legacy peer deps
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Solution 2: Use Yarn (recommended)  
npm install -g yarn
yarn install

# Solution 3: Force install
npm install --force
```

#### 2. **Backend API Errors**
```bash
# Problem: MongoDB connection failed
# Solution: Check MongoDB is running
sudo systemctl start mongodb  # Linux
brew services start mongodb   # macOS
net start MongoDB            # Windows

# Problem: Missing Python packages
# Solution: Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

#### 3. **Data Not Loading**
```bash
# Problem: Employee directory empty
# Solution: Check Excel file location
ls backend/employee_directory.xlsx  # Should exist

# Problem: Meeting rooms not persisting 
# Solution: Check MongoDB connection and restart backend
curl http://localhost:8001/health
```

#### 4. **Port Conflicts**
```bash
# Problem: Port 8001 already in use
# Solution: Kill existing process
lsof -i :8001  # Find PID
kill -9 <PID>  # Kill process

# Or use different port
uvicorn server:app --host 0.0.0.0 --port 8002

# Problem: Port 3000 already in use  
# Solution: Use different port
PORT=3001 yarn start
```

#### 5. **Build Errors**
```bash
# Problem: ESLint errors in production build
# Solution: Disable ESLint for build
DISABLE_ESLINT_PLUGIN=true yarn build

# Problem: Memory issues during build
# Solution: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" yarn build
```

### **MongoDB Issues**

#### **Windows MongoDB Setup**
```cmd
# Install MongoDB Community Server
# Start MongoDB service
net start MongoDB

# Verify connection
mongo --eval "db.runCommand({connectionStatus: 1})"
```

#### **Connection Problems**
```cmd
# Check MongoDB status  
# Windows:
sc query MongoDB

# Linux:  
sudo systemctl status mongodb

# Test connection
python -c "from pymongo import MongoClient; print(MongoClient().admin.command('ismaster'))"
```

### **Frontend Dependency Conflicts**

#### **React 19 + ESLint 9 Issues**
```cmd
# Method 1: Legacy peer deps
npm install --legacy-peer-deps

# Method 2: Force install
npm install --force  

# Method 3: Use Yarn
npm install -g yarn
yarn install

# Method 4: Nuclear option
nuclear_fix.bat  # Windows
```

#### **Date-fns Version Conflicts**
```cmd
# Fix react-day-picker compatibility
npm install date-fns@3.6.0 --legacy-peer-deps
npm install react-day-picker@8.8.0 --legacy-peer-deps
```

### **Backend Issues**

#### **Server Won't Start**
```cmd
# Check Python version
python --version  # Should be 3.8+

# Verify dependencies
pip list | findstr fastapi
pip list | findstr uvicorn  
pip list | findstr pymongo

# Check virtual environment
.venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux

# Check logs
uvicorn server:app --host 0.0.0.0 --port 8001 --log-level debug
```

#### **Import Errors**
```cmd
# Reinstall requirements
pip install -r requirements.txt --force-reinstall

# Install missing packages
pip install openpyxl et_xmlfile pandas motor
```

### **Port Conflicts**

#### **Port 8001 Already in Use**
```cmd
# Windows - Find process
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux - Find and kill process  
lsof -i :8001
kill -9 <PID>

# Use different port
uvicorn server:app --host 0.0.0.0 --port 8002 --reload
```

#### **Port 3000 Already in Use**
```cmd
# Kill React process
# Windows:
taskkill /f /im node.exe

# Linux:  
pkill -f react-scripts

# Use different port
set PORT=3001 && npm start  # Windows
PORT=3001 npm start         # Linux
```

## 🔧 **Configuration Files**

### **Backend Environment (.env)**
```env
# MongoDB Configuration  
MONGO_URL="mongodb://localhost:27017"
DB_NAME="employee_directory_db"

# Excel Configuration
FORCE_EXCEL_RELOAD=true
EXCEL_FILE_PATH="employee_directory.xlsx"

# Server Configuration
HOST="0.0.0.0"
PORT=8001
DEBUG=true
```

### **Frontend Environment (.env)**
```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Development Configuration  
WDS_SOCKET_PORT=3000
GENERATE_SOURCEMAP=false
```

## 📚 API Documentation

### Interactive API Docs
Visit **http://localhost:8001/docs** for complete interactive API documentation with Swagger UI.

### Core API Endpoints

#### Authentication & Health
```bash
GET  /health                 # System health check
GET  /                      # API status
```

#### Employee Management  
```bash
GET  /api/employees         # List all employees (625+ records)
GET  /api/employees?search={term}  # Search employees (starts-with pattern)
PUT  /api/employees/{id}/image     # Update profile image (base64)
POST /api/employees/{id}/upload-image  # Upload image file
```

#### Meeting Rooms (Backend Persistent)
```bash
GET    /api/meeting-rooms                    # List all rooms with booking status
POST   /api/meeting-rooms/{id}/book          # Book meeting room
DELETE /api/meeting-rooms/{id}/booking/{bid} # Cancel specific booking  
DELETE /api/meeting-rooms/clear-all-bookings # Clear all bookings
```

#### Alerts System (Backend Persistent)
```bash
GET    /api/alerts              # Get all active alerts
GET    /api/alerts?target_audience=user  # Filter by audience
POST   /api/alerts              # Create new alert
PUT    /api/alerts/{id}          # Update existing alert
DELETE /api/alerts/{id}          # Delete alert
```

#### Utility Endpoints
```bash
GET /api/departments           # List all departments (23 total)
GET /api/locations            # List all locations (22 total)  
GET /api/stats                # System statistics
```

### Request/Response Examples

#### Book Meeting Room
```bash
POST /api/meeting-rooms/conf_11a/book
Content-Type: application/json

{
  "employee_name": "John Doe",
  "employee_id": "EMP001", 
  "start_time": "2025-08-30T10:00:00Z",
  "end_time": "2025-08-30T11:00:00Z",
  "purpose": "Team meeting"
}
```

#### Create Alert
```bash
POST /api/alerts
Content-Type: application/json

{
  "title": "System Maintenance",
  "message": "Scheduled maintenance on Sunday 2-4 AM", 
  "priority": "high",
  "type": "system",
  "target_audience": "all",
  "created_by": "Admin"
}
```

### Response Format
All API responses follow a consistent format:
```json
{
  "message": "Success message",
  "data": { /* Response data */ },
  "status": "success|error"
}
```

## 🔐 **Security & Production**

### **Production Environment Variables**
```env
# Backend Production
MONGO_URL="mongodb://username:password@localhost:27017/production_db"
ENVIRONMENT="production"
ALLOWED_ORIGINS=["https://yourdomain.com"]
DEBUG=false

# Frontend Production  
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### **Production Deployment**
1. **Build Frontend**: `npm run build`
2. **Serve Static Files**: Configure nginx/apache
3. **Process Manager**: Use PM2 or supervisor
4. **SSL Certificate**: Configure HTTPS
5. **Database Security**: Enable MongoDB authentication
6. **Firewall**: Configure proper ports (80, 443, not 3000/8001)

## 📋 **Quick Reference Commands**

### **Daily Development Workflow**
```cmd
# Start everything (Windows)
cd backend && run_server.bat
cd frontend && simple_start.bat

# Start everything (Linux)
cd backend && source venv/bin/activate && uvicorn server:app --reload --host 0.0.0.0 --port 8001
cd frontend && npm start

# Force refresh Excel data
cd backend && python force_excel_load.py

# Check system health  
cd backend && python check_setup.py
```

### **Reset Everything**
```cmd
# Clear database and reload
cd backend && python force_excel_load.py

# Reset frontend dependencies  
cd frontend && nuclear_fix.bat  # Windows
cd frontend && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps  # Linux
```

## 🆘 **Getting Help**

### **Common Error Messages & Solutions**

| Error | Solution |
|-------|----------|
| "Database already has employees" | Run `python force_excel_load.py` |
| "Excel file not found" | Ensure `employee_directory.xlsx` is in backend folder |
| "MongoDB connection failed" | Start MongoDB service: `net start MongoDB` |
| "Cannot find module 'ajv/dist/compile/codegen'" | Run `npm install --legacy-peer-deps` |
| "ERESOLVE could not resolve" | Use `npm install --force` or `yarn install` |
| "Port 8001 is already in use" | Kill process: `netstat -ano \| findstr :8001` |

### **System Requirements Verification**
```cmd
# Check all requirements
node --version    # Should be 16+
python --version  # Should be 3.8+
mongo --version   # Should be 4.4+
npm --version     # Should be 8+
```

### **Emergency Reset (Nuclear Option)**
```cmd
# Complete reset - Windows
setup_windows.bat

# Complete reset - Linux  
./setup.sh
```

## 📁 Project Structure

```
smartworld-employee-directory/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main FastAPI application  
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment configuration
│   └── employee_directory.xlsx # Employee data (625+ records)
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.jsx  # User dashboard with 5 buttons
│   │   │   ├── MeetingRooms.jsx # Room booking system  
│   │   │   ├── AlertManagement.jsx # Alert system
│   │   │   └── ...           # Other components
│   │   ├── context/           # Authentication & state
│   │   ├── services/          # API services
│   │   └── App.js            # Main application
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Styling configuration
│   └── .env                  # Frontend environment
├── README.md                 # This documentation
└── package.json              # Root package file
```

## 🎉 Success Verification

### You'll know everything is working correctly when:

1. **✅ Backend Health**: Visit http://localhost:8001/health
   ```json
   {"status":"healthy","mode":"backend-persistent","mongodb":true}
   ```

2. **✅ Frontend Loading**: Visit http://localhost:3000  
   - Login page displays with "Administrator Access" and "User Access" buttons
   - Company logo and "BUILDING FUTURE HOMES" text visible

3. **✅ Database Connected**: Backend logs show
   ```
   Connected to MongoDB: mongodb://localhost:27017/smartworld
   ```

4. **✅ Meeting Rooms**: Visit Meeting Rooms tab
   - Shows 32+ meeting rooms across locations
   - Booking system allows room reservations
   - Data persists after page refresh

5. **✅ User Dashboard**: Login as User
   - Dashboard tab appears after Holiday Calendar
   - Shows 5 professional buttons (Analytics, Team Management, etc.)
   - No configuration section visible

6. **✅ Admin Features**: Login as Admin
   - Access to all tabs including Alerts, Work, Knowledge
   - Can create and manage system alerts
   - Alert data persists in backend

## 🚀 Deployment Notes

### Local Development
- Frontend runs on port 3000 with hot reload
- Backend runs on port 8001 with auto-reload
- MongoDB typically runs on port 27017

### Production Considerations
- Set `DEBUG=false` in backend environment
- Use `yarn build` for production frontend build
- Configure proper MongoDB authentication
- Set up reverse proxy (nginx/apache) for production
- Use process manager like PM2 for backend

## 🆘 Getting Help

### Quick Debug Commands
```bash
# Check if all services are running
curl http://localhost:8001/health        # Backend health
curl http://localhost:3000              # Frontend health  
mongo --eval "db.runCommand({ping: 1})" # MongoDB health

# View logs
tail -f backend/logs/app.log    # Backend logs
# Frontend logs appear in browser console

# Reset everything
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install --legacy-peer-deps
cd ../backend && pip install -r requirements.txt --force-reinstall
```

### Support Resources
- **API Documentation**: http://localhost:8001/docs
- **MongoDB Admin**: Use MongoDB Compass or CLI
- **React DevTools**: Install browser extension for debugging
- **Network Tab**: Check browser DevTools for API call failures

---

## 🏆 System Highlights

### 🔧 **Technical Achievements**
- **Backend Persistence**: Meeting rooms and alerts now save to MongoDB  
- **Cross-System Access**: Data accessible from multiple client systems
- **Modern Stack**: React 19 + FastAPI + MongoDB with async operations
- **Professional UI**: Tailwind CSS + Radix UI component library

### 🎨 **User Experience**  
- **Role-Based Access**: Separate Admin and User experiences
- **Dashboard Integration**: 5 configurable quick-access buttons for users
- **Real-Time Updates**: Live data synchronization across components
- **Mobile Responsive**: Works seamlessly across desktop and mobile devices

### 📈 **Business Features**
- **Employee Management**: Complete directory with 625+ employees  
- **Resource Booking**: 32 meeting rooms with conflict prevention
- **Communication**: Alert system for organization-wide messaging
- **Productivity Tools**: Task management, knowledge base, support system

---

**🚀 Built with ❤️ for SmartWorld Developers - BUILDING FUTURE HOMES**

*Complete local development setup with full backend persistence and modern React architecture.*
