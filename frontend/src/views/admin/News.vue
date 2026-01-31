<template>
  <div class="admin-news">
    <div class="page-header">
      <h2>新闻管理</h2>
      <el-button type="primary" @click="showDialog()">
        <el-icon><Plus /></el-icon> 发布新闻
      </el-button>
    </div>

    <el-table :data="newsList" style="width: 100%">
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="orderIndex" label="排序" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.orderIndex === 0" type="danger" size="small">置顶</el-tag>
          <span v-else>{{ row.orderIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isPublished" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isPublished ? 'success' : 'warning'">
            {{ row.isPublished ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishedAt" label="发布时间" width="180">
        <template #default="{ row }">
          {{ row.publishedAt ? formatDate(row.publishedAt) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="showDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑新闻' : '发布新闻'" width="800px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content" required>
          <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="封面图片">
          <div style="display: flex; gap: 10px;">
            <el-input 
              v-model="form.coverImage" 
              placeholder="输入图片URL或上传图片"
              style="flex: 1;"
            />
            <el-upload
              auto-upload
              action="/api/upload/image"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
              :show-file-list="false"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <div v-if="form.coverImage" style="margin-top: 10px;">
            <img :src="form.coverImage" style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
          </div>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="form.tags" multiple allow-create filterable placeholder="输入标签">
            <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderIndex" :min="0" placeholder="0为置顶" />
          <el-text type="info" size="small" style="margin-left: 10px;">设置为0即为置顶</el-text>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-switch v-model="form.isPublished" active-text="发布" inactive-text="草稿" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { newsAPI } from '../../api'

const newsList = ref<any[]>([])
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const commonTags = ['公告', '活动', '更新', '教程', '社区']

const form = ref({
  title: '',
  content: '',
  coverImage: '',
  tags: [] as string[],
  isPublished: false,
  orderIndex: 0,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const loadNews = async () => {
  try {
    newsList.value = await newsAPI.getAll()
  } catch (error) {
    console.error('加载失败:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const showDialog = (row?: any) => {
  if (row) {
    editingId.value = row.id
    form.value = { ...row, tags: row.tags || [], orderIndex: row.orderIndex || 0 }
  } else {
    editingId.value = null
    form.value = {
      title: '',
      content: '',
      coverImage: '',
      tags: [],
      isPublished: false,
      orderIndex: 0,
    }
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    // 验证表单
    await formRef.value.validate()
    
    // 移除数据库自动生成的字段
    const { id, createdAt, updatedAt, publishedAt, ...submitData } = form.value as any
    
    if (editingId.value) {
      await newsAPI.update(editingId.value, submitData)
      ElMessage.success('更新成功')
    } else {
      await newsAPI.create(submitData)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadNews()
  } catch (error: any) {
    console.error('保存失败:', error)
    if (error?.response?.data?.message) {
      const message = error.response.data.message
      ElMessage.error(Array.isArray(message) ? message.join('; ') : message)
    } else if (error instanceof Error && error.message !== 'Validation failed') {
      ElMessage.error(error.message || '保存失败')
    }
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除吗?', '警告', {
      type: 'warning',
    })
    await newsAPI.delete(id)
    ElMessage.success('删除成功')
    loadNews()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleUploadSuccess = (response: any) => {
  if (response?.url) {
    form.value.coverImage = response.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('上传失败：无效的响应')
  }
}

const handleUploadError = (error: any) => {
  console.error('上传错误:', error)
  ElMessage.error('上传失败')
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}
</style>
