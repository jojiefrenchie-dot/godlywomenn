#!/bin/bash
# Start both Django backend and Next.js frontend

# Start Django backend on port 10000 in background
cd backend
gunicorn backend_project.wsgi:application --bind 0.0.0.0:10000 &
DJANGO_PID=$!

# Wait a moment for Django to start
sleep 2

# Start Next.js frontend (will use port 10000 by default, but let it handle routing)
cd ..
npm start

# Kill Django if Next.js dies
kill $DJANGO_PID
