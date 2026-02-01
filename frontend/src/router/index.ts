import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { analyticsAPI } from '../api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/founders',
      name: 'founders',
      component: () => import('../views/Founders.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/Projects.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/News.vue'),
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: () => import('../views/NewsDetail.vue'),
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/Login.vue'),
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: () => import('../views/admin/Register.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/Dashboard.vue'),
        },
        {
          path: 'guide',
          name: 'admin-guide',
          component: () => import('../views/admin/Guide.vue'),
        },
        {
          path: 'founders',
          name: 'admin-founders',
          component: () => import('../views/admin/Founders.vue'),
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('../views/admin/Projects.vue'),
        },
        {
          path: 'news',
          name: 'admin-news',
          component: () => import('../views/admin/News.vue'),
        },
        {
          path: 'stats',
          name: 'admin-stats',
          component: () => import('../views/admin/Stats.vue'),
        },
        {
          path: 'friend-links',
          name: 'admin-friend-links',
          component: () => import('../views/admin/FriendLinks.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/admin/login')
  } else {
    next()
  }
})

// 路由后置守卫：追踪页面访问
router.afterEach((to) => {
  // 只追踪前台页面，不追踪后台管理页面
  if (!to.path.startsWith('/admin')) {
    try {
      analyticsAPI.track(to.path, document.referrer)
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }
})

export default router
