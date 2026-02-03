<template>
  <div class="projects-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ siteName }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link active">合作项目</a>
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
        <h1 class="page-title">合作项目</h1>
        <p class="page-subtitle">探索我们完成的项目和正在进行的创新工作</p>
      </div>
    </div>

    <!-- 项目时间线 -->
    <div class="projects-section">
      <div class="container">
        <div class="timeline">
          <div class="timeline-item" v-for="project in projects" :key="project.id">
            <div class="timeline-marker">
              <div class="marker-circle"></div>
            </div>
            <div class="timeline-content">
              <div class="project-card" :class="{ 'is-pinned': project.orderIndex === 0 }">
                <!-- 置顶标签 -->
                <div v-if="project.orderIndex === 0" class="pinned-badge">
                  <span>已置顶</span>
                </div>
                <div class="project-header">
                  <div class="project-image">
                    <img v-if="project.image" :src="project.image" :alt="project.title" />
                    <div v-else class="project-placeholder">
                      {{ project.title.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="project-info">
                    <div class="project-meta">
                      <span class="project-date">
                        <el-icon><Calendar /></el-icon>
                        {{ formatDate(project.startDate) }}
                        <span v-if="project.endDate"> - {{ formatDate(project.endDate) }}</span>
                      </span>
                      <el-tag v-if="!project.endDate" type="success" effect="plain">进行中</el-tag>
                    </div>
                    <h3 class="project-title">{{ project.title }}</h3>
                    <p class="project-description">{{ project.description }}</p>
                    <div class="project-tags" v-if="project.tags && project.tags.length">
                      <el-tag v-for="tag in getTags(project.tags)" :key="tag" size="small">{{ tag }}</el-tag>
                    </div>
                    <div v-if="project.link" class="project-link">
                      <span>项目链接：</span>
                      <a :href="project.link" target="_blank">{{ project.link }}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!loading && projects.length === 0" description="暂无项目信息" :image-size="200" />
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
import { Calendar, Moon, Sunny } from '@element-plus/icons-vue'
import { projectsAPI, statsAPI } from '../api'
import MobileMenu from '../components/MobileMenu.vue'

const projects = ref<any[]>([])
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

const loadProjects = async () => {
  try {
    const data = await projectsAPI.getActive()
    projects.value = data
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
  })
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

onMounted(async () => {
  await Promise.all([
    loadProjects(),
    loadSiteName()
  ])
  loading.value = false
})
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), #fafafa;
}
/* 自定义加载遮罩样式 */
.projects-page :deep(.el-loading-mask) {
  background-color: transparent !important;
}

body.dark-mode .projects-page :deep(.el-loading-mask) {
  background-color: transparent !important;
}

.projects-page :deep(.el-loading-spinner) {
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

/* 项目时间�?*/
.projects-section {
  padding: 80px 24px;
  background: transparent;
}

.timeline {
  position: relative;
  padding: 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #6366f1 0%, #3b82f6 50%, #06b6d4 100%);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
}

.timeline-item {
  position: relative;
  padding-left: 80px;
  margin-bottom: 60px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
}

.marker-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #3b82f6 0%, #2563eb 50%, #1e40af 80%, #0c1e4a 100%);
  border: none;
  box-shadow: 
    0 0 10px rgba(59, 130, 246, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset -15px -15px 30px rgba(0, 0, 0, 0.3),
    inset 15px 15px 30px rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.marker-circle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: transparent;
  top: 0;
  left: 0;
}

.marker-circle::after {
  content: '';
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid rgba(147, 197, 253, 0.15);
  border-top-color: transparent;
  border-bottom-color: rgba(147, 197, 253, 0.08);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(75deg) rotateZ(-15deg);
  box-shadow: 
    0 0 8px rgba(59, 130, 246, 0.15),
    inset 0 0 5px rgba(59, 130, 246, 0.1);
}

.timeline-content {
  flex: 1;
}

.project-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: visible;
  box-shadow: 0 8px 32px rgba(30, 58, 138, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(59, 130, 246, 0.15);
  padding: 28px;
  position: relative;
}

/* 置顶标签样式 - 右上角折角效果 */
.pinned-badge {
  position: absolute;
  top: -4px;
  right: -4px;
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
  box-shadow: 0 3px 10px rgba(245, 158, 11, 0.4);
  color: #000;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transform: rotate(45deg);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.pinned-badge span {
  display: none;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.4s;
}

.project-card:hover::before {
  transform: scaleX(1);
}

.project-card:hover {
  transform: none;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.18);
  border-color: rgba(59, 130, 246, 0.6);
  filter: brightness(1.05);
}

