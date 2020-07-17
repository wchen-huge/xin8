import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Users from '../components/system/Users'
import Welcome from '../components/Welcome'
import Roles from '../components/system/Roles'
import Alarm from '../components/menuInfo/Alarm'
import Approve from '../components/menuInfo/Approve'
import Placard from '../components/menuInfo/Placard'
import Urge from '../components/menuInfo/Urge'
import Department from '../components/system/Department'
import Login from '../components/Login'
import FlowTrack from '../components/menuInfo/FlowTrack'
import Allocation from '../components/menuInfo/Allocation'
import Application from '../components/system/Application'
import Donate from '../components/system/Donate'
import Infomation from '../components/system/Infomation'
import Scrap from '../components/system/Scrap'
Vue.use(VueRouter)

const routes = [
  /* 重定向路由 */
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
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', component: Welcome },
      { path: '/roles', component: Roles },
      { path: '/users', component: Users },
      { path: '/department', component: Department },
      { path: '/approve', component: Approve },
      { path: '/placard', component: Placard },
      { path: '/urge', component: Urge },
      { path: '/alarm', component: Alarm },
      { path: '/allocation', component: Allocation },
      { path: '/application', component: Application },
      { path: '/donate', component: Donate },
      { path: '/infomation', component: Infomation },
      { path: '/scrap', component: Scrap },
      { path: '/flowTrack', component: FlowTrack }]
  }
]

const router = new VueRouter({
  routes
})

export default router
