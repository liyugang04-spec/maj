$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $projectRoot

if (-not $env:VERCEL_TOKEN) {
    throw "缺少 VERCEL_TOKEN。请先在当前终端执行: `$env:VERCEL_TOKEN='你的_token'"
}

Write-Host "Linking local folder to a Vercel project..."
npx vercel link --token $env:VERCEL_TOKEN
