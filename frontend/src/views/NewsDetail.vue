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
          <img v-if="news.coverImage" :src="news.coverImage" class="cover-image" />
          <div class="content" v-html="news.content"></div>
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
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #606266;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.04);
  transform: translateX(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.15);
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

.news-article {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.news-article h1 {
  font-size: 36px;
  margin-bottom: 20px;
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
  border-radius: 8px;
  margin-bottom: 30px;
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
  background: #0f1629 !important;
}

body.dark-mode .header {
  background: #1e293b !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .back-btn {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #cbd5e1 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .back-btn:hover {
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: #60a5fa !important;
  color: #60a5fa !important;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.25) !important;
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

body.dark-mode .news-article {
  background: #0f1629 !important;
}

body.dark-mode .news-article h1 {
  color: #f1f5f9 !important;
}

body.dark-mode .meta {
  color: #94a3b8 !important;
}

body.dark-mode .content {
  color: #cbd5e1 !important;
}

body.dark-mode .cover-image {
  border: 2px solid #3b4d66 !important;
}
</style>
