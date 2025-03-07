import * as bootstrap from 'bootstrap'
import { BIconTrash3, BIconPencil, BIconChevronDown, BIconChevronUp } from 'bootstrap-icons-vue'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.provide('bootstrap', bootstrap)
app.use(router)

app.component('BIconTrash3', BIconTrash3)
app.component('BIconPencil', BIconPencil)
app.component('BIconChevronDown', BIconChevronDown)
app.component('BIconChevronUp', BIconChevronUp)

app.mount('#app')
