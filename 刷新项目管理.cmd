@echo off
setlocal
cd /d "%~dp0"
node "node_modules\tsx\dist\cli.mjs" "scripts\replica\projectInventory.ts"
if errorlevel 1 (
  echo Could not refresh the project index.
  pause
  exit /b 1
)
start "" "%~dp0PROJECTS.html"
endlocal
