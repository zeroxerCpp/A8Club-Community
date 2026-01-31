<template>
  <div class="home" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ stats?.name || '超级A8俱乐部' }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link active">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link">项目经历</a>
          <a href="/news" class="nav-link">社区动态</a>
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

    <!-- Hero区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到 {{ stats?.name || '超级A8俱乐部' }}</h1>
        <p class="hero-subtitle">探索创新项目 · 了解优秀团队 · 加入活跃社群</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" round @click="$router.push('/founders')">
            <el-icon><User /></el-icon>
            <span style="margin-left: 8px;">了解团队</span>
          </el-button>
          <el-button size="large" round plain @click="$router.push('/projects')">
            <el-icon><Briefcase /></el-icon>
            <span style="margin-left: 8px;">查看项目</span>
          </el-button>
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
        <el-row :gutter="40">
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.memberCount || 0 }}+</div>
              <div class="stat-label">社群成员</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.activeMembers || 0 }}+</div>
              <div class="stat-label">活跃成员</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalProjects || 0 }}+</div>
              <div class="stat-label">项目数量</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalEvents || 0 }}+</div>
              <div class="stat-label">活动数量</div>
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
            <p class="section-subtitle">了解我们正在进行的创新工作</p>
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
                  <img v-if="project.image" :src="project.image" :alt="project.title" />
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
                <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" />
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
              <li><a href="/projects">项目经历</a></li>
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
          <p>&copy; 2026 A8 社区. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Briefcase, TrophyBase, Star, ChatDotRound, ArrowRight, Moon, Sunny } from '@element-plus/icons-vue'
import { statsAPI, projectsAPI, newsAPI, friendLinksAPI } from '../api'

const isDark = ref(false)
const loading = ref(true)

// 立即初始化主题，防止闪烁
const savedTheme = localStorage.getItem('frontend-theme')
if (savedTheme === 'dark') {
  isDark.value = true
  document.documentElement.classList.add('dark-mode')
  document.body.classList.add('dark-mode')
} else {
  // 确保移除可能存在的 dark-mode 类
  document.documentElement.classList.remove('dark-mode')
  document.body.classList.remove('dark-mode')
}

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
  try {
    stats.value = await statsAPI.getLatest()
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadProjects = async () => {
  try {
    const data = await projectsAPI.getActive()
    projects.value = data
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

const loadNews = async () => {
  try {
    const data = await newsAPI.getPublished()
    news.value = data
  } catch (error) {
    console.error('加载社区动态失败:', error)
  }
}

const loadFriendLinks = async () => {
  try {
    const data = await friendLinksAPI.getActive()
    friendLinks.value = data
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
.home {
  min-height: 100vh;
  background: #f8f9fa;
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

/* Hero 区域 */
.hero-section {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 80px 24px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%);
  background-size: 60px 60px;
  opacity: 0.3;
  pointer-events: none;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.95;
  margin-bottom: 48px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-buttons .el-button {
  padding: 14px 32px;
  font-size: 16px;
  height: auto;
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
  padding: 40px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.08);
  transition: all 0.3s ease;
  cursor: default;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
}

.stat-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

.stat-number {
  font-size: 56px;
  font-weight: 800;
  font-family: 'Arial', 'Helvetica', sans-serif;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.06);
  margin-bottom: 24px;
  border: 2px solid #e2e8f0;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

.project-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f7fa;
  flex-shrink: 0;
  position: relative;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
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
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.06);
  margin-bottom: 24px;
  border: 2px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

.news-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f7fa;
  flex-shrink: 0;
  position: relative;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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
  
  .hero-buttons .el-button {
    font-size: 14px;
    padding: 12px 24px;
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
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .home {
  background: #0f1629 !important;
}

body.dark-mode .navbar {
  background: #1e293b !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5) !important;
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

body.dark-mode .section-title {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

body.dark-mode .theme-toggle-btn {
  background: #0f172a !important;
  border-color: #3b4d66 !important;
  color: #cbd5e1 !important;
}

body.dark-mode .theme-toggle-btn:hover {
  background: rgba(96, 165, 250, 0.1) !important;
  border-color: #60a5fa !important;
  color: #60a5fa !important;
}

body.dark-mode .intro-section {
  background: #1a1f35 !important;
}

body.dark-mode .intro-content p {
  color: #e2e8f0 !important;
  font-size: 18px !important;
  line-height: 2.2 !important;
}

body.dark-mode .stats-section {
  background: #1a1f35 !important;
}

body.dark-mode .stat-item {
  background: linear-gradient(135deg, #232a42 0%, #1e2538 100%) !important;
  border-color: #3b4d66 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .stat-item::before {
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%) !important;
}

body.dark-mode .stat-item:hover {
  border-color: #60a5fa !important;
  box-shadow: 0 12px 40px rgba(96, 165, 250, 0.25) !important;
}

body.dark-mode .stat-number {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

body.dark-mode .stat-label {
  color: #94a3b8 !important;
}

body.dark-mode .features-section {
  background: #0f1629 !important;
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
  filter: brightness(1.2) !important;
}

body.dark-mode .projects-preview {
  background: #1a1f35 !important;
}

body.dark-mode .news-preview {
  background: #0f1629 !important;
}

body.dark-mode .project-card,
body.dark-mode .news-card {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .project-card:hover,
body.dark-mode .news-card:hover {
  border-color: #60a5fa !important;
  box-shadow: 0 12px 40px rgba(96, 165, 250, 0.25) !important;
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
  background: #0f172a !important;
}

body.dark-mode .footer {
  background: linear-gradient(135deg, #0d1120 0%, #060811 100%) !important;
  color: #cbd5e1 !important;
}

body.dark-mode .footer-section h3,
body.dark-mode .footer-section h4 {
  color: #e2e8f0 !important;
}

body.dark-mode .footer-section a {
  color: #cbd5e1 !important;
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
  background-color: transparent !important;
}

body.dark-mode .home :deep(.el-loading-mask) {
  background-color: transparent !important;
}

.home :deep(.el-loading-spinner) {
  display: none;
}
</style>
