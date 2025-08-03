#!/bin/bash

set -e

# Invoice Factory Setup Script

echo "=== Invoice Factory Setup ==="

echo "Checking Go installation..."
go version || { echo "Go not found. Please install Go from https://go.dev/dl/ and rerun this script."; exit 1; }

echo "\n--- Backend Setup ---"
cd backend

go mod tidy
nohup go run main.go &
BACKEND_PID=$!
echo "Backend started (PID $BACKEND_PID) on http://localhost:8080"

cd ../frontend

echo "\n--- Frontend Setup ---"
npm install
nohup npm start &
FRONTEND_PID=$!
echo "Frontend started (PID $FRONTEND_PID) on http://localhost:3000"

cd ..

echo "\n--- Docker Compose Option ---"
echo "To run both services in Docker, use:"
echo "  docker-compose up --build"

echo "\n--- Done! ---"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
