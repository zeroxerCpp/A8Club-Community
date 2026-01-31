import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './style.css'

// 立即初始化主题，防止白屏闪烁
const initTheme = () => {
  const path = window.location.pathname
  const isAdminRoute = path.startsWith('/admin')
  const storageKey = isAdminRoute ? 'admin-theme' : 'frontend-theme'
  const savedTheme = localStorage.getItem(storageKey)
  const isDark = savedTheme !== 'light' // 默认暗夜模式
  
  if (isDark) {
    document.documentElement.classList.add('dark-mode')
    document.body.classList.add('dark-mode')
    document.body.style.backgroundColor = '#0f1629'
    document.documentElement.style.backgroundColor = '#0f1629'
  } else {
    document.documentElement.classList.remove('dark-mode')
    document.body.classList.remove('dark-mode')
    document.body.style.backgroundColor = '#f8f9fa'
    document.documentElement.style.backgroundColor = '#f8f9fa'
  }
}

// 在应用创建之前就初始化主题
initTheme()

// 路由切换时保持主题
router.beforeEach((to) => {
  const isAdminRoute = to.path.startsWith('/admin')
  const storageKey = isAdminRoute ? 'admin-theme' : 'frontend-theme'
  const savedTheme = localStorage.getItem(storageKey)
  const isDark = savedTheme !== 'light'
  
  if (isDark) {
    document.documentElement.classList.add('dark-mode')
    document.body.classList.add('dark-mode')
    document.body.style.backgroundColor = '#0f1629'
    document.documentElement.style.backgroundColor = '#0f1629'
  } else {
    document.documentElement.classList.remove('dark-mode')
    document.body.classList.remove('dark-mode')
    document.body.style.backgroundColor = '#f8f9fa'
    document.documentElement.style.backgroundColor = '#f8f9fa'
  }
})

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
