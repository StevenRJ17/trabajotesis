import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApexCharts from 'vue3-apexcharts'
import { defineRule, } from 'vee-validate';// Import global styles
import { is_boolean } from './rules/custom_rules'



defineRule('is_boolean', is_boolean);
const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
