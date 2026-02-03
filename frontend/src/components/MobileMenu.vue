<template>
  <!-- 移动端汉堡按钮 -->
  <button class="hamburger" :class="{ active: menuOpen }" @click.prevent.stop="toggleMenu">
    <span></span><span></span><span></span>
  </button>

  <!-- 移动端菜单抽屉 -->
  <div v-if="menuOpen" class="mobile-menu-container" @click.self="closeMenu">
    <div class="mobile-menu-overlay" @click="closeMenu"></div>
    <div class="mobile-menu" @click.stop>
      <a href="/" class="nav-link" @click="closeMenu">首页</a>
      <a href="/founders" class="nav-link" @click="closeMenu">创始团队</a>
      <a href="/projects" class="nav-link" @click="closeMenu">合作项目</a>
      <a href="/news" class="nav-link" @click="closeMenu">社区动态</a>
      <a href="/knowledge" class="nav-link" @click="closeMenu">发现</a>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

interface Props {
  isDark: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  themeToggle: []
}>()

const menuOpen = ref(false)

const closeMenu = () => {
  menuOpen.value = false
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleThemeToggle = () => {
  emit('themeToggle')
}
</script>

<style scoped>
/* 汉堡按钮样式 */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1201;
  position: relative;
}
.hamburger span {
  display: block;
  width: 24px;
  height: 3px;
  margin: 3px 0;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* 汉堡菜单动画效果 */
.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 移动端菜单样式 */
.mobile-menu-container {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: 1199;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
}

.mobile-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.mobile-menu {
  position: relative;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  opacity: 0;
  transform: translateY(-30px);
  animation: slideIn 0.3s ease forwards;
  width: 280px;
  border-radius: 8px;
}

.mobile-menu .nav-link {
  margin: 12px 0;
  font-size: 18px;
  color: #333;
  text-decoration: none;
}

.mobile-menu .theme-toggle-btn {
  margin-top: 16px;
  margin-left: 0;
  align-self: center;
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

.mobile-menu .theme-toggle-btn:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

/* 响应式：移动端显示汉堡，隐藏PC导航 */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }
}

body.dark-mode .hamburger span {
  background: #f1f5f9;
}

body.dark-mode .mobile-menu {
  background: #181828;
  color: #f1f5f9;
}

body.dark-mode .mobile-menu .nav-link {
  color: #f1f5f9;
}

body.dark-mode .mobile-menu .theme-toggle-btn {
  background: #181828;
  border-color: #374151;
  color: #f1f5f9;
}

body.dark-mode .mobile-menu .theme-toggle-btn:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: #3b82f6;
  color: #3b82f6;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>