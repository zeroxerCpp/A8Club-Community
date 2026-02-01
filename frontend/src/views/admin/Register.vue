<template>
  <div class="register-page">
    <el-card class="register-card">
      <template #header>
        <h2>管理后台注册</h2>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%">
            注册
          </el-button>
        </el-form-item>

        <div class="register-link">
          已有账号？<router-link to="/admin/login">立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authAPI } from '../../api'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validatePassword = (rule: any, value: any, callback: any) => {
  void rule
  if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  
  loading.value = true
  
  try {
    const response = await authAPI.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    })
    console.log('注册响应:', response)
    ElMessage.success('注册成功，请登录')
    await router.push('/admin/login')
  } catch (error: any) {
    console.error('注册失败详情:', {
      error,
      response: error.response,
      data: error.response?.data,
      status: error.response?.status,
      message: error.message,
    })
    ElMessage.error(error.response?.data?.message || error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.register-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  padding: 20px;
  border-radius: 4px 4px 0 0;
}

.register-card :deep(.el-card__header h2) {
  color: white;
  margin: 0;
  font-size: 20px;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 4px;
}

.register-link a:hover {
  color: #66b1ff;
}
</style>
