<template>
  <div class="projects-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">{{ siteName }}</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link active">项目经历</a>
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
        <h1 class="page-title">项目经历</h1>
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
              <div class="project-card">
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

const projects = ref<any[]>([])
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
  background: #f8f9fa;
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

/* 项目时间�?*/
.projects-section {
  padding: 80px 24px;
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
  background: linear-gradient(to bottom, #409eff, #67c23a);
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
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border: 4px solid #fff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(30, 58, 138, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-content {
  flex: 1;
}

.project-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.08);
  transition: all 0.3s;
  border: 2px solid #e2e8f0;
  padding: 20px;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
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
  background: #f5f7fa;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

  .project-image {
    height: 200px;
  }

  .project-info {
    padding: 24px;
  }

  .project-title {
    font-size: 20px;
  }
}
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .projects-page {
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

body.dark-mode .projects-section {
  background: #0f1629 !important;
}

body.dark-mode .timeline::before {
  background: linear-gradient(to bottom, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%) !important;
}

body.dark-mode .marker-circle {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
}

body.dark-mode .project-card {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .project-card:hover {
  box-shadow: 0 12px 40px rgba(96, 165, 250, 0.25) !important;
  border-color: #60a5fa !important;
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
  background: linear-gradient(135deg, #0d1120 0%, #060811 100%) !important;
}
</style>
}

.page-title {
  text-align: center;
  padding: 60px 0;
