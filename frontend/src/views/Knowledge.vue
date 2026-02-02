<template>
  <div class="knowledge-page">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">超级A8俱乐部</a>
        <div class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/founders" class="nav-link">创始团队</a>
          <a href="/projects" class="nav-link">合作项目</a>
          <a href="/news" class="nav-link">社区动态</a>
          <a href="/knowledge" class="nav-link active">发现</a>
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

    <!-- Hero 区 -->
    <div class="knowledge-hero">
      <div class="hero-content">
        <h1 class="hero-title">发现</h1>
        <p class="hero-subtitle">启迪思想 · 链接世界</p>
        <div class="hero-divider">
          <span class="divider-ornament">◈</span>
        </div>
      </div>
    </div>

    <!-- 创始人语录 -->
    <section class="quotes-section">
      <div class="section-header">
        <div class="section-title-wrapper">
          <div class="title-ornament left">❖</div>
          <h2>创始人语录</h2>
          <div class="title-ornament right">❖</div>
        </div>
        <p>智慧之光，照耀前路</p>
      </div>
      
      <div class="quotes-container">
        <div v-for="(group, dateKey) in paginatedQuotes" :key="dateKey" class="quote-card">
          <div class="quote-date">{{ dateKey }}</div>
          <div v-if="group[0]" class="quote-item">
            <div class="quote-content">
              <p class="quote-text">{{ group[0].content }}</p>
              <div class="quote-author">—— {{ group[0].author }}</div>
              <div v-if="group[0].context" class="quote-context">{{ group[0].context }}</div>
            </div>
            <div v-if="group.length > 1" class="quote-badge" @click="showMoreQuotes(dateKey, group)">
              {{ group.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <div class="pagination-info">
          <span class="current-page">{{ currentPage }}</span>
          <span class="separator">/</span>
          <span class="total-pages">{{ totalPages }}</span>
        </div>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>

      <!-- 语录详情弹窗 - 自定义 -->
      <div v-if="dialogVisible" class="custom-dialog-overlay" @click.self="dialogVisible = false">
        <div class="custom-dialog-box">
          <div class="custom-dialog-header">
            <div class="custom-dialog-title">{{ dialogTitle }}</div>
            <button class="custom-dialog-close" @click="dialogVisible = false">×</button>
          </div>
          <div class="custom-dialog-body">
            <div class="dialog-quotes-list">
              <div v-for="(quote, index) in selectedQuotes" :key="quote.id" class="dialog-quote-item">
                <div class="quote-number">({{ index + 1 }})</div>
                <div class="quote-content">
                  <div class="quote-text">
                    <span class="quote-mark">「</span>
                    {{ quote.content }}
                    <span class="quote-mark">」</span>
                  </div>
                  <div class="quote-meta">
                    <span class="quote-author">—— {{ quote.author }}</span>
                    <span v-if="quote.context" class="quote-context">· {{ quote.context }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 社区工具 -->
    <section class="tools-section">
      <div class="section-header">
        <div class="section-title-wrapper">
          <div class="title-ornament left">❖</div>
          <h2>社区工具</h2>
          <div class="title-ornament right">❖</div>
        </div>
        <p>利器善事，以技载道</p>
      </div>

      <div class="tools-container">
        <div v-for="tool in tools" :key="tool.id" class="tool-card" @click="openTool(tool.url)">
          <div class="tool-icon" v-if="tool.icon">
            <img :src="tool.icon" :alt="tool.name">
          </div>
          <div class="tool-icon default-icon" v-else>
            <svg viewBox="0 0 1024 1024" fill="currentColor">
              <path d="M853.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667v256a42.666667 42.666667 0 0 1-42.666667 42.666667H256a42.666667 42.666667 0 0 1-42.666667-42.666667V256a42.666667 42.666667 0 0 1 42.666667-42.666667h256a42.666667 42.666667 0 0 0 0-85.333333H256a128 128 0 0 0-128 128v512a128 128 0 0 0 128 128h512a128 128 0 0 0 128-128v-256a42.666667 42.666667 0 0 0-42.666667-42.666667z"/>
              <path d="M682.666667 213.333333h67.413333l-268.373333 268.373334a42.666667 42.666667 0 0 0 60.586666 60.586666l268.373334-268.373333V341.333333a42.666667 42.666667 0 0 0 85.333333 0V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667h-170.666666a42.666667 42.666667 0 0 0 0 85.333333z"/>
            </svg>
          </div>
          <div class="tool-info">
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
            <span v-if="tool.category" class="tool-category">{{ tool.category }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-container">
        <div class="footer-bottom">
          <p>&copy; 2026 {{ siteName }}. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { quotesAPI, toolsAPI } from '../api'
import { Sunny, Moon } from '@element-plus/icons-vue'

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

interface Quote {
  id: number
  content: string
  author: string
  context?: string
  order: number
  createdAt: string
  publishDate?: string
}

interface Tool {
  id: number
  name: string
  description: string
  url: string
  icon?: string
  category?: string
  order: number
}

const quotes = ref<Quote[]>([])
const tools = ref<Tool[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const selectedQuotes = ref<Quote[]>([])
const currentPage = ref(1)
const pageSize = 6

// 按日期分组语录
const groupedQuotes = computed(() => {
  const groups: Record<string, Quote[]> = {}
  
  quotes.value.forEach(quote => {
    const dateString = quote.publishDate || quote.createdAt
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}.${month}.${day}`
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(quote)
  })
  
  // 转换为数组并按日期倒序排序
  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => {
      return new Date(b[0].replace(/\./g, '-')).getTime() - new Date(a[0].replace(/\./g, '-')).getTime()
    })
  )
})

// 分页后的语录组
const paginatedQuotes = computed(() => {
  const entries = Object.entries(groupedQuotes.value)
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return Object.fromEntries(entries.slice(start, end))
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(Object.keys(groupedQuotes.value).length / pageSize)
})

const fetchQuotes = async () => {
  try {
    const data = await quotesAPI.getList()
    // 按发布日期倒序排序，如果没有发布日期则使用创建时间
    quotes.value = data.sort((a: Quote, b: Quote) => {
      const dateA = a.publishDate || a.createdAt
      const dateB = b.publishDate || b.createdAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  } catch (error) {
    console.error('获取语录失败:', error)
  }
}

const showMoreQuotes = (dateKey: string, quotesGroup: Quote[]) => {
  dialogTitle.value = `${dateKey} 的语录`
  selectedQuotes.value = quotesGroup
  dialogVisible.value = true
}

const fetchTools = async () => {
  try {
    const data = await toolsAPI.getList()
    tools.value = data
  } catch (error) {
    console.error('获取工具列表失败:', error)
  }
}

const openTool = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  fetchQuotes()
  fetchTools()
})
</script>

<style scoped>
/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  transition: color 0.3s ease;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-link {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
  padding: 20px 0;
}

.nav-link:hover {
  color: #3b82f6;
}

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

.knowledge-page {
  min-height: 100vh;
  padding-top: 64px;
  background: #fff;
}

/* Hero 区 */
.knowledge-hero {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 140px 24px 100px;
  text-align: center;
  color: #f5f5dc;
  position: relative;
  overflow: hidden;
}

.knowledge-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245, 245, 220, 0.03) 2px, rgba(245, 245, 220, 0.03) 4px),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245, 245, 220, 0.03) 2px, rgba(245, 245, 220, 0.03) 4px);
  opacity: 0.5;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-decoration {
  margin-bottom: 30px;
}

.chinese-pattern {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border: 3px solid rgba(245, 245, 220, 0.4);
  border-radius: 50%;
  position: relative;
  background: transparent;
}

.chinese-pattern::before {
  display: none;
}

.chinese-pattern::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 30px;
  background: rgba(245, 245, 220, 0.4);
  border-radius: 2px;
  bottom: -25px;
  right: -8px;
  transform: rotate(45deg);
}

.hero-title {
  font-size: 72px;
  font-weight: 900;
  margin: 0 0 20px;
  letter-spacing: 20px;
  color: #f5f5dc;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-family: 'KaiTi', 'STKaiti', serif;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  letter-spacing: 8px;
  color: #d4c5a9;
}

.hero-divider {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-ornament {
  font-size: 24px;
  color: rgba(245, 245, 220, 0.5);
}

/* 通用 Section */
.quotes-section,
.tools-section {
  padding: 100px 24px;
}

.quotes-section {
  background: linear-gradient(to bottom, #f8f6f0 0%, #faf8f3 100%);
}

.quotes-section > *,
.tools-section > * {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.tools-section {
  background: linear-gradient(to bottom, #f5f3ed 0%, #f0ebe0 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.title-ornament {
  font-size: 20px;
  color: #c9a961;
  opacity: 0.6;
}

.section-header h2 {
  font-size: 40px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: 8px;
  font-family: 'KaiTi', 'STKaiti', serif;
  position: relative;
}

.section-header p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  letter-spacing: 4px;
}

/* 语录卡片容器 */
.quotes-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-bottom: 40px;
}

.pagination-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #faf8f3 0%, #f5f2ea 100%);
  border: 1px solid rgba(139, 111, 71, 0.2);
  border-radius: 6px;
  color: #8b6f47;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: rgba(139, 111, 71, 0.4);
  background: linear-gradient(135deg, #f5f2ea 0%, #faf8f3 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #8b6f47;
  font-weight: 500;
}

.current-page {
  font-size: 18px;
  font-weight: 600;
}

.separator {
  opacity: 0.5;
}

.quote-card {
  background: linear-gradient(135deg, #faf8f3 0%, #f5f2ea 100%);
  border: 1px solid rgba(139, 111, 71, 0.15);
  border-radius: 6px;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.quote-card::before {
  display: none;
}

.quote-card::after {
  display: none;
}

.quote-card:hover {
  border-color: rgba(139, 111, 71, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.quote-date {
  background: transparent;
  border-bottom: 1px solid rgba(139, 111, 71, 0.1);
  padding: 12px 16px;
  font-size: 13px;
  color: #8b6f47;
  font-family: 'Consolas', monospace;
  letter-spacing: 1px;
  font-weight: 500;
  text-align: center;
  position: relative;
  flex-shrink: 0;
}

.quote-date::after {
  display: none;
}

.quote-item {
  padding: 24px 18px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  background: transparent;
  flex: 1;
}

.quote-content {
  flex: 1;
}

.quote-text {
  font-size: 15px;
  line-height: 1.85;
  color: #2d2d2d;
  margin: 0 0 12px;
  font-family: 'STSong', 'SimSun', serif;
  letter-spacing: 0px;
  font-weight: 400;
}

.quote-author {
  font-size: 12px;
  color: #8b6f47;
  font-weight: 500;
  margin-bottom: 6px;
  font-family: 'KaiTi', 'STKaiti', serif;
  letter-spacing: 0.5px;
}

.quote-context {
  font-size: 11px;
  color: #9a8b7e;
  opacity: 0.85;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.2px;
}

.quote-badge {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b6f47 0%, #a89068 100%);
  color: #faf8f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  border: none;
  font-family: 'STSong', 'SimSun', serif;
}

.quote-badge:hover {
  transform: scale(1.15);
  background: linear-gradient(135deg, #a89068 0%, #8b6f47 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 竖排语录容器 - 隐藏 */
.quotes-vertical-container {
  display: none;
}

.quotes-timeline::before {
  content: '卷';
  position: absolute;
  top: 0;
  left: 100px;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: radial-gradient(circle, #c9a961 0%, #d4b673 70%);
  color: #2c3e50;
  font-size: 14px;
  font-weight: bold;
  font-family: 'KaiTi', 'STKaiti', serif;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(201, 169, 97, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(44, 62, 80, 0.1);
  z-index: 3;
  display: none;
}

.quotes-timeline::after {
  content: '轴';
  position: absolute;
  bottom: 0;
  left: 100px;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: radial-gradient(circle, #c9a961 0%, #d4b673 70%);
  color: #2c3e50;
  font-size: 14px;
  font-weight: bold;
  font-family: 'KaiTi', 'STKaiti', serif;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(201, 169, 97, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(44, 62, 80, 0.1);
  z-index: 3;
  display: none;
}

.timeline-line {
  position: absolute;
  left: 108px;
  top: 14px;
  bottom: 14px;
  width: 16px;
  background: 
    repeating-linear-gradient(
      0deg,
      #d4b673 0px,
      #c9a961 2px,
      #e8dcc8 4px,
      #c9a961 6px,
      #d4b673 8px,
      transparent 8px,
      transparent 9px
    ),
    linear-gradient(90deg, 
      rgba(139, 69, 19, 0.1) 0%,
      rgba(201, 169, 97, 0.3) 50%,
      rgba(139, 69, 19, 0.1) 100%
    ),
    linear-gradient(180deg,
      #d4b673 0%,
      #c9a961 20%,
      #e8dcc8 50%,
      #c9a961 80%,
      #d4b673 100%
    );
  box-shadow: 
    0 0 8px rgba(201, 169, 97, 0.5),
    inset 2px 0 4px rgba(139, 69, 19, 0.2),
    inset -2px 0 4px rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(201, 169, 97, 0.4);
  z-index: 2;
  display: none;
}


/* 工具卡片 */
.tools-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.tool-card {
  background: linear-gradient(135deg, #fdfbf7 0%, #f8f6f0 100%);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e8dcc8;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, #c9a961 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tool-card:hover {
  border-color: #c9a961;
  box-shadow: 0 12px 40px rgba(201, 169, 97, 0.2);
  transform: translateY(-6px);
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-icon {
  width: 72px;
  height: 72px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f6f0 0%, #f0ebe0 100%);
  border: 2px solid #e8dcc8;
  transition: all 0.3s ease;
}

.tool-card:hover .tool-icon {
  border-color: #c9a961;
  transform: scale(1.05);
}

.tool-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.tool-icon.default-icon {
  background: linear-gradient(135deg, #c9a961 0%, #d4b673 100%);
  border: none;
  color: #fff;
}

.tool-icon svg {
  width: 36px;
  height: 36px;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px;
  font-family: 'KaiTi', 'STKaiti', serif;
  letter-spacing: 2px;
}

.tool-description {
  font-size: 14px;
  line-height: 1.8;
  color: #7f8c8d;
  margin: 0 0 16px;
}

.tool-category {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(201, 169, 97, 0.1);
  color: #c9a961;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  border: 1px solid rgba(201, 169, 97, 0.2);
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
  }

  .logo {
    font-size: 18px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-link {
    font-size: 14px;
    padding: 16px 0;
  }

  .hero-title {
    font-size: 48px;
    letter-spacing: 4px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .quotes-section,
  .tools-section {
    padding: 60px 16px;
  }

  .section-header h2 {
    font-size: 28px;
  }

  .quotes-container,
  .tools-container {
    grid-template-columns: 1fr;
  }

  .quote-card {
    padding: 24px;
  }

  .quote-content {
    font-size: 16px;
  }
}

/* 深色模式 */
body.dark-mode .knowledge-page {
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

body.dark-mode .knowledge-hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
}

body.dark-mode .hero-title,
body.dark-mode .hero-subtitle,
body.dark-mode .divider-ornament {
  color: #d4c5a9 !important;
}

body.dark-mode .chinese-pattern {
  border-color: rgba(201, 169, 97, 0.5);
}

body.dark-mode .chinese-pattern::after {
  background: rgba(201, 169, 97, 0.5);
}

body.dark-mode .quotes-section {
  background: linear-gradient(to bottom, #0f0f1e 0%, #16213e 100%) !important;
}

body.dark-mode .tools-section {
  background: linear-gradient(to bottom, #1a1a2e 0%, #0f0f1e 100%) !important;
}

body.dark-mode .section-header h2 {
  background: linear-gradient(135deg, #d4c5a9 0%, #c9a961 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

body.dark-mode .section-header p {
  color: #8b8b8b !important;
}

body.dark-mode .title-ornament {
  color: #c9a961 !important;
}

body.dark-mode .timeline-line {
  background: 
    repeating-linear-gradient(
      0deg,
      #d4b673 0px,
      #c9a961 2px,
      rgba(201, 169, 97, 0.6) 4px,
      #c9a961 6px,
      #d4b673 8px,
      transparent 8px,
      transparent 9px
    ),
    linear-gradient(90deg, 
      rgba(139, 69, 19, 0.2) 0%,
      rgba(201, 169, 97, 0.4) 50%,
      rgba(139, 69, 19, 0.2) 100%
    ),
    linear-gradient(180deg,
      #d4b673 0%,
      #c9a961 20%,
      rgba(201, 169, 97, 0.8) 50%,
      #c9a961 80%,
      #d4b673 100%
    ) !important;
  box-shadow: 
    0 0 12px rgba(201, 169, 97, 0.6),
    inset 2px 0 4px rgba(201, 169, 97, 0.3),
    inset -2px 0 4px rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(201, 169, 97, 0.5) !important;
}

body.dark-mode .timeline-line::before,
body.dark-mode .timeline-line::after {
  background: linear-gradient(90deg, transparent 0%, #c9a961 50%, transparent 100%) !important;
  opacity: 0.4 !important;
}

body.dark-mode .quotes-timeline::before,
body.dark-mode .quotes-timeline::after {
  background: radial-gradient(circle, #c9a961 0%, #d4b673 70%) !important;
  color: #1a1a2e !important;
  box-shadow: 0 2px 12px rgba(201, 169, 97, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(201, 169, 97, 0.3) !important;
}

body.dark-mode .timeline-dot {
  background: radial-gradient(circle, #c9a961 0%, #d4b673 100%) !important;
  border-color: #1a1a2e !important;
  box-shadow: 
    0 0 0 4px rgba(201, 169, 97, 0.3),
    0 2px 12px rgba(201, 169, 97, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.3) !important;
}

body.dark-mode .timeline-dot::before {
  color: rgba(26, 26, 46, 0.5) !important;
}

body.dark-mode .timeline-item:hover .timeline-dot {
  box-shadow: 
    0 0 0 6px rgba(201, 169, 97, 0.4), 
    0 0 20px rgba(201, 169, 97, 0.8),
    inset 0 1px 3px rgba(255, 255, 255, 0.4) !important;
}

body.dark-mode .timeline-date {
  color: #c9a961 !important;
}

body.dark-mode .timeline-content {
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 24px,
      rgba(201, 169, 97, 0.05) 24px,
      rgba(201, 169, 97, 0.05) 25px
    ),
    linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%) !important;
  border-top-color: rgba(201, 169, 97, 0.3) !important;
  border-bottom-color: rgba(201, 169, 97, 0.3) !important;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(201, 169, 97, 0.2) !important;
}

body.dark-mode .timeline-content::before {
  background: 
    repeating-linear-gradient(
      180deg,
      #c9a961 0px,
      #d4b673 3px,
      #c9a961 6px,
      transparent 6px,
      transparent 8px
    ) !important;
  opacity: 0.5 !important;
}

body.dark-mode .timeline-content::after {
  color: #c9a961 !important;
  opacity: 0.4 !important;
}

body.dark-mode .timeline-item:hover .timeline-content {
  box-shadow: 
    0 12px 40px rgba(201, 169, 97, 0.2),
    inset 0 1px 0 rgba(201, 169, 97, 0.3) !important;
}

body.dark-mode .timeline-item:hover .timeline-content::before {
  opacity: 0.7 !important;
}

body.dark-mode .timeline-item:hover .timeline-content::after {
  opacity: 0.6 !important;
}

body.dark-mode .quote-text {
  color: #d4c5a9 !important;
}

body.dark-mode .quote-mark {
  color: #c9a961 !important;
}

body.dark-mode .quote-card {
  background: linear-gradient(135deg, #16213e 0%, #0f1626 100%);
  border-color: rgba(201, 169, 97, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

body.dark-mode .quote-card {
  background: linear-gradient(135deg, #16213e 0%, #0f1626 100%);
  border-color: rgba(201, 169, 97, 0.1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

body.dark-mode .quote-card:hover {
  border-color: rgba(201, 169, 97, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

body.dark-mode .quote-date {
  border-bottom-color: rgba(201, 169, 97, 0.1);
  color: #a89068;
}

body.dark-mode .quote-date::after {
  display: none;
}

body.dark-mode .quote-item {
  background: transparent;
}

body.dark-mode .quote-text {
  color: #d4c5a9;
}

body.dark-mode .quote-author {
  color: #a89068;
}

body.dark-mode .quote-context {
  color: #8b8b8b;
}

body.dark-mode .quote-badge {
  background: linear-gradient(135deg, #a89068 0%, #c9a961 100%);
  color: #1a1a2e;
  border: none;
  box-shadow: 0 3px 10px rgba(201, 169, 97, 0.3);
}

body.dark-mode .quote-badge:hover {
  background: linear-gradient(135deg, #c9a961 0%, #a89068 100%);
  box-shadow: 0 4px 14px rgba(201, 169, 97, 0.4);
}

/* 暗色模式 - 分页 */
body.dark-mode .pagination-btn {
  background: linear-gradient(135deg, #16213e 0%, #0f1626 100%);
  border-color: rgba(201, 169, 97, 0.15);
  color: #a89068;
}

body.dark-mode .pagination-btn:hover:not(:disabled) {
  border-color: rgba(201, 169, 97, 0.3);
  background: linear-gradient(135deg, #0f1626 0%, #16213e 100%);
  box-shadow: 0 4px 12px rgba(201, 169, 97, 0.15);
}

body.dark-mode .pagination-info {
  color: #a89068;
}

/* 弹窗样式 */
.quotes-dialog {
  --el-dialog-bg-color: #faf8f3;
}

.quotes-dialog :deep(.el-dialog) {
  border: 1px solid rgba(139, 111, 71, 0.3) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  background-color: #faf8f3 !important;
}

.quotes-dialog :deep(.el-dialog__body) {
  background-color: #faf8f3 !important;
}

.quotes-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #e8dcc8 !important;
  background: linear-gradient(90deg, #fdfbf7 0%, #fffcf5 100%) !important;
}

.quotes-dialog .el-dialog__title {
  color: #3d3d3d;
  font-weight: 600;
  font-family: 'KaiTi', 'STKaiti', serif;
}

.quotes-dialog .el-dialog__close {
  color: #8b6f47;
}

.quotes-dialog .el-dialog__close:hover {
  color: #6b5a3d;
}

.quotes-dialog .dialog-quotes-list {
  max-height: 500px;
  overflow-y: auto;
  background: linear-gradient(180deg, #faf8f3 0%, #f5f2ea 100%);
}

.quotes-dialog .dialog-quote-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: linear-gradient(180deg, #fffef9 0%, #fdfbf7 100%);
  border-radius: 0;
  border: none;
  border-left: 4px solid #8b6f47;
}

.quotes-dialog .quote-number {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: rgba(139, 111, 71, 0.15);
  color: #8b6f47;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  font-family: 'STSong', 'SimSun', serif;
  box-shadow: none;
  border: 1px solid rgba(139, 111, 71, 0.25);
}

.quotes-dialog .quote-content {
  flex: 1;
}

.quotes-dialog .quote-text {
  font-size: 14px;
  line-height: 1.8;
  color: #3d3d3d;
  margin-bottom: 10px;
  font-family: 'STSong', 'SimSun', serif;
}

.quotes-dialog .quote-meta {
  font-size: 12px;
  color: #8b6f47;
  font-weight: 600;
}

body.dark-mode .quotes-dialog {
  --el-dialog-bg-color: #1a1a2e;
}

body.dark-mode .quotes-dialog .el-dialog__header {
  border-bottom-color: rgba(201, 169, 97, 0.15);
  background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
}

body.dark-mode .quotes-dialog .el-dialog__title {
  color: #d4c5a9;
}

body.dark-mode .quotes-dialog .el-dialog__close {
  color: #a89068;
}

body.dark-mode .quotes-dialog .el-dialog__close:hover {
  color: #c9a961;
}

body.dark-mode .quotes-dialog .dialog-quotes-list {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
}

body.dark-mode .quotes-dialog .dialog-quote-item {
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 19px,
      rgba(201, 169, 97, 0.06) 19px,
      rgba(201, 169, 97, 0.06) 20px
    ),
    linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
  border: 1px solid rgba(201, 169, 97, 0.1);
  border-left-color: rgba(201, 169, 97, 0.3);
}

body.dark-mode .quotes-dialog .quote-number {
  background: rgba(201, 169, 97, 0.15);
  color: #c9a961;
  border-color: rgba(201, 169, 97, 0.3);
}

body.dark-mode .quotes-dialog .quote-text {
  color: #d4c5a9;
}

body.dark-mode .quotes-dialog .quote-meta {
  color: #a89068;
}
body.dark-mode .tool-card {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%) !important;
  border-color: rgba(201, 169, 97, 0.3) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .tool-card:hover {
  border-color: #c9a961 !important;
  box-shadow: 0 12px 40px rgba(201, 169, 97, 0.2) !important;
}

body.dark-mode .tool-card::before {
  background: linear-gradient(90deg, transparent 0%, #c9a961 50%, transparent 100%) !important;
}

body.dark-mode .tool-icon {
  background: linear-gradient(135deg, rgba(22, 33, 62, 0.8) 0%, rgba(15, 15, 30, 0.8) 100%) !important;
  border-color: rgba(201, 169, 97, 0.3) !important;
}

body.dark-mode .tool-card:hover .tool-icon {
  border-color: #c9a961 !important;
}

body.dark-mode .tool-icon.default-icon {
  background: linear-gradient(135deg, #c9a961 0%, #d4b673 100%) !important;
}

body.dark-mode .tool-name {
  color: #d4c5a9 !important;
}

body.dark-mode .tool-description {
  color: #8b8b8b !important;
}

body.dark-mode .tool-category {
  background: rgba(201, 169, 97, 0.15) !important;
  color: #c9a961 !important;
  border-color: rgba(201, 169, 97, 0.3) !important;
}

/* 全局对话框样式 - 不受 scoped 限制 */
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.custom-dialog-box {
  background: #faf8f3;
  border: 1px solid rgba(139, 111, 71, 0.3);
  width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.custom-dialog-header {
  background: linear-gradient(90deg, #fdfbf7 0%, #fffcf5 100%);
  border-bottom: 2px solid rgba(139, 111, 71, 0.2);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-dialog-title {
  color: #3d3d3d;
  font-weight: 600;
  font-family: 'KaiTi', 'STKaiti', serif;
  font-size: 16px;
}

.custom-dialog-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #8b6f47;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-dialog-close:hover {
  color: #6b5a3d;
}

.custom-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

/* 自定义滚动条样式 */
.custom-dialog-body::-webkit-scrollbar {
  width: 8px;
}

.custom-dialog-body::-webkit-scrollbar-track {
  background: rgba(139, 111, 71, 0.08);
  border-radius: 4px;
}

.custom-dialog-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #c9a961 0%, #a89068 100%);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.custom-dialog-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #d4b673 0%, #b89a79 100%);
  box-shadow: 0 2px 8px rgba(201, 169, 97, 0.4);
}

/* 暗色模式 - 自定义对话框 */
body.dark-mode .custom-dialog-box {
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  border-color: rgba(201, 169, 97, 0.3);
}

body.dark-mode .custom-dialog-header {
  background: linear-gradient(90deg, rgba(22, 33, 62, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%);
  border-bottom-color: rgba(201, 169, 97, 0.2);
}

body.dark-mode .custom-dialog-title {
  color: #c9a961;
}

body.dark-mode .custom-dialog-close {
  color: #a89068;
}

body.dark-mode .custom-dialog-close:hover {
  color: #c9a961;
}

body.dark-mode .custom-dialog-body {
  background: linear-gradient(180deg, rgba(22, 33, 62, 0.5) 0%, rgba(26, 26, 46, 0.5) 100%);
}

/* 暗色模式 - 滚动条 */
body.dark-mode .custom-dialog-body::-webkit-scrollbar-track {
  background: rgba(201, 169, 97, 0.1);
}

body.dark-mode .custom-dialog-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #c9a961 0%, #8b6f47 100%);
}

body.dark-mode .custom-dialog-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #d4b673 0%, #9a7f58 100%);
  box-shadow: 0 2px 8px rgba(201, 169, 97, 0.5);
}

body.dark-mode .dialog-quote-item {
  background: linear-gradient(180deg, rgba(22, 33, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border-left-color: #c9a961;
}

body.dark-mode .dialog-quote-item .quote-text {
  color: #e0e0e0;
}

body.dark-mode .dialog-quote-item .quote-meta {
  color: #a89068;
}

/* 页脚样式 */
.footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #e2e8f0;
  padding: 40px 24px 24px;
  border-top: 3px solid #3b82f6;
  margin-top: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
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

/* 暗色模式 - 页脚 */
body.dark-mode .footer {
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.95) 0%, rgba(5, 5, 15, 1) 100%);
  border-top: 1px solid rgba(167, 139, 250, 0.1);
}

body.dark-mode .footer-bottom p {
  color: #cbd5e1;
}

.quotes-dialog {
  --el-dialog-bg-color: #faf8f3 !important;
}

.quotes-dialog .el-dialog {
  border: 1px solid rgba(139, 111, 71, 0.3) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  background-color: #faf8f3 !important;
}
</style>
