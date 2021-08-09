import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import( /* webpackChunkName: "home" */ '../views/Home.vue');
const SettingMiner = () => import( /* webpackChunkName: "setting-miner" */ '../views/SettingMiner.vue')
const SettingSystem = () => import( /* webpackChunkName: "setting-system" */ '../views/SettingSystem.vue')
const Login = () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
const Debug = () => import( /* webpackChunkName: "debug" */ "../views/Debug.vue")
const Layout = () => import( /* webpackChunkName: "layout" */ "../views/Layout.vue")

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
          title: 'TITLE_HOME'
        }
      },
      {
        path: '/config',
        name: 'MinerSetting',
        component: SettingMiner,
        meta: {
          title: 'TITLE_MINER'
        }
      },
      {
        path: '/system',
        name: 'SystemSetting',
        component: SettingSystem,
        meta: {
          title: 'TITLE_SYSTEM'
        }
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
          title: 'UNLOCK_TITLE'
        }
      }
    ]
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router