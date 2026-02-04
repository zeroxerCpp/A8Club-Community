<template>
  <div class="news-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ siteName }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link">合作项目</a>
          <a href="/news" class="nav-link active">社区动态</a>
          <a href="/knowledge" class="nav-link">发现</a>
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
        <!-- 移动端汉堡按钮 -->
        <MobileMenu :is-dark="isDark" @theme-toggle="handleThemeToggle" />
      </div>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-bg-animation"></div>
      <div class="header-particles">
        <span v-for="i in 15" :key="i" class="particle"></span>
      </div>
      <div class="container">
        <h1 class="page-title">社区动态</h1>
        <p class="page-subtitle">了解社区的最新消息和精彩活动</p>
      </div>
    </div>

    <!-- 新闻列表 -->
    <div class="news-section">
      <div class="container">
        <div class="news-grid">
          <div class="news-card" :class="{ 'is-pinned': item.orderIndex === 0 }" v-for="item in newsList" :key="item.id" @click="viewDetail(item.id)">
            <div v-if="item.orderIndex === 0" class="pinned-badge"></div>
            <div class="news-image">
              <img v-if="item.coverImage" :src="getSecureImageUrl(item.coverImage)" :alt="item.title" />
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
import { newsAPI, statsAPI } from '../api'
import MobileMenu from '../components/MobileMenu.vue'
import { getSecureImageUrl } from '../utils/url'

const router = useRouter()
const newsList = ref<any[]>([])
const siteName = ref('超级A8俱乐部')
const isDark = ref(true)
const loading = ref(true)

// 立即初始化主题，防止闪烁
const savedTheme = localStorage.getItem('frontend-theme')
if (savedTheme === 'light') {
  isDark.value = false
  document.documentElement.classList.remove('dark-mode')
  document.body.classList.remove('dark-mode')
} else {
  document.documentElement.classList.add('dark-mode')
  document.body.classList.add('dark-mode')
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
  background: radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), #fafafa;
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
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  text-decoration: none;
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

/* 页面头部 - 宇宙主题 */
.page-header {
  background: #000000;
  padding: 100px 24px 80px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.header-bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(120, 40, 200, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(30, 100, 200, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(100, 50, 150, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #000000 0%, #0a0a1a 50%, #000000 100%);
  animation: cosmicShift 20s ease infinite alternate;
}

@keyframes cosmicShift {
  0% { 
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05) rotate(2deg);
    opacity: 0.95;
  }
  100% { 
    transform: scale(1.1) rotate(-2deg);
    opacity: 1;
  }
}

.header-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 20s infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
}

.particle:nth-child(odd) { animation-delay: -10s; }
.particle:nth-child(1) { left: 10%; top: 20%; animation-duration: 25s; }
.particle:nth-child(2) { left: 20%; top: 80%; animation-duration: 30s; }
.particle:nth-child(3) { left: 30%; top: 40%; animation-duration: 22s; }
.particle:nth-child(4) { left: 40%; top: 70%; animation-duration: 28s; }
.particle:nth-child(5) { left: 50%; top: 30%; animation-duration: 26s; }
.particle:nth-child(6) { left: 60%; top: 60%; animation-duration: 24s; }
.particle:nth-child(7) { left: 70%; top: 50%; animation-duration: 27s; }
.particle:nth-child(8) { left: 80%; top: 40%; animation-duration: 23s; }

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
}

.page-header .container {
  position: relative;
  z-index: 2;
}

.header-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-title {
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -1px;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.title-icon {
  display: inline-block;
  margin-right: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-subtitle {
  font-size: 20px;
  opacity: 0.95;
  font-weight: 300;
  animation: fadeInUp 0.8s ease 0.4s both;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(30, 58, 138, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
}

.pinned-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  z-index: 10;
  pointer-events: none;
}

.pinned-badge::before {
  content: '已置顶';
  position: absolute;
  top: 20px;
  right: -24px;
  width: 120px;
  padding: 6px 0;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
  transform: rotate(45deg);
  text-align: center;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.news-card.is-pinned::after {
  display: none;
}

.news-card::after {
  content: '📰';
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 32px;
  background: rgba(255, 255, 255, 0.95);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0) rotate(-180deg);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  z-index: 10;
}

.news-card:hover::after {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.news-card:hover {
  transform: translateY(-20px) scale(1.03);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.2);
  border-color: rgba(59, 130, 246, 0.6);
}

.news-image {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
  border-radius: 24px 24px 0 0;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.news-card:hover .news-image img {
  transform: scale(1.15);
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
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  color: #64748b;
  padding: 48px 24px;
  text-align: center;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
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
/* 响应式隐藏PC端/移动端导航 */
@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }
}
@media (min-width: 769px) {
  .mobile-menu {
    display: none !important;
  }
}
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .news-page {
  background: radial-gradient(ellipse at 30% 20%, rgba(120, 40, 200, 0.08) 0%, transparent 50%), 
              radial-gradient(ellipse at 70% 80%, rgba(30, 100, 200, 0.08) 0%, transparent 50%),
              #000000 !important;
}

body.dark-mode .navbar {
  background: rgba(10, 10, 20, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 2px 20px rgba(120, 40, 200, 0.3) !important;
  border-bottom: 1px solid rgba(167, 139, 250, 0.1) !important;
}

body.dark-mode .logo {
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  filter: drop-shadow(0 0 15px rgba(167, 139, 250, 0.4)) !important;
}

body.dark-mode .nav-link {
  color: #cbd5e1 !important;
}

body.dark-mode .nav-link:hover,
body.dark-mode .nav-link.active {
  color: #a78bfa !important;
}

body.dark-mode .nav-link.active::after {
  background: linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%) !important;
}

body.dark-mode .theme-toggle-btn {
  background: rgba(20, 20, 40, 0.8) !important;
  border-color: rgba(167, 139, 250, 0.3) !important;
  color: #cbd5e1 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .theme-toggle-btn:hover {
  background: rgba(167, 139, 250, 0.15) !important;
  border-color: #a78bfa !important;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.4) !important;
}

body.dark-mode .page-header {
  background: #000000 !important;
}

body.dark-mode .news-section {
  background: radial-gradient(ellipse at 50% 50%, rgba(100, 50, 150, 0.05) 0%, transparent 50%), transparent !important;
}

body.dark-mode .news-card {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.5) 0%, rgba(20, 20, 40, 0.5) 100%) !important;
  border: 1px solid rgba(167, 139, 250, 0.15) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(120, 40, 200, 0.05) !important;
  backdrop-filter: blur(10px) !important;
  overflow: visible !important;
}

body.dark-mode .pinned-badge::before {
  background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%) !important;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.6) !important;
  color: #000 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3) !important;
}

body.dark-mode .news-card:hover {
  transform: translateY(-20px) scale(1.03) !important;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(59, 130, 246, 0.6) !important;
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
  background: linear-gradient(to top, rgba(10, 10, 20, 0.95), transparent) !important;
}

body.dark-mode .footer {
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.95) 0%, rgba(5, 5, 15, 1) 100%) !important;
  color: #cbd5e1 !important;
  border-top: 1px solid rgba(167, 139, 250, 0.2) !important;
}
</style>
