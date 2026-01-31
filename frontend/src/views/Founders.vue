<template>
  <div class="founders-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ siteName }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link active">创始团队</a>
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

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">创始团队</h1>
        <p class="page-subtitle">认识推动社区发展的核心成员</p>
      </div>
    </div>

    <!-- 创始人 -->
    <div class="founder-section" v-if="mainFounder">
      <div class="container">
        <h2 class="section-title">创始人</h2>
        <div class="main-founder-wrapper">
          <div class="founder-card founder-featured main-founder">
            <div class="founder-avatar">
              <img v-if="mainFounder.avatar" :src="mainFounder.avatar" :alt="mainFounder.name" />
              <div v-else class="avatar-placeholder">
                <span class="avatar-text">{{ mainFounder.name.substring(0, 1) }}</span>
              </div>
            </div>
            <div class="founder-info">
              <h3>{{ mainFounder.name }}</h3>
              <p class="title">{{ mainFounder.title }}</p>
              <p class="bio">{{ mainFounder.bio }}</p>
              <div class="social-links" v-if="mainFounder.linkedin || mainFounder.twitter">
                <a v-if="mainFounder.linkedin" :href="mainFounder.linkedin" target="_blank" class="social-link">
                  <el-icon><Link /></el-icon>
                </a>
                <a v-if="mainFounder.twitter" :href="mainFounder.twitter" target="_blank" class="social-link">
                  <el-icon><Position /></el-icon>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 社区成员 -->
    <div class="team-section" v-if="coreMembers.length > 0">
      <div class="container">
        <h2 class="section-title">社区成员</h2>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="12" :lg="8" v-for="founder in coreMembers" :key="founder.id">
            <div class="founder-card">
              <div class="founder-avatar">
                <img v-if="founder.avatar" :src="founder.avatar" :alt="founder.name" />
                <div v-else class="avatar-placeholder">
                  <span class="avatar-text">{{ founder.name.substring(0, 1) }}</span>
                </div>
              </div>
              <div class="founder-info">
                <h3>{{ founder.name }}</h3>
                <p class="title">{{ founder.title }}</p>
                <p class="bio">{{ founder.bio }}</p>
                <div class="social-links" v-if="founder.linkedin || founder.twitter">
                  <a v-if="founder.linkedin" :href="founder.linkedin" target="_blank" class="social-link">
                    <el-icon><Link /></el-icon>
                  </a>
                  <a v-if="founder.twitter" :href="founder.twitter" target="_blank" class="social-link">
                    <el-icon><Position /></el-icon>
                  </a>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 其他成员 -->
    <div class="team-section" v-if="otherMembers.length > 0">
      <div class="container">
        <h2 class="section-title">其他成员</h2>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="12" :lg="8" v-for="founder in otherMembers" :key="founder.id">
            <div class="founder-card">
              <div class="founder-avatar">
                <img v-if="founder.avatar" :src="founder.avatar" :alt="founder.name" />
                <div v-else class="avatar-placeholder">
                  <span class="avatar-text">{{ founder.name.substring(0, 1) }}</span>
                </div>
              </div>
              <div class="founder-info">
                <h3>{{ founder.name }}</h3>
                <p class="title">{{ founder.title }}</p>
                <p class="bio">{{ founder.bio }}</p>
                <div class="social-links" v-if="founder.linkedin || founder.twitter">
                  <a v-if="founder.linkedin" :href="founder.linkedin" target="_blank" class="social-link">
                    <el-icon><Link /></el-icon>
                  </a>
                  <a v-if="founder.twitter" :href="founder.twitter" target="_blank" class="social-link">
                    <el-icon><Position /></el-icon>
                  </a>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="container" v-if="!mainFounder && coreMembers.length === 0 && otherMembers.length === 0">
      <el-empty description="暂无团队成员信息" />
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
import { ref, computed, onMounted } from 'vue'
import { Link, Position, Moon, Sunny } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { foundersAPI, statsAPI } from '../api'

