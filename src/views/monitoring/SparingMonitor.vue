<template>
  <section class="p-6">
    <h2 class="text-2xl font-semibold mt-10 sm:mt-2 mb-1">Sparing Monitoring Dashboard</h2>
    <p class="text-gray-500 mb-6">Monitoring real-time sistem industri</p>

    <div class="fixed inset-0 p-4 flex items-center justify-center z-50" v-show="isOpenDetails">
      <!-- Backdrop (langsung muncul, tanpa transisi) -->
      <div class="absolute inset-0 bg-black/70" @click="isOpenDetails = false"></div>

      <!-- Modal dengan transisi -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-90 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-90 translate-y-4"
      >
        <div
          v-if="isOpenDetails"
          class="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md z-10"
        >
          <button
            @click="isOpenDetails = false"
            class="absolute top-2 right-4 font-extrabold text-black hover:text-gray-700"
          >
            ✕
          </button>

          <h3 class="font-semibold text-blue-600 mb-4 flex items-center gap-2">
            📌 Informasi Lokasi
          </h3>
          <div class="space-y-3 text-sm" v-if="selectedSite">
            <p><span class="font-medium">🏭 Perusahaan:</span> {{ selectedSite.company }}</p>
            <p><span class="font-medium">📍 Lokasi:</span> {{ selectedSite.location }}</p>
            <p>
              <span class="font-medium">📡 Status Device:</span>
              <span
                :class="selectedSite.status === 'Online' ? 'text-green-500' : 'text-red-500'"
                class="font-semibold ml-1"
              >
                {{ selectedSite.status }}
              </span>
            </p>
            <p><span class="font-medium">⏱ Last Update:</span> {{ selectedSite.last_update }}</p>
            <p><span class="font-medium">🔗 Serial:</span> {{ selectedSite.serial }}</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Loop tiap lokasi -->
    <!-- Grid Container -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <!-- Loop item -->
      <div
        v-for="site in deviceList"
        :key="site.serial"
        class="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow p-6"
      >
        <h3 class="text-lg font-semibold mb-6">{{ site.company }}</h3>

        <div class="grid grid-cols-3 gap-6 text-center">
          <div>
            <p class="text-3xl font-bold">{{ site.amon }}</p>
            <p class="text-sm opacity-90">Amonnia (mg/L)</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ site.ph }}</p>
            <p class="text-sm opacity-90">PH</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ site.nitrat }}</p>
            <p class="text-sm opacity-90">Nitrat (mg/L)</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ site.temp }}</p>
            <p class="text-sm opacity-90">temp (°C)</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ site.flow1 }}</p>
            <p class="text-sm opacity-90">Flowmeter 1 (m3/H)</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ site.flow2 }}</p>
            <p class="text-sm opacity-90">Flowmeter 2 (m3/H)</p>
          </div>
        </div>

        <div class="mt-6 text-center flex justify-between gap-4 flex-wrap">
          <button
            @click="openChart(site)"
            class="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100"
          >
            View Chart
          </button>
          <button
            @click="openDetails(site)"
            class="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Detail
          </button>
          <button
            @click="openMap(site)"
            class="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            <i class="text-lg fa-solid fa-location-dot"></i>
          </button>
          <button
            @click="openCctv(site)"
            class="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            <i class="fa-solid fa-desktop"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Pop Up -->
    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-5xl shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-blue-600">Chart Monitoring</h3>
          <button @click="showModal = false" class="text-gray-600 hover:text-red-500 text-xl">
            ✕
          </button>
        </div>

        <!-- ApexChart -->
        <ApexCharts width="100%" type="line" :options="chartOptions" :series="chartSeries" />
      </div>
    </div>

    <MapModal
      v-model="showMap"
      :location="selectedLocation"
      :lat="selectedLat"
      :lng="selectedLng"
    />

    <div v-if="showCctv" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-xl shadow-lg w-[800px] relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-black">
          ✕
        </button>

        <h2 class="text-lg font-bold mb-4">Live CCTV</h2>

        <!-- CCTV Video -->
        <video
          ref="videoRef"
          :src="cctvUrl"
          class="w-full h-[450px] rounded-lg bg-black"
          controls
          autoplay
        ></video>

        <!-- Tombol Fullscreen -->
        <div class="flex justify-end mt-2">
          <button
            @click="toggleFullscreen"
            class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ApexCharts from 'vue3-apexcharts'
import { DateTime } from 'luxon'
import MapModal from '@/components/Map/MapModal.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
console.log('user category:', userStore.user.category)
console.log('user info:', userStore.user.id)
console.log('user name:', userStore.user.station_id)
console.log('user station:', userStore.user.module_app_id)

