@echo off
echo =========================================
echo   CivicLens AI - Smart City Platform
echo =========================================
echo.

echo [1/3] Installing backend dependencies...
cd backend
pip install -r requirements.txt -q 2>nul
cd ..

echo [2/3] Installing frontend dependencies...
cd frontend
call npm install --silent 2>nul
cd ..

echo [3/3] Starting servers...
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.

start "CivicLens Backend" cmd /c "cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
cd frontend && npm run dev
