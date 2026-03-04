@echo off
echo.
echo  Rhombi — fotos.json bijwerken
echo  ================================
echo.

cd /d "%~dp0"
python scan_fotos.py

echo.
echo  Klaar! Je kunt dit venster sluiten.
pause
