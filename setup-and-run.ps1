# ===========================================================
#  JJK Merkez — Kurulum tamamlama + çalıştırma
#  Bilgisayarı YENİDEN BAŞLATTIKTAN sonra bu dosyaya sağ tıklayıp
#  "Run with PowerShell" de (ya da PowerShell'de çalıştır).
# ===========================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Güncel PATH'i çek (yeni kurulan node/rust için)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "==> Araçlar kontrol ediliyor..." -ForegroundColor Cyan
Write-Host ("node : " + (node --version))
Write-Host ("rustc: " + (rustc --version))

# C++ Build Tools kurulu mu? (cl.exe veya VS BuildTools klasörü)
$vsPath = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools"
if (-not (Test-Path $vsPath)) {
    Write-Host "==> Visual Studio C++ Build Tools kuruluyor (büyük indirme, sabırlı ol)..." -ForegroundColor Yellow
    Write-Host "    UAC penceresi çıkarsa EVET de." -ForegroundColor Yellow
    winget install -e --id Microsoft.VisualStudio.2022.BuildTools `
        --accept-source-agreements --accept-package-agreements `
        --override "--quiet --wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
} else {
    Write-Host "==> C++ Build Tools zaten kurulu." -ForegroundColor Green
}

Write-Host "==> Uygulama derleniyor ve açılıyor (ilk derleme 5-10 dk sürebilir)..." -ForegroundColor Cyan
npm run tauri dev
