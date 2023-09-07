import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
    children: [
      {
        name: 'Login',
        path: 'login',
        meta: {
          title: '登录',
          noNavBar: true
        },
        component: () => import('@/views/userInfo/login/index.vue')
      }
    ]
  }
]

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes
})

export default router
