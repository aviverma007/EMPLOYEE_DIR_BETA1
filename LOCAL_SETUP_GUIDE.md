# SmartDesk Local Server Setup Guide

Complete guide to run the SmartDesk Employee Management application on your local machine.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)
6. [Project Structure](#project-structure)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

### Required Software:

1. **Node.js & npm** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Yarn** (Package Manager)
   - Install globally:
     ```bash
     npm install -g yarn
     ```
   - Verify installation:
     ```bash
     yarn --version
     ```

3. **Python** (v3.8 or higher)
   - Download: https://www.python.org/downloads/
   - Verify installation:
     ```bash
     python --version
     # or
     python3 --version
     ```

4. **MongoDB** (v4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Install MongoDB Community Edition for your OS
   - Verify installation:
     ```bash
     mongod --version
     ```

---

## 📥 Installation Steps

### Step 1: Clone/Download the Project

```bash
# If using git
git clone <your-repository-url>
cd smartdesk

# Or extract the project folder if downloaded as ZIP
```

### Step 2: Start MongoDB

**On Windows:**
```bash
# Open Command Prompt as Administrator
net start MongoDB

# Or if MongoDB is not set as service:
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
```

**On macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

**On Linux:**
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

**Verify MongoDB is running:**
```bash
# Try connecting to MongoDB
mongosh
# or for older versions
mongo
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Note: If emergentintegrations fails, install with:
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
```

### Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies using Yarn
yarn install

# If you encounter errors, try:
rm -rf node_modules yarn.lock
yarn install
```

---

## ⚙️ Configuration

### Backend Configuration

**File: `/backend/.env`**

Create or update the `.env` file in the backend folder:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/smartworld

# Emergent LLM Key (for chatbot functionality)
EMERGENT_LLM_KEY=sk-emergent-f24028e592424E9A37
```

**Important Notes:**
- MongoDB should be running on default port 27017
- Database name is `smartworld` (will be created automatically)
- The employee data will be loaded from `employee_directory.xlsx`

### Frontend Configuration

**File: `/frontend/.env`**

Create or update the `.env` file in the frontend folder:

```env
# Frontend Port
PORT=3000

# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Important:** Change `REACT_APP_BACKEND_URL` from the production URL to `http://localhost:8001`

---

## 🚀 Running the Application

### Method 1: Manual Start (Recommended for Development)

#### Terminal 1 - Start Backend:

```bash
cd backend

# Activate virtual environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Start FastAPI server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### Terminal 2 - Start Frontend:

```bash
cd frontend

# Start React development server
yarn start
```

**Expected Output:**
```
Compiled successfully!

You can now view smartdesk in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Method 2: Using Process Managers

#### Option A: Using PM2 (Node.js Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name smartdesk-backend

# Start frontend
cd frontend
pm2 start "yarn start" --name smartdesk-frontend

# View status
pm2 status

# View logs
pm2 logs

# Stop services
pm2 stop all
pm2 delete all
```

#### Option B: Using Supervisor (Linux/macOS)

Install supervisor and configure as shown in the system setup.

---

## 🌐 Accessing the Application

Once both servers are running:

1. **Frontend (User Interface):**
   - URL: http://localhost:3000
   - This is where you access the application

2. **Backend (API):**
   - URL: http://localhost:8001
   - API Documentation: http://localhost:8001/docs
   - API Endpoints: All routes start with `/api/`

3. **MongoDB:**
   - Connection: mongodb://localhost:27017
   - Database: smartworld

---

## 🔑 Login & Access

### Landing Page
- Open http://localhost:3000
- You'll see two login options:

1. **Administrator Access** (Blue Card)
   - Full access to all features
   - Can manage employees, banners, alerts
   - Can refresh Excel data

2. **User Access** (Green Card)
   - Employee portal access
   - View and search employees
   - Access meeting rooms, policies, etc.

### Admin Dashboard
- After logging in as Admin, navigate to "Admin Dashboard" tab
- Password: `Sm@rtworld`
- Manage banners and employee data

---

## 📁 Project Structure

```
smartdesk/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── employee_directory.xlsx # Employee data
│   └── uploads/               # Uploaded files
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers (Auth, Theme)
│   │   ├── services/          # API services
│   │   └── index.css          # Global styles & dark mode
│   ├── public/
│   │   └── images/            # Logo and UI images
│   ├── package.json           # Node dependencies
│   └── .env                   # Environment variables
│
└── LOCAL_SETUP_GUIDE.md       # This file
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** Can't connect to MongoDB

**Solutions:**
```bash
# Check if MongoDB is running
# Windows:
tasklist | findstr mongod

# macOS/Linux:
ps aux | grep mongod

# Start MongoDB if not running (see Step 2 above)

# Test connection
mongosh mongodb://localhost:27017
```

### Backend Issues

**Problem:** ModuleNotFoundError

**Solution:**
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Problem:** Port 8001 already in use

**Solution:**
```bash
# Find process using port 8001
# Windows:
netstat -ano | findstr :8001

# macOS/Linux:
lsof -i :8001

# Kill the process or change port in backend command
uvicorn server:app --host 0.0.0.0 --port 8002 --reload
# Remember to update frontend .env with new port
```

### Frontend Issues

**Problem:** Module not found or dependency errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn cache clean
yarn install
```

**Problem:** Port 3000 already in use

**Solution:**
```bash
# Change port in frontend/.env
PORT=3001

# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

**Problem:** Can't connect to backend API

**Solution:**
1. Verify backend is running on http://localhost:8001
2. Check frontend/.env has correct REACT_APP_BACKEND_URL
3. Check browser console for CORS errors
4. Restart both frontend and backend

### Employee Data Not Loading

**Problem:** No employees showing up

**Solution:**
1. Check if `employee_directory.xlsx` exists in backend folder
2. Check backend logs for Excel loading errors
3. Verify MongoDB connection
4. Try refreshing data from Admin Dashboard

---

## 🎨 Dark Mode

The application includes a beautiful dark mode toggle:

- **Light Mode:** Blue theme with white backgrounds
- **Dark Mode:** Darker grey theme (#333333 background, #404040 containers)
- Toggle location: Top right corner (slider icon)
- Setting is saved in browser localStorage

---

## 📊 Features Overview

1. **Home Dashboard**
   - Quick access to external portals
   - New joinees showcase
   - Company announcements

2. **Employee Directory**
   - Search and filter employees
   - View employee details
   - Extension numbers and reporting managers
   - Profile image management

3. **Meeting Rooms**
   - View all meeting rooms
   - Book rooms with date/time
   - Cancel bookings
   - Filter by location and floor

4. **Policies**
   - View company policies (PDF files)
   - Download and preview policies

5. **Holiday Calendar**
   - View company holidays
   - Download holiday list

6. **Dashboard**
   - Analytics and statistics
   - Department-wise breakdown

7. **Admin Dashboard** (Admin Only)
   - Banner management
   - Employee data management
   - Refresh Excel data

---

## 🔄 Updating Employee Data

### Method 1: Excel File Update
1. Update `backend/employee_directory.xlsx` file
2. Login as Admin
3. Click the refresh button in header
4. Data will reload from Excel

### Method 2: Direct Database Update
1. Connect to MongoDB: `mongosh mongodb://localhost:27017/smartworld`
2. Update employee collection
3. Changes reflect immediately

---

## 📝 API Endpoints

All API endpoints are prefixed with `/api/`

### Main Endpoints:
- `GET /api/employees` - Get all employees
- `GET /api/meeting-rooms` - Get meeting rooms
- `GET /api/policies` - Get policies
- `GET /api/alerts` - Get alerts
- `POST /api/meeting-rooms/{id}/book` - Book a room
- `POST /api/refresh-excel` - Refresh employee data (Admin only)

**API Documentation:** http://localhost:8001/docs

---

## 💡 Tips

1. **Development Mode:**
   - Backend runs with `--reload` flag (auto-restart on code changes)
   - Frontend has hot-reload enabled

2. **Production Build:**
   ```bash
   cd frontend
   yarn build
   # Build files will be in frontend/build/
   ```

3. **Database Backup:**
   ```bash
   mongodump --db smartworld --out ./backup
   ```

4. **Database Restore:**
   ```bash
   mongorestore --db smartworld ./backup/smartworld
   ```

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review backend logs in terminal
3. Check frontend console in browser DevTools (F12)
4. Verify all prerequisites are installed correctly
5. Ensure MongoDB is running

---

## 🎉 Success!

If everything is set up correctly, you should see:
- ✅ MongoDB running
- ✅ Backend API responding at http://localhost:8001
- ✅ Frontend UI accessible at http://localhost:3000
- ✅ Employee data loaded from Excel
- ✅ All features working correctly

**Enjoy using SmartDesk!** 🚀