const founders = ref<any[]>([])
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

// 创始人 (orderIndex === 0)
const mainFounder = computed(() => {
  return founders.value.find(f => f.orderIndex === 0)
})

// 核心成员 (orderIndex 1-5)
const coreMembers = computed(() => {
  return founders.value.filter(f => f.orderIndex > 0 && f.orderIndex <= 5).sort((a, b) => a.orderIndex - b.orderIndex)
})

// 其他成员 (orderIndex > 5)
const otherMembers = computed(() => {
  return founders.value.filter(f => f.orderIndex > 5).sort((a, b) => a.orderIndex - b.orderIndex)
})

const loadFounders = async () => {
  try {
    const data = await foundersAPI.getActive()
    founders.value = data
  } catch (error) {
    console.error('加载创始人失败:', error)
  }
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

onMounted(async () => {
  await Promise.all([
    loadFounders(),
    loadSiteName()
  ])
  loading.value = false
})
</script>

<style scoped>
.founders-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* 自定义加载遮罩样式 */
.founders-page :deep(.el-loading-mask) {
  background-color: transparent !important;
}

body.dark-mode .founders-page :deep(.el-loading-mask) {
  background-color: transparent !important;
}

.founders-page :deep(.el-loading-spinner) {
  display: none;
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

/* 团队成员区域 */
.founder-section,
.team-section {
  padding: 60px 24px;
}

.founder-section {
  padding-top: 80px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-founder-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.main-founder {
  max-width: 600px;
  width: 100%;
}

.founder-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.08);
  margin-bottom: 32px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 2px solid #e2e8f0;
}

.founder-card.founder-featured {
  border: 3px solid #d4af37;
  box-shadow: 0 6px 30px rgba(212, 175, 55, 0.25);
}

.founder-card.founder-featured:hover {
  box-shadow: 0 12px 50px rgba(212, 175, 55, 0.35);
}

.founder-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

.founder-avatar {
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.founder-avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%);
  background-size: 40px 40px;
  opacity: 0.3;
}

.founder-avatar img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.avatar-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 5px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.avatar-text {
  font-size: 72px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
}

.founder-info {
  padding: 32px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.founder-info h3 {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.founder-info .title {
  font-size: 16px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 16px;
}

.founder-info .bio {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 20px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.social-links {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  transition: all 0.3s;
  text-decoration: none;
}

.social-link:hover {
  background: #3b82f6;
  color: #fff;
  transform: translateY(-3px);
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

  .page-header {
    padding: 60px 16px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .founders-section {
    padding: 60px 16px;
  }

  .founder-avatar {
    height: 240px;
    padding: 30px;
  }

  .founder-avatar img {
    width: 160px;
    height: 160px;
  }
}
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .founders-page {
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

body.dark-mode .founder-section,
body.dark-mode .team-section {
  background: #0f1629 !important;
}

body.dark-mode .section-title {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

body.dark-mode .founder-card {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .founder-card:hover {
  box-shadow: 0 12px 40px rgba(96, 165, 250, 0.25) !important;
  border-color: #60a5fa !important;
}

body.dark-mode .founder-card.founder-featured {
  border-color: #d4af37 !important;
}

body.dark-mode .founder-card.founder-featured:hover {
  box-shadow: 0 12px 50px rgba(212, 175, 55, 0.35) !important;
}

body.dark-mode .founder-info h3 {
  color: #f1f5f9 !important;
}

body.dark-mode .founder-info .title {
  color: #60a5fa !important;
}

body.dark-mode .founder-info .bio {
  color: #cbd5e1 !important;
}

body.dark-mode .social-link {
  background: #1e293b !important;
  color: #cbd5e1 !important;
}

body.dark-mode .social-link:hover {
  background: #60a5fa !important;
  color: #fff !important;
}

body.dark-mode .footer {
  background: linear-gradient(135deg, #0d1120 0%, #060811 100%) !important;
}
</style>
