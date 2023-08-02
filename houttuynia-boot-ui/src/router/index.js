import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/',
    name: 'HelloWorld',
  },
]
export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap,
})
