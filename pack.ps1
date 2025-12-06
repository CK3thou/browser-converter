# Simple extension packager
Add-Type -AssemblyName System.IO.Compression.FileSystem

$ProjectDir = "c:\Users\justthatuser\Documents\GitHub\browser converter"
$OutputDir = "$ProjectDir\dist"
$ZipPath = "$OutputDir\text-converter-pro.zip"

# Remove old zip
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }

# Create staging directory
$StagingDir = "$OutputDir\temp-staging"
if (Test-Path $StagingDir) { Remove-Item $StagingDir -Recurse -Force }
New-Item -Type Directory -Path $StagingDir | Out-Null

# Files to include
$files = @(
    'manifest.json',
    'background.js',
    'content.js',
    'popup.html',
    'popup.js',
    'popup.css',
    'options.html',
    'options.js',
    'options.css',
    'content.css'
)

# Copy files
foreach ($file in $files) {
    $src = "$ProjectDir\$file"
    if (Test-Path $src) {
        Copy-Item $src "$StagingDir\$file" -Force
        Write-Host "  + $file"
    }
}

# Copy icons folder
if (Test-Path "$ProjectDir\icons") {
    Copy-Item "$ProjectDir\icons" "$StagingDir\icons" -Recurse -Force
    Write-Host "  + icons (folder)"
}

# Create zip
[System.IO.Compression.ZipFile]::CreateFromDirectory($StagingDir, $ZipPath, 'Optimal', $true)
Write-Host "`n[✓] Created: text-converter-pro.zip"
Write-Host "[✓] Location: $OutputDir`n"

# Cleanup
Remove-Item $StagingDir -Recurse -Force

# Show info
Write-Host "=== INSTALLATION OPTIONS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. DEVELOPMENT (Load unpacked)" -ForegroundColor Yellow
Write-Host "   - chrome://extensions/"
Write-Host "   - Enable Developer mode"
Write-Host "   - Load unpacked: $ProjectDir"
Write-Host ""
Write-Host "2. CHROME WEB STORE" -ForegroundColor Yellow
Write-Host "   - Dashboard: https://chrome.google.com/webstore/developer/dashboard"
Write-Host "   - Upload ZIP: $ZipPath"
Write-Host ""
Write-Host "3. SIGNED .CRX" -ForegroundColor Yellow
Write-Host "   - chrome://extensions/"
Write-Host "   - Pack extension > Select: $ProjectDir"
Write-Host ""
Write-Host "Package ready for distribution!" -ForegroundColor Green
