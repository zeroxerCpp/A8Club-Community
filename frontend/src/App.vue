<template>
  <ThemeProvider>
    <div id="app">
      <Transition name="fade-slide" mode="out-in">
        <KeepAlive :include="['Home', 'Founders', 'Projects', 'News', 'Knowledge']">
          <router-view :key="$route.path" />
        </KeepAlive>
      </Transition>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/ThemeProvider.vue'
</script>

<style>
/* ===== 主题 CSS 变量默认值（紫蓝极光，ThemeProvider 运行后会覆盖） ===== */
:root {
  --theme-gradient:    linear-gradient(135deg, #a855f7, #6366f1, #3b82f6);
  --theme-color-start: #a855f7;
  --theme-color-mid:   #6366f1;
  --theme-color-end:   #3b82f6;
}

/* ===== 通用渐变文字工具类 ===== */
.gradient-text {
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== 渐变边框/下划线工具类 ===== */
.gradient-border-bottom {
  border-bottom: 2px solid transparent;
  border-image: var(--theme-gradient) 1;
}

#app {
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  overflow-y: scroll; /* 始终显示滚动条，防止闪烁导致页面shift */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* ===== 页面过渡动画 ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

