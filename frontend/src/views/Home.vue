<template>
  <div class="home" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ stats?.name || '超级A8俱乐部' }}</a>
        <!-- PC端导航 -->
        <div class="nav-links">
          <a href="/" class="nav-link active">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link">合作项目</a>
          <a href="/news" class="nav-link">社区动态</a>
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

    <!-- Hero区域 -->
    <div class="hero-section">
      <div class="hero-bg-animation"></div>
      <div class="hero-particles">
        <span v-for="i in 20" :key="i" class="particle"></span>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">欢迎来到</span>
          <span class="title-highlight">{{ stats?.name || '超级A8俱乐部' }}</span>
        </h1>
        <p class="hero-subtitle">探索创新项目 · 了解优秀团队 · 加入活跃社群</p>
        <div class="hero-buttons">
          <button class="custom-btn btn-primary" @click="$router.push('/founders')">
            <svg class="btn-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M512 512m-192 0a192 192 0 1 0 384 0 192 192 0 1 0-384 0Z"/>
              <path d="M512 704c-106.039 0-192-85.961-192-192s85.961-192 192-192 192 85.961 192 192-85.961 192-192 192z m0-320c-70.692 0-128 57.308-128 128s57.308 128 128 128 128-57.308 128-128-57.308-128-128-128zM864 896H160c-17.673 0-32-14.327-32-32 0-123.712 100.288-224 224-224h320c123.712 0 224 100.288 224 224 0 17.673-14.327 32-32 32z m-672-64h640c-11.703-80.478-79.522-144-160-144H352c-80.478 0-148.297 63.522-160 144z"/>
            </svg>
            <span>了解团队</span>
          </button>
          <button class="custom-btn btn-secondary" @click="$router.push('/projects')">
            <svg class="btn-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M832 192H704V128c0-17.673-14.327-32-32-32H352c-17.673 0-32 14.327-32 32v64H192c-35.346 0-64 28.654-64 64v576c0 35.346 28.654 64 64 64h640c35.346 0 64-28.654 64-64V256c0-35.346-28.654-64-64-64zM384 160h256v32H384v-32z m448 672c0 17.673-14.327 32-32 32H224c-17.673 0-32-14.327-32-32V288c0-17.673 14.327-32 32-32h96v32c0 17.673 14.327 32 32 32h320c17.673 0 32-14.327 32-32v-32h96c17.673 0 32 14.327 32 32v544z"/>
            </svg>
            <span>查看项目</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 社区介绍 -->
    <div class="intro-section" v-if="stats?.description">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">关于我们</h2>
          </div>
        </div>
        <div class="intro-content">
          <p>{{ stats.description }}</p>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-section" v-if="stats">
      <div class="container">
        <el-row :gutter="24">
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon">👥</div>
              <div class="stat-number">{{ stats.memberCount || 0 }}+</div>
              <div class="stat-label">社群成员</div>
              <div class="stat-bar"></div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon">⚡</div>
              <div class="stat-number">{{ stats.activeMembers || 0 }}+</div>
              <div class="stat-label">活跃成员</div>
              <div class="stat-bar"></div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon">💼</div>
              <div class="stat-number">{{ stats.totalProjects || 0 }}+</div>
              <div class="stat-label">项目数量</div>
              <div class="stat-bar"></div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon">🎯</div>
              <div class="stat-number">{{ stats.totalEvents || 0 }}+</div>
              <div class="stat-label">活动数量</div>
              <div class="stat-bar"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 最新项目 -->
    <div class="projects-preview" v-if="loading || projects.length > 0">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">最新项目</h2>
            <p class="section-subtitle">了解我们正在进行的项目</p>
          </div>
          <el-button type="primary" link @click="$router.push('/projects')">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <el-row :gutter="24" v-if="!loading">
          <el-col :xs="24" :sm="12" :md="6" v-for="project in projects.slice(0, 4)" :key="project.id">
            <div class="project-card" @click="handleProjectClick(project)">
              <div class="project-content">
                <div class="project-image">
                  <img v-if="project.image" :src="getSecureImageUrl(project.image)" :alt="project.title" />
                  <div v-else class="project-placeholder">
                    {{ project.title.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="project-info">
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.description.length > 60 ? project.description.substring(0, 60) + '...' : project.description }}</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 社区动态 -->
    <div class="news-preview" v-if="loading || news.length > 0">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">社区动态</h2>
            <p class="section-subtitle">了解最新的社区资讯和活动</p>
          </div>
          <el-button type="primary" link @click="$router.push('/news')">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <el-row :gutter="24" v-if="!loading">
          <el-col :xs="24" :sm="12" :md="8" v-for="item in news.slice(0, 3)" :key="item.id">
            <div class="news-card" @click="$router.push(`/news/${item.id}`)">
              <div class="news-image">
                <img v-if="item.coverImage" :src="getSecureImageUrl(item.coverImage)" :alt="item.title" />
                <div v-else class="news-placeholder">
                  {{ item.title.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="news-info">
                <h3>{{ item.title }}</h3>
                <p class="news-content">{{ item.content.length > 80 ? item.content.substring(0, 80) + '...' : item.content }}</p>
                <div class="news-meta">
                  <span class="news-date">{{ new Date(item.publishedAt || item.createdAt).toLocaleDateString('zh-CN') }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 特色功能 -->
    <div class="features-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">为什么选择我们</h2>
            <p class="section-subtitle">专业的团队，创新的项目，活跃的社区</p>
          </div>
        </div>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="8">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon :size="48" color="#409eff"><TrophyBase /></el-icon>
              </div>
              <h3>专业团队</h3>
              <p>经验丰富的创始人团队，来自顶尖企业和机构</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon :size="48" color="#67c23a"><Star /></el-icon>
              </div>
              <h3>优质项目</h3>
              <p>精心打磨的项目，持续创新和迭代</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon :size="48" color="#e6a23c"><ChatDotRound /></el-icon>
              </div>
              <h3>活跃社区</h3>
              <p>热情的社区氛围，定期举办线上线下活动</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{ stats?.name || '超级A8俱乐部' }}</h3>
            <p>致力于创新与分享的专业社区</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/founders">创始团队</a></li>
              <li><a href="/projects">合作项目</a></li>
              <li><a href="/news">社区动态</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>邮箱: {{ stats?.contactEmail || 'contact@example.com' }}</p>
          </div>
          <div class="footer-section" v-if="friendLinks.length > 0">
            <h4>友情链接</h4>
            <div class="friend-links">
              <a
                v-for="link in friendLinks"
                :key="link.id"
                :href="link.url"
                target="_blank"
                :title="link.description"
                class="friend-link"
              >
                <img v-if="link.logo" :src="link.logo" :alt="link.name" class="link-logo" />
                <span v-else>{{ link.name }}</span>
              </a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 {{ siteName }}. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrophyBase, Star, ChatDotRound, ArrowRight, Moon, Sunny } from '@element-plus/icons-vue'
import { statsAPI, projectsAPI, newsAPI, friendLinksAPI } from '../api'
import MobileMenu from '../components/MobileMenu.vue'
import { getSecureImageUrl } from '../utils/url'

const siteName = ref('超级A8俱乐部')
// 在任何渲染之前立即初始化主题
const savedTheme = localStorage.getItem('frontend-theme')
const isDarkMode = savedTheme !== 'light' // 默认暗夜模式

if (isDarkMode) {
  document.documentElement.classList.add('dark-mode')
  document.body.classList.add('dark-mode')
} else {
  document.documentElement.classList.remove('dark-mode')
  document.body.classList.remove('dark-mode')
}

const isDark = ref(isDarkMode)
const loading = ref(true)

const handleThemeToggle = () => {
  console.log('=== Theme toggle clicked ===')
  isDark.value = !isDark.value
  
  if (isDark.value) {
    document.body.classList.add('dark-mode')
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('frontend-theme', 'dark')
    console.log('Switched to dark mode')
    console.log('Body classes:', document.body.classList.toString())
  } else {
    document.body.classList.remove('dark-mode')
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('frontend-theme', 'light')
    console.log('Switched to light mode')
  }
}

// 初始化主题
onMounted(async () => {
  // 并行加载所有数据
  await Promise.all([
    loadStats(),
    loadProjects(),
    loadNews(),
    loadFriendLinks()
  ])
  loading.value = false
})

const stats = ref<any>(null)
const projects = ref<any[]>([])
const news = ref<any[]>([])
const friendLinks = ref<any[]>([])

const loadStats = async () => {
  // 检查本地缓存
  const cachedStats = localStorage.getItem('home-stats')
  const cacheTime = localStorage.getItem('home-stats-time')
  const now = Date.now()
  
  // 如果缓存存在且未过期（2分钟），使用缓存数据
  if (cachedStats && cacheTime && (now - parseInt(cacheTime)) < 2 * 60 * 1000) {
    stats.value = JSON.parse(cachedStats)
    return
  }
  
  try {
    stats.value = await statsAPI.getLatest()
    // 缓存数据
    localStorage.setItem('home-stats', JSON.stringify(stats.value))
    localStorage.setItem('home-stats-time', now.toString())
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadProjects = async () => {
  // 检查本地缓存
  const cachedProjects = localStorage.getItem('home-projects')
  const cacheTime = localStorage.getItem('home-projects-time')
  const now = Date.now()
  
  // 如果缓存存在且未过期（5分钟），使用缓存数据
  if (cachedProjects && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
    projects.value = JSON.parse(cachedProjects)
    return
  }
  
  try {
    const data = await projectsAPI.getActive()
    projects.value = data
    // 缓存数据
    localStorage.setItem('home-projects', JSON.stringify(projects.value))
    localStorage.setItem('home-projects-time', now.toString())
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

const loadNews = async () => {
  // 检查本地缓存
  const cachedNews = localStorage.getItem('home-news')
  const cacheTime = localStorage.getItem('home-news-time')
  const now = Date.now()
  
  // 如果缓存存在且未过期（3分钟），使用缓存数据
  if (cachedNews && cacheTime && (now - parseInt(cacheTime)) < 3 * 60 * 1000) {
    news.value = JSON.parse(cachedNews)
    return
  }
  
  try {
    const data = await newsAPI.getPublished()
    news.value = data
    // 缓存数据
    localStorage.setItem('home-news', JSON.stringify(news.value))
    localStorage.setItem('home-news-time', now.toString())
  } catch (error) {
    console.error('加载社区动态失败:', error)
  }
}

const loadFriendLinks = async () => {
  // 检查本地缓存
  const cachedLinks = localStorage.getItem('home-friendlinks')
  const cacheTime = localStorage.getItem('home-friendlinks-time')
  const now = Date.now()
  
  // 如果缓存存在且未过期（10分钟），使用缓存数据
  if (cachedLinks && cacheTime && (now - parseInt(cacheTime)) < 10 * 60 * 1000) {
    friendLinks.value = JSON.parse(cachedLinks)
    return
  }
  
  try {
    const data = await friendLinksAPI.getActive()
    friendLinks.value = data
    // 缓存数据
    localStorage.setItem('home-friendlinks', JSON.stringify(friendLinks.value))
    localStorage.setItem('home-friendlinks-time', now.toString())
  } catch (error) {
    console.error('加载友情链接失败:', error)
  }
}

const handleProjectClick = (project: any) => {
  if (project.link) {
    window.open(project.link, '_blank')
  }
}

onMounted(() => {
  loadStats()
  loadProjects()
  loadNews()
})
</script>

<style scoped>
.mobile-menu {
  background: #fff;
  color: #222;
}
body.dark-mode .mobile-menu {
  background: #181828;
  color: #f1f5f9;
}
/* 响应式隐藏PC端/移动端导航 */
@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }
  .hamburger {
    display: flex !important;
  }
}
@media (min-width: 769px) {
  .hamburger {
    display: none !important;
  }
  .mobile-menu {
    display: none !important;
  }
}
.home {
  min-height: 100vh;
}

/* 导航栏 */
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
  margin-left: 16px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #606266;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.theme-toggle-btn:active {
  transform: scale(0.92);
}

/* Hero 区域 - 宇宙主题 */
.hero-section {
  background: #000000;
  padding: 120px 24px 100px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-bg-animation {
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

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  animation: twinkle 3s infinite, float 20s infinite linear;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
}

/* 不同大小的星星 */
.particle:nth-child(1), .particle:nth-child(5), .particle:nth-child(9), .particle:nth-child(13), .particle:nth-child(17) {
  width: 3px;
  height: 3px;
}

.particle:nth-child(2), .particle:nth-child(6), .particle:nth-child(10), .particle:nth-child(14), .particle:nth-child(18) {
  width: 5px;
  height: 5px;
}

.particle:nth-child(3), .particle:nth-child(7), .particle:nth-child(11), .particle:nth-child(15), .particle:nth-child(19) {
  width: 2px;
  height: 2px;
}

.particle:nth-child(4), .particle:nth-child(8), .particle:nth-child(12), .particle:nth-child(16), .particle:nth-child(20) {
  width: 4px;
  height: 4px;
}

.particle:nth-child(odd) { animation-delay: -10s; }
.particle:nth-child(1) { left: 10%; top: 20%; animation-duration: 25s, 4s; }
.particle:nth-child(2) { left: 20%; top: 80%; animation-duration: 30s, 3.5s; }
.particle:nth-child(3) { left: 30%; top: 40%; animation-duration: 22s, 5s; }
.particle:nth-child(4) { left: 40%; top: 70%; animation-duration: 28s, 4.2s; }
.particle:nth-child(5) { left: 50%; top: 30%; animation-duration: 26s, 3.8s; }
.particle:nth-child(6) { left: 60%; top: 60%; animation-duration: 24s, 4.5s; }
.particle:nth-child(7) { left: 70%; top: 50%; animation-duration: 27s, 3.2s; }
.particle:nth-child(8) { left: 80%; top: 40%; animation-duration: 23s, 4.8s; }
.particle:nth-child(9) { left: 90%; top: 70%; animation-duration: 29s, 3.6s; }
.particle:nth-child(10) { left: 15%; top: 60%; animation-duration: 25s, 4.3s; }
.particle:nth-child(11) { left: 25%; top: 25%; animation-duration: 31s, 3.9s; }
.particle:nth-child(12) { left: 35%; top: 85%; animation-duration: 27s, 4.6s; }
.particle:nth-child(13) { left: 45%; top: 15%; animation-duration: 24s, 3.4s; }
.particle:nth-child(14) { left: 55%; top: 75%; animation-duration: 28s, 4.1s; }
.particle:nth-child(15) { left: 65%; top: 35%; animation-duration: 26s, 3.7s; }
.particle:nth-child(16) { left: 75%; top: 65%; animation-duration: 29s, 4.4s; }
.particle:nth-child(17) { left: 85%; top: 25%; animation-duration: 23s, 3.3s; }
.particle:nth-child(18) { left: 95%; top: 55%; animation-duration: 30s, 4.7s; }
.particle:nth-child(19) { left: 5%; top: 45%; animation-duration: 25s, 3.5s; }
.particle:nth-child(20) { left: 12%; top: 90%; animation-duration: 27s, 4.2s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(-100vh) translateX(30px); }
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: -2px;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.title-line {
  display: block;
  font-size: 36px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 12px;
}

.title-highlight {
  display: block;
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.4));
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.4)); }
  50% { filter: drop-shadow(0 0 30px rgba(96, 165, 250, 0.6)); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-subtitle {
  font-size: 22px;
  opacity: 0.95;
  margin-bottom: 48px;
  line-height: 1.6;
  font-weight: 300;
  animation: fadeInUp 0.8s ease 0.4s both;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease 0.6s both;
}

.custom-btn {
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, transform 0.8s ease-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  outline: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.custom-btn span {
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.85);
  color: #1e3a8a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(0);
}

/* 社区介绍 */
.intro-section {
  padding: 80px 24px;
  background: #fff;
}

.intro-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.intro-content p {
  font-size: 16px;
  line-height: 2;
  color: #606266;
  white-space: pre-wrap;
}

/* 统计区域 */
.stats-section {
  padding: 80px 24px;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: 48px 24px;
  background: linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 50%, #fce7f3 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  box-shadow: 0 8px 32px rgba(30, 58, 138, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s;
}

.stat-item:hover::before {
  left: 100%;
}

.stat-item:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 16px 48px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.stat-number {
  font-size: 64px;
  font-weight: 900;
  font-family: 'Arial', 'Helvetica', sans-serif;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  line-height: 1;
  letter-spacing: -0.03em;
  animation: countUp 1.5s ease-out;
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-label {
  font-size: 15px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.stat-bar {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  margin: 12px auto 0;
  animation: expandWidth 1s ease-out;
}

@keyframes expandWidth {
  from { width: 0; }
  to { width: 60px; }
}

/* 底部 */
.footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #e2e8f0;
  padding: 60px 24px 24px;
  border-top: 3px solid #3b82f6;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #fff;
}

.footer-section h4 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #fff;
}

.footer-section p {
  opacity: 0.8;
  line-height: 1.6;
  margin: 8px 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin: 8px 0;
}

.footer-section ul li a {
  color: #ecf0f1;
  opacity: 0.8;
  text-decoration: none;
  transition: opacity 0.3s;
}

.footer-section ul li a:hover {
  opacity: 1;
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  margin: 0;
  font-size: 14px;
  opacity: 0.6;
}

/* 功能特色区域 */
.features-section {
  padding: 80px 24px;
  background: #fff;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 16px;
  color: #909399;
  margin-bottom: 0;
}

.feature-card {
  text-align: center;
  padding: 40px 24px;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  margin-bottom: 24px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 项目预览区域 */
.projects-preview {
  padding: 80px 24px;
  background: #f8f9fa;
}

/* 社区动态区域 */
.news-preview {
  padding: 80px 24px;
  background: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.section-header > div:first-child {
  flex: 1;
}

.project-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 24px rgba(30, 58, 138, 0.08);
  margin-bottom: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  height: 100%;
  position: relative;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.project-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: all 0.6s ease;
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover::after {
  opacity: 0.4;
  animation: shimmer 2s infinite;
}

.project-card:hover {
  transform: translateY(-16px) scale(1.03);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.18),
              0 0 40px rgba(59, 130, 246, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.8);
  filter: brightness(1.05);
}

.project-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.project-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  flex-shrink: 0;
  position: relative;
}

.project-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.project-card:hover .project-image::after {
  opacity: 1;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover .project-image img {
  transform: scale(1.1) rotate(2deg);
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  font-weight: 700;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: #fff;
  text-transform: uppercase;
}

.project-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.project-info p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  flex: 1;
}

/* 动态卡片样式 */
.news-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 24px rgba(30, 58, 138, 0.08);
  margin-bottom: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.6s;
}

