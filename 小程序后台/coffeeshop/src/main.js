import { createApp } from 'vue'
import Router from './tools/Router'
import Store from './tools/Storage'
import App from './App.vue'
import axios from 'axios'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/icon/iconfont.css'


const app = createApp(App)
app.use(ElementPlus)
app.use(Router)
app.use(Store)

// ？
// 配置axios全局使用
app.config.globalProperties.$http = axios

// 设置axios默认配置
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.timeout = 5000


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.mount('#app')

