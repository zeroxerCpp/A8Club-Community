import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authAPI, type LoginData } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)

  const login = async (data: LoginData) => {
    const response: any = await authAPI.login(data)
    token.value = response.accessToken
    user.value = response.user
    localStorage.setItem('token', response.accessToken)
    return response
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => {
    return !!token.value
  }

  return {
    token,
    user,
    login,
    logout,
    isAuthenticated,
  }
})
