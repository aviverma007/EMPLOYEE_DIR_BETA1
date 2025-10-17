# 🚀 Quick Start Guide - SmartWorld Employee Directory

## ⚡ Fast Setup (5 Minutes)

### Step 1: Start All Services
```bash
cd /app
sudo supervisorctl restart all
```

### Step 2: Wait for Services (30 seconds)
```bash
sleep 30
sudo supervisorctl status
```

All services should show **RUNNING**:
- ✅ backend (port 8001)
- ✅ frontend (port 3000)
- ✅ mongodb

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 🔑 Login Credentials

### Administrator Access
- **Username**: Admin
- **Password**: Smart@12345
- **Features**: 3 management tabs
  - Banner Management
  - Alerts Management  
  - Employee Management

### User Access
- **Username**: User (or any name)
- **Password**: (none - just click login)
- **Features**: 7 tabs
  - Home
  - Dashboard
  - Employee Directory
  - Policies
  - Meeting Rooms
  - Holiday Calendar
  - Help

## ✅ Verification

### Check Backend is Running
```bash
curl http://localhost:8001/api/stats
```

Should return:
```json
{
  "employees": 625,
  "departments": 20,
  "locations": 12,
  ...
}
```

### Check Frontend is Running
```bash
curl http://localhost:3000
```

Should return HTML content.

## 🔧 Quick Troubleshooting

### Services Not Running?
```bash
# Restart all services
sudo supervisorctl restart all

# Check logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

### Cannot Connect to Backend?
```bash
# Verify backend is listening
curl http://localhost:8001/docs

# Check if port is in use
sudo lsof -i :8001
```

### Frontend Not Loading?
```bash
# Check if frontend compiled successfully
tail -f /var/log/supervisor/frontend.out.log

# Should see: "Compiled successfully!"
```

### MongoDB Not Connected?
```bash
# Restart MongoDB
sudo supervisorctl restart mongodb

# Check MongoDB status
sudo supervisorctl status mongodb
```

## 📊 Key Features

### Admin Can:
- ✅ Manage all employees (add, edit, delete)
- ✅ Upload employee photos
- ✅ Create system alerts
- ✅ Manage homepage banners
- ✅ Export employee data to Excel

### User Can:
- ✅ View employee directory
- ✅ Search and filter employees
- ✅ Access Power BI dashboards
- ✅ Book meeting rooms
- ✅ View company policies
- ✅ Check holiday calendar
- ✅ Submit help requests

## 🎯 Common Tasks

### Add New Employee (Admin)
1. Login as Admin
2. Go to "Employee Management" tab
3. Click "Add New Employee"
4. Fill in details (ID, Name, Designation, Department are required)
5. Upload photo (optional)
6. Click "Save Employee"

### Create Alert (Admin)
1. Login as Admin
2. Go to "Alerts Management" tab
3. Click "Create New Alert"
4. Fill in Title, Message, Priority, Type
5. Select Target Audience
6. Set Expiry Date (optional)
7. Click "Create Alert"

### Book Meeting Room (User)
1. Login as User
2. Go to "Meeting Rooms" tab
3. Filter by Location/Floor if needed
4. Click "Book Room" on available room
5. Select Employee, Time, and Purpose
6. Click "Book Room"

## 📝 Important Notes

- **Data Persistence**: All changes are saved to MongoDB (not Excel)
- **Excel Import**: Employees are loaded from Excel only on server startup
- **Alerts**: Must be created via Admin panel to display
- **Photos**: Stored in `/app/backend/uploads/images/`
- **Policies**: PDF files located in `/app/company policies/`

## 🔄 Restart Services

If you make any changes, restart the appropriate service:

```bash
# After backend code changes
sudo supervisorctl restart backend

# After frontend code changes
sudo supervisorctl restart frontend

# After .env changes
sudo supervisorctl restart all
```

## 📞 Need Help?

Check the full documentation:
```bash
cat /app/README.md
```

Or check service logs:
```bash
# Backend logs
tail -f /var/log/supervisor/backend.*.log

# Frontend logs
tail -f /var/log/supervisor/frontend.*.log

# MongoDB logs
tail -f /var/log/supervisor/mongodb.*.log
```

## 🎉 You're All Set!

The application is now ready to use. Enjoy managing your employee directory! 🚀
