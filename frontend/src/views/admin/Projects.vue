<template>
  <div class="admin-projects">
    <div class="page-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="showDialog()">
        <el-icon><Plus /></el-icon> 添加项目
      </el-button>
    </div>

    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="title" label="项目名称" width="180" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="orderIndex" label="排序" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.orderIndex === 0" type="danger" size="small">置顶</el-tag>
          <span v-else>{{ row.orderIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="120">
        <template #default="{ row }">
          {{ formatDate(row.startDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? '激活' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="showDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑项目' : '添加项目'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="项目名称" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述" prop="description" required>
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入项目描述" />
        </el-form-item>
        <el-form-item label="项目图片">
          <div style="display: flex; gap: 10px;">
            <el-input 
              v-model="form.image" 
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
          <div v-if="form.image" style="margin-top: 10px;">
            <img :src="form.image" style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
          </div>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate" required>
          <el-date-picker v-model="form.startDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请选择开始日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.endDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="form.tags" multiple allow-create filterable placeholder="输入标签">
            <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目链接">
          <el-input v-model="form.link" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderIndex" :min="0" />
          <el-text type="info" size="small" style="margin-left: 10px;">设置为0即为置顶</el-text>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.isActive" />
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
import { projectsAPI } from '../../api'

const projects = ref<any[]>([])
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const commonTags = ['技术', '教育', '社区', '活动', '合作']

const form = ref({
  title: '',
  description: '',
  image: '',
  startDate: '',
  endDate: '',
  tags: [] as string[],
  link: '',
  orderIndex: 0,
  isActive: true,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
}

const loadProjects = async () => {
  try {
    projects.value = (await projectsAPI.getAll()) as any
  } catch (error) {
    console.error('加载失败:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const showDialog = (row?: any) => {
  if (row) {
    editingId.value = row.id
    form.value = { ...row, tags: row.tags || [] }
  } else {
    editingId.value = null
    form.value = {
      title: '',
      description: '',
      image: '',
      startDate: '',
      endDate: '',
      tags: [],
      link: '',
      orderIndex: 0,
      isActive: true,
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
    const { id, createdAt, updatedAt, ...submitData } = form.value as any
    
    if (editingId.value) {
      await projectsAPI.update(editingId.value, submitData)
      ElMessage.success('更新成功')
    } else {
      await projectsAPI.create(submitData)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadProjects()
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
    await projectsAPI.delete(id)
    ElMessage.success('删除成功')
    loadProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleUploadSuccess = (response: any) => {
  if (response?.url) {
    form.value.image = response.url
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
  loadProjects()
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
