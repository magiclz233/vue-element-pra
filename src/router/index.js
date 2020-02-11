import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/pra/Users.vue'
import Roles from '../components/pra/Roles.vue'
import Rights from '../components/pra/Rights.vue'
import Categories from '../components/pra/Categories.vue'
import Goods from '../components/pra/Goods.vue'
import Params from '../components/pra/Params.vue'
import Reports from '../components/pra/Reports.vue'
import Orders from '../components/pra/Orders.vue'
import GoodsAdd from '../components/pra/GoodsAdd.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      },
      {
        path: '/goods/add',
        component: GoodsAdd
      }
    ]
  },
  {
    path: '/welcome',
    component: Welcome
  }
]

const router = new VueRouter({
  routes
})

// 路由导航首位
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  // 如果token为空,name直接跳转到登陆页面
  const token = sessionStorage.getItem('token')

  if (!token) return next('/login')

  next()
})

export default router
