# Run as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Please run as Administrator!" -ForegroundColor Red
    Start-Process powershell -Verb RunAs -ArgumentList "-NoExit", "-File", $PSCommandPath
    exit
}

Write-Host "=== PostgreSQL Password Reset to 'admin' ===" -ForegroundColor Cyan
Write-Host ""

$dataDir = "C:\Program Files\PostgreSQL\17\data"
$pgHbaFile = "$dataDir\pg_hba.conf"
$backupFile = "$dataDir\pg_hba.conf.backup"

# Step 1: Backup
Write-Host "[1/5] Backing up pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $pgHbaFile $backupFile -Force
Write-Host "Backup created" -ForegroundColor Green

# Step 2: Modify pg_hba.conf to trust
Write-Host "[2/5] Modifying pg_hba.conf..." -ForegroundColor Yellow
$content = Get-Content $pgHbaFile
$newContent = @()
foreach ($line in $content) {
    if ($line -match '^host\s+all\s+all\s+127\.0\.0\.1/32') {
        $newContent += 'host    all             all             127.0.0.1/32            trust'
    } elseif ($line -match '^host\s+all\s+all\s+::1/128') {
        $newContent += 'host    all             all             ::1/128                 trust'
    } else {
        $newContent += $line
    }
}
$newContent | Out-File $pgHbaFile -Encoding UTF8
Write-Host "Modified to allow trust authentication" -ForegroundColor Green

# Step 3: Restart service
Write-Host "[3/5] Restarting PostgreSQL..." -ForegroundColor Yellow
Restart-Service postgresql-x64-17 -Force
Start-Sleep -Seconds 5
Write-Host "Service restarted" -ForegroundColor Green

# Step 4: Change password
Write-Host "[4/5] Setting password to 'admin'..." -ForegroundColor Yellow
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$sqlCmd = "ALTER USER postgres WITH PASSWORD 'admin';"
& $psqlPath -U postgres -d postgres -c $sqlCmd
Write-Host "Password changed to 'admin'" -ForegroundColor Green

# Step 5: Restore pg_hba.conf
Write-Host "[5/5] Restoring original config..." -ForegroundColor Yellow
Copy-Item $backupFile $pgHbaFile -Force
Restart-Service postgresql-x64-17 -Force
Start-Sleep -Seconds 5
Write-Host "Configuration restored and service restarted" -ForegroundColor Green

Write-Host ""
Write-Host "=== SUCCESS ===" -ForegroundColor Green
Write-Host "PostgreSQL password is now: admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow

# Create database
$env:PGPASSWORD = "admin"
$createDbCmd = "CREATE DATABASE community_cms;"
$result = & $psqlPath -U postgres -d postgres -c $createDbCmd 2>&1
if ($result -match "already exists") {
    Write-Host "Database 'community_cms' already exists" -ForegroundColor Yellow
} else {
    Write-Host "Database 'community_cms' created" -ForegroundColor Green
}

Write-Host ""
Write-Host "All done! You can now start the backend:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run start:dev" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to close"
