import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Create the app
const app = createApp(App)

// Setup Pinia for state management
app.use(createPinia())

// Setup Vue Router
app.use(router)

// Mount the app
app.mount('#app')
