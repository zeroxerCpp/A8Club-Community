# 部署指南

本指南展示如何将G8社区展示网站部署到服务器上。

## 目录

1. [环境要求](#环境要求)
2. [本地部署](#本地部署)
3. [服务器部署](#服务器部署)
4. [Nginx反向代理](#nginx反向代理)
5. [常见问题](#常见问题)

## 环境要求

### 本地开发
- Node.js >= 16
- npm >= 8
- PostgreSQL >= 12
- Docker (可选，用于容器化部署)

### 服务器
- Linux 服务器 (推荐 Ubuntu 20.04+)
- Docker 和 Docker Compose
- 至少 2GB RAM
- 10GB+ 可用磁盘空间

## 本地部署

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd G8
```

### 2. 准备环境变量

```bash
# 复制示例配置
cp .env.example .env

# 编辑 .env 文件，修改以下关键配置：
# - DB_PASSWORD: 改为强密码
# - JWT_SECRET: 改为随机字符串
# - VITE_API_URL: 改为你的 API 地址
```

### 3. 构建并启动

```bash
# 启动所有服务（自动构建 Docker 镜像）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查服务状态
docker-compose ps
```

### 4. 访问应用

- 前端: http://localhost
- 后端 API: http://localhost:3000/api
- 管理后台: http://localhost/admin

### 5. 初始化数据库

后端会自动创建必要的表结构。如果需要重置：

```bash
# 进入后端容器
docker-compose exec backend sh

# 清除数据库（谨慎操作）
# 或者直接删除 postgres 卷
docker volume rm g8_postgres_data
docker-compose restart postgres
```

## 服务器部署

### 1. 连接到服务器

```bash
ssh root@your-server-ip
```

### 2. 安装 Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 添加当前用户到 docker 组
sudo usermod -aG docker $USER
newgrp docker

# 验证安装
docker --version
docker-compose --version
```

### 3. 上传项目代码

```bash
# 本地执行
scp -r ./G8 root@your-server-ip:/opt/

# 或使用 git
ssh root@your-server-ip
cd /opt
git clone <your-repo-url> G8
cd G8
```

### 4. 配置环境变量

```bash
cd /opt/G8

# 复制并编辑环境变量
cp .env.example .env
nano .env
```

**重要配置项：**

```env
NODE_ENV=production

# 修改数据库密码
DB_PASSWORD=your-strong-password-here

# 修改 JWT 密钥（使用 openssl rand -base64 32 生成）
JWT_SECRET=your-generated-secret-key-here

# 修改前端 API 地址为你的域名或 IP
VITE_API_URL=https://api.yourdomain.com

# 如果使用域名，需要配置 Nginx
```

### 5. 启动服务

```bash
cd /opt/G8

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查状态
docker-compose ps
```

### 6. 验证部署

```bash
# 检查后端健康状态
curl http://localhost:3000/api

# 检查前端
curl http://localhost

# 查看错误日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Nginx 反向代理

如果要使用域名访问，使用 Nginx 作为反向代理：

### 1. 安装 Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### 2. 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/g8
```

**使用 HTTP（不推荐用于生产）：**

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:80;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 前端
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API
    location /api {
        proxy_pass http://backend/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 处理 WebSocket（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**使用 HTTPS（推荐）：**

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# 更新 Nginx 配置为 HTTPS
```

**HTTPS Nginx 配置：**

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:80;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 前端
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # 后端 API
    location /api {
        proxy_pass http://backend/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. 启用 Nginx 配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/g8 /etc/nginx/sites-enabled/g8

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 自动启动
sudo systemctl enable nginx
```

### 4. 更新环境变量

```bash
# 更新 .env 中的 VITE_API_URL
VITE_API_URL=https://yourdomain.com/api

# 重启前端服务
docker-compose restart frontend
```

## 常见问题

### Q: 如何更新代码？

```bash
cd /opt/G8

# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

### Q: 如何查看日志？

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# 查看最后 100 行
docker-compose logs --tail 100
```

### Q: 如何备份数据库？

```bash
# 导出数据库
docker-compose exec postgres pg_dump -U postgres g8_community > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U postgres g8_community < backup.sql
```

### Q: 如何清理旧容器和镜像？

```bash
# 停止所有容器
docker-compose down

# 删除所有未使用的资源
docker system prune -a

# 删除特定卷（谨慎操作）
docker volume rm g8_postgres_data
```

### Q: 端口被占用怎么办？

编辑 `.env` 文件修改端口：

```env
BACKEND_PORT=3001      # 改为其他端口
FRONTEND_PORT=8080
DB_PORT=5433
```

### Q: 如何增加内存限制？

在 `docker-compose.yml` 中添加 `deploy.resources.limits`：

```yaml
backend:
  deploy:
    resources:
      limits:
        memory: 1G
      reservations:
        memory: 512M
```

### Q: 性能优化建议

1. **启用 Gzip 压缩**：已在 Nginx 配置中启用
2. **设置资源缓存**：已在 Nginx 配置中配置 1 年缓存
3. **使用 CDN**：配置 CloudFlare 或其他 CDN 加速静态资源
4. **数据库优化**：
   - 定期清理日志
   - 创建必要的数据库索引
   - 定期进行 VACUUM 维护

### Q: 如何监控系统？

```bash
# 查看容器资源使用
docker stats

# 查看 Docker 磁盘使用
docker system df
```

## 支持

如有问题，请参考官方文档：
- Docker: https://docs.docker.com/
- NestJS: https://docs.nestjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
