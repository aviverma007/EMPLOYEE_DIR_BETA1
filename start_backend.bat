@echo off
echo ========================================
echo Starting SmartDesk Backend Server
echo ========================================
echo.

cd backend

echo Activating Python virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting backend server on port 8001...
echo Backend API will be available at: http://localhost:8001
echo API Documentation will be available at: http://localhost:8001/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

uvicorn server:app --host 0.0.0.0 --port 8001 --reload

pause
