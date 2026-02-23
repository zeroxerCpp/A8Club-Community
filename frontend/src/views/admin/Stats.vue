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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { statsAPI } from '../../api'

const form = ref({
  name: '超级A8俱乐部',
  subtitle: '',
  memberCount: 0,
  activeMembers: 0,
  totalProjects: 0,
  totalEvents: 0,
  description: '',
  contactEmail: 'contact@example.com',
})

const history = ref<any[]>([])

const loadStats = async () => {
  try {
    const latest = await statsAPI.getLatest()
    if (latest) {
      form.value = {
        name: latest.name || '超级A8俱乐部',
        subtitle: latest.subtitle || '',
        memberCount: latest.memberCount,
        activeMembers: latest.activeMembers,
        totalProjects: latest.totalProjects,
        totalEvents: latest.totalEvents,
        description: latest.description || '',
        contactEmail: latest.contactEmail || 'contact@example.com',
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
    ElMessage.success('更新成功')
    loadHistory()
  } catch (error: any) {
    console.error('保存失败:', error)
    const message = error?.response?.data?.message || error?.message || '保存失败'
    ElMessage.error(Array.isArray(message) ? message.join('; ') : message)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
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
</style>
