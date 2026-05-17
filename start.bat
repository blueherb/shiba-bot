@echo off
cd /d "%~dp0"

echo [1/3] npm install...
call npm install
if %errorlevel% neq 0 (echo npm install FAILED & pause & exit /b)

echo [2/3] deploying slash commands...
call node deploy-commands.js
if %errorlevel% neq 0 (echo deploy FAILED & pause & exit /b)

echo [3/3] starting bot...
call node index.js
pause
