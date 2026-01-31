<template>
  <el-container class="admin-layout">
    <el-aside width="200px">
      <div class="logo">
        <h2>管理后台</h2>
      </div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/guide">
          <el-icon><Document /></el-icon>
          <span>使用指南</span>
        </el-menu-item>
        <el-divider style="margin: 8px 0; background: #42526f;"></el-divider>
        <el-menu-item index="/admin/founders">
          <el-icon><User /></el-icon>
          <span>创始人管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/projects">
          <el-icon><Folder /></el-icon>
          <span>项目管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/news">
          <el-icon><Document /></el-icon>
          <span>新闻管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/stats">
          <el-icon><TrendCharts /></el-icon>
          <span>统计数据</span>
        </el-menu-item>
        <el-menu-item index="/admin/friend-links">
          <el-icon><Link /></el-icon>
          <span>友情链接</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <h3 class="page-title">管理后台</h3>
        </div>
        <div class="header-right">
          <button 
            @click="handleThemeToggle"
            class="theme-toggle-btn"
            type="button"
          >
            <el-icon :size="18">
              <Sunny v-if="isDark" />
              <Moon v-else />
            </el-icon>
          </button>
          <el-dropdown>
            <span class="user-dropdown">
              <el-icon><User /></el-icon>
              {{ authStore.user?.username || '管理员' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Moon, Sunny, Odometer, User, Folder, Document, TrendCharts, Link } from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 在任何渲染之前立即初始化主题
const savedTheme = localStorage.getItem('admin-theme')
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
    localStorage.setItem('admin-theme', 'dark')
    ElMessage.success('已切换到暗色模式')
  } else {
    document.body.classList.remove('dark-mode')
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('admin-theme', 'light')
    ElMessage.success('已切换到亮色模式')
  }
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.el-aside {
  background: #304156;
}

.logo {
  padding: 20px;
  text-align: center;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.admin-header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left .page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #606266;
}

.theme-toggle-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: scale(1.05);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #303133;
}

.admin-main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  transition: background-color 0s;
}
</style>

<style>
/* 暗夜模式 - 非 scoped 样式 */
body.dark-mode .admin-layout {
  background: #0f1629 !important;
}

body.dark-mode .el-aside {
  background: #1a1f35 !important;
}

body.dark-mode .logo {
  border-bottom-color: #2d3548 !important;
}

body.dark-mode .admin-header {
  background: #1e293b !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .header-left .page-title {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
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

body.dark-mode .user-dropdown {
  color: #e2e8f0 !important;
}

body.dark-mode .admin-main {
  background: #0f1629 !important;
}

/* Element Plus 暗色模式覆盖 */
body.dark-mode .el-card {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  color: #e2e8f0 !important;
}

body.dark-mode .el-card__header {
  background: #1e293b !important;
  border-bottom-color: #3b4d66 !important;
  color: #f1f5f9 !important;
}

body.dark-mode .el-table {
  background: #232a42 !important;
  color: #e2e8f0 !important;
  --el-table-border-color: #3b4d66 !important;
  --el-table-bg-color: #232a42 !important;
  --el-table-tr-bg-color: #232a42 !important;
  --el-table-row-hover-bg-color: #2d3548 !important;
}

body.dark-mode .el-table th,
body.dark-mode .el-table tr {
  background: #232a42 !important;
  color: #e2e8f0 !important;
}

body.dark-mode .el-table tr:hover > td {
  background-color: #2d3548 !important;
}

body.dark-mode .el-table td {
  border-bottom-color: #3b4d66 !important;
}

body.dark-mode .el-table__header {
  background: #1e293b !important;
}

body.dark-mode .el-table__header th {
  background: #1e293b !important;
  color: #f1f5f9 !important;
}

body.dark-mode .el-table__body tr:hover {
  background-color: #2d3548 !important;
}

body.dark-mode .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #1e293b !important;
}

body.dark-mode .el-table__empty-text {
  color: #94a3b8 !important;
}

body.dark-mode .el-form-item__label {
  color: #cbd5e1 !important;
}

body.dark-mode .el-input__wrapper {
  background: #1e293b !important;
  box-shadow: 0 0 0 1px #3b4d66 inset !important;
}

body.dark-mode .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #60a5fa inset !important;
}

body.dark-mode .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #60a5fa inset !important;
}

body.dark-mode .el-input__inner {
  color: #e2e8f0 !important;
}

body.dark-mode .el-input__inner::placeholder {
  color: #64748b !important;
}

body.dark-mode .el-textarea__inner {
  background: #1e293b !important;
  border-color: #3b4d66 !important;
  color: #e2e8f0 !important;
}

body.dark-mode .el-textarea__inner:hover {
  border-color: #60a5fa !important;
}

body.dark-mode .el-textarea__inner:focus {
  border-color: #60a5fa !important;
}

body.dark-mode .el-textarea__inner::placeholder {
  color: #64748b !important;
}

body.dark-mode .el-empty__description {
  color: #94a3b8 !important;
}

body.dark-mode .el-button {
  border-color: #3b4d66 !important;
}

body.dark-mode .el-button--default {
  background: #232a42 !important;
  color: #e2e8f0 !important;
}

