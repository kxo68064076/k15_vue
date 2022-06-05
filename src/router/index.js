import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from "@/k15/Login";
import Home from "@/k15/Home"
import WelCome from "@/k15/WelCome"
import Permission from "@/k15/system/Permission";

const routes = [
  {
    path:"/",
    name:"Login",
    component:Login
  },
  {
    path:"login",
    name:"Login",
    component:Login
  },
  {
    path:"/Home",
    name:"Home",
    component:Home,
    children:[
      {
        path:"/",
        name:"WelCome",
        component:WelCome
      },
      {
        path:"/permission",
        name:"Permission",
        component:Permission
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