.news-card:hover::before {
  left: 100%;
}

.news-card:hover {
  transform: translateY(-16px) scale(1.03);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.18);
  border-color: rgba(59, 130, 246, 0.6);
}

.news-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
  flex-shrink: 0;
  position: relative;
}

.news-image::after {
  content: '📰';
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.95);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.news-card:hover .news-image::after {
  opacity: 1;
  transform: scale(1);
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
  font-size: 80px;
  font-weight: 700;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: #fff;
  text-transform: uppercase;
}

.news-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.news-date {
  font-size: 13px;
  color: #909399;
}

/* 响应式 */
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
  
  .hero-section {
    padding: 80px 16px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .custom-btn {
    font-size: 14px;
    padding: 14px 32px;
    width: 200px;
  }
  
  .stats-section {
    padding: 60px 16px;
  }
  
  .stat-item {
    padding: 30px 15px;
    margin-bottom: 20px;
  }
  
  .stat-number {
    font-size: 36px;
  }
  
  .stat-label {
    font-size: 14px;
  }
}
</style>

<style>
/* 主题背景色 - 非 scoped 样式 */
.home {
  background: #f8f9fa;
}

body.dark-mode .home {
  background: #000000 !important;
}

body.dark-mode .navbar {
  background: rgba(10, 10, 20, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 2px 20px rgba(120, 40, 200, 0.3) !important;
  border-bottom: 1px solid rgba(167, 139, 250, 0.1) !important;
}

body.dark-mode .nav-link {
  color: #cbd5e1 !important;
}

body.dark-mode .logo {
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  filter: drop-shadow(0 0 15px rgba(167, 139, 250, 0.4)) !important;
}

body.dark-mode .nav-link:hover,
body.dark-mode .nav-link.active {
  color: #a78bfa !important;
}

body.dark-mode .nav-link.active::after {
  background: linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%) !important;
}