.project-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  align-items: start;
}

.project-image {
  width: 200px;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
  border-radius: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
}

.project-image::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 2px solid rgba(59, 130, 246, 0.2);
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
  transform: none;
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
  padding: 0;
  min-width: 0;
}

.project-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.project-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #909399;
}

.project-title {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
  line-height: 1.4;
}

.project-description {
  font-size: 15px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 20px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.project-link span {
  color: #909399;
  font-weight: 500;
}

.project-link a {
  color: #3b82f6;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.3s ease;
}

.project-link a:hover {
  color: #2563eb;
  text-decoration: underline;
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

  .projects-section {
    padding: 60px 16px;
  }

  .timeline::before {
    left: 20px;
  }

  .timeline-item {
    padding-left: 60px;
  }

  .marker-circle {
    width: 40px;
    height: 40px;
  }

  /* 移动端项目卡片布局优化 */
  .project-card {
    padding: 20px;
  }

  .project-header {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .project-image {
    width: 100%;
    height: 200px;
    margin: 0 auto;
  }

  .project-info {
    padding: 0;
  }

  .project-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .project-description {
    font-size: 14px;
    line-height: 1.6;
  }

  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .project-date {
    font-size: 13px;
  }

  .project-tags {
    margin-top: 12px;
    gap: 6px;
  }

  .project-link {
    margin-top: 12px;
    padding: 12px;
    font-size: 13px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .project-link a {
    word-break: break-all;
  }

  /* 置顶标签在移动端调整位置 */
  .pinned-badge {
    width: 80px;
    height: 80px;
  }

  .pinned-badge::before {
    top: 16px;
    right: -20px;
    width: 100px;
    padding: 4px 0;
    font-size: 11px;
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
body.dark-mode .projects-page {
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

body.dark-mode .projects-section {
  background: radial-gradient(ellipse at 50% 50%, rgba(100, 50, 150, 0.05) 0%, transparent 50%), transparent !important;
}

body.dark-mode .timeline::before {
  background: linear-gradient(to bottom, #a78bfa 0%, #60a5fa 50%, #a78bfa 100%) !important;
  box-shadow: 0 0 12px rgba(167, 139, 250, 0.4) !important;
}

body.dark-mode .marker-circle {
  background: radial-gradient(circle at 50% 50%, #8b5cf6 0%, #7c3aed 50%, #6d28d9 80%, #2d1b4e 100%) !important;
  border: none !important;
  box-shadow: 
    0 0 15px rgba(167, 139, 250, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset -15px -15px 30px rgba(0, 0, 0, 0.4),
    inset 15px 15px 30px rgba(255, 255, 255, 0.04) !important;
}

body.dark-mode .marker-circle::before {
  background: transparent !important;
}

body.dark-mode .marker-circle::after {
  border: 2px solid rgba(167, 139, 250, 0.2);
  border-top-color: transparent;
  border-bottom-color: rgba(167, 139, 250, 0.1);
  box-shadow: 
    0 0 10px rgba(167, 139, 250, 0.2),
    inset 0 0 8px rgba(167, 139, 250, 0.12) !important;
}

body.dark-mode .project-card {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.5) 0%, rgba(20, 20, 40, 0.5) 100%) !important;
  border: 1px solid rgba(167, 139, 250, 0.15) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(120, 40, 200, 0.05) !important;
  backdrop-filter: blur(10px) !important;
}

body.dark-mode .pinned-badge::before {
  background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%) !important;
  box-shadow: 0 3px 10px rgba(252, 211, 77, 0.5) !important;
  color: #000 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3) !important;
}

body.dark-mode .project-card:hover {
  transform: none !important;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(167, 139, 250, 0.3) !important;
  filter: brightness(1.15) !important;
}

body.dark-mode .project-title {
  color: #f1f5f9 !important;
}

body.dark-mode .project-description {
  color: #cbd5e1 !important;
}

body.dark-mode .project-link {
  border-color: #3b4d66 !important;
}

body.dark-mode .project-link span {
  color: #94a3b8 !important;
}

body.dark-mode .project-link a {
  color: #60a5fa !important;
}

body.dark-mode .project-link a:hover {
  color: #3b82f6 !important;
}

body.dark-mode .project-meta,
body.dark-mode .project-date {
  color: #94a3b8 !important;
}

body.dark-mode .footer {
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.95) 0%, rgba(5, 5, 15, 1) 100%) !important;
  color: #cbd5e1 !important;
  border-top: 1px solid rgba(167, 139, 250, 0.2) !important;
}
</style>
}

.page-title {
  text-align: center;
  padding: 60px 0;
