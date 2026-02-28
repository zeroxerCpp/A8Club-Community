<template>
  <div class="navbar">
    <div class="navbar-container">
      <a href="/" class="logo">{{ siteName }}</a>
      <!-- PC端导航 -->
      <div class="nav-links">
        <a href="/" class="nav-link" :class="{ active: activeRoute === 'home' }">首页</a>
        <a href="/founders" class="nav-link" :class="{ active: activeRoute === 'founders' }">创始团队</a>
        <a href="/projects" class="nav-link" :class="{ active: activeRoute === 'projects' }">合作项目</a>
        <a href="/news" class="nav-link" :class="{ active: activeRoute === 'news' }">社区动态</a>
        <a href="/knowledge" class="nav-link" :class="{ active: activeRoute === 'knowledge' }">发现</a>
        <button 
          @click="$emit('theme-toggle')"
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
      <MobileMenu :is-dark="isDark" @theme-toggle="$emit('theme-toggle')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import MobileMenu from './MobileMenu.vue'

defineProps<{
  siteName: string
  isDark: boolean
  activeRoute: 'home' | 'founders' | 'projects' | 'news' | 'knowledge'
}>()

defineEmits<{
  'theme-toggle': []
}>()
</script>

<style scoped>
/* 响应式隐藏PC端/移动端导航 */
@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }
}

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
  background: linear-gradient(135deg, #a855f7, #3b82f6);
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
  background: linear-gradient(135deg, #a855f7, #3b82f6);
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
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
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
  background: var(--theme-gradient) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

body.dark-mode .nav-link:hover,
body.dark-mode .nav-link.active {
  color: var(--theme-color-end) !important;
}

body.dark-mode .nav-link.active::after {
  background: var(--theme-gradient) !important;
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
</style>