body.dark-mode .section-title {
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.3)) !important;
}

body.dark-mode .theme-toggle-btn {
  background: rgba(20, 20, 40, 0.8) !important;
  border-color: rgba(167, 139, 250, 0.3) !important;
  color: #cbd5e1 !important;
}

body.dark-mode .theme-toggle-btn:hover {
  background: rgba(167, 139, 250, 0.15) !important;
  border-color: #a78bfa !important;
  color: #a78bfa !important;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.4) !important;
}

body.dark-mode .intro-section {
  background: radial-gradient(ellipse at 50% 50%, rgba(60, 30, 100, 0.1) 0%, transparent 50%), #0a0a15 !important;
}

body.dark-mode .intro-content p {
  color: #e2e8f0 !important;
  font-size: 18px !important;
  line-height: 2.2 !important;
}

body.dark-mode .stats-section {
  background: radial-gradient(ellipse at 30% 50%, rgba(120, 40, 200, 0.08) 0%, transparent 50%), 
              radial-gradient(ellipse at 70% 50%, rgba(30, 100, 200, 0.08) 0%, transparent 50%),
              #000000 !important;
}

body.dark-mode .stat-item {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.6) 0%, rgba(20, 20, 40, 0.6) 100%) !important;
  border: 1px solid rgba(167, 139, 250, 0.2) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(120, 40, 200, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}

