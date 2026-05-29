@echo off
chcp 65001 >nul
echo ============================================
echo   Rhombi - Sitemap maken
echo ============================================
echo.

node maak-sitemap.js

echo.
echo ============================================
echo   Klaar!
echo ============================================
echo.
echo Upload nu sitemap.xml naar je site
echo en dien hem opnieuw in via Search Console.
echo.
pause
