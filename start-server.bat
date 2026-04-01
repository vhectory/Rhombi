@echo off
title Rhombi — Lokale Server
echo.
echo  ◆ Rhombi lokale server starten...
echo.

set PORT=8080
set URL=http://localhost:%PORT%

python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  ✓ Python gevonden
    echo  ✓ Server draait op %URL%
    echo.
    echo  Sluit dit venster om de server te stoppen.
    echo.
    start "" "%URL%"
    python -m http.server %PORT%
    goto :done
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo  ✓ Python3 gevonden
    echo  ✓ Server draait op %URL%
    echo.
    echo  Sluit dit venster om de server te stoppen.
    echo.
    start "" "%URL%"
    python3 -m http.server %PORT%
    goto :done
)

npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo  ✓ Node.js gevonden
    echo  ✓ Server draait op %URL%
    echo.
    echo  Sluit dit venster om de server te stoppen.
    echo.
    timeout /t 2 /nobreak >nul
    start "" "%URL%"
    npx serve . -p %PORT%
    goto :done
)

echo  ✗ Geen server gevonden.
echo  Installeer Python via https://www.python.org
echo.
pause

:done
