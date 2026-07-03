#!/bin/bash
echo "========================================="
echo "  CivicLens AI - Smart City Platform"
echo "========================================="

# Install backend
echo "[1/3] Installing backend dependencies..."
cd backend
pip install -r requirements.txt -q 2>/dev/null
cd ..

# Install frontend
echo "[2/3] Installing frontend dependencies..."
cd frontend
npm install --silent 2>/dev/null
cd ..

# Start both
echo "[3/3] Starting servers..."
echo ""
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:3000"
echo ""

cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
