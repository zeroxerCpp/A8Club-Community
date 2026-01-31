@echo off
REM G8 社区展示网站 - Docker 部署启动脚本 (Windows)

setlocal enabledelayedexpansion

echo ================================
echo G8 社区展示网站 - Docker 部署
echo ================================
echo.

REM 检查 Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

REM 检查 Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do echo ✅ %%i
for /f "tokens=*" %%i in ('docker-compose --version') do echo ✅ %%i

REM 检查 .env 文件
if not exist ".env" (
    echo.
    echo ⚠️  .env 文件不存在，从 .env.example 创建
    copy .env.example .env
    echo 📝 请编辑 .env 文件，设置必要的环境变量
    echo    特别是: DB_PASSWORD, JWT_SECRET, VITE_API_URL
    pause
    exit /b 1
)

echo ✅ .env 文件已存在

REM 启动服务
echo.
echo 📦 启动服务中...
docker-compose up -d

REM 等待服务启动
echo.
echo ⏳ 等待服务启动（约10秒）...
timeout /t 10 /nobreak

REM 检查服务状态
echo.
echo 📊 服务状态:
docker-compose ps

REM 检查后端健康
echo.
echo 🔍 检查后端健康状态...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api' -UseBasicParsing -ErrorAction Stop; Write-Host '✅ 后端服务正常' } catch { Write-Host '⚠️  后端服务可能未就绪，请稍候再试' }"

REM 输出访问地址
echo.
echo ================================
echo ✅ 部署完成！
echo ================================
echo.
echo 📍 访问地址:
echo    前端: http://localhost
echo    后端 API: http://localhost:3000/api
echo    管理后台: http://localhost/admin
echo.
echo 📋 常用命令:
echo    查看日志: docker-compose logs -f
echo    停止服务: docker-compose down
echo    重启服务: docker-compose restart
echo    更新代码: git pull 然后 docker-compose up -d --build
echo.
pause
