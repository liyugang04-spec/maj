param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path
)

$envRoot = Join-Path $ProjectRoot ".dev-env"
$jdkRoot = Join-Path $envRoot "jdk-17"
$sdkRoot = Join-Path $envRoot "android-sdk"
$cmdTools = Join-Path $sdkRoot "cmdline-tools\latest\bin"
$platformTools = Join-Path $sdkRoot "platform-tools"
$emulatorTools = Join-Path $sdkRoot "emulator"

$env:JAVA_HOME = $jdkRoot
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:PATH = "$jdkRoot\bin;$cmdTools;$platformTools;$emulatorTools;$env:PATH"

Write-Host "Local Android environment loaded."
Write-Host "JAVA_HOME=$env:JAVA_HOME"
Write-Host "ANDROID_SDK_ROOT=$env:ANDROID_SDK_ROOT"
