<template>
  <div class="admin-stats">
    <h2>社区统计数据</h2>

    <el-card>
      <template #header>
        <span>当前统计数据</span>
      </template>

      <el-form :model="form" label-width="120px">
        <el-form-item label="社区名称">
          <el-input v-model="form.name" placeholder="请输入社区名称" />
        </el-form-item>

        <el-form-item label="社区副标题">
          <el-input v-model="form.subtitle" placeholder="可选，显示在名称下方" />
        </el-form-item>

        <el-form-item label="Hero背景图">
          <div class="image-upload-container">
            <el-upload
              class="avatar-uploader"
              :http-request="customUpload"
              :show-file-list="false"
              @success="handleHeroImageSuccess"
            >
              <img v-if="form.heroImage" :src="form.heroImage" alt="Hero Image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <p class="upload-tip">建议尺寸: 1920×800px</p>
            <el-button v-if="form.heroImage" type="danger" size="small" @click="form.heroImage = ''">删除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="主题渐变配色">
          <div class="theme-picker">
            <!-- 实时预览条 -->
            <div class="theme-preview-bar" :style="{ background: buildGradientString(form.themeGradient.colors) }">
              <span
                class="gradient-text-demo"
                :style="{ backgroundImage: buildGradientString(form.themeGradient.colors) }"
              >标题渐变预览 Aa</span>
            </div>
            <!-- 预设主题卡片 -->
            <div class="theme-presets">
              <div
                v-for="preset in nonCustomPresets"
                :key="preset.id"
                class="theme-preset-card"
                :class="{ active: form.themeGradient.preset === preset.id }"
                @click="applyPreset(preset)"
              >
                <div class="preset-preview" :style="{ background: buildGradientString(preset.colors) }"></div>
                <span class="preset-name">{{ preset.name }}</span>
              </div>
            </div>
            <!-- 自定义颜色 -->
            <div class="theme-custom">
              <span class="custom-label">自定义颜色：</span>
              <div class="color-pickers">
                <div v-for="(_, idx) in form.themeGradient.colors" :key="idx" class="color-item">
                  <el-color-picker v-model="form.themeGradient.colors[idx]" @change="onCustomColorChange" />
                  <span class="color-label">{{ colorLabel(idx, form.themeGradient.colors.length) }}</span>
                </div>
                <el-button v-if="form.themeGradient.colors.length < 4" size="small" circle @click="addColor" title="增加中间色">+</el-button>
                <el-button v-if="form.themeGradient.colors.length > 2" size="small" circle type="danger" @click="removeColor" title="删除中间色">−</el-button>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="社区成员数">
          <el-input-number v-model="form.memberCount" :min="0" :step="1" />
        </el-form-item>

        <el-form-item label="活跃成员数">
          <el-input-number v-model="form.activeMembers" :min="0" :step="1" />
        </el-form-item>

        <el-form-item label="项目总数">
          <el-input-number v-model="form.totalProjects" :min="0" :step="1" />
        </el-form-item>

        <el-form-item label="活动总数">
          <el-input-number v-model="form.totalEvents" :min="0" :step="1" />
        </el-form-item>

        <el-form-item label="社区介绍">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="6"
            placeholder="请输入社区介绍，将显示在首页" 
          />
        </el-form-item>

        <el-form-item label="联系邮箱">
          <el-input 
            v-model="form.contactEmail" 
            placeholder="请输入联系邮箱" 
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">保存更新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>历史数据</span>
      </template>

      <el-table :data="history" style="width: 100%">
        <el-table-column prop="memberCount" label="成员数" width="120" />
        <el-table-column prop="activeMembers" label="活跃成员" width="120" />
        <el-table-column prop="totalProjects" label="项目数" width="120" />
        <el-table-column prop="totalEvents" label="活动数" width="120" />
        <el-table-column prop="createdAt" label="更新时间">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { statsAPI } from '../../api'
import {
  THEME_PRESETS,
  buildGradientString,
  applyThemeToDom,
  currentTheme,
  DEFAULT_THEME,
  type ThemePreset,
  type ThemeGradient,
} from '../../composables/useTheme'

const nonCustomPresets = computed(() => THEME_PRESETS.filter((p) => p.id !== 'custom'))

function colorLabel(idx: number, total: number) {
  if (idx === 0) return '起'
  if (idx === total - 1) return '终'
  return '中'
}

const token = localStorage.getItem('token') || ''

