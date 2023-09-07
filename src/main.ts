import 'the-new-css-reset/css/reset.css'
import 'uno.css'
import '@/styles/index.scss'

import { createSSRApp } from 'vue'

import store from '@/store'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 路由
app.use(router)

// 状态管理
app.use(store)

app.mount('#app')
