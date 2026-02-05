<template>
  <div class="news-detail-page">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <button class="back-btn" @click="$router.back()">
            <el-icon :size="18"><ArrowLeft /></el-icon>
            <span>返回</span>
          </button>
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
      </el-header>

      <el-main v-if="news">
        <article class="news-article">
          <h1>{{ news.title }}</h1>
          <p class="meta">发布时间: {{ formatDate(news.publishedAt) }}</p>
          <div class="tags">
            <el-tag v-for="tag in news.tags" :key="tag">{{ tag }}</el-tag>
          </div>
          <img v-if="news.coverImage" :src="getSecureImageUrl(news.coverImage)" class="cover-image" />
          <div class="content" style="white-space: pre-wrap;">{{ news.content }}</div>
        </article>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Moon, Sunny } from '@element-plus/icons-vue'
import { newsAPI } from '../api'
import { getSecureImageUrl } from '../utils/url'

const route = useRoute()
const news = ref<any>(null)
const isDark = ref(true)

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
    const id = Number(route.params.id)
    news.value = await newsAPI.getOne(id)
  } catch (error) {
    console.error('加载新闻详情失败:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  loadNews()
  
  // 初始化主题
  const savedTheme = localStorage.getItem('frontend-theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.body.classList.remove('dark-mode')
    document.documentElement.classList.remove('dark-mode')
  } else {
    document.body.classList.add('dark-mode')
    document.documentElement.classList.add('dark-mode')
  }
})
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), #fafafa;
  position: relative;
  /* 防止CSS加载时的布局闪动 */
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
  color: #4b5563;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-btn:hover {
  border-color: rgba(59, 130, 246, 0.6);
  color: #3b82f6;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%);
  transform: translateY(-2px) translateX(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
}

.theme-toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6366f1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.theme-toggle-btn:hover {
  border-color: rgba(59, 130, 246, 0.6);
  color: #3b82f6;
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.news-article {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.news-article h1 {
  font-size: 36px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.meta {
  color: #909399;
  margin-bottom: 15px;
}

.tags {
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
}

.cover-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 30px;
  border: 2px solid rgba(99, 102, 241, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.content {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.content :deep(p) {
  margin-bottom: 15px;
}
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .news-detail-page {
  background: radial-gradient(ellipse at 30% 20%, rgba(120, 40, 200, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(30, 100, 200, 0.08) 0%, transparent 50%),
              #000000 !important;
  position: relative;
  overflow-x: hidden;
}

body.dark-mode .news-detail-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at 20% 30%, rgba(120, 40, 200, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(30, 100, 200, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

body.dark-mode .header {
  background: rgba(10, 10, 20, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
  border-bottom: 1px solid rgba(167, 139, 250, 0.2) !important;
  position: relative;
  z-index: 10;
}

body.dark-mode .back-btn {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.6) 0%, rgba(20, 20, 40, 0.6) 100%) !important;
  backdrop-filter: blur(10px) !important;
  border-color: rgba(167, 139, 250, 0.3) !important;
  color: #cbd5e1 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .back-btn:hover {
  background: linear-gradient(135deg, rgba(40, 30, 60, 0.8) 0%, rgba(30, 30, 50, 0.8) 100%) !important;
  border-color: rgba(167, 139, 250, 0.6) !important;
  color: #a78bfa !important;
  box-shadow: 0 6px 16px rgba(167, 139, 250, 0.3) !important;
  transform: translateY(-2px) translateX(-2px) !important;
}

body.dark-mode .theme-toggle-btn {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.6) 0%, rgba(20, 20, 40, 0.6) 100%) !important;
  backdrop-filter: blur(10px) !important;
  border-color: rgba(167, 139, 250, 0.3) !important;
  color: #a78bfa !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .theme-toggle-btn:hover {
  background: linear-gradient(135deg, rgba(40, 30, 60, 0.8) 0%, rgba(30, 30, 50, 0.8) 100%) !important;
  border-color: rgba(167, 139, 250, 0.6) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 16px rgba(167, 139, 250, 0.4) !important;
}

body.dark-mode .news-article {
  background: linear-gradient(135deg, rgba(30, 20, 50, 0.5) 0%, rgba(20, 20, 40, 0.5) 100%) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(167, 139, 250, 0.15) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(120, 40, 200, 0.05) !important;
  position: relative;
  z-index: 1;
}

body.dark-mode .news-article h1 {
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.3)) !important;
}

body.dark-mode .meta {
  color: #94a3b8 !important;
}

body.dark-mode .content {
  color: #cbd5e1 !important;
}

body.dark-mode .cover-image {
  border: 2px solid rgba(167, 139, 250, 0.2) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(120, 40, 200, 0.1) !important;
}
</style>
