<template>
  <div class="news-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ siteName }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link">项目经历</a>
          <a href="/news" class="nav-link active">社区动态</a>
          <button 
            @click="handleThemeToggle"
            class="theme-toggle-btn"
            type="button"
          >
            <el-icon :size="16">
              <Sunny v-if="isDark" />
              <Moon v-else />
            </el-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">社区动态</h1>
        <p class="page-subtitle">了解社区的最新消息和精彩活动</p>
      </div>
    </div>

    <!-- 新闻列表 -->
    <div class="news-section">
      <div class="container">
        <div class="news-grid">
          <div class="news-card" v-for="item in newsList" :key="item.id" @click="viewDetail(item.id)">
            <div class="news-image">
              <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" />
              <div v-else class="news-placeholder">
                {{ item.title.charAt(0).toUpperCase() }}
              </div>
              <div class="news-overlay">
                <el-button type="primary" round>
                  阅读更多 <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="news-date">
                  <el-icon><Calendar /></el-icon>
                  {{ formatDate(item.publishedAt || item.createdAt) }}
                </span>
              </div>
              <h3 class="news-title">{{ item.title }}</h3>
              <p class="news-excerpt">{{ getExcerpt(item.content) }}</p>
              <div class="news-tags" v-if="item.tags && item.tags.length">
                <el-tag v-for="tag in getTags(item.tags)" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!loading && newsList.length === 0" description="暂无社区动态" :image-size="200" />
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="container">
        <p>&copy; 2026 {{ siteName }}. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, ArrowRight, Moon, Sunny } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { newsAPI, statsAPI } from '../api'

const router = useRouter()
const newsList = ref<any[]>([])
const siteName = ref('超级A8俱乐部')
const isDark = ref(false)
const loading = ref(true)

// 立即初始化主题，防止闪烁
const savedTheme = localStorage.getItem('frontend-theme')
if (savedTheme === 'dark') {
  isDark.value = true
  document.documentElement.classList.add('dark-mode')
  document.body.classList.add('dark-mode')
} else {
  document.documentElement.classList.remove('dark-mode')
  document.body.classList.remove('dark-mode')
}

const handleThemeToggle = () => {
  isDark.value = !isDark.value
  
  if (isDark.value) {
    document.body.classList.add('dark-mode')
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('frontend-theme', 'dark')
  } else {
    document.body.classList.remove('dark-mode')
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('frontend-theme', 'light')
  }
}

const loadNews = async () => {
  try {
    const data = await newsAPI.getPublished()
    newsList.value = data
  } catch (error) {
    console.error('加载新闻失败:', error)
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getExcerpt = (content: string) => {
  if (!content) return ''
  const text = content.replace(/<[^>]*>/g, '')
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

const getTags = (tags: any) => {
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags)
    } catch {
      return tags.split(',').map((t: string) => t.trim())
    }
  }
  return Array.isArray(tags) ? tags : []
}

const loadSiteName = async () => {
  try {
    const stats = await statsAPI.getLatest()
    if (stats?.name) {
      siteName.value = stats.name
    }
  } catch (error) {
    console.error('加载社区名称失败:', error)
  }
}

const viewDetail = (id: number) => {
  router.push(`/news/${id}`)
}

onMounted(async () => {
  await Promise.all([
    loadNews(),
    loadSiteName()
  ])
  loading.value = false
})
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  background: #f8f9fa;
}
/* 自定义加载遮罩样式 */
.news-page :deep(.el-loading-mask) {
  background-color: transparent !important;
}

body.dark-mode .news-page :deep(.el-loading-mask) {
  background-color: transparent !important;
}

.news-page :deep(.el-loading-spinner) {
  display: none;
}
/* 导航�?*/
.navbar {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
  position: relative;
  padding: 20px 0;
}

.nav-link:hover,
.nav-link.active {
  color: #3b82f6;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
}

.theme-toggle-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #606266;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 80px 24px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%);
  background-size: 60px 60px;
  opacity: 0.3;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 18px;
  opacity: 0.95;
}

/* 新闻列表 */
.news-section {
  padding: 80px 24px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.news-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.08);
  border: 2px solid #e2e8f0;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

.news-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f5f7fa;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .news-image img {
  transform: scale(1.1);
}

.news-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: #fff;
  text-transform: uppercase;
}

.news-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.news-card:hover .news-overlay {
  opacity: 1;
}

.news-content {
  padding: 24px;
}

.news-meta {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.news-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #909399;
}

.news-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-excerpt {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 底部 */
.footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #e2e8f0;
  padding: 48px 24px;
  text-align: center;
  border-top: 3px solid #3b82f6;
}

.footer p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

/* 响应�?*/
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
  }

  .logo {
    font-size: 20px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-link {
    font-size: 14px;
  }

  .page-header {
    padding: 60px 16px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .news-section {
    padding: 60px 16px;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .news-image {
    height: 200px;
  }

  .news-content {
    padding: 20px;
  }

  .news-title {
    font-size: 18px;
  }
}
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .news-page {
  background: #0f1629 !important;
}

body.dark-mode .navbar {
  background: #1e293b !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .logo {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

body.dark-mode .nav-link {
  color: #cbd5e1 !important;
}

body.dark-mode .nav-link:hover,
body.dark-mode .nav-link.active {
  color: #60a5fa !important;
}

body.dark-mode .nav-link.active::after {
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%) !important;
}

body.dark-mode .theme-toggle-btn {
  background: #0f172a !important;
  border-color: #334155 !important;
  color: #cbd5e1 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .theme-toggle-btn:hover {
  background: rgba(96, 165, 250, 0.1) !important;
  border-color: #60a5fa !important;
}

body.dark-mode .page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%) !important;
}

body.dark-mode .news-section {
  background: #0f1629 !important;
}

body.dark-mode .news-card {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .news-card:hover {
  box-shadow: 0 12px 40px rgba(96, 165, 250, 0.25) !important;
  border-color: #60a5fa !important;
}

body.dark-mode .news-title {
  color: #f1f5f9 !important;
}

body.dark-mode .news-excerpt {
  color: #cbd5e1 !important;
}

body.dark-mode .news-meta,
body.dark-mode .news-date {
  color: #94a3b8 !important;
}

body.dark-mode .news-overlay {
  background: linear-gradient(to top, rgba(15, 22, 41, 0.95), transparent) !important;
}

body.dark-mode .footer {
  background: linear-gradient(135deg, #0d1120 0%, #060811 100%) !important;
}
</style>
