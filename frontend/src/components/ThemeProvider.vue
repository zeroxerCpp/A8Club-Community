<template>
  <!-- 纯逻辑组件，不渲染任何 DOM -->
  <slot />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { statsAPI } from '../api'
import {
  currentTheme,
  applyThemeToDom,
  DEFAULT_THEME,
  type ThemeGradient,
} from '../composables/useTheme'

const CACHE_KEY = 'g8_theme_gradient'

/** 立即从缓存读取并应用，避免刷新闪烁 */
function applyFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const theme = JSON.parse(cached) as ThemeGradient
      if (theme?.colors?.length) {
        currentTheme.value = theme
        applyThemeToDom(theme)
        return
      }
    }
  } catch {}
  applyThemeToDom(DEFAULT_THEME)
}

/** 从后端拉取最新主题并写入缓存 */
async function loadTheme() {
  try {
    const data = await statsAPI.getLatest()
    if (data?.themeGradient?.colors?.length) {
      const theme = data.themeGradient as ThemeGradient
      currentTheme.value = theme
      applyThemeToDom(theme)
      localStorage.setItem(CACHE_KEY, JSON.stringify(theme))
    } else {
      currentTheme.value = { ...DEFAULT_THEME }
      applyThemeToDom(DEFAULT_THEME)
    }
  } catch {
    currentTheme.value = { ...DEFAULT_THEME }
    applyThemeToDom(DEFAULT_THEME)
  }
}

// 同步读取缓存，在任何 CSS 渲染前就设好变量
applyFromCache()

onMounted(loadTheme)

// Admin 保存后同步到 DOM 和缓存
watch(currentTheme, (val) => {
  applyThemeToDom(val)
  localStorage.setItem(CACHE_KEY, JSON.stringify(val))
}, { deep: true })
</script>
