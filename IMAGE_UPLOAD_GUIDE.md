# 图片上传功能使用指南

## ✅ 功能完成

已在后台管理系统的所有表单中添加图片上传功能。

## 📋 支持的表单

1. **项目管理** - 项目图片上传
2. **新闻管理** - 封面图片上传  
3. **创始人管理** - 头像上传
4. **友情链接** - Logo 上传

## 🎯 使用方法

### 方式一：直接输入 URL
在图片输入框中粘贴完整的图片URL，例如：
```
https://example.com/image.jpg
```

### 方式二：上传本地文件
1. 点击表单中的 **"上传"** 按钮
2. 选择本地图片文件（支持 JPG、PNG、GIF、WebP）
3. 系统会自动上传并填充图片URL
4. 表单下方显示上传的图片预览

## 📦 技术规格

| 属性 | 规格 |
|------|------|
| **支持格式** | JPEG、PNG、GIF、WebP |
| **文件大小** | 最大 5MB |
| **保存位置** | Docker 容器内 `/app/uploads` 目录 |
| **访问 URL** | `/uploads/{filename}` |

## ⚙️ 后端配置

- **API 端点**: `POST /api/upload/image`
- **参数**: `file` (FormData)
- **响应示例**:
```json
{
  "url": "/uploads/image-1234567890-123456789.jpg",
  "filename": "image-1234567890-123456789.jpg",
  "size": 102400
}
```

## 📝 常见问题

**Q: 上传的图片会丢失吗？**
A: 上传的图片保存在 Docker 容器的 `uploads` 卷中。使用 `docker-compose` 启动时，该卷会持久化数据。如果使用 `docker-compose down -v` 会删除卷。

**Q: 能否同时使用 URL 和上传文件？**
A: 可以。URL 输入框和文件上传是独立的。上传文件会覆盖当前的 URL 值。

**Q: 支持批量上传吗？**
A: 当前不支持，每个表单字段只能上传一个图片。

## 🚀 部署注意

如果部署在服务器上，确保：
1. Docker 容器的 `/app/uploads` 目录已挂载为卷
2. Nginx 配置已正确转发 `/api/` 请求到后端
3. 确保有足够的磁盘空间存储上传的图片

## 📂 项目文件变更

- `backend/src/upload/upload.controller.ts` - 上传API端点
- `backend/src/upload/upload.module.ts` - 上传模块
- `frontend/src/api/index.ts` - 上传API客户端方法
- `frontend/src/views/admin/Projects.vue` - 项目表单更新
- `frontend/src/views/admin/News.vue` - 新闻表单更新
- `frontend/src/views/admin/Founders.vue` - 创始人表单更新
- `frontend/src/views/admin/FriendLinks.vue` - 友情链接表单更新
- `docker-compose.yml` - 添加uploads卷挂载

## ✨ 特性亮点

✅ 双模式输入 - URL 和文件上传  
✅ 即时预览 - 上传后立即显示图片  
✅ 格式验证 - 后端自动检查图片格式  
✅ 大小限制 - 防止过大文件  
✅ 错误提示 - 清晰的成功/失败消息  
✅ 响应式布局 - 表单适配各种屏幕尺寸
