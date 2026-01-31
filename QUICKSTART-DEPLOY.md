# 快速部署参考

## 快速启动（本地 Docker）

### 第一次部署

```bash
# 1. 复制环境配置
cp .env.example .env

# 2. 编辑 .env (重要！)
# 修改 DB_PASSWORD, JWT_SECRET 等

# 3. 启动所有服务
docker-compose up -d

# 4. 访问应用
# 前端: http://localhost
# 后端: http://localhost:3000/api
# 管理后台: http://localhost/admin
```

### 日常使用

```bash
# 查看日志
docker-compose logs -f

# 查看指定服务日志
docker-compose logs -f backend

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新代码后重新构建
docker-compose up -d --build
```

## 服务器部署（Linux）

### 1. 连接服务器
```bash
ssh root@your-server-ip
```

### 2. 安装 Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 3. 克隆项目
```bash
cd /opt
git clone <your-repo-url> G8
cd G8
```

### 4. 配置环境
```bash
cp .env.example .env
nano .env

# 必改项：
# DB_PASSWORD=strong-password
# JWT_SECRET=your-secret-key
# VITE_API_URL=https://yourdomain.com
```

### 5. 启动服务
```bash
docker-compose up -d
docker-compose logs -f
```

### 6. 配置 Nginx (可选，推荐用于生产)

```bash
# 安装 Nginx
sudo apt-get install nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/g8

# 复制下方的 Nginx 配置

# 启用配置
sudo ln -s /etc/nginx/sites-available/g8 /etc/nginx/sites-enabled/g8
sudo nginx -t
sudo systemctl restart nginx
```

**Nginx 配置示例：**

```nginx
upstream backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    # HTTP 重定向到 HTTPS (生产环境)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert;
    ssl_certificate_key /path/to/key;

    # 前端
    location / {
        proxy_pass http://localhost;
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
    }
}
```

### 7. 获取 SSL 证书 (推荐)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

## 常见问题速查

| 问题 | 解决方案 |
|------|--------|
| 端口被占用 | 修改 `.env` 中的 `BACKEND_PORT`, `FRONTEND_PORT` |
| 无法连接数据库 | 检查 `DB_PASSWORD`, 确保 postgres 容器运行 |
| 前端无法访问 API | 检查 `VITE_API_URL` 配置 |
| 容器无法启动 | 查看日志: `docker-compose logs` |
| 磁盘空间不足 | 清理: `docker system prune -a` |

## 环境变量说明

```env
NODE_ENV=production           # 环境：development/production

DB_HOST=postgres              # 数据库主机（Docker 内部）
DB_PORT=5432                  # 数据库端口
DB_USERNAME=postgres          # 数据库用户名
DB_PASSWORD=postgres          # 数据库密码 ⚠️ 改为强密码
DB_NAME=g8_community         # 数据库名称

JWT_SECRET=secret-key         # JWT 密钥 ⚠️ 改为随机字符串
JWT_EXPIRATION=86400         # JWT 过期时间（秒）

BACKEND_PORT=3000             # 后端端口
FRONTEND_PORT=80              # 前端端口

VITE_API_URL=http://...      # 前端调用的 API 地址
```

## 监控和维护

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df

# 备份数据库
docker-compose exec postgres pg_dump -U postgres g8_community > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U postgres g8_community < backup.sql

# 查看容器日志大小
du -sh $(docker inspect -f '{{.LogPath}}' g8-backend)
```

## 更新部署

```bash
# 更新代码
git pull

# 重新构建并启动
docker-compose up -d --build

# 或者分步操作
docker-compose down
docker-compose build
docker-compose up -d
```

## 注意事项

⚠️ **生产环境必须：**
1. 修改所有默认密码和密钥
2. 启用 HTTPS/SSL
3. 配置强大的数据库密码
4. 定期备份数据库
5. 监控磁盘空间和日志
6. 设置自动更新和重启策略

## 获取帮助

查看完整文档: [DEPLOYMENT.md](./DEPLOYMENT.md)
