<template>
  <div class="founders-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ siteName }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link active">创始团队</a>
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

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-bg-animation"></div>
      <div class="header-particles">
        <span v-for="i in 15" :key="i" class="particle"></span>
      </div>
      <div class="container">
        <h1 class="page-title">创始团队</h1>
        <p class="page-subtitle">认识推动社区发展的核心成员</p>
      </div>
    </div>

    <!-- 创始人 -->
    <div class="founder-section" v-if="!foundersLoading && mainFounder">
      <div class="container">
        <h2 class="section-title">创始人</h2>
        <div class="main-founder-wrapper" v-if="mainFounder">
          <div class="founder-card founder-featured main-founder">
            <div class="founder-avatar" style="background: linear-gradient(135deg, #1a1f35 0%, #2d3548 100%);">
              <img v-if="mainFounder?.avatar" :src="getSecureAvatarUrl(mainFounder.avatar)" :alt="mainFounder?.name" />
              <div v-else class="avatar-placeholder">
                <span class="avatar-text">{{ mainFounder?.name?.substring(0, 1) }}</span>
              </div>
            </div>
            <div class="founder-info" v-if="mainFounder">
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
    <div class="team-section" v-if="otherMembers.length > 0">
      <div class="container">
        <h2 class="section-title">社区成员</h2>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="founder in otherMembers" :key="founder.id" style="display: flex; justify-content: center;">
            <div class="founder-card member-card">
              <div class="founder-avatar" :style="{ background: founder.avatarBgColor || 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }">
                <img v-if="founder.avatar" :src="getSecureAvatarUrl(founder.avatar)" :alt="founder.name" />
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

    <div class="container" v-if="!loading && !mainFounder && otherMembers.length === 0">
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
import { foundersAPI, statsAPI } from '../api'
import MobileMenu from '../components/MobileMenu.vue'
import { getSecureAvatarUrl } from '../utils/url'

const founders = ref<any[]>([])
const siteName = ref('超级A8俱乐部')
const isDark = ref(true)
const loading = ref(true)
const foundersLoading = ref(true)

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

// 创始人 (orderIndex === 0)
const mainFounder = computed(() => {
  return founders.value.find(f => f.orderIndex === 0)
})

// 所有其他成员 (orderIndex > 0)
const otherMembers = computed(() => {
  return founders.value.filter(f => f.orderIndex > 0).sort((a, b) => a.orderIndex - b.orderIndex)
})

const loadFounders = async () => {
  try {
    // 清除旧缓存格式
    localStorage.removeItem('founders-list')
    localStorage.removeItem('founders-list-time')
    
    foundersLoading.value = true
    const data = await foundersAPI.getActive()
    
    // 确保是数组
    founders.value = Array.isArray(data) ? data : []
    
    if (founders.value.length > 0) {
      // 为每个创始人根据头像URL生成背景色
      founders.value.forEach((founder) => {
        founder.avatarBgColor = generateColorFromUrl(founder.avatar || founder.name)
      })
      // 缓存数据
      localStorage.setItem('founders-list', JSON.stringify(founders.value))
      localStorage.setItem('founders-list-time', Date.now().toString())
    }
  } catch (error) {
    console.error('加载创始人失败:', error)
    founders.value = []
  } finally {
    foundersLoading.value = false
  }
}

