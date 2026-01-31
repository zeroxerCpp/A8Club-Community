# This script must run as Administrator
$pgDataDir = "C:\Program Files\PostgreSQL\17\data"
$pgHbaFile = "$pgDataDir\pg_hba.conf"

Write-Host "Step 1: Stopping PostgreSQL service..." -ForegroundColor Yellow
Stop-Service postgresql-x64-17 -Force
Start-Sleep -Seconds 2

Write-Host "Step 2: Backing up pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $pgHbaFile "$pgHbaFile.bak" -Force

Write-Host "Step 3: Creating temporary pg_hba.conf with trust auth..." -ForegroundColor Yellow
$trustConfig = @"
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             0.0.0.0/0               trust
"@
$trustConfig | Out-File -FilePath $pgHbaFile -Encoding ASCII -Force

Write-Host "Step 4: Starting PostgreSQL service..." -ForegroundColor Yellow
Start-Service postgresql-x64-17
Start-Sleep -Seconds 5

$status = (Get-Service postgresql-x64-17).Status
if ($status -eq 'Running') {
    Write-Host "Service started successfully" -ForegroundColor Green
    
    Write-Host "Step 5: Changing password to 'admin'..." -ForegroundColor Yellow
    $psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
    & $psql -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'admin';"
    
    Write-Host "Password changed!" -ForegroundColor Green
} else {
    Write-Host "Failed to start service. Status: $status" -ForegroundColor Red
}

Write-Host "Step 6: Restoring original pg_hba.conf..." -ForegroundColor Yellow
Copy-Item "$pgHbaFile.bak" $pgHbaFile -Force

Write-Host "Step 7: Restarting service with new config..." -ForegroundColor Yellow
Restart-Service postgresql-x64-17 -Force
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Done! PostgreSQL password is now: admin" -ForegroundColor Green
Write-Host "Testing connection..." -ForegroundColor Yellow

$env:PGPASSWORD = "admin"
& $psql -U postgres -d postgres -c "SELECT version();" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Connection test SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Creating database community_cms..." -ForegroundColor Yellow
    & $psql -U postgres -c "CREATE DATABASE community_cms;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0 -or $Error[0] -match "already exists") {
        Write-Host "Database ready!" -ForegroundColor Green
    }
} else {
    Write-Host "Connection test FAILED" -ForegroundColor Red
}

Remove-Item Env:\PGPASSWORD
