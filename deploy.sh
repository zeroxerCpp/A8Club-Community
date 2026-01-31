#!/bin/bash

# G8 社区展示网站 - 部署启动脚本

set -e

echo "================================"
echo "G8 社区展示网站 - Docker 部署"
echo "================================"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 版本: $(docker --version)"
echo "✅ Docker Compose 版本: $(docker-compose --version)"

# 检查 .env 文件
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env 文件不存在，从 .env.example 创建"
    cp .env.example .env
    echo "📝 请编辑 .env 文件，设置必要的环境变量"
    echo "   特别是: DB_PASSWORD, JWT_SECRET, VITE_API_URL"
    exit 1
fi

echo "✅ .env 文件已存在"

# 启动服务
echo ""
echo "📦 启动服务中..."
docker-compose up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker-compose ps

# 检查后端健康
echo ""
echo "🔍 检查后端健康状态..."
if curl -s http://localhost:3000/api > /dev/null; then
    echo "✅ 后端服务正常"
else
    echo "⚠️  后端服务可能未就绪，请稍候再试"
fi

# 输出访问地址
echo ""
echo "================================"
echo "✅ 部署完成！"
echo "================================"
echo ""
echo "📍 访问地址:"
echo "   前端: http://localhost"
echo "   后端 API: http://localhost:3000/api"
echo "   管理后台: http://localhost/admin"
echo ""
echo "📋 常用命令:"
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart"
echo "   更新代码: git pull && docker-compose up -d --build"
echo ""