// 根据URL或名字生成独特的渐变背景色
const generateColorFromUrl = (str: string) => {
  // 预设的7种内敛低饱和度的渐变色方案
  const colorSchemes = [
    { start: '#2c3e50', end: '#34495e' },  // 深蓝灰
    { start: '#445566', end: '#556677' },  // 石板灰
    { start: '#3d5a80', end: '#4a6fa5' },  // 钢青色
    { start: '#4a5568', end: '#5a6c7d' },  // 暗灰蓝
    { start: '#495057', end: '#5d646b' },  // 炭灰色
    { start: '#374151', end: '#475569' },  // 深炭灰
    { start: '#1e3a5f', end: '#2d4a6e' },  // 深海蓝
  ]
  
  // 使用字符串哈希来选择颜色
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  
  const colorIndex = Math.abs(hash) % colorSchemes.length
  const colors = colorSchemes[colorIndex]!
  
  return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`
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
  try {
    await Promise.allSettled([
      loadFounders(),
      loadSiteName()
    ])
  } catch (error) {
    console.error('页面加载出错:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.founders-page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), #fafafa;
  /* 防止CSS加载时的布局闪动 */
  display: flex;
  flex-direction: column;
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

/* 让社区成员卡片优先从中间开始排列 */
.team-section .el-row {
  display: flex !important;
  flex-wrap: wrap;
  justify-content: center;
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
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
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
  text-align: center;
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
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%);
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(30, 58, 138, 0.1);
  margin-bottom: 32px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
}

.founder-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s;
}

.founder-card:hover::before {
  left: 100%;
}

.founder-card.founder-featured {
  border: 2px solid #d4af37;
  box-shadow: 0 12px 48px rgba(212, 175, 55, 0.25);
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,250,240,0.98) 100%);
}

.founder-card.founder-featured.main-founder::after {
  content: '⭐ 创始人';
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #b8860b, #d4af37);
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.5);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.founder-card.founder-featured:hover {
  transform: none !important;
  box-shadow: 0 20px 60px rgba(212, 175, 55, 0.35);
}

.founder-card:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-color: rgba(59, 130, 246, 0.6);
  transform: translateY(-12px) !important;
}

/* 社区成员卡片样式 - 更紧凑 */
.founder-card.member-card {
  margin-bottom: 20px;
  will-change: box-shadow;
  max-width: 320px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.founder-card.member-card::before {
  display: none;
}

.founder-card.member-card:hover::before {
  display: none;
}

.founder-card.member-card:hover {
  transform: none !important;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(59, 130, 246, 0.6);
  filter: brightness(1.05);
}

.founder-card.member-card .founder-avatar {
  height: 160px;
  padding: 20px;
}

.founder-card.member-card .founder-avatar img,
.founder-card.member-card .avatar-placeholder {
  width: 120px;
  height: 120px;
}

.founder-card.member-card .avatar-placeholder .avatar-text {
  font-size: 2rem;
}

.founder-card.member-card .founder-info {
  padding: 16px;
}

.founder-card.member-card .founder-info h3 {
  font-size: 1rem;
  margin-bottom: 6px;
}

.founder-card.member-card .founder-info .title {
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.founder-card.member-card .founder-info .bio {
  font-size: 0.8rem;
  line-height: 1.4;
  max-height: 3.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.avatar-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
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
  transform: none;
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

  /* 移动端社区成员卡片优化 */
  .founder-card.member-card .founder-avatar {
    height: 140px;
    padding: 15px;
  }

  .founder-card.member-card .founder-avatar img,
  .founder-card.member-card .avatar-placeholder {
    width: 110px;
    height: 110px;
  }

  .founder-card.member-card .avatar-placeholder .avatar-text {
    font-size: 2.5rem;
  }

  .founder-card.member-card .founder-info {
    padding: 12px;
    min-height: 120px;
  }

  .founder-card.member-card .founder-info h3 {
    font-size: 0.95rem;
    margin-bottom: 4px;
  }

  .founder-card.member-card .founder-info .title {
    font-size: 0.8rem;
    margin-bottom: 6px;
  }

  .founder-card.member-card .founder-info .bio {
    font-size: 0.75rem;
    line-height: 1.3;
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
body.dark-mode .founders-page {
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

body.dark-mode .founder-section,
body.dark-mode .team-section {
  background: radial-gradient(ellipse at 50% 50%, rgba(100, 50, 150, 0.05) 0%, transparent 50%), transparent !important;
}

body.dark-mode .section-title {
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.3)) !important;
}

body.dark-mode .founder-card {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .founder-card:hover {
  transform: translateY(-12px) !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(59, 130, 246, 0.6) !important;
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
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.95) 0%, rgba(5, 5, 15, 1) 100%) !important;
  color: #cbd5e1 !important;
  border-top: 1px solid rgba(167, 139, 250, 0.2) !important;
}
</style>
