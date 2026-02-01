<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    
    <!-- 访问统计面板 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="analytics-card">
          <el-statistic title="总访问量" :value="analyticsStats.totalViews">
            <template #prefix>
              <el-icon color="#409eff"><View /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="analytics-card">
          <el-statistic title="今日访问" :value="analyticsStats.todayViews">
            <template #prefix>
              <el-icon color="#67c23a"><Calendar /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="analytics-card">
          <el-statistic title="独立访客" :value="analyticsStats.uniqueVisitors">
            <template #prefix>
              <el-icon color="#e6a23c"><User /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="analytics-card">
          <el-statistic title="近7日访问" :value="analyticsStats.recentViews">
            <template #prefix>
              <el-icon color="#f56c6c"><TrendCharts /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 访问趋势图表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :md="16">
        <el-card>
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>访问趋势</span>
              <el-radio-group v-model="chartDays" size="small" @change="loadAnalytics">
                <el-radio-button :value="7">7天</el-radio-button>
                <el-radio-button :value="14">14天</el-radio-button>
                <el-radio-button :value="30">30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" v-if="dailyStats.length > 0">
            <div class="simple-chart">
              <div 
                v-for="stat in dailyStats" 
                :key="stat.date" 
                class="chart-bar"
              >
                <div class="bar-fill" :style="{ height: `${(stat.views / maxViews) * 85}%` }"></div>
                <div class="bar-label">{{ formatChartDate(stat.date) }}</div>
                <div class="bar-value">{{ stat.views }}</div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
      
      <el-col :xs="24" :md="8">
        <el-card>
          <template #header>
            <span>热门页面</span>
          </template>
          <el-table :data="topPages" style="width: 100%" size="small">
            <el-table-column prop="path" label="页面">
              <template #default="{ row }">
                <span class="page-path">{{ formatPath(row.path) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="views" label="访问量" width="80" align="right" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近访客 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>最近访客</span>
          </template>
          <el-table :data="recentVisitors" style="width: 100%" size="small">
            <el-table-column prop="path" label="访问页面" width="150">
              <template #default="{ row }">
                <span class="page-path">{{ formatPath(row.path) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="150" />
            <el-table-column prop="userAgent" label="浏览器" min-width="200">
              <template #default="{ row }">
                <span class="user-agent">{{ formatUserAgent(row.userAgent) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="referrer" label="来源" min-width="200">
              <template #default="{ row }">
                <span class="referrer">{{ row.referrer || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="访问时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 原有的统计面板 -->
    <h3 style="margin-top: 30px;">内容管理</h3>
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="创始人数量" :value="stats.foundersCount">
            <template #prefix>
              <el-icon color="#409eff"><User /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="项目数量" :value="stats.projectsCount">
            <template #prefix>
              <el-icon color="#67c23a"><Folder /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="新闻数量" :value="stats.newsCount">
            <template #prefix>
              <el-icon color="#e6a23c"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="社区成员" :value="stats.memberCount">
            <template #prefix>
              <el-icon color="#f56c6c"><UserFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          <el-space wrap>
            <el-button type="primary" @click="$router.push('/admin/founders')">
              <el-icon><Plus /></el-icon> 添加创始人
            </el-button>
            <el-button type="success" @click="$router.push('/admin/projects')">
              <el-icon><Plus /></el-icon> 添加项目
            </el-button>
            <el-button type="warning" @click="$router.push('/admin/news')">
              <el-icon><Plus /></el-icon> 发布新闻
            </el-button>
            <el-button type="info" @click="$router.push('/admin/stats')">
              <el-icon><Edit /></el-icon> 更新统计
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>数据库管理</span>
          </template>
          <el-space wrap>
            <el-button type="primary" :loading="exportLoading" @click="exportDatabase">
              <el-icon><Download /></el-icon> 导出数据库
            </el-button>
            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleImportFile"
              accept=".json"
            >
              <el-button type="warning" :loading="importLoading">
                <el-icon><Upload /></el-icon> 导入数据库
              </el-button>
            </el-upload>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import axios from 'axios'
import { foundersAPI, projectsAPI, newsAPI, statsAPI, analyticsAPI } from '../../api'

const stats = ref({
  foundersCount: 0,
  projectsCount: 0,
  newsCount: 0,
  memberCount: 0,
})

const analyticsStats = ref({
  totalViews: 0,
  todayViews: 0,
  uniqueVisitors: 0,
  recentViews: 0,
})

const dailyStats = ref<any[]>([])
const topPages = ref<any[]>([])
const recentVisitors = ref<any[]>([])
const chartDays = ref(7)

const maxViews = computed(() => {
  if (dailyStats.value.length === 0) return 1
  return Math.max(...dailyStats.value.map(s => s.views))
})

const formatChartDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const formatPath = (path: string) => {
  const pathMap: Record<string, string> = {
    '/': '首页',
    '/founders': '创始团队',
    '/projects': '项目展示',
    '/news': '新闻动态',
  }
  return pathMap[path] || path
}

const formatUserAgent = (ua: string) => {
  if (!ua) return '-'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  if (ua.includes('Mobile')) return 'Mobile'
  return 'Unknown'
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const exportLoading = ref(false)
const importLoading = ref(false)

const loadStats = async () => {
  try {
    const [founders, projects, news, communityStats] = await Promise.all([
      foundersAPI.getAll(),
      projectsAPI.getAll(),
      newsAPI.getAll(),
      statsAPI.getLatest(),
    ])
    
    stats.value = {
      foundersCount: founders.length,
      projectsCount: projects.length,
      newsCount: news.length,
      memberCount: communityStats?.memberCount || 0,
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadAnalytics = async () => {
  try {
    const [statsData, dailyData, pagesData, visitorsData] = await Promise.all([
      analyticsAPI.getStats(7),
      analyticsAPI.getDailyStats(chartDays.value),
      analyticsAPI.getTopPages(5),
      analyticsAPI.getRecentVisitors(10),
    ])
    
    analyticsStats.value = statsData
    dailyStats.value = dailyData
    topPages.value = pagesData
    recentVisitors.value = visitorsData
  } catch (error) {
    console.error('加载访问统计失败:', error)
  }
}

const exportDatabase = async () => {
  exportLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
    
    const response = await axios.get(`${apiUrl}/database/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `g8_community_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('数据库导出成功')
  } catch (error: any) {
    console.error('导出错误:', error)
    ElMessage.error(error.response?.data?.message || '导出失败')
  } finally {
    exportLoading.value = false
  }
}

const handleImportFile = async (uploadFile: UploadFile) => {
  importLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
    
    const formData = new FormData()
    formData.append('file', uploadFile.raw as Blob)
    
    const response = await axios.post(`${apiUrl}/database/import`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      ElMessage.success(`数据导入成功！${JSON.stringify(response.data.result)}`)
      await loadStats() // 重新加载统计数据
    } else {
      ElMessage.error(response.data.message || '导入失败')
    }
  } catch (error: any) {
    console.error('导入错误:', error)
    ElMessage.error(error.response?.data?.message || '导入失败')
  } finally {
    importLoading.value = false
  }
}

onMounted(() => {
  loadStats()
  loadAnalytics()
})
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 20px;
  color: #303133;
}

.stats-row .el-col {
  margin-bottom: 20px;
}

.analytics-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.analytics-card :deep(.el-statistic__head) {
  color: rgba(255, 255, 255, 0.9);
}

.analytics-card :deep(.el-statistic__content) {
  color: white;
}

.chart-container {
  height: 300px;
  padding: 20px 0;
}

.simple-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  gap: 15px;
  padding: 0 20px;
}

.chart-bar {
  flex: 0 0 auto;
  width: 40px;
  max-width: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar-fill {
  width: 100%;
  min-height: 5px;
  background: linear-gradient(180deg, #409eff 0%, #79bbff 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
}

.chart-bar:hover .bar-fill {
  background: linear-gradient(180deg, #66b1ff 0%, #a0cfff 100%);
}

.bar-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #409eff;
  white-space: nowrap;
}

.page-path {
  color: #409eff;
  font-weight: 500;
}

.user-agent {
  color: #606266;
}

.referrer {
  color: #909399;
  font-size: 12px;
}
</style>

<style>
/* 暗夜模式 - Dashboard 专用样式 */
body.dark-mode .dashboard h2 {
  color: #f1f5f9 !important;
}

body.dark-mode .el-statistic__head {
  color: #94a3b8 !important;
}

body.dark-mode .el-statistic__content {
  color: #f1f5f9 !important;
}

body.dark-mode .el-statistic .el-statistic__number {
  color: #f1f5f9 !important;
}
</style>
