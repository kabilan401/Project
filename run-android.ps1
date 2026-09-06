# Configure session environment variables
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
$env:PATH = "$env:PATH;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:JAVA_HOME\bin"

Write-Host "Step 1: Rebuilding web application and syncing to Capacitor..." -ForegroundColor Cyan
npm run android:build

Write-Host "Step 2: Deploying to connected Android device / emulator..." -ForegroundColor Cyan
npm run android:run