const customUpload = (options: any) => {
  const { file } = options
  const formData = new FormData()
  formData.append('file', file)
  
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          options.onProgress({ percent: (e.loaded / e.total) * 100 })
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = xhr.responseText ? JSON.parse(xhr.responseText) : null
            if (response && response.url) {
              // Element Plus 会自动调用 @success 并传递这个承诺的结果
              options.onSuccess(response)
              resolve(response)
            } else {
              options.onError(new Error('上传失败：无效响应'))
              reject(new Error('上传失败：无效响应'))
            }
          } catch (e) {
            options.onError(new Error('上传失败：响应解析错误'))
            reject(new Error('上传失败：响应解析错误'))
          }
        } else {
          options.onError(new Error(`上传失败: HTTP ${xhr.status}`))
          reject(new Error(`上传失败: HTTP ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        options.onError(new Error('上传失败：网络错误'))
        reject(new Error('上传失败：网络错误'))
      })
      
      xhr.open('POST', '/api/upload/image')
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(formData)
    } catch (error) {
      options.onError(error)
      reject(error)
    }
  })
}

const form = ref({
  name: '超级A8俱乐部',
  subtitle: '',
  heroImage: '',
  memberCount: 0,
  activeMembers: 0,
  totalProjects: 0,
  totalEvents: 0,
  description: '',
  contactEmail: 'contact@example.com',
  themeGradient: { ...DEFAULT_THEME } as ThemeGradient,
})

const history = ref<any[]>([])

const loadStats = async () => {
  try {
    const latest = await statsAPI.getLatest()
    if (latest) {
      form.value = {
        name: latest.name || '超级A8俱乐部',
        subtitle: latest.subtitle || '',
        heroImage: latest.heroImage || '',
        memberCount: latest.memberCount,
        activeMembers: latest.activeMembers,
        totalProjects: latest.totalProjects,
        totalEvents: latest.totalEvents,
        description: latest.description || '',
        contactEmail: latest.contactEmail || 'contact@example.com',
        themeGradient: latest.themeGradient ?? { ...DEFAULT_THEME },
      }
    }
  } catch (error) {
    console.error('加载失败:', error)
  }
}

const loadHistory = async () => {
  try {
    history.value = await statsAPI.getHistory(10)
  } catch (error) {
    console.error('加载历史失败:', error)
  }
}

const handleSave = async () => {
  try {
    // 移除数据库自动生成的字段
    const { id, createdAt, updatedAt, ...submitData } = form.value as any
    
    await statsAPI.update(submitData)
    // 保存后同步全局主题、立即更新 DOM、写入缓存
    currentTheme.value = { ...form.value.themeGradient }
    applyThemeToDom(form.value.themeGradient)
    localStorage.setItem('g8_theme_gradient', JSON.stringify(form.value.themeGradient))
    ElMessage.success('更新成功')
    loadHistory()
  } catch (error: any) {
    console.error('保存失败:', error)
    const message = error?.response?.data?.message || error?.message || '保存失败'
    ElMessage.error(Array.isArray(message) ? message.join('; ') : message)
  }
}

function applyPreset(preset: ThemePreset) {
  form.value.themeGradient = { preset: preset.id, colors: [...preset.colors] }
  currentTheme.value = { ...form.value.themeGradient }
}

function onCustomColorChange() {
  form.value.themeGradient.preset = 'custom'
  currentTheme.value = { ...form.value.themeGradient }
}

function addColor() {
  const colors = form.value.themeGradient.colors
  colors.splice(colors.length - 1, 0, colors[colors.length - 1] ?? '#6366f1')
  onCustomColorChange()
}

function removeColor() {
  const colors = form.value.themeGradient.colors
  if (colors.length > 2) colors.splice(colors.length - 2, 1)
  onCustomColorChange()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const handleHeroImageSuccess = (response: any) => {
  console.log('上传成功，响应:', response)
  
  if (!response || !response.url) {
    ElMessage.error('上传失败：无法获取图片URL')
    return
  }
  
  let imageUrl = response.url
  
  // 保持相对路径，由 nginx 统一代理 /uploads/
  if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
    imageUrl = `/${imageUrl}`
  }
  
  form.value.heroImage = imageUrl
  console.log('设置img src:', imageUrl)
  ElMessage.success('图片上传成功')
}

onMounted(() => {
  loadStats()
  loadHistory()
})
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}

.image-upload-container {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

:deep(.avatar-uploader .el-upload) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin: 8px 0 0;
}

/* ===== 主题选择器 ===== */
.theme-picker {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 600px;
}

.theme-preview-bar {
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.gradient-text-demo {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.theme-preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 6px 8px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.theme-preset-card:hover {
  border-color: #909399;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.theme-preset-card.active {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64,158,255,0.3);
}

.preset-preview {
  width: 80px;
  height: 30px;
  border-radius: 4px;
}

.preset-name {
  font-size: 12px;
  color: #606266;
}

.theme-custom {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.custom-label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.color-pickers {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.color-label {
  font-size: 11px;
  color: #909399;
}
</style>
