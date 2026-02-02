<template>
  <div class="quotes-admin">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>语录管理</span>
          <div>
            <el-button type="danger" @click="handleDeleteAll">全部删除</el-button>
            <el-button type="success" @click="handleBatchImport">批量导入</el-button>
            <el-button type="primary" @click="handleAdd">新增语录</el-button>
          </div>
        </div>
      </template>

      <el-table :data="quotes" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column prop="content" label="内容" :show-overflow-tooltip="true" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="context" label="出处/背景" width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="order" label="排序" width="80" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchQuotes"
        @current-change="fetchQuotes"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 批量导入对话框 -->
    <el-dialog v-model="batchDialogVisible" title="批量导入语录" width="700px">
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="统一作者 *">
          <el-input v-model="batchForm.author" placeholder="所有语录将使用此作者" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="batchForm.publishDate"
            type="date"
            placeholder="统一发布日期（可选）"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="出处/背景">
          <el-input v-model="batchForm.context" placeholder="统一出处（可选）" />
        </el-form-item>
        <el-form-item label="语录内容 *">
          <el-input
            v-model="batchForm.content"
            type="textarea"
            :rows="15"
            placeholder="请粘贴语录内容，每段语录用空行分隔"
          />
        </el-form-item>
        <el-alert
          title="提示"
          type="info"
          :closable="false"
          style="margin-bottom: 10px"
        >
          每段语录用空行（两个回车）分隔，将自动识别并批量导入
        </el-alert>
      </el-form>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSubmit" :loading="batchLoading">确定导入</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            placeholder="选择发布日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="内容 *" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="作者 *" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="出处/背景" prop="context">
          <el-input v-model="form.context" />
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
import { quotesAPI } from '../../api'

interface Quote {
  id?: number
  content: string
  author: string
  context?: string
  order: number
  publishDate?: string
}

const quotes = ref<Quote[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增语录')
const formRef = ref<FormInstance>()
const form = ref<Quote>({
  content: '',
  author: '',
  context: '',
  order: 0,
  publishDate: '',
})
const isEdit = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 批量导入相关
const batchDialogVisible = ref(false)
const batchLoading = ref(false)
const batchForm = ref({
  content: '',
  author: '',
  publishDate: '',
  context: '',
})

const rules: FormRules = {
  content: [
    { required: true, message: '请输入语录内容', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入作者', trigger: 'blur' }
  ]
}

const fetchQuotes = async () => {
  try {
    const result = await quotesAPI.getList(currentPage.value, pageSize.value)
    if (Array.isArray(result)) {
      // 兼容旧的返回格式
      quotes.value = result
      total.value = result.length
    } else {
      // 新的分页格式
      quotes.value = result.items
      total.value = result.total
    }
  } catch (error) {
    ElMessage.error('获取语录列表失败')
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增语录'
  isEdit.value = false
  form.value = { content: '', author: '', context: '', order: 0, publishDate: '' }
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const handleEdit = (quote: Quote) => {
  dialogTitle.value = '编辑语录'
  isEdit.value = true
  form.value = { ...quote }
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
    const { content, author, context, order, publishDate } = form.value
    const submitData = { content, author, context, order, publishDate }
    
    if (isEdit.value && form.value.id) {
      await quotesAPI.update(form.value.id, submitData)
      ElMessage.success('更新成功')
    } else {
      await quotesAPI.create(submitData)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchQuotes()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = (row: Quote) => {
  ElMessageBox.confirm('确定要删除这条语录吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await quotesAPI.delete(row.id!)
      ElMessage.success('删除成功')
      fetchQuotes()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleDeleteAll = () => {
  ElMessageBox.confirm(
    `确定要删除所有语录吗？此操作不可恢复！`,
    '危险操作',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'error',
      confirmButtonClass: 'el-button--danger',
    }
  ).then(async () => {
    try {
      const result = await quotesAPI.deleteAll()
      ElMessage.success(`已删除 ${result.count} 条语录`)
      fetchQuotes()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

const handleBatchImport = () => {
  batchForm.value = { content: '', author: '笑苍生', publishDate: '', context: '' }
  batchDialogVisible.value = true
}

const handleBatchSubmit = async () => {
  if (!batchForm.value.content.trim()) {
    ElMessage.warning('请输入语录内容')
    return
  }

  if (!batchForm.value.author.trim()) {
    ElMessage.warning('请输入作者')
    return
  }

  try {
    // 用空行分割语录（\n\n 或 \r\n\r\n）
    const paragraphs = batchForm.value.content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)

    if (paragraphs.length === 0) {
      ElMessage.warning('未识别到有效的语录内容')
      return
    }

    // 显示确认信息
    await ElMessageBox.confirm(
      `识别到 ${paragraphs.length} 条语录，确定导入吗？`,
      '确认导入',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )

    batchLoading.value = true

    // 调用批量导入接口
    const response = await quotesAPI.batchImport({
      content: batchForm.value.content,
      author: batchForm.value.author,
      publishDate: batchForm.value.publishDate || undefined,
      context: batchForm.value.context || undefined,
    })

    if (response.failed === 0) {
      ElMessage.success(`成功导入 ${response.success} 条语录`)
    } else {
      ElMessage.warning(`导入完成：成功 ${response.success} 条，失败 ${response.failed} 条`)
    }

    batchDialogVisible.value = false
    fetchQuotes()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '批量导入失败')
    }
  } finally {
    batchLoading.value = false
  }
}

onMounted(() => {
  fetchQuotes()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
