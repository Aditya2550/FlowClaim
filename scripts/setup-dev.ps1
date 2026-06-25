Write-Host "Setting up backend..."
Set-Location "$PSScriptRoot\..\backend"
npm install

Write-Host "Setting up frontend..."
Set-Location "$PSScriptRoot\..\frontend"
npm install
