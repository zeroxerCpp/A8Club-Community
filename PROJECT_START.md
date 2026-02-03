# 项目启动命令文档

## 1. 前提条件
- 已安装 Node.js（建议 18.x 及以上）
- 已安装 Docker & Docker Compose（用于生产环境部署）
- 已安装 pnpm 或 npm

---

## 2. 本地开发环境启动

### 2.1 启动后端（NestJS）
```bash
cd backend
npm install
npm run start:dev
```

### 2.2 启动前端（Vue3 + Vite）
```bash
cd frontend
npm install
npm run dev
```

---

## 3. 生产环境一键部署（Docker）

### 3.1 构建并启动所有服务
```bash
docker compose up -d --build
```

### 3.2 关闭所有服务
```bash
docker compose down
```

---

## 4. 其他常用命令

### 4.1 数据库初始化（首次部署/重置）
```bash
# 进入 backend 目录
cd backend
# 初始化数据库（如有 setup 脚本）
npm run prisma:migrate
```

### 4.2 查看日志
```bash
docker compose logs -f
```

---

## 5. 访问地址
- 前端页面：http://localhost:80 或 http://服务器IP
- 后端 API：http://localhost:3000

如需域名访问，请确保 DNS 解析和 nginx 配置正确。
