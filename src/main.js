// import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {useAuthStore} from '@/stores/auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())

const auth = useAuthStore()
auth.initAuthListener()

app.use(router)

app.mount('#app')
