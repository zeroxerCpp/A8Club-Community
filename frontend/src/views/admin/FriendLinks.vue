<template>
  <div class="friend-links-page">
    <div class="page-header">
      <h2>友情链接管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加链接
      </el-button>
    </div>

    <el-table :data="friendLinks" style="width: 100%">
      <el-table-column prop="orderIndex" label="排序" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.orderIndex === 0" type="danger" size="small">置顶</el-tag>
          <span v-else>{{ row.orderIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站Logo" width="100">
        <template #default="{ row }">
          <img v-if="row.logo" :src="row.logo" style="width: 40px; height: 40px; object-fit: contain;" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="网站名称" width="150" />
      <el-table-column prop="url" label="网站链接">
        <template #default="{ row }">
          <el-link :href="row.url" target="_blank" type="primary">{{ row.url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="isActive" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="网站名称" required>
          <el-input v-model="form.name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站链接" required>
          <el-input v-model="form.url" placeholder="https://example.com" />
        </el-form-item>
        <el-form-item label="Logo链接">
          <div style="display: flex; gap: 10px;">
            <el-input 
              v-model="form.logo" 
              placeholder="输入Logo URL或上传图片"
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
          <div v-if="form.logo" style="margin-top: 10px;">
            <img :src="form.logo" style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="简短描述（选填）"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderIndex" :min="0" />
          <el-text type="info" size="small" style="margin-left: 10px;">设置为0即为置顶</el-text>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.isActive" active-text="启用" inactive-text="禁用" />
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
import { Plus } from '@element-plus/icons-vue'
import { friendLinksAPI } from '../../api'

const friendLinks = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加友情链接')
const isEdit = ref(false)
const editId = ref<number | null>(null)

const form = ref({
  name: '',
  url: '',
  logo: '',
  description: '',
  orderIndex: 0,
  isActive: true,
})

const loadFriendLinks = async () => {
  try {
    const data = await friendLinksAPI.getAll()
    friendLinks.value = data
  } catch (error) {
    ElMessage.error('加载友情链接失败')
    console.error('加载友情链接失败:', error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加友情链接'
  isEdit.value = false
  form.value = {
    name: '',
    url: '',
    logo: '',
    description: '',
    orderIndex: 0,
    isActive: true,
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑友情链接'
  isEdit.value = true
  editId.value = row.id
  form.value = {
    name: row.name,
    url: row.url,
    logo: row.logo || '',
    description: row.description || '',
    orderIndex: row.orderIndex,
    isActive: row.isActive,
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.url) {
    ElMessage.warning('请填写必填项')
    return
  }

  try {
    if (isEdit.value && editId.value) {
      await friendLinksAPI.update(editId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await friendLinksAPI.create(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadFriendLinks()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    console.error('操作失败:', error)
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该友情链接吗？', '提示', {
      type: 'warning',
    })
    await friendLinksAPI.delete(row.id)
    ElMessage.success('删除成功')
    loadFriendLinks()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

const handleUploadSuccess = (response: any) => {
  if (response?.url) {
    form.value.logo = response.url
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
  loadFriendLinks()
})
</script>

<style scoped>
.friend-links-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
