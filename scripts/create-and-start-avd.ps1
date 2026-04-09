param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path,
    [string]$AvdName = "majiang_api34"
)

$ErrorActionPreference = "Stop"

. "$PSScriptRoot\use-local-android-env.ps1" -ProjectRoot $ProjectRoot

$sdkRoot = $env:ANDROID_SDK_ROOT
$image = "system-images;android-34;google_apis;x86_64"

$existing = & avdmanager.bat list avd | Select-String -Pattern "Name: $AvdName" -SimpleMatch
if (-not $existing) {
    Write-Host "Creating AVD: $AvdName"
    cmd /c "echo no" | & avdmanager.bat create avd -n $AvdName -k $image -d pixel
}

Write-Host "Starting emulator: $AvdName"
Start-Process -FilePath (Join-Path $sdkRoot "emulator\emulator.exe") -ArgumentList "-avd $AvdName"

Write-Host "Waiting for device..."
& adb wait-for-device
& adb shell settings put global window_animation_scale 0
& adb shell settings put global transition_animation_scale 0
& adb shell settings put global animator_duration_scale 0

Write-Host "Emulator is ready."
