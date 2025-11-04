# 🚀 SmartDesk Application - Complete Setup Guide

## 📋 Prerequisites (Install These First)

### 1. Install Python 3.8+
- **Windows:** Download from [python.org](https://www.python.org/downloads/)
  - ✅ Check "Add Python to PATH" during installation
- **Verify:** Open Command Prompt and type: `python --version`

### 2. Install Node.js 16+
- **Windows:** Download from [nodejs.org](https://nodejs.org/)
  - Choose LTS (Long Term Support) version
- **Verify:** Open Command Prompt and type: `node --version`

### 3. Install MongoDB
- **Windows:** Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
  - ✅ Select "Install MongoDB as a Service"
  - ✅ Select "Install MongoDB Compass" (GUI tool)
- **Verify:** MongoDB should start automatically as a service

---

## 🎯 Step-by-Step Setup Instructions

### STEP 1: Download Your Application

```bash
# Option A: If using GitHub
git clone <your-repository-url>
cd <repository-name>

# Option B: If you downloaded as ZIP
# Extract the ZIP file to a folder like:
# D:\SMARTDESK APPLICATION FILES\smartdesk 3\
```

---

### STEP 2: Configure Environment Files

#### A. Update Backend Configuration

Navigate to `backend` folder and create/edit `.env` file:

**File: `backend/.env`**
```env
MONGO_URL=mongodb://localhost:27017/smartworld
EMERGENT_LLM_KEY=sk-emergent-f24028e592424E9A37
```

#### B. Update Frontend Configuration

Navigate to `frontend` folder and create/edit `.env` file:

**File: `frontend/.env`**
```env
PORT=3000
REACT_APP_BACKEND_URL=http://localhost:8001
```

⚠️ **IMPORTANT:** Change the backend URL from the current value to `http://localhost:8001`

---

### STEP 3: Start MongoDB

**Method 1: As Windows Service (Recommended)**

Open **PowerShell as Administrator** (Right-click → Run as Administrator):

```powershell
net start MongoDB
```

**Method 2: Manual Start (If service method fails)**

```bash
# Navigate to MongoDB bin folder
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB (keep this window open)
mongod --dbpath="C:\data\db"
```

**Verify MongoDB is Running:**
```bash
# Open MongoDB Compass (GUI application)
# Connect to: mongodb://localhost:27017
# You should see "Connected" status
```

---

### STEP 4: Setup and Start Backend

Open **Command Prompt** or **PowerShell** (doesn't need to be Administrator):

```bash
# Navigate to your project folder
cd "D:\SMARTDESK APPLICATION FILES\smartdesk 3\backend"

# Create virtual environment
python -m venv venv

# Activate virtual environment
# For Windows Command Prompt:
venv\Scripts\activate.bat

# For Windows PowerShell:
venv\Scripts\Activate.ps1

# Install required packages
pip install -r requirements.txt

# Start the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**✅ Success Indicators:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
Connected to MongoDB: mongodb://localhost:27017/smartworld
Loading employee data from: /path/to/employee_directory.xlsx
Successfully loaded 670 employees from Excel
Initialized 15 meeting rooms
Data initialization completed
```

**🌐 Test Backend:**
- Open browser: http://localhost:8001/docs
- You should see FastAPI Swagger documentation

---

### STEP 5: Setup and Start Frontend

Open a **NEW** Command Prompt or PowerShell window (keep backend running):

```bash
# Navigate to frontend folder
cd "D:\SMARTDESK APPLICATION FILES\smartdesk 3\frontend"

# Install dependencies (only needed first time)
npm install

# Start the frontend
npm start
```

**✅ Success Indicators:**
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

**Browser will automatically open to:** http://localhost:3000

---

## 🎉 Access Your Application

### Main Application
- **URL:** http://localhost:3000
- **Login Options:**
  - **Administrator Access** - Full admin features
  - **User Access** - Standard user features

### Backend API (for testing)
- **API Documentation:** http://localhost:8001/docs
- **Direct API:** http://localhost:8001/api/employees

### Database Management
- **MongoDB Compass:** Connect to `mongodb://localhost:27017`
- **Database Name:** `smartworld`

---

## ✅ Verify Everything Works

### 1. Check Backend
```bash
# In a new terminal, test the API
curl http://localhost:8001/api/employees
```
Should return JSON with 670 employees

### 2. Check Frontend
- Open http://localhost:3000
- Click "Administrator Access"
- Navigate to "Employee Directory"
- You should see 670 employees loaded

### 3. Check Database
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- Select database `smartworld`
- Check `employees` collection - should have 670 documents

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "MongoDB Connection Failed"

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If connection fails, start MongoDB manually:
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --dbpath="C:\data\db"
```

### Issue 2: "Port 8001 Already in Use"

**Solution:**
```bash
# Windows - Find and kill process on port 8001
netstat -ano | findstr :8001
taskkill /PID <process_id> /F
```

### Issue 3: "Port 3000 Already in Use"

**Solution:**
- React will ask if you want to use a different port
- Type `Y` and it will use port 3001 instead
- Update your browser URL accordingly

### Issue 4: "Module Not Found" Errors

**Backend Solution:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
```

**Frontend Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "Cannot GET /api/employees" or 404 Errors

**Solution:**
- Check `frontend/.env` has: `REACT_APP_BACKEND_URL=http://localhost:8001`
- Restart frontend: `npm start`
- Clear browser cache (Ctrl + Shift + Delete)

### Issue 6: "Access Denied" When Starting MongoDB

**Solution:**
- Right-click on PowerShell
- Select "Run as Administrator"
- Try `net start MongoDB` again

---

## 🔄 Daily Startup Routine

Once everything is set up, use this simple routine:

### Terminal 1: Start Backend
```bash
cd "D:\SMARTDESK APPLICATION FILES\smartdesk 3\backend"
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Terminal 2: Start Frontend
```bash
cd "D:\SMARTDESK APPLICATION FILES\smartdesk 3\frontend"
npm start
```

### MongoDB
- Should start automatically as Windows service
- If not: Open PowerShell as Admin → `net start MongoDB`

---

## 📊 Application Features

Once running, you can access:

✅ **Employee Directory** - 670 employees with full details
✅ **Extension & Reporting Manager** - Visible and editable
✅ **Meeting Rooms** - 15 rooms available for booking
✅ **Holiday Calendar** - 2025 company holidays
✅ **Hierarchy Builder** - Organizational structure
✅ **Work Management** - Tasks and workflows
✅ **Knowledge Base** - Company policies and documents
✅ **Attendance System** - Track employee attendance
✅ **Help & Support** - Support ticket system
✅ **Alerts** - System notifications

---

## 💾 Data Files Location

- **Excel File:** `backend/employee_directory.xlsx` or `frontend/public/employee_directory.xlsx`
- **Employee Images:** `backend/uploads/images/`
- **Database:** MongoDB (`smartworld` database)

---

## 🛑 How to Stop the Application

1. **Stop Frontend:** Press `Ctrl + C` in the frontend terminal
2. **Stop Backend:** Press `Ctrl + C` in the backend terminal
3. **Stop MongoDB (Optional):** 
   ```bash
   # PowerShell as Admin
   net stop MongoDB
   ```

---

## 📞 Need Help?

If you encounter any issues:

1. Check the terminal outputs for error messages
2. Verify all prerequisites are installed correctly
3. Ensure MongoDB is running before starting backend
4. Make sure ports 3000 and 8001 are not in use
5. Review `.env` files for correct configuration

**Success indicators to look for:**
- Backend: "Application startup complete" + "Successfully loaded 670 employees"
- Frontend: "Compiled successfully!"
- Browser: Landing page with two login buttons visible

---

## 🎯 Quick Reference

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:8001 | 8001 |
| API Docs | http://localhost:8001/docs | 8001 |
| MongoDB | mongodb://localhost:27017 | 27017 |

| Terminal | Command | Purpose |
|----------|---------|---------|
| Backend | `uvicorn server:app --host 0.0.0.0 --port 8001 --reload` | Start backend |
| Frontend | `npm start` | Start frontend |
| MongoDB | `net start MongoDB` | Start database |

---

**🎉 You're all set! Open http://localhost:3000 and start using your application!**
