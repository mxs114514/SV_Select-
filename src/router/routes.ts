export const constantRputer = [
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    name: 'login',
  },
  {
    path: '/',
    component: () => import('@/views/Home/index.vue'),
    name: 'home',
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: 'notFound',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
  },
]
