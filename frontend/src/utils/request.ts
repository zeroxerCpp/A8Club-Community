import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
}) as any

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    console.log('API Response:', data) // 调试日志
    
    // 处理后端返回的 { value: [...], Count: number } 格式
    if (data && typeof data === 'object' && 'value' in data && Array.isArray(data.value) && 'Count' in data) {
      console.log('Converting structured response to array:', data.value)
      return data.value
    }
    return data
  },
  (error: AxiosError<{ message?: string }>) => {
    console.error('API Error:', error)
    const message = error.response?.data?.message || '请求失败'
    ElMessage.error(message)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
