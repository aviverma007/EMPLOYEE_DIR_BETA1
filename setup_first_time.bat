@echo off
echo ========================================
echo SmartDesk Application - First Time Setup
echo ========================================
echo.
echo This script will:
echo 1. Create Python virtual environment
echo 2. Install backend dependencies
echo 3. Install frontend dependencies
echo.
echo This may take 5-10 minutes...
echo ========================================
echo.

pause

echo.
echo [1/4] Setting up Backend...
echo ----------------------------------------
cd backend

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo Backend setup complete!
echo.

cd ..

echo.
echo [2/4] Setting up Frontend...
echo ----------------------------------------
cd frontend

echo Installing frontend dependencies (this may take a few minutes)...
call npm install

echo.
echo Frontend setup complete!
echo.

cd ..

echo.
echo [3/4] Checking MongoDB...
echo ----------------------------------------
echo Attempting to start MongoDB service...
net start MongoDB 2>nul
if errorlevel 1 (
    echo.
    echo WARNING: Could not start MongoDB automatically
    echo Please start MongoDB manually:
    echo   1. Open PowerShell as Administrator
    echo   2. Run: net start MongoDB
    echo.
    echo Or start MongoDB manually from:
    echo   C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe --dbpath="C:\data\db"
    echo.
) else (
    echo MongoDB started successfully!
)

echo.
echo [4/4] Configuration Check...
echo ----------------------------------------
echo Checking configuration files...

if exist "backend\.env" (
    echo ✓ Backend .env file found
) else (
    echo × Backend .env file not found - creating default...
    (
        echo MONGO_URL=mongodb://localhost:27017/smartworld
        echo EMERGENT_LLM_KEY=sk-emergent-f24028e592424E9A37
    ) > backend\.env
    echo ✓ Created backend\.env
)

if exist "frontend\.env" (
    echo ✓ Frontend .env file found
    echo.
    echo IMPORTANT: Make sure frontend\.env contains:
    echo   REACT_APP_BACKEND_URL=http://localhost:8001
    echo.
) else (
    echo × Frontend .env file not found - creating default...
    (
        echo PORT=3000
        echo REACT_APP_BACKEND_URL=http://localhost:8001
    ) > frontend\.env
    echo ✓ Created frontend\.env
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Double-click 'start_backend.bat' to start backend
echo 3. Double-click 'start_frontend.bat' to start frontend
echo 4. Open browser to http://localhost:3000
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo ========================================
echo.

pause
