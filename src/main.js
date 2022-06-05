import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import "./assets/css/global.css"
import MyUrl from "./plugins/Url"

import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'DCSZhZWAqQBtGG7wVcKDh7PYD769XvVC'
});

import axios from 'axios'
axios.defaults.baseURL=MyUrl.serverUrl;
Vue.prototype.$imgUrl = MyUrl.imgUrl
Vue.prototype.$axios = axios

axios.interceptors.request.use(config=>{
  let token = sessionStorage.getItem("token");
  if (token){
    config.headers["token"]=token
  }
  return config;
})

axios.interceptors.response.use((config=>{
  let data = config.data;
  if (data == "0"){
    ElementUI.Message({
      type:"error",
      message:"非法访问，请先登录！",
      duration:1000,
    })
    location.href = "/Login";
  }else if (data == '1'){
    ElementUI.Message({
      type:'error',
      message:'登录过期,请重新登录!',
      duration:1000
    })
    location.href = "/Login";
  }else if (data == '2'){
    ElementUI.Message({
      type:'error',
      message:'非法访问,请先登录!',
      duration:1000
    })
    location.href = "/Login";
  }else if (data == '3') {
    ElementUI.Message({
      type: 'error',
      message: '系统错误，请联系管理员!',
      duration: 1000
    })
    location.href = "/Login";
  }
  // location.href = "/Login"
  return config
}))

import qs from 'qs'
Vue.prototype.$qs = qs

import ElementUI from 'element-ui'
Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