const showModal = ref(false)
const selectedSite = ref(null)
const isOpenDetails = ref(false)
const showMap = ref(false)
const selectedLocation = ref('')
const selectedLat = ref(null)
const selectedLng = ref(null)
const showCctv = ref(false)
const cctvUrl = ref('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
const videoRef = ref(null)

const openCctv = (site) => {
  // kalau site punya field cctv_url
  cctvUrl.value =
    site.cctv_url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  showCctv.value = true
}

const closeModal = () => {
  showCctv.value = false
  cctvUrl.value = ''
}

const toggleFullscreen = () => {
  if (videoRef.value) {
    if (videoRef.value.requestFullscreen) {
      videoRef.value.requestFullscreen()
    } else if (videoRef.value.webkitRequestFullscreen) {
      videoRef.value.webkitRequestFullscreen()
    } else if (videoRef.value.msRequestFullscreen) {
      videoRef.value.msRequestFullscreen()
    }
  }
}

function openMap(site) {
  selectedLocation.value = site.location
  selectedLat.value = site.lat
  selectedLng.value = site.lng
  showMap.value = true
}

const openDetails = (site) => {
  selectedSite.value = site
  isOpenDetails.value = true
}

const chartSeries = ref([])
const chartOptions = ref({
  chart: { id: 'realtime-data' },
  xaxis: { categories: ['Debit', 'PH', 'TSS', 'COD', 'Flow 1', 'Flow 2'] },
  stroke: { curve: 'smooth' },
  dataLabels: { enabled: true },
})

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// daftar lokasi dengan id berbeda2
// station pertama (real)
const realStation = {
  company: 'PT. KUS',
  location: 'Kawasan Industri Lippo',
  location_name: 'Sparing Lippo',
  user_id: 522,
  station_id: 257,
  module_id: 255,
  serial: '-',
  flow1: randomInt(5, 20),
  flow2: randomInt(5, 20),
}

// dummy stations
const dummyStations = [
  {
    company: 'PT. KUS',
    location: 'Kawasan Industri Bekasi',
    location_name: 'Sparing PT.KUS',
    user_id: 249,
    station_id: 243,
    module_id: 240,
    serial: '-',
    flow1: randomInt(5, 20),
    flow2: randomInt(5, 20),
  },
  {
    company: 'PT. KUS',
    location: 'Kawasan Industri PTPN',
    location_name: 'Sparing Leuwitex',
    user_id: 21,
    station_id: 10,
    module_id: 10,
    serial: 'SP-987654',
    flow1: randomInt(5, 20),
    flow2: randomInt(5, 20),
  },
]

const deviceList = ref([])

const fetchMonitoringData = async () => {
  const today = new Date()
  const fromDate = new Date(today.setHours(0, 0, 0, 0)).toISOString()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const toDate = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString()

  try {
    // hanya fetch realStation
    const res = await axios.get('https://v2.cbi.mdtapps.id/api/monitoring', {
      params: {
        user_id: userStore.user.id,
        station_id: userStore.user.station_id,
        module_id: userStore.user.module_app_id,
        from_date: fromDate,
        to_date: toDate,
      },
    })

    const data = Array.isArray(res.data) ? res.data[0] : res.data
    console.log('Fetched monitoring data:', data)

    const realData = {
      ...realStation,
      company: data?.stasiun,
      status: 'Online',
      last_update: data?.waktu
        ? DateTime.fromFormat(data.waktu, 'dd/LL/yyyy HH:mm', { zone: 'utc' })
            .setZone('UTC-7')
            .toFormat('dd/LL/yyyy HH:mm')
        : '-',
      nitrat: data?.nitrat ?? 0,
      ph: data?.ph ?? 0,
      temp: data?.temp ?? 0,
      amon: data?.amon ?? 0,
    }

    // gabungkan dengan dummy
    deviceList.value = [
      realData,
      ...dummyStations.map((s) => ({
        ...s,
        status: 'Offline',
        last_update: '-',
        debit: 0,
        ph: 0,
        tss: 0,
        cod: 0,
      })),
    ]
  } catch (error) {
    console.error(error)

    // fallback kalau error
    deviceList.value = [
      { ...realStation, status: 'Offline', last_update: '-', debit: 0, ph: 0, tss: 0, cod: 0 },
      ...dummyStations.map((s) => ({
        ...s,
        status: 'Offline',
        last_update: '-',
        debit: 0,
        ph: 0,
        tss: 0,
        cod: 0,
      })),
    ]
  }
}

const openChart = async (site) => {
  try {
    // tanggal hari ini
    const today = new Date()
    const fromDate = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const toDate = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString()

    const res = await axios.post('https://v2.cbi.mdtapps.id/api/chart-data/monitoring', {
      user_id: site.user_id,
      station: {
        station_id: site.station_id,
        module_id: site.module_id,
      },
      from_date: fromDate,
      to_date: toDate,
    })

    const chartData = res.data.data || {}

    // ambil label dari salah satu parameter yang ada (misal cod / bod / tss / dll)
    const firstKey = Object.keys(chartData)[0]
    const labels = firstKey
      ? chartData[firstKey].map(
          (item) =>
            DateTime.fromFormat(item.waktu, 'dd/LL/yyyy HH:mm', { zone: 'utc' }) // baca waktu backend sebagai UTC
              .setZone('UTC-7') // ubah ke UTC-7
              .toFormat('dd/LL/yyyy HH:mm'), // format tampilan
        )
      : []

    // generate series dinamis hanya dari key yang tersedia
    chartSeries.value = Object.keys(chartData)
      .filter((key) => Array.isArray(chartData[key]))
      .map((key) => ({
        name: key.toUpperCase(),
        data: chartData[key].map((i) => i.value),
      }))

    chartOptions.value = {
      chart: { id: 'monitoring-chart' },
      xaxis: { categories: labels },
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: true },
      tooltip: { shared: true, intersect: false },
      legend: { position: 'bottom' },
    }

    showModal.value = true
  } catch (err) {
    console.error('❌ Gagal ambil data chart:', err)
  }
}

onMounted(fetchMonitoringData)
</script>
