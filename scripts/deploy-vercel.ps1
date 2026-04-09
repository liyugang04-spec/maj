param(
    [switch]$Prod
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $projectRoot

if (-not (Test-Path ".\node_modules")) {
    throw "node_modules 不存在，请先运行 npm install。"
}

if (-not $env:VERCEL_TOKEN) {
    throw "缺少 VERCEL_TOKEN。请先在当前终端执行: `$env:VERCEL_TOKEN='你的_token'"
}

if (-not (Test-Path ".\.vercel\project.json")) {
    throw "当前目录还没有绑定 Vercel 项目。先执行一次: npx vercel link --token `$env:VERCEL_TOKEN"
}

Write-Host "Building project..."
npm run build

$deployArgs = @("vercel", "--token", $env:VERCEL_TOKEN)

if ($Prod) {
    $deployArgs += @("--prod", "--yes")
} else {
    $deployArgs += @("--yes")
}

Write-Host "Deploying with Vercel CLI..."
npx @deployArgs
