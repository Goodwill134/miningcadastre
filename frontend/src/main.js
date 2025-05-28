import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
app.use(pinia)

// Setup Router
app.use(router)

// Setup VueUse
import { useMouse } from '@vueuse/core'
app.config.globalProperties.$mouse = useMouse()

// Setup Error Handling
app.config.errorHandler = (err, vm, info) => {
  console.error('Error:', err, 'Info:', info)
}

// Mount app
app.mount('#app')
