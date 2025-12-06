# Text Converter Pro - Chrome Extension Packager
# This script packages the extension into a distributable format

param(
    [string]$ProjectPath = (Get-Location),
    [string]$OutputPath = "$ProjectPath\dist",
    [string]$PrivateKeyPath = $null
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Text Converter Pro - Extension Packager" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Validate project structure
$requiredFiles = @("manifest.json", "background.js", "content.js", "popup.html", "options.html")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    $path = Join-Path $ProjectPath $file
    if (-not (Test-Path $path)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "ERROR: Missing required files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✓ Project structure validated" -ForegroundColor Green

# Create output directory
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath | Out-Null
    Write-Host "✓ Created output directory: $OutputPath" -ForegroundColor Green
} else {
    Write-Host "✓ Output directory exists: $OutputPath" -ForegroundColor Green
}

# Create ZIP package
$zipFileName = "text-converter-pro.zip"
$zipPath = Join-Path $OutputPath $zipFileName

Write-Host "`nCreating ZIP package..." -ForegroundColor Cyan

# Remove existing zip if it exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Create zip with all extension files
Add-Type -AssemblyName System.IO.Compression.FileSystem

$filesToInclude = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.js",
    "popup.css",
    "options.html",
    "options.js",
    "options.css",
    "content.css",
    "icons"
)

# Create temporary staging directory
$stagingPath = Join-Path $OutputPath "staging"
if (Test-Path $stagingPath) {
    Remove-Item $stagingPath -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingPath | Out-Null

# Copy files
foreach ($item in $filesToInclude) {
    $sourcePath = Join-Path $ProjectPath $item
    $destPath = Join-Path $stagingPath $item
    
    if (Test-Path $sourcePath) {
        if ((Get-Item $sourcePath).PSIsContainer) {
            Copy-Item $sourcePath $destPath -Recurse -Force
        } else {
            Copy-Item $sourcePath $destPath -Force
        }
        Write-Host "  ✓ Included: $item" -ForegroundColor Green
    }
}

# Create ZIP from staging
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingPath, $zipPath, 'Optimal', $true)
Write-Host "`n✓ Created ZIP package: $zipPath" -ForegroundColor Green

# Clean up staging
Remove-Item $stagingPath -Recurse -Force

# Get manifest info
$manifest = Get-Content (Join-Path $ProjectPath "manifest.json") | ConvertFrom-Json
$extName = $manifest.name
$extVersion = $manifest.version

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "EXTENSION PACKAGED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Extension Details:" -ForegroundColor Cyan
Write-Host "  Name: $extName"
Write-Host "  Version: $extVersion"
Write-Host "  ZIP File: $zipFileName"
Write-Host "  Output: $OutputPath`n"

Write-Host "INSTALLATION OPTIONS:" -ForegroundColor Yellow

Write-Host "`n1. Development (Unpacked Extension)" -ForegroundColor Yellow
Write-Host "   • Open: chrome://extensions/"
Write-Host "   • Enable Developer mode (toggle, top-right)"
Write-Host "   • Click 'Load unpacked'"
Write-Host "   • Select: $ProjectPath"
Write-Host "   • Best for: Testing and development"

Write-Host "`n2. Chrome Web Store Submission" -ForegroundColor Yellow
Write-Host "   • URL: https://chrome.google.com/webstore/developer/dashboard"
Write-Host "   • Click 'New item'"
Write-Host "   • Upload ZIP: $zipPath"
Write-Host "   • Best for: Official distribution"

Write-Host "`n3. Create Signed .crx (Manual)" -ForegroundColor Yellow
Write-Host "   • Open: chrome://extensions/"
Write-Host "   • Enable Developer mode"
Write-Host "   • Click 'Pack extension'"
Write-Host "   • Extension root: $ProjectPath"
Write-Host "   • Private key: (leave blank first time)"
Write-Host "   • Best for: Self-signed distribution"

Write-Host "`n4. Direct Installation from ZIP" -ForegroundColor Yellow
Write-Host "   • Rename $zipFileName to: $($extName -replace '\s', '-').crx"
Write-Host "   • Or extract ZIP to folder and use 'Load unpacked'"
Write-Host "   • Best for: Team distribution"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Test in development mode"
Write-Host "2. Verify all features work:"
Write-Host "   - Text highlighting on webpages"
Write-Host "   - Timezone conversions"
Write-Host "   - Currency conversions with forexrateapi.com"
Write-Host "3. Check Chrome console for any errors"
Write-Host "4. Submit to Chrome Web Store or distribute ZIP`n"

# Open output directory in Explorer
Write-Host "Opening output directory..." -ForegroundColor Cyan
Invoke-Item $OutputPath

Write-Host "✓ Complete! Package ready for distribution.`n" -ForegroundColor Green
