param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

$envRoot = Join-Path $ProjectRoot ".dev-env"
$downloadsDir = Join-Path $envRoot "downloads"
$jdkDir = Join-Path $envRoot "jdk-17"
$sdkDir = Join-Path $envRoot "android-sdk"
$cmdToolsDir = Join-Path $sdkDir "cmdline-tools"
$localProps = Join-Path $ProjectRoot "local.properties"

New-Item -ItemType Directory -Force -Path $envRoot, $downloadsDir, $sdkDir, $cmdToolsDir | Out-Null
Write-Host "[1/5] Local folders ready: $envRoot"

# JDK 17 (Temurin) portable zip for Windows x64
$jdkZip = Join-Path $downloadsDir "jdk17.zip"
$jdkUrl = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"
if (-not (Test-Path $jdkDir)) {
    New-Item -ItemType Directory -Force -Path $jdkDir | Out-Null
}

if (-not (Test-Path (Join-Path $jdkDir "bin\java.exe"))) {
    Write-Host "[2/5] Downloading JDK 17..."
    Invoke-WebRequest -Uri $jdkUrl -OutFile $jdkZip
    $jdkTmp = Join-Path $downloadsDir "jdk-tmp"
    if (Test-Path $jdkTmp) { Remove-Item -Recurse -Force $jdkTmp }
    Expand-Archive -Path $jdkZip -DestinationPath $jdkTmp -Force
    $extracted = Get-ChildItem $jdkTmp -Directory | Select-Object -First 1
    Copy-Item -Path (Join-Path $extracted.FullName "*") -Destination $jdkDir -Recurse -Force
} else {
    Write-Host "[2/5] JDK 17 already exists, skipping download."
}

# Android commandline-tools (latest)
$cliZip = Join-Path $downloadsDir "cmdline-tools.zip"
$cliUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$latestDir = Join-Path $cmdToolsDir "latest"
if (-not (Test-Path (Join-Path $latestDir "bin\sdkmanager.bat"))) {
    Write-Host "[3/5] Downloading Android command line tools..."
    Invoke-WebRequest -Uri $cliUrl -OutFile $cliZip
    $cliTmp = Join-Path $downloadsDir "cli-tmp"
    if (Test-Path $cliTmp) { Remove-Item -Recurse -Force $cliTmp }
    Expand-Archive -Path $cliZip -DestinationPath $cliTmp -Force
    if (Test-Path $latestDir) { Remove-Item -Recurse -Force $latestDir }
    New-Item -ItemType Directory -Force -Path $latestDir | Out-Null
    Copy-Item -Path (Join-Path $cliTmp "cmdline-tools\*") -Destination $latestDir -Recurse -Force
} else {
    Write-Host "[3/5] Android command line tools already exist, skipping download."
}

$env:JAVA_HOME = $jdkDir
$env:ANDROID_HOME = $sdkDir
$env:ANDROID_SDK_ROOT = $sdkDir
$env:PATH = "$jdkDir\bin;$latestDir\bin;$sdkDir\platform-tools;$sdkDir\emulator;$env:PATH"
Write-Host "[4/5] Installing Android SDK packages. This can take several minutes."
Write-Host "       Target SDK root: $sdkDir"

& sdkmanager.bat --sdk_root=$sdkDir `
    "platform-tools" `
    "platforms;android-34" `
    "build-tools;34.0.0" `
    "emulator" `
    "system-images;android-34;google_apis;x86_64"

Write-Host "[5/5] Accepting Android SDK licenses..."
cmd /c "(for /l %i in (1,1,50) do @echo y) | ""$latestDir\bin\sdkmanager.bat"" --sdk_root=""$sdkDir"" --licenses"

"sdk.dir=$($sdkDir -replace '\\','\\')" | Set-Content -Path $localProps -Encoding ascii

Write-Host "Local toolchain ready."
Write-Host "Project local.properties generated: $localProps"
