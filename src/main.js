import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './assets/styles/style.css'


const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#050505',
          surface: '#0b0b0b',
          primary: '#d4af37',
          success: '#22c55e',
          warning: '#eab308',
          error: '#ef4444',
          info: '#3b82f6'
        }
      }
    }
  }
})

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .mount('#app')