body.dark-mode .el-button--default:hover,
body.dark-mode .el-button--default:focus {
  background: #2d3548 !important;
  border-color: #60a5fa !important;
  color: #60a5fa !important;
}

body.dark-mode .el-button--primary {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #fff !important;
}

body.dark-mode .el-button--primary:hover,
body.dark-mode .el-button--primary:focus {
  background: #2563eb !important;
  border-color: #2563eb !important;
}

body.dark-mode .el-button--danger {
  background: #ef4444 !important;
  border-color: #ef4444 !important;
}

body.dark-mode .el-button--danger:hover,
body.dark-mode .el-button--danger:focus {
  background: #dc2626 !important;
  border-color: #dc2626 !important;
}

body.dark-mode .el-button--success {
  background: #10b981 !important;
  border-color: #10b981 !important;
}

body.dark-mode .el-button--success:hover,
body.dark-mode .el-button--success:focus {
  background: #059669 !important;
  border-color: #059669 !important;
}

body.dark-mode .el-button.is-text {
  color: #60a5fa !important;
}

body.dark-mode .el-button.is-text:hover {
  color: #93c5fd !important;
  background: rgba(96, 165, 250, 0.1) !important;
}

body.dark-mode .el-select__wrapper {
  background: #1e293b !important;
  box-shadow: 0 0 0 1px #3b4d66 inset !important;
}

body.dark-mode .el-select__wrapper:hover {
  box-shadow: 0 0 0 1px #60a5fa inset !important;
}

body.dark-mode .el-select__wrapper.is-focused {
  box-shadow: 0 0 0 1px #60a5fa inset !important;
}

body.dark-mode .el-select__placeholder {
  color: #64748b !important;
}

body.dark-mode .el-select-dropdown {
  background: #1e293b !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-select-dropdown__item {
  color: #e2e8f0 !important;
}

body.dark-mode .el-select-dropdown__item:hover {
  background: #2d3548 !important;
}

body.dark-mode .el-select-dropdown__item.is-selected {
  color: #60a5fa !important;
  font-weight: 600;
}

body.dark-mode .el-input-number {
  background: #1e293b !important;
}

body.dark-mode .el-input-number .el-input__wrapper {
  background: #1e293b !important;
}

body.dark-mode .el-input-number__decrease,
body.dark-mode .el-input-number__increase {
  background: #232a42 !important;
  color: #cbd5e1 !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-input-number__decrease:hover,
body.dark-mode .el-input-number__increase:hover {
  color: #60a5fa !important;
  background: #2d3548 !important;
}

body.dark-mode .el-switch__core {
  background: #3b4d66 !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .admin-stats h2,
body.dark-mode .admin-founders h2,
body.dark-mode .admin-projects h2,
body.dark-mode .admin-news h2 {
  color: #f1f5f9 !important;
}

/* 下拉菜单 */
body.dark-mode .el-dropdown-menu {
  background: #1e293b !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-dropdown-menu__item {
  color: #e2e8f0 !important;
}

body.dark-mode .el-dropdown-menu__item:hover {
  background: #2d3548 !important;
  color: #60a5fa !important;
}

/* 消息框 */
body.dark-mode .el-message-box {
  background: #1e293b !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-message-box__title,
body.dark-mode .el-message-box__content {
  color: #e2e8f0 !important;
}

/* 分页 */
body.dark-mode .el-pagination button {
  background: #232a42 !important;
  color: #e2e8f0 !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-pagination button:hover {
  color: #60a5fa !important;
}

body.dark-mode .el-pagination .el-pager li {
  background: #232a42 !important;
  color: #e2e8f0 !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-pagination .el-pager li:hover {
  color: #60a5fa !important;
}

body.dark-mode .el-pagination .el-pager li.is-active {
  background: #3b82f6 !important;
  color: #fff !important;
}

/* 标签 */
body.dark-mode .el-tag {
  background: #232a42 !important;
  border-color: #3b4d66 !important;
  color: #e2e8f0 !important;
}

body.dark-mode .el-tag.el-tag--success {
  background: rgba(16, 185, 129, 0.2) !important;
  border-color: #10b981 !important;
  color: #34d399 !important;
}

body.dark-mode .el-tag.el-tag--warning {
  background: rgba(245, 158, 11, 0.2) !important;
  border-color: #f59e0b !important;
  color: #fbbf24 !important;
}

body.dark-mode .el-tag.el-tag--danger {
  background: rgba(239, 68, 68, 0.2) !important;
  border-color: #ef4444 !important;
  color: #f87171 !important;
}

body.dark-mode .el-tag.el-tag--info {
  background: rgba(59, 130, 246, 0.2) !important;
  border-color: #3b82f6 !important;
  color: #60a5fa !important;
}

/* 对话框 */
body.dark-mode .el-dialog {
  background: #1e293b !important;
  border-color: #3b4d66 !important;
}

body.dark-mode .el-dialog__header {
  border-bottom-color: #3b4d66 !important;
}

body.dark-mode .el-dialog__title {
  color: #f1f5f9 !important;
}

body.dark-mode .el-dialog__body {
  color: #e2e8f0 !important;
}
</style>
