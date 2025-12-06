@echo off
REM Text Converter Pro - Extension Packager
REM Packages the extension as a ZIP file for distribution

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo Text Converter Pro - Extension Packager
echo ========================================
echo.

REM Set paths
set "PROJECT_DIR=%~dp0"
set "OUTPUT_DIR=%PROJECT_DIR%dist"
set "EXTENSION_NAME=text-converter-pro"

echo Validating project structure...
echo.

REM Check required files
if not exist "%PROJECT_DIR%manifest.json" (
    echo ERROR: manifest.json not found
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%background.js" (
    echo ERROR: background.js not found
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%content.js" (
    echo ERROR: content.js not found
    pause
    exit /b 1
)

echo [OK] Project structure validated
echo.

REM Create output directory
if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
    echo [OK] Created output directory
)

echo.
echo Creating ZIP package...
echo.

REM Use PowerShell to create the ZIP
powershell -NoProfile -Command "^
    $ProjectDir = '%PROJECT_DIR%'; ^
    $OutputDir = '%OUTPUT_DIR%'; ^
    $ZipPath = Join-Path $OutputDir 'text-converter-pro.zip'; ^
    if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }; ^
    $Files = @('manifest.json', 'background.js', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'options.html', 'options.js', 'options.css', 'content.css'); ^
    $StagingDir = Join-Path $OutputDir 'staging'; ^
    if (Test-Path $StagingDir) { Remove-Item $StagingDir -Recurse -Force }; ^
    New-Item -Type Directory -Path $StagingDir | Out-Null; ^
    foreach ($f in $Files) { ^
        if (Test-Path (Join-Path $ProjectDir $f)) { ^
            Copy-Item (Join-Path $ProjectDir $f) (Join-Path $StagingDir $f) -Force ^
        } ^
    }; ^
    if (Test-Path (Join-Path $ProjectDir 'icons')) { ^
        Copy-Item (Join-Path $ProjectDir 'icons') (Join-Path $StagingDir 'icons') -Recurse -Force ^
    }; ^
    [System.IO.Compression.ZipFile]::CreateFromDirectory($StagingDir, $ZipPath, 'Optimal', $true); ^
    Remove-Item $StagingDir -Recurse -Force; ^
    Write-Host ('Created: ' + (Split-Path $ZipPath -Leaf))
"

if errorlevel 1 (
    echo ERROR: Failed to create ZIP file
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Extension packaged as: text-converter-pro.zip
echo Location: %OUTPUT_DIR%
echo.
echo INSTALLATION OPTIONS:
echo.
echo [1] Development Mode (Recommended for testing)
echo     - Open chrome://extensions/
echo     - Enable "Developer mode" (top right)
echo     - Click "Load unpacked"
echo     - Select: %PROJECT_DIR%
echo.
echo [2] Submit to Chrome Web Store
echo     - Go to: https://chrome.google.com/webstore/developer/dashboard
echo     - Click "New item"
echo     - Upload the ZIP file
echo.
echo [3] Create Signed Extension (.crx)
echo     - Open chrome://extensions/
echo     - Enable "Developer mode"
echo     - Click "Pack extension"
echo     - Select extension root: %PROJECT_DIR%
echo.
echo OUTPUT LOCATION:
echo %OUTPUT_DIR%
echo.

REM Open the output folder
explorer "%OUTPUT_DIR%"

echo.
pause
