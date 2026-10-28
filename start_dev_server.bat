@echo off
echo Starting local server at http://localhost:8000 (press Ctrl+C to stop)...
start "" http://localhost:8000/index.html
py -m http.server 8000 || python -m http.server 8000
