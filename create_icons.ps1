# Create icon PNG files
$iconDir = 'icons'
if (!(Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir | Out-Null
}

# Base64 encoded minimal blue PNG files (1x1 pixel)
$png16Base64 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACNJREFUeNpmnGFgYGBkYGD4z8DAwMDAwMAEZGRgYGBkYGD8DwADdQECLF8WrgAAAABJRU5ErkJggg=="
$png48Base64 = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAABkF7oxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACNJREFUeNpmnGFgYGBkYGD4z8DAwMDAwMAEZGRgYGBkYGD8DwADdQECLF8WrgAAAABJRU5ErkJggg=="
$png128Base64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACIAAAD91JpzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACNJREFUeNpmnGFgYGBkYGD4z8DAwMDAwMAEZGRgYGBkYGD8DwADdQECLF8WrgAAAABJRU5ErkJggg=="

# Decode and save
[System.IO.File]::WriteAllBytes("$iconDir/icon16.png", [System.Convert]::FromBase64String($png16Base64))
[System.IO.File]::WriteAllBytes("$iconDir/icon48.png", [System.Convert]::FromBase64String($png48Base64))
[System.IO.File]::WriteAllBytes("$iconDir/icon128.png", [System.Convert]::FromBase64String($png128Base64))

Write-Host "[+] Created icon16.png"
Write-Host "[+] Created icon48.png"
Write-Host "[+] Created icon128.png"
Write-Host ""
Write-Host "Icon files created successfully!"