body.dark-mode .stat-item::before {
  background: linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%) !important;
}

body.dark-mode .stat-item:hover {
  border-color: #60a5fa !important;
  box-shadow: 0 12px 40px rgba(167, 139, 250, 0.3), 0 0 40px rgba(120, 40, 200, 0.2) !important;
  transform: translateY(-8px) !important;
}

body.dark-mode .stat-number {
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.5)) !important;
}

body.dark-mode .stat-label {
  color: #cbd5e1 !important;
}

body.dark-mode .features-section {
  background: radial-gradient(ellipse at 50% 50%, rgba(60, 30, 100, 0.08) 0%, transparent 50%), #0a0a15 !important;
}

body.dark-mode .section-subtitle {
  color: #94a3b8 !important;
}

body.dark-mode .feature-card h3 {
  color: #f1f5f9 !important;
}

body.dark-mode .feature-card p {
  color: #cbd5e1 !important;
}

body.dark-mode .feature-icon {
  filter: brightness(1.3) drop-shadow(0 0 10px rgba(167, 139, 250, 0.4)) !important;
}

body.dark-mode .projects-preview {
  background: radial-gradient(ellipse at 70% 50%, rgba(30, 100, 200, 0.08) 0%, transparent 50%), #000000 !important;
}

body.dark-mode .news-preview {
  background: radial-gradient(ellipse at 30% 50%, rgba(120, 40, 200, 0.08) 0%, transparent 50%), #0a0a15 !important;
}

