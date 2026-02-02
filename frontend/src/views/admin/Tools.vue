<template>
  <div class="tools-admin">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工具管理</span>
          <el-button type="primary" @click="handleAdd">新增工具</el-button>
        </div>
      </template>

      <el-table :data="tools" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="工具名称" width="150" />
        <el-table-column prop="description" label="描述" :show-overflow-tooltip="true" />
        <el-table-column prop="url" label="链接" width="200" :show-overflow-tooltip="true" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="order" label="排序" width="80" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工具名称 *" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述 *" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="链接 *" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="form.icon" placeholder="可选，留空则显示默认图标" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="例如：开发工具、设计工具等" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { toolsAPI } from '../../api'

interface Tool {
  id?: number
  name: string
  description: string
  url: string
  icon?: string
  category?: string
  order: number
}

const tools = ref<Tool[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增工具')
const formRef = ref<FormInstance>()
const form = ref<Tool>({
  name: '',
  description: '',
  url: '',
  icon: '',
  category: '',
  order: 0,
})
const isEdit = ref(false)

const rules: FormRules = {
  name: [
    { required: true, message: '请输入工具名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ]
}

const fetchTools = async () => {
  try {
    tools.value = await toolsAPI.getList()
  } catch (error) {
    ElMessage.error('获取工具列表失败')
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增工具'
  isEdit.value = false
  form.value = { name: '', description: '', url: '', icon: '', category: '', order: 0 }
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const handleEdit = (row: Tool) => {
  dialogTitle.value = '编辑工具'
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.warning('请填写必填项')
      return
    }
  })

  try {
    // 只提取允许的字段
    const submitData = {
      name: form.value.name,
      description: form.value.description,
      url: form.value.url,
      icon: form.value.icon,
      category: form.value.category,
      order: form.value.order
    }
    
    if (isEdit.value && form.value.id) {
      await toolsAPI.update(form.value.id, submitData)
      ElMessage.success('更新成功')
    } else {
      await toolsAPI.create(submitData)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchTools()
  } catch (error) {
    console.error('提交错误:', error)
    ElMessage.error('操作失败')
  }
}

const handleDelete = (row: Tool) => {
  ElMessageBox.confirm('确定要删除这个工具吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await toolsAPI.delete(row.id!)
      ElMessage.success('删除成功')
      fetchTools()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  fetchTools()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
