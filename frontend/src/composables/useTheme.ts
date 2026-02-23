import { ref } from 'vue'

export interface ThemePreset {
  id: string
  name: string
  colors: string[]
}

/** 内置预设主题 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'purple-blue',
    name: '紫蓝极光',
    colors: ['#a855f7', '#6366f1', '#3b82f6'],
  },
  {
    id: 'rose-flame',
    name: '玫瑰烈焰',
    colors: ['#f43f5e', '#ec4899', '#f97316'],
  },
  {
    id: 'teal-ocean',
    name: '青翠海洋',
    colors: ['#06b6d4', '#0ea5e9', '#10b981'],
  },
  {
    id: 'golden-fire',
    name: '燃烧金橙',
    colors: ['#fbbf24', '#f59e0b', '#ef4444'],
  },
  {
    id: 'silver-star',
    name: '星辰银白',
    colors: ['#94a3b8', '#cbd5e1', '#e2e8f0'],
  },
  {
    id: 'custom',
    name: '自定义',
    colors: ['#a855f7', '#3b82f6'],
  },
]

export interface ThemeGradient {
  preset: string
  colors: string[]
}

/** 默认主题（紫蓝极光） */
export const DEFAULT_THEME: ThemeGradient = {
  preset: 'purple-blue',
  colors: ['#a855f7', '#6366f1', '#3b82f6'],
}

/**
 * 由颜色数组生成 CSS linear-gradient 字符串
 * 角度固定 135deg，视觉上从左上到右下
 */
export function buildGradientString(colors: string[]): string {
  if (!colors || colors.length === 0) return 'linear-gradient(135deg, #a855f7, #3b82f6)'
  if (colors.length === 1) return colors[0] ?? '#a855f7'
  return `linear-gradient(135deg, ${colors.join(', ')})`
}

/** 将主题应用到 document.documentElement 的 CSS 变量 */
export function applyThemeToDom(theme: ThemeGradient) {
  const colors = theme.colors ?? DEFAULT_THEME.colors
  const gradient = buildGradientString(colors)
  const root = document.documentElement
  root.style.setProperty('--theme-gradient', gradient)
  root.style.setProperty('--theme-color-start', colors[0] ?? '#a855f7')
  root.style.setProperty('--theme-color-end', colors[colors.length - 1] ?? '#3b82f6')
  root.style.setProperty('--theme-color-mid', colors[Math.floor(colors.length / 2)] ?? colors[0] ?? '#6366f1')
}

/** 全局单例 theme 状态，方便多组件共享 */
export const currentTheme = ref<ThemeGradient>({ ...DEFAULT_THEME })
