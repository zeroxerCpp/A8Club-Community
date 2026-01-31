<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { foundersAPI, projectsAPI, newsAPI, statsAPI } from '../../api'

const stats = ref({
  foundersCount: 0,
  projectsCount: 0,
  newsCount: 0,
  memberCount: 0,
})

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

onMounted(() => {
  loadStats()
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