body.dark-mode .project-card,
body.dark-mode .news-card {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.5) 0%, rgba(20, 20, 40, 0.5) 100%) !important;
  border: 1px solid rgba(167, 139, 250, 0.15) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(120, 40, 200, 0.05) !important;
  backdrop-filter: blur(10px) !important;
}

body.dark-mode .project-card::after {
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(167, 139, 250, 0.6) 50%,
    transparent 70%
  ) !important;
}

body.dark-mode .project-card:hover::after {
  opacity: 0 !important;
}

body.dark-mode .project-card:hover,
body.dark-mode .news-card:hover {
  border-color: rgba(167, 139, 250, 0.15) !important;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.3) !important;
  filter: brightness(1.2) !important;
}

body.dark-mode .project-info h3,
body.dark-mode .news-info h3 {
  color: #f1f5f9 !important;
}

body.dark-mode .project-info p,
body.dark-mode .news-content {
  color: #cbd5e1 !important;
}

body.dark-mode .news-date {
  color: #94a3b8 !important;
}

body.dark-mode .project-image,
body.dark-mode .news-image {
  background: radial-gradient(circle, rgba(120, 40, 200, 0.1) 0%, rgba(10, 10, 20, 1) 100%) !important;
}

body.dark-mode .footer {
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.95) 0%, rgba(5, 5, 15, 1) 100%) !important;
  color: #cbd5e1 !important;
  border-top: 1px solid rgba(167, 139, 250, 0.1) !important;
}

body.dark-mode .footer-section h3,
body.dark-mode .footer-section h4 {
  color: #e2e8f0 !important;
}

body.dark-mode .footer-section a {
  color: #cbd5e1 !important;
}

body.dark-mode .footer-section a:hover {
  color: #60a5fa !important;
}

.friend-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.friend-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.friend-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.link-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

body.dark-mode .friend-link {
  background: rgba(255, 255, 255, 0.08);
}

body.dark-mode .friend-link:hover {
  background: rgba(96, 165, 250, 0.2);
}

/* 自定义加载遮罩样式 */
.home :deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(2px);
}

body.dark-mode .home :deep(.el-loading-mask) {
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(2px);
}

.home :deep(.el-loading-spinner) {
  display: none;
}
</style>
