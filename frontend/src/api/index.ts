import api from '../utils/request'

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export const authAPI = {
  login: (data: LoginData) => api.post('/auth/login', data),
  register: (data: RegisterData) => api.post('/auth/register', data),
}

export const foundersAPI = {
  getAll: () => api.get('/founders'),
  getActive: () => api.get('/founders/active'),
  getOne: (id: number) => api.get(`/founders/${id}`),
  create: (data: any) => api.post('/founders', data),
  update: (id: number, data: any) => api.patch(`/founders/${id}`, data),
  delete: (id: number) => api.delete(`/founders/${id}`),
}

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getActive: () => api.get('/projects/active'),
  getOne: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.patch(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
}

export const statsAPI = {
  getLatest: () => api.get('/stats/latest'),
  getHistory: (limit?: number) => api.get('/stats/history', { params: { limit } }),
  update: (data: any) => api.patch('/stats', data),
  create: (data: any) => api.post('/stats', data),
}

export const newsAPI = {
  getAll: () => api.get('/news'),
  getPublished: () => api.get('/news/published'),
  getOne: (id: number) => api.get(`/news/${id}`),
  create: (data: any) => api.post('/news', data),
  update: (id: number, data: any) => api.patch(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
}

export const friendLinksAPI = {
  getAll: () => api.get('/friend-links'),
  getActive: () => api.get('/friend-links/active'),
  getOne: (id: number) => api.get(`/friend-links/${id}`),
  create: (data: any) => api.post('/friend-links', data),
  update: (id: number, data: any) => api.put(`/friend-links/${id}`, data),
  delete: (id: number) => api.delete(`/friend-links/${id}`),
}

export const analyticsAPI = {
  track: (path: string, referrer?: string) => api.post('/analytics/track', { path, referrer }),
  getStats: (days?: number) => api.get('/analytics/stats', { params: { days } }),
  getDailyStats: (days?: number) => api.get('/analytics/daily', { params: { days } }),
  getTopPages: (limit?: number) => api.get('/analytics/pages', { params: { limit } }),
  getRecentVisitors: (limit?: number) => api.get('/analytics/recent', { params: { limit } }),
}

export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export const quotesAPI = {
  getList: (page?: number, limit?: number) => {
    if (page && limit) {
      return api.get(`/quotes?page=${page}&limit=${limit}`)
    }
    return api.get('/quotes')
  },
  getOne: (id: number) => api.get(`/quotes/${id}`),
  create: (data: any) => api.post('/quotes', data),
  update: (id: number, data: any) => api.put(`/quotes/${id}`, data),
  delete: (id: number) => api.delete(`/quotes/${id}`),
  deleteAll: () => api.delete('/quotes'),
  batchImport: (data: { content: string; author: string; publishDate?: string; context?: string }) => 
    api.post('/quotes/batch-import', data),
}

export const toolsAPI = {
  getList: () => api.get('/tools'),
  getOne: (id: number) => api.get(`/tools/${id}`),
  create: (data: any) => api.post('/tools', data),
  update: (id: number, data: any) => api.put(`/tools/${id}`, data),
  delete: (id: number) => api.delete(`/tools/${id}`),
}

