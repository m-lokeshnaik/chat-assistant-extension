# Extension Diagnostic Script
Write-Host "`n=== CHROME EXTENSION DIAGNOSTIC ===" -ForegroundColor Cyan
Write-Host ""

# Check 1: Icons
Write-Host "1. Checking icons..." -ForegroundColor Yellow
$iconFiles = @("icon16.png", "icon32.png", "icon48.png", "icon128.png")
$allIcons = $true
foreach ($icon in $iconFiles) {
    $srcPath = "src\icons\$icon"
    $distPath = "dist\icons\$icon"
    if (Test-Path $srcPath) {
        Write-Host "   ✅ $icon exists in src" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $icon MISSING in src" -ForegroundColor Red
        $allIcons = $false
    }
    if (Test-Path $distPath) {
        Write-Host "   ✅ $icon exists in dist" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $icon MISSING in dist" -ForegroundColor Red
        $allIcons = $false
    }
}

# Check 2: Required files
Write-Host "`n2. Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "dist\manifest.json",
    "dist\background.js",
    "dist\content.js",
    "dist\sidepanel-entry.js",
    "dist\sidepanel.html",
    "dist\perplexity.js"
)
$allFiles = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $(Split-Path $file -Leaf) MISSING" -ForegroundColor Red
        $allFiles = $false
    }
}

# Check 3: Manifest
Write-Host "`n3. Checking manifest..." -ForegroundColor Yellow
if (Test-Path "dist\manifest.json") {
    $manifest = Get-Content "dist\manifest.json" | ConvertFrom-Json
    Write-Host "   ✅ Manifest version: $($manifest.manifest_version)" -ForegroundColor Green
    Write-Host "   ✅ Extension name: $($manifest.name)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Manifest not found" -ForegroundColor Red
}

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
if ($allIcons -and $allFiles) {
    Write-Host "✅ All files present - Extension should load!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Go to chrome://extensions/"
    Write-Host "2. Remove old extension (if exists)"
    Write-Host "3. Click 'Load unpacked'"
    Write-Host "4. Select: $PWD\dist"
} else {
    Write-Host "❌ Some files are missing!" -ForegroundColor Red
    if (-not $allIcons) {
        Write-Host "   → Add icon files to src/icons/ and run: npm run build" -ForegroundColor Yellow
    }
    if (-not $allFiles) {
        Write-Host "   → Run: npm run build" -ForegroundColor Yellow
    }
}

Write-Host "`n"

