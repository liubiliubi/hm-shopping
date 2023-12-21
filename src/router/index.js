import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout'
import Home from '@/views/layout/home.vue'
import Cart from '@/views/layout/cart.vue'
import Category from '@/views/layout/category.vue'
import User from '@/views/layout/user.vue'

import store from '@/store'

const Login = () => import('@/views/login')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list.vue')
const ProDetail = () => import('@/views/prodetail')
const Pay = () => import('@/views/pay')
const MyOrder = () => import('@/views/myorder')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      { name: 'home', path: '/home', component: Home },
      { name: 'cart', path: '/cart', component: Cart },
      { name: 'category', path: '/category', component: Category },
      { name: 'user', path: '/user', component: User }
    ]
  },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/searchlist', component: SearchList },
  { path: '/prodetail/:id', component: ProDetail },
  { path: '/pay', component: Pay },
  { path: '/myorder', component: MyOrder }
]

const router = new VueRouter({
  routes
})
// 定义一个数组，专门存放所有需要权限访问的页面
const authUrls = ['/pay', '/myorder']
// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 看 to.path 是否在 authUrls 里面出现过
  if (!authUrls.includes(to.path)) {
    next()
  } else {
    const token = store.getters.token
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
