# Create a minimal 128x128 PNG file
# This is a valid PNG with a single transparent pixel, stretched to 128x128

$base64PNG = @'
iVBORw0KGgoAAAANSUhEUgAAAIAAAACACIAAAD91JpzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACNJREFUeNpmnGFgYGBkYGD4z8DAwMDAwMAEZGRgYGBkYGD8DwADdQECLF8WrgAAAABJRU5ErkJggg==
'@ -replace '\s', ''

try {
    $bytes = [System.Convert]::FromBase64String($base64PNG)
    [System.IO.File]::WriteAllBytes('icons/icon128.png', $bytes)
    Write-Host "Successfully created icon128.png ($(([System.IO.FileInfo]'icons/icon128.png').Length) bytes)"
} catch {
    Write-Host "Error creating icon128.png: $_"
    # Fallback: Create minimal valid PNG hex
    $pngHex = @(
        137, 80, 78, 71, 13, 10, 26, 10,  # PNG signature
        0, 0, 0, 13,                        # IHDR chunk size
        73, 72, 68, 82,                     # IHDR
        0, 0, 0, 1, 0, 0, 0, 1,            # 1x1
        8, 2, 0, 0, 0, 144, 119, 83, 222,  # bit depth, color, CRC
        0, 0, 0, 10,                        # IDAT chunk size
        73, 68, 65, 84,                     # IDAT
        8, 29, 1, 0, 0, 255, 255, 0, 0, 0, 1, # data
        0, 0, 0, 0, 73, 69, 78, 68,        # IEND
        174, 66, 96, 130                     # CRC
    )
    [System.IO.File]::WriteAllBytes('icons/icon128.png', [byte[]]$pngHex)
    Write-Host "Created minimal valid PNG icon128.png as fallback"
}
