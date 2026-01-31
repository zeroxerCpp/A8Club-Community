# PostgreSQL Setup Script
Write-Host "PostgreSQL Database Setup" -ForegroundColor Cyan
Write-Host ""

$pgPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $pgPath)) {
    Write-Host "PostgreSQL not found at default path" -ForegroundColor Red
    exit 1
}

Write-Host "Found PostgreSQL: $pgPath" -ForegroundColor Green
Write-Host ""

Write-Host "Enter database configuration (press Enter for defaults):" -ForegroundColor Yellow
Write-Host ""

$dbHost = Read-Host "Database host [localhost]"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "Database port [5432]"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }

$dbUser = Read-Host "Database username [postgres]"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "Database password" -AsSecureString
$dbPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

$dbName = Read-Host "Database name [community_cms]"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "community_cms" }

Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow

$env:PGPASSWORD = $dbPasswordText

try {
    $createDbCmd = "CREATE DATABASE $dbName;"
    $result = & $pgPath -h $dbHost -p $dbPort -U $dbUser -d postgres -c $createDbCmd 2>&1
    
    if ($LASTEXITCODE -eq 0 -or $result -match 'already exists') {
        Write-Host "Database created successfully or already exists" -ForegroundColor Green
    } else {
        Write-Host "Database creation failed: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

$envContent = @"
# Database config
DB_HOST=$dbHost
DB_PORT=$dbPort
DB_USERNAME=$dbUser
DB_PASSWORD=$dbPasswordText
DB_NAME=$dbName

# JWT config
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=7d

# Server config
PORT=3000
NODE_ENV=development

# CORS config
CORS_ORIGIN=http://localhost:5173
"@

$envPath = Join-Path $PSScriptRoot "backend\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host ""
Write-Host "Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Config saved to: backend\.env" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd backend" -ForegroundColor White
Write-Host "2. npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
