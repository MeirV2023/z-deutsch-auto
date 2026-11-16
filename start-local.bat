@echo off
title Z-LINGO Local Dev Server (http://localhost:8080)
echo Starting Z-LINGO local server at http://localhost:8080 ...
start "" "http://localhost:8080"
python -m http.server 8080
