# 🚀 SmartDesk Application - Quick Start

## ⚡ Super Quick Start (3 Steps)

### First Time Only:
1. **Install Prerequisites:**
   - Python 3.8+ from [python.org](https://python.org)
   - Node.js 16+ from [nodejs.org](https://nodejs.org)
   - MongoDB from [mongodb.com](https://mongodb.com/try/download/community)

2. **Run Setup:**
   ```bash
   # Double-click this file:
   setup_first_time.bat
   ```
   Wait 5-10 minutes for installation to complete.

3. **Update Frontend Configuration:**
   - Open `frontend/.env`
   - Change line 2 to: `REACT_APP_BACKEND_URL=http://localhost:8001`
   - Save the file

---

## 🎯 Daily Usage (2 Steps)

### Step 1: Start Backend
```bash
# Double-click:
start_backend.bat

# Wait for: "Application startup complete" message
```

### Step 2: Start Frontend  
```bash
# Double-click:
start_frontend.bat

# Browser will open automatically to http://localhost:3000
```

---

## 🌐 Access URLs

| What | Where | Port |
|------|-------|------|
| **Main App** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:8001 | 8001 |
| **API Docs** | http://localhost:8001/docs | 8001 |

---

## ⚠️ Troubleshooting

### MongoDB Won't Start
```bash
# Open PowerShell as Administrator (Right-click → Run as Administrator)
net start MongoDB
```

### Backend Shows "Connection Error"
- Make sure MongoDB is running first
- Check `backend/.env` has: `MONGO_URL=mongodb://localhost:27017/smartworld`

### Frontend Shows "Network Error"
- Make sure backend is running first
- Check `frontend/.env` has: `REACT_APP_BACKEND_URL=http://localhost:8001`

### Port Already in Use
```bash
# Kill process on port 8001 (backend)
netstat -ano | findstr :8001
taskkill /PID <number> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

---

## 📚 Full Documentation

For detailed setup instructions, troubleshooting, and features:
**Read:** `SETUP_GUIDE.md`

---

## 🎉 What This App Does

✅ **Employee Directory** - 670 employees with full details
✅ **Meeting Room Booking** - 15 rooms across multiple locations
✅ **Hierarchy Builder** - Organizational structure visualization
✅ **Holiday Calendar** - Company holidays for 2025
✅ **Task Management** - Assign and track work
✅ **Knowledge Base** - Company policies and documents
✅ **Attendance System** - Employee attendance tracking
✅ **Help Desk** - Support ticket management

---

## 📁 Project Structure

```
smartdesk/
├── backend/              # FastAPI Backend
│   ├── server.py        # Main backend file
│   ├── .env             # Backend configuration
│   └── requirements.txt # Python dependencies
├── frontend/            # React Frontend
│   ├── src/            # Source code
│   ├── .env            # Frontend configuration
│   └── package.json    # Node dependencies
├── SETUP_GUIDE.md      # Detailed setup guide
├── setup_first_time.bat # First-time setup script
├── start_backend.bat   # Backend startup script
└── start_frontend.bat  # Frontend startup script
```

---

## 🆘 Quick Help

**Application won't start?**
1. Check MongoDB is running
2. Check backend terminal for errors
3. Check frontend terminal for errors
4. Read `SETUP_GUIDE.md` for detailed help

**Need to reset everything?**
1. Stop backend and frontend (Ctrl+C)
2. Delete `backend/venv` folder
3. Delete `frontend/node_modules` folder
4. Run `setup_first_time.bat` again

---

## 🎯 Success Checklist

- [ ] MongoDB installed and running
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Ran `setup_first_time.bat` successfully
- [ ] Updated `frontend/.env` with correct backend URL
- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can see employee directory with 670 employees

---

**🎉 Enjoy your SmartDesk Application!**
