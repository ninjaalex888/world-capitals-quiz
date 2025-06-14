@echo off
echo Starting local development server...
start "" http://localhost:8000/index.html
python -m http.server 8000
