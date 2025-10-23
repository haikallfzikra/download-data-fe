import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker path
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const app = createApp(App)
app.use(VueApexCharts)
// ⬅️ tambahkan ini
app.component('ApexCharts', VueApexCharts) // ⬅️ tambahkan ini

app.use(createPinia())
app.use(router)

app.mount('#app')
