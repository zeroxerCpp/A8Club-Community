<template>
  <div class="admin-founders">
    <div class="page-header">
      <h2>创始人管理</h2>
      <el-button type="primary" @click="showDialog()">
        <el-icon><Plus /></el-icon> 添加创始人
      </el-button>
    </div>

    <el-table :data="founders" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="title" label="职位" width="150" />
      <el-table-column prop="bio" label="简介" show-overflow-tooltip />
      <el-table-column prop="orderIndex" label="排序" width="80" />
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑创始人' : '添加创始人'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="简介" prop="bio" required>
          <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="头像URL">
          <div style="display: flex; gap: 10px;">
            <el-input 
              v-model="form.avatar" 
              placeholder="输入头像URL或上传图片"
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
          <div v-if="form.avatar" style="margin-top: 10px;">
            <img :src="form.avatar" style="max-width: 200px; max-height: 200px; border-radius: 50%;" />
          </div>
        </el-form-item>
        <el-form-item label="LinkedIn">
          <el-input v-model="form.linkedin" placeholder="请输入LinkedIn链接" />
        </el-form-item>
        <el-form-item label="Twitter">
          <el-input v-model="form.twitter" placeholder="请输入Twitter链接" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderIndex" :min="0" />
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
import { foundersAPI } from '../../api'

const founders = ref<any[]>([])
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = ref({
  name: '',
  title: '',
  bio: '',
  avatar: '',
  linkedin: '',
  twitter: '',
  orderIndex: 0,
  isActive: true,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  title: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  bio: [{ required: true, message: '请输入简介', trigger: 'blur' }],
}

const loadFounders = async () => {
  try {
    founders.value = await foundersAPI.getAll()
  } catch (error) {
    console.error('加载失败:', error)
  }
}

const showDialog = (row?: any) => {
  if (row) {
    editingId.value = row.id
    form.value = { ...row }
  } else {
    editingId.value = null
    form.value = {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      linkedin: '',
      twitter: '',
      orderIndex: 0,
      isActive: true,
    }
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    // 先验证表单
    await formRef.value.validate()
    
    // 准备提交数据，移除不应该发送的字段
    const { id, createdAt, updatedAt, ...submitData } = form.value as any
    
    // 验证通过后再提交
    if (editingId.value) {
      await foundersAPI.update(editingId.value, submitData)
      ElMessage.success('更新成功')
    } else {
      await foundersAPI.create(submitData)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadFounders()
  } catch (error: any) {
    console.error('保存失败:', error)
    if (error?.response?.data?.message) {
      // 后端返回的验证错误
      const messages = Array.isArray(error.response.data.message) 
        ? error.response.data.message.join('; ') 
        : error.response.data.message
      ElMessage.error(messages)
    } else if (error instanceof Error && error.message !== 'Validation failed') {
      // 其他错误（排除表单验证错误）
      ElMessage.error(error.message || '保存失败，请稍后重试')
    }
    // 如果是表单验证错误，不显示消息（Element Plus已经在表单上显示了）
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除吗?', '警告', {
      type: 'warning',
    })
    await foundersAPI.delete(id)
    ElMessage.success('删除成功')
    loadFounders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleUploadSuccess = (response: any) => {
  if (response?.url) {
    form.value.avatar = response.url
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
  loadFounders()
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
