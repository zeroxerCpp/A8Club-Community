# 社区展示网站管理系统

一个全栈社区展示网站，包含前端展示页面和后端管理系统。用于展示创始人团队、合作项目、社群数据等内容。

## 技术栈

### 后端
- **框架**: Nest.js + TypeScript
- **数据库**: PostgreSQL + TypeORM
- **认证**: JWT + bcryptjs
- **验证**: class-validator, class-transformer

### 前端
- **框架**: Vue 3 + TypeScript + Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI组件**: Element Plus
- **HTTP客户端**: Axios

## 项目结构

```
A8/
├── backend/           # 后端项目 (Nest.js)
│   ├── src/
│   │   ├── entities/        # 数据库实体
│   │   ├── auth/            # 认证模块
│   │   ├── founders/        # 创始人管理
│   │   ├── projects/        # 项目管理
│   │   ├── news/            # 新闻管理
│   │   ├── stats/           # 统计数据管理
│   │   └── main.ts          # 应用入口
│   ├── .env                 # 环境变量
│   └── package.json
│
└── frontend/          # 前端项目 (Vue 3)
    ├── src/
    │   ├── api/             # API接口
    │   ├── router/          # 路由配置
    │   ├── stores/          # Pinia状态管理
    │   ├── utils/           # 工具函数
    │   ├── views/           # 页面组件
    │   │   ├── Home.vue           # 首页
    │   │   ├── Founders.vue       # 创始人展示
    │   │   ├── Projects.vue       # 项目展示
    │   │   ├── News.vue           # 新闻列表
    │   │   └── admin/             # 管理后台
    │   │       ├── Login.vue      # 登录页
    │   │       ├── Layout.vue     # 后台布局
    │   │       ├── Dashboard.vue  # 仪表盘
    │   │       ├── Founders.vue   # 创始人管理
    │   │       ├── Projects.vue   # 项目管理
    │   │       ├── News.vue       # 新闻管理
    │   │       └── Stats.vue      # 统计管理
    │   └── main.ts
    └── package.json
```

## 快速开始

### 环境要求

- Node.js >= 20.19+ 或 22.12+
- PostgreSQL >= 12
- npm 或 yarn

### 1. 安装数据库

#### Windows (使用PostgreSQL安装程序):
1. 下载: https://www.postgresql.org/download/windows/
2. 安装并设置密码
3. 创建数据库:
```sql
CREATE DATABASE community_cms;
```

### 2. 配置后端

```bash
# 进入后端目录
cd backend

# 安装依赖 (如果未安装)
npm install

# 配置环境变量
# 复制 .env.example 到 .env 并修改配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=community_cms
JWT_SECRET=your-secret-key

# 启动后端服务 (数据库表会自动创建)
npm run start:dev
```

后端将运行在 `http://localhost:3000`

### 3. 配置前端

```bash
# 打开新终端,进入前端目录
cd frontend

# 安装依赖 (如果未安装)
npm install

# 启动前端开发服务器
npm run dev
```

前端将运行在 `http://localhost:5173`

### 4. 创建管理员账户

使用API工具(如Postman)或curl创建第一个管理员账户:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

## 功能特性

### 前端展示页面
- ✅ 首页 - 社区概览和统计数据展示
- ✅ 创始人团队 - 展示创始人信息、职位、简介、社交链接
- ✅ 合作项目 - 时间线展示项目历程
- ✅ 社区动态 - 新闻列表和详情页

### 管理后台
- ✅ 用户认证 - JWT登录认证
- ✅ 仪表盘 - 数据统计概览
- ✅ 创始人管理 - CRUD操作
- ✅ 项目管理 - CRUD操作,支持时间线和标签
- ✅ 新闻管理 - CRUD操作,支持草稿和发布
- ✅ 统计数据管理 - 更新社区统计数据

## API接口文档

### 认证接口
- `POST /api/auth/register` - 注册用户
- `POST /api/auth/login` - 用户登录

### 创始人接口
- `GET /api/founders` - 获取所有创始人
- `GET /api/founders/active` - 获取激活的创始人
- `GET /api/founders/:id` - 获取单个创始人
- `POST /api/founders` - 创建创始人 (需要认证)
- `PATCH /api/founders/:id` - 更新创始人 (需要认证)
- `DELETE /api/founders/:id` - 删除创始人 (需要认证)

### 项目接口
- `GET /api/projects` - 获取所有项目
- `GET /api/projects/active` - 获取激活的项目
- `GET /api/projects/:id` - 获取单个项目
- `POST /api/projects` - 创建项目 (需要认证)
- `PATCH /api/projects/:id` - 更新项目 (需要认证)
- `DELETE /api/projects/:id` - 删除项目 (需要认证)

### 新闻接口
- `GET /api/news` - 获取所有新闻
- `GET /api/news/published` - 获取已发布的新闻
- `GET /api/news/:id` - 获取单个新闻
- `POST /api/news` - 创建新闻 (需要认证)
- `PATCH /api/news/:id` - 更新新闻 (需要认证)
- `DELETE /api/news/:id` - 删除新闻 (需要认证)

### 统计接口
- `GET /api/stats/latest` - 获取最新统计数据
- `GET /api/stats/history` - 获取历史统计数据
- `POST /api/stats` - 创建统计数据 (需要认证)
- `PATCH /api/stats` - 更新统计数据 (需要认证)

## 开发说明

### 后端开发
```bash
cd backend

# 开发模式
npm run start:dev

# 生产构建
npm run build
npm run start:prod

# 运行测试
npm run test
```

### 前端开发
```bash
cd frontend

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview
```

## 部署

### Docker部署 (推荐)

#### Linux服务器部署

```bash
# 1. 安装Docker和Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. 克隆项目
git clone <your-repo-url>
cd G8

# 3. 配置环境变量 (可选，修改docker-compose.yml中的密码等配置)
nano docker-compose.yml

# 4. 构建并启动服务
docker-compose up -d --build

# 5. 查看服务状态
docker-compose ps

# 6. 查看日志
docker-compose logs -f

# 常用命令:
docker-compose down        # 停止服务
docker-compose restart     # 重启服务
docker-compose pull        # 更新镜像
```

服务启动后:
- 前端: `http://your-server-ip`
- 后端API: `http://your-server-ip:3000`

#### Windows服务器部署

```powershell
# 1. 安装Docker Desktop for Windows
# 下载: https://www.docker.com/products/docker-desktop

# 2. 克隆项目
git clone <your-repo-url>
cd G8

# 3. 启动服务
docker-compose up -d --build

# 查看状态
docker-compose ps
docker-compose logs -f
```

### 部署检查清单

- [ ] 修改docker-compose.yml中的数据库密码
- [ ] 修改JWT_SECRET为强随机字符串
- [ ] 配置防火墙开放80和3000端口
- [ ] （可选）配置域名和Nginx反向代理
- [ ] （可选）配置HTTPS证书

## 注意事项

1. **安全性**
   - 修改JWT_SECRET为强密码
   - 在生产环境中使用HTTPS
   - 定期更新依赖包

2. **数据库**
   - 开发环境使用`synchronize: true`自动同步表结构
   - 生产环境建议使用数据库迁移工具
   - 定期备份数据库

3. **性能优化**
   - 启用CORS仅允许信任的域名
   - 使用CDN加速静态资源
   - 考虑使用Redis缓存

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request!
