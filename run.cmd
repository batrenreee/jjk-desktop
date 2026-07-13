@echo off
chcp 65001 >nul
echo ============================================
echo   JJK Merkez - kurulum ve calistirma
echo ============================================
echo.
echo Bu pencere ACIK kalacak. Hata olursa burada gorunur.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0setup-and-run.ps1"
