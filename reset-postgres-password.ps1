# PostgreSQL Password Reset Script
Write-Host "PostgreSQL Password Reset" -ForegroundColor Cyan
Write-Host ""

$pgDataPath = "C:\Program Files\PostgreSQL\17\data"
$pgHbaFile = Join-Path $pgDataPath "pg_hba.conf"

Write-Host "Step 1: Backup current pg_hba.conf" -ForegroundColor Yellow
if (Test-Path $pgHbaFile) {
    Copy-Item $pgHbaFile "$pgHbaFile.backup" -Force
    Write-Host "Backup created: $pgHbaFile.backup" -ForegroundColor Green
} else {
    Write-Host "pg_hba.conf not found at: $pgHbaFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Modify pg_hba.conf to allow trust authentication" -ForegroundColor Yellow

# Read and modify pg_hba.conf
$content = Get-Content $pgHbaFile
$newContent = $content | ForEach-Object {
    if ($_ -match '^host\s+all\s+all\s+127\.0\.0\.1/32\s+scram-sha-256') {
        'host    all             all             127.0.0.1/32            trust'
    } elseif ($_ -match '^host\s+all\s+all\s+::1/128\s+scram-sha-256') {
        'host    all             all             ::1/128                 trust'
    } else {
        $_
    }
}

$newContent | Out-File -FilePath $pgHbaFile -Encoding UTF8 -Force
Write-Host "pg_hba.conf modified" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Restart PostgreSQL service" -ForegroundColor Yellow
try {
    Restart-Service postgresql-x64-17 -Force
    Start-Sleep -Seconds 3
    Write-Host "PostgreSQL service restarted" -ForegroundColor Green
} catch {
    Write-Host "Failed to restart service. Please restart manually:" -ForegroundColor Red
    Write-Host "1. Open Services (services.msc)" -ForegroundColor White
    Write-Host "2. Find 'postgresql-x64-17'" -ForegroundColor White
    Write-Host "3. Right-click and select Restart" -ForegroundColor White
    Read-Host "Press Enter after restarting the service"
}

Write-Host ""
Write-Host "Step 4: Set new password" -ForegroundColor Yellow
$newPassword = Read-Host "Enter new password for postgres user" -AsSecureString
$newPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

$pgPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$alterCmd = "ALTER USER postgres WITH PASSWORD '$newPasswordText';"

try {
    & $pgPath -U postgres -d postgres -c $alterCmd
    Write-Host "Password updated successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error updating password: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 5: Restore original pg_hba.conf" -ForegroundColor Yellow
Copy-Item "$pgHbaFile.backup" $pgHbaFile -Force
Write-Host "Original pg_hba.conf restored" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Restart PostgreSQL service again" -ForegroundColor Yellow
Restart-Service postgresql-x64-17 -Force
Start-Sleep -Seconds 3
Write-Host "PostgreSQL service restarted" -ForegroundColor Green

Write-Host ""
Write-Host "Password reset completed!" -ForegroundColor Green
Write-Host "Your new password: $newPasswordText" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now update backend\.env file with this password" -ForegroundColor Yellow
