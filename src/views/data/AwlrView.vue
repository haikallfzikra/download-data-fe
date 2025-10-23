<template>
  <div class="p-6 space-y-6 min-h-screen">
    <h1 class="text-2xl font-bold mt-10 sm:mt-2 text-gray-800">Data</h1>

    <!-- Filter Section -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <div
          v-if="userStore.user.category === 'wqms'"
          class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mt-2"
        >
          <label class="inline-flex items-center">
            <input value="Waktu" v-model="filterBy" class="accent-blue-600" />
            <span class="ml-2"></span>
          </label>

          <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 mt-2 sm:mt-0">
            <label class="inline-flex items-center">
              <input type="radio" value="2min" v-model="dataType" class="accent-blue-600" />
              <span class="ml-2">2 Menit</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="hourly" v-model="dataType" class="accent-blue-600" />
              <span class="ml-2">Per Jam</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="daily" v-model="dataType" class="accent-blue-600" />
              <span class="ml-2">Per Hari</span>
            </label>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        <div>
          <label class="text-sm text-gray-600">Mulai</label>
          <input
            type="date"
            v-model="startDate"
            class="form-input w-full mt-1 border p-2 rounded-md"
          />
        </div>
        <div>
          <label class="text-sm text-gray-600">Hingga</label>
          <input
            type="date"
            v-model="endDate"
            class="form-input w-full mt-1 border p-2 rounded-md"
          />
        </div>

        <div class="flex items-end sm:col-span-2 md:col-span-1">
          <button
            @click="fetchData"
            class="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full flex items-center justify-center"
          >
            Filter
          </button>
        </div>
      </div>
    </section>

    <!-- Grafik Section -->
    <button
      @click="showChart = !showChart"
      class="bg-blue-500 text-white px-3 py-1 rounded w-full sm:w-auto"
    >
      Show Chart
    </button>

    <!-- Grafik Section -->
    <section v-if="showChart" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div class="text-gray-600 mb-4">Grafik Report:</div>

      <!-- Filter tanggal -->
      <div class="flex flex-col sm:flex-row gap-4 mb-4">
        <div class="flex-1">
          <label class="text-sm text-gray-600">Mulai</label>
          <input
            type="date"
            v-model="chartStartDate"
            class="form-input w-full mt-1 border p-2 rounded-md"
          />
        </div>
        <div class="flex-1">
          <label class="text-sm text-gray-600">Hingga</label>
          <input
            type="date"
            v-model="chartEndDate"
            class="form-input w-full mt-1 border p-2 rounded-md"
          />
        </div>
        <!-- Tombol load -->
        <div class="flex items-end">
          <button
            @click="fetchChartData"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            Load Chart
          </button>
        </div>
      </div>

      <!-- Pilihan parameter -->
      <div class="mb-4">
        <label class="font-semibold text-gray-700">Pilih Parameter:</label>
        <div class="flex flex-wrap gap-3 mt-2">
          <label
            v-for="param in Object.keys(chartData[0] || {}).filter(
              (k) => k !== 'waktu' && k !== 'stasiun',
            )"
            :key="param"
            class="inline-flex items-center text-sm sm:text-base"
          >
            <input
              type="checkbox"
              :value="param"
              v-model="selectedParams"
              class="accent-blue-600"
            />
            <span class="ml-2 capitalize">{{ param }}</span>
          </label>
        </div>
      </div>

      <!-- Tombol kontrol -->
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
        <button
          @click="selectAllParams"
          class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Tampilkan Semua
        </button>
        <button
          @click="clearParams"
          class="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
        >
          Hapus Semua
        </button>
      </div>

      <!-- Chart -->
      <div class="w-full border border-dashed text-gray-400 rounded-lg overflow-x-auto">
        <ApexCharts
          type="line"
          height="350"
          width="100%"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </section>

    <!-- Tabel -->
    <section
      class="bg-white p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg w-full lg:w-full lg:max-w-none"
    >
      <div class="mb-4">
        <label class="font-semibold text-gray-800 text-lg">Tampilkan Kolom:</label>
      </div>

      <!-- Export Buttons -->
      <div class="flex flex-wrap justify-end gap-2 mb-3">
        <button
          @click="openCctv(site)"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          <i class="fa-solid fa-desktop"></i>
        </button>
        <button
          @click="showMap = true"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          <i class="text-lg fa-solid fa-location-dot"></i>
        </button>
        <button
          @click="downloadCurrentPage"
          class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Download Current Page
        </button>
        <button
          @click="downloadAllPages"
          class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Download All
        </button>
      </div>

      <div class="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm min-h-[200px]">
        <!-- Loading State -->
        <div v-if="loadingTable" class="flex flex-col items-center justify-center py-10 w-full">
          <svg
            class="animate-spin h-10 w-10 text-blue-600 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span class="text-gray-500">Memuat data...</span>
        </div>

        <!-- Table Content -->
        <table
          v-else-if="dataTable.length"
          class="table-auto min-w-[700px] w-full text-sm text-gray-700 border-collapse"
        >
          <thead class="bg-gradient-to-r from-blue-500 to-blue-600">
            <tr>
              <th class="px-3 py-2 border-b text-center font-semibold text-white whitespace-nowrap">
                Stasiun
              </th>
              <th class="px-3 py-2 border-b text-center font-semibold text-white whitespace-nowrap">
                Waktu
              </th>
              <th
                v-for="key in dynamicColumns"
                :key="key"
                class="px-3 py-2 border-b text-center font-semibold text-white whitespace-nowrap"
              >
                {{ key.replaceAll('_', ' ') }}
                <span v-if="columnUnits[key]" class="block text-xs font-normal text-blue-100">
                  ({{ columnUnits[key] }})
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in dataTable"
              :key="index"
              class="even:bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <!-- Stasiun -->
              <td
                class="px-3 py-2 border-b font-medium text-gray-900 whitespace-normal sm:whitespace-nowrap"
              >
                {{ row.stasiun }}
              </td>

              <!-- Waktu -->
              <td class="px-3 py-2 border-b text-gray-600 whitespace-normal sm:whitespace-nowrap">
                {{ row.waktu }}
              </td>

              <!-- Kolom sensor -->
              <td
                v-for="key in dynamicColumns"
                :key="key"
                class="px-3 py-2 border-b text-center whitespace-normal sm:whitespace-nowrap"
                :class="getColorClass(row[key], key)"
              >
                {{ row[key] ?? '-' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-else class="py-10 w-full text-center text-gray-500">Tidak ada data ditemukan.</div>
      </div>
    </section>

    <MapModal
      v-model="showMap"
      :location="'awlr-demo'"
      :lat="-6.948548992398081"
      :lng="107.53153986625901"
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

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-4">
      <ul class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <!-- First Page -->
        <li>
          <button
            @click="changePage(1)"
            :disabled="currentPage === 1"
            class="px-2 py-1 border rounded disabled:opacity-50"
          >
            «
          </button>
        </li>

        <!-- Previous -->
        <li>
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-2 py-1 border rounded disabled:opacity-50"
          >
            ‹
          </button>
        </li>

        <!-- Page Numbers -->
        <li v-for="page in pageNumbersToShow" :key="page" class="hidden sm:inline-block">
          <button
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded border',
              page === currentPage ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
        </li>

        <!-- Next -->
        <li>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-2 py-1 border rounded disabled:opacity-50"
          >
            ›
          </button>
        </li>

        <!-- Last Page -->
        <li>
          <button
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-2 py-1 border rounded disabled:opacity-50"
          >
            »
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { DateTime } from 'luxon'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ApexCharts from 'vue3-apexcharts'
import { useUserStore } from '@/stores/user'
import MapModal from '@/components/Map/MapModal.vue'

const userStore = useUserStore()

const dataTable = ref([])
const chartData = ref([])

const filterBy = ref('waktu')
// const selectedStation = ref('')
const startDate = ref('')
const endDate = ref('')
const showChart = ref(false)
const showMap = ref(false)
// const selectedLocation = ref('')
// const selectedLat = ref(null)
// const selectedLng = ref(null)
const showCctv = ref(false)
const cctvUrl = ref('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
const videoRef = ref(null)

// const byIspuBaru = ref('')
// const byIspuLama = ref('')

// const gasKeys = ['co', 'pm25', 'pm10', 'no2', 'so2', 'o3', 'hc']
// const weatherKeys = [
//   'temp',
//   'humidity',
//   'pressure',
//   'wspeed',
//   'intensity',
//   'tprecipitation',
//   'solar-radiation',
//   'rain_intensity',
// ]

const aqmsColumns = [
  'pm10',
  'pm25',
  'so2',
  'co',
  'o3',
  'no2',
  'hc',
  'wspeed', // Wind Speed
  'wind_angle', // Wind Direction
  'humidity',
  'temp', // Temperature
  'pressure',
  'intensity', // Solar Radiation
  'rain_intensity', // Rain Intensity
]

const dataType = ref('2min')
const loadingTable = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const chartSeries = ref([])
const chartCategories = ref([])
const selectedParams = ref(['pm25']) // default pm25
const thresholdsChart = {
  pm25: { min: 0, max: 65 },
  pm10: { min: 0, max: 150 },
  so2: { min: 0, max: 80 },
  no2: { min: 0, max: 200 },
  o3: { min: 0, max: 120 },
  co: { min: 0, max: 10000 },
  hc: { min: 0, max: 200 },
}
// const year = ref(new Date().getFullYear())
// const month = ref(new Date().getMonth() + 1)
// const months = [
//   { value: 1, name: 'Januari' },
//   { value: 2, name: 'Februari' },
//   { value: 3, name: 'Maret' },
//   { value: 4, name: 'April' },
//   { value: 5, name: 'Mei' },
//   { value: 6, name: 'Juni' },
//   { value: 7, name: 'Juli' },
//   { value: 8, name: 'Agustus' },
//   { value: 9, name: 'September' },
//   { value: 10, name: 'Oktober' },
//   { value: 11, name: 'November' },
//   { value: 12, name: 'Desember' },
// ]

const columnUnits = {
  bod: 'mg/L',
  cod: 'mg/L',
  tss: 'mg/L',
  debit: 'm³/H',
  ph: '-',
  amon: 'mg/L',

  temp: '°C',
  'temp panel': '°C',
  'temp cleaning': '°C',

  humidity: '%',

  voltage: 'Volt',

  pm10: 'µg/m³',
  pm25: 'µg/m³',
  o3: 'µg/m³',
  co: 'µg/m³',
  so2: 'µg/m³',
  no2: 'µg/m³',

  'rain intensity': 'mm',
  pressure: 'hPa',
  intensity: 'W/m²',
  wspeed: 'm/s',
  'wind angle': '°',
  hc: 'µg/m³',
}

startDate.value = DateTime.now().toISODate()
endDate.value = DateTime.now().toISODate()

// const hiddenColumns = ['tprecipitation']

const dynamicColumns = computed(() => {
  if (!dataTable.value.length) return []
  const keys = Object.keys(dataTable.value[0]).filter(
    (key) => !['stasiun', 'waktu', 'tprecipitation'].includes(key),
  )

  if (userStore.user.category === 'aqms') {
    const allowed = ['pm10', 'pm25', 'so2', 'no2', 'co', 'o3', 'hc']
    return aqmsColumns.filter((col) => keys.includes(col) && allowed.includes(col))
  }

  return keys
})

const openCctv = (site) => {
  // kalau site punya field cctv_url
  cctvUrl.value =
    site?.cctv_url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
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

function getFileName(prefix) {
  const start = startDate.value ? DateTime.fromISO(startDate.value).toFormat('yyyy-MM-dd') : 'start'
  const end = endDate.value ? DateTime.fromISO(endDate.value).toFormat('yyyy-MM-dd') : 'end'
  return `${prefix}_${start}_from_${end}.xlsx`
}

function exportToExcel(rows, filename) {
  if (!rows || !rows.length) return

  // Urutkan sesuai aqmsColumns
  const formattedRows = rows.map((row) => {
    const ordered = {
      stasiun: row.stasiun,
      waktu: row.waktu,
    }
    aqmsColumns.forEach((col) => {
      ordered[col] = row[col] ?? '-'
    })
    return ordered
  })

  const ws = XLSX.utils.json_to_sheet(formattedRows, {
    header: ['stasiun', 'waktu', ...aqmsColumns],
  })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), filename)
}

function downloadCurrentPage() {
  exportToExcel(dataTable.value, getFileName('aqms_page' + currentPage.value))
}

async function downloadAllPages() {
  try {
    loadingTable.value = true

    let endpoint = ''
    if (dataType.value === 'hourly') {
      endpoint = 'https://v2.cbi.mdtapps.id/api/sensor-table/hourly/ispu'
    } else if (dataType.value === 'daily') {
      endpoint = 'https://v2.cbi.mdtapps.id/api/sensor-table/daily/ispu'
    } else {
      endpoint = 'https://v2.cbi.mdtapps.id/api/api/sensor-table/awlr'
    }

    const response = await axios.post(endpoint, {
      user_id: userStore.user.id,
      station: JSON.stringify({
        module_id: userStore.user.module_app_id,
        station_id: userStore.user.station_id,
      }),
      from_date: DateTime.fromISO(startDate.value).startOf('day').toISO(),
      to_date: DateTime.fromISO(endDate.value).endOf('day').toISO(),
      parameter: null,
      page: 1,
      per_page: totalPages.value * 20,
    })

    const allData = response.data.data
    exportToExcel(allData, getFileName('aqms_all'))
  } catch (err) {
    console.error('Gagal download semua data:', err)
  } finally {
    loadingTable.value = false
  }
}

const fetchData = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Mohon isi tanggal mulai dan hingga.')
    return
  }

  const start = DateTime.fromISO(startDate.value).startOf('day')
  const end = DateTime.fromISO(endDate.value).endOf('day')

  const diff = end.diff(start, 'days').days
  if (diff > 31) {
    alert('Rentang tanggal tidak boleh lebih dari 1 bulan!')
    return
  }

  const fromDate = start.toISO()
  const toDate = end.toISO()

  let endpoint = ''
  if (dataType.value === 'hourly') {
    endpoint = 'https://v2.cbi.mdtapps.id/api/sensor-table/hourly/ispu'
  } else if (dataType.value === 'daily') {
    endpoint = 'https://v2.cbi.mdtapps.id/api/sensor-table/daily/ispu'
  } else {
    endpoint = 'https://v2.cbi.mdtapps.id/api/api/sensor-table/awlr'
  }

  loadingTable.value = true
  try {
    const response = await axios.post(endpoint, {
      user_id: userStore.user.id,
      station: JSON.stringify({
        module_id: userStore.user.module_app_id,
        station_id: userStore.user.station_id,
      }),
      from_date: fromDate,
      to_date: toDate,
      parameter: null,
      page: currentPage.value,
      per_page: 20,
    })

    dataTable.value = response.data.data
    totalPages.value = response.data.total_pages
  } catch (error) {
    console.error('Gagal ambil data:', error)
  } finally {
    loadingTable.value = false
  }
}

const chartStartDate = ref(DateTime.now().toISODate())
const chartEndDate = ref(DateTime.now().toISODate())

const fetchChartData = async () => {
  if (!chartStartDate.value || !chartEndDate.value) {
    alert('Mohon isi tanggal mulai dan hingga untuk chart.')
    return
  }

  const start = DateTime.fromISO(chartStartDate.value).startOf('day')
  const end = DateTime.fromISO(chartEndDate.value).endOf('day')

  // hitung selisih hari
  const diff = end.startOf('day').diff(start.startOf('day'), 'days').days

  if (diff !== 0) {
    alert('Rentang tanggal hanya boleh 1 hari!')
    return
  }

  const fromDate = start.toISO()
  const toDate = end.toISO()

  let endpoint = ''
  if (dataType.value === 'hourly') {
    endpoint = 'https://v2.cbi.mdtapps.id/api/sensor-table/hourly/ispu'
  } else if (dataType.value === 'daily') {
    endpoint = 'https://v2.cbi.mdtapps.id/api/sensor-table/daily/ispu'
  } else {
    endpoint = 'https://v2.cbi.mdtapps.id/api/api/chart-data/awlr'
  }

  try {
    const response = await axios.post(endpoint, {
      user_id: userStore.user.id,
      station: JSON.stringify({
        module_id: userStore.user.module_app_id,
        station_id: userStore.user.station_id,
      }),
      from_date: fromDate,
      to_date: toDate,
      parameter: null,
    })

    chartData.value = response.data.data
  } catch (error) {
    console.error('Gagal ambil data chart:', error)
  }
}

// const applyFilter = () => {
//   console.log('Filter diterapkan:', {
//     filterBy: filterBy.value,
//     selectedStation: selectedStation.value,
//     startDate: startDate.value,
//     endDate: endDate.value,
//     byIspuBaru: byIspuBaru.value,
//     byIspuLama: byIspuLama.value,
//   })
// }

function getColorClass(value, key) {
  const category = userStore.user.category
  if (category === 'aqms') {
    return getGasColorClass(value, key)
  }

  if (category === 'wqms') {
    return ''
  }

  if (category === 'awlr') {
    return getDepthColorClass(value, key)
  }

  return ''
}

// Tabel konversi konsentrasi → ISPU (dari dokumen)
const thresholds = {
  pm10: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 150, iLow: 51, iHigh: 100 },
    { cLow: 151, cHigh: 350, iLow: 101, iHigh: 200 },
    { cLow: 351, cHigh: 420, iLow: 201, iHigh: 300 },
    { cLow: 421, cHigh: 500, iLow: 301, iHigh: 400 },
  ],
  pm25: [
    { cLow: 0, cHigh: 15.5, iLow: 0, iHigh: 50 },
    { cLow: 15.6, cHigh: 55.4, iLow: 51, iHigh: 100 },
    { cLow: 55.5, cHigh: 150.4, iLow: 101, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 500, iLow: 301, iHigh: 400 },
  ],
  so2: [
    { cLow: 0, cHigh: 52, iLow: 0, iHigh: 50 },
    { cLow: 53, cHigh: 185, iLow: 51, iHigh: 100 },
    { cLow: 186, cHigh: 304, iLow: 101, iHigh: 200 },
    { cLow: 305, cHigh: 800, iLow: 201, iHigh: 300 },
    { cLow: 801, cHigh: 1200, iLow: 301, iHigh: 400 },
  ],
  co: [
    { cLow: 0, cHigh: 4000, iLow: 0, iHigh: 50 },
    { cLow: 4001, cHigh: 8000, iLow: 51, iHigh: 100 },
    { cLow: 8001, cHigh: 15000, iLow: 101, iHigh: 200 },
    { cLow: 15001, cHigh: 30000, iLow: 201, iHigh: 300 },
    { cLow: 30001, cHigh: 45000, iLow: 301, iHigh: 400 },
  ],
  o3: [
    { cLow: 0, cHigh: 120, iLow: 0, iHigh: 50 },
    { cLow: 121, cHigh: 235, iLow: 51, iHigh: 100 },
    { cLow: 236, cHigh: 400, iLow: 101, iHigh: 200 },
    { cLow: 401, cHigh: 800, iLow: 201, iHigh: 300 },
    { cLow: 801, cHigh: 1000, iLow: 301, iHigh: 400 },
  ],
  no2: [
    { cLow: 0, cHigh: 80, iLow: 0, iHigh: 50 },
    { cLow: 81, cHigh: 200, iLow: 51, iHigh: 100 },
    { cLow: 201, cHigh: 1130, iLow: 101, iHigh: 200 },
    { cLow: 1131, cHigh: 2260, iLow: 201, iHigh: 300 },
    { cLow: 2261, cHigh: 3000, iLow: 301, iHigh: 400 },
  ],
  hc: [
    { cLow: 0, cHigh: 45, iLow: 0, iHigh: 50 },
    { cLow: 46, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 215, iLow: 101, iHigh: 200 },
    { cLow: 216, cHigh: 432, iLow: 201, iHigh: 300 },
    { cLow: 433, cHigh: 648, iLow: 301, iHigh: 400 },
  ],
}

// Fungsi hitung ISPU dengan interpolasi linear
function calculateISPU(value, key) {
  const arr = thresholds[key.toLowerCase()]
  if (!arr) return null
  for (const t of arr) {
    if (value >= t.cLow && value <= t.cHigh) {
      return ((t.iHigh - t.iLow) / (t.cHigh - t.cLow)) * (value - t.cLow) + t.iLow
    }
  }
  return null
}

function getGasColorClass(value, key) {
  if (value === undefined || value === '') return ''
  const val = parseFloat(value)
  if (isNaN(val)) return ''

  const ispu = calculateISPU(val, key)
  if (ispu == null) return ''

  if (ispu > 300) return 'bg-black text-white' // Berbahaya
  if (ispu > 200) return 'bg-red-600 text-white' // Sangat Tidak Sehat
  if (ispu > 100) return 'bg-yellow-400 text-black' // Tidak Sehat
  if (ispu > 50) return 'bg-blue-500 text-white' // Sedang
  return 'bg-green-500 text-white' // Baik
}

function getDepthColorClass(value, key) {
  if (value === undefined || value === '') return ''
  const val = parseFloat(value)
  if (isNaN(val)) return ''

  if (['ketinggian'].includes(key.toLowerCase())) {
    if (val > 150) return 'bg-red-500 text-white blink-smooth'
    if (val > 75) return 'bg-yellow-400 blink-smooth'
    if (val > 30) return 'bg-blue-400 text-white'
    return 'bg-green-400 text-white'
  }

  return ''
}

const pageNumbersToShow = computed(() => {
  const maxButtons = 10
  const half = Math.floor(maxButtons / 2)

  let start = Math.max(currentPage.value - half, 1)
  let end = start + maxButtons - 1

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(end - maxButtons + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchData()
  }
}

const chartOptions = ref({
  chart: { type: 'line', height: 350, toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: { categories: [], labels: { rotate: -45 } },
  yaxis: { title: { text: 'Nilai' } },
  legend: { position: 'top' },
  tooltip: { shared: true },
})

const transformToChart = () => {
  if (!chartData.value.length) return

  chartCategories.value = chartData.value.map((row) => row.waktu)

  let baseSeries = selectedParams.value.map((param) => ({
    name: param,
    data: chartData.value.map((row) => row[param] ?? null),
  }))

  // jika hanya 1 parameter → tambahkan batas atas & bawah
  if (selectedParams.value.length === 1) {
    const param = selectedParams.value[0]
    const thresholds = thresholdsChart[param]

    if (thresholds) {
      baseSeries.push({
        name: `Batas Atas (${thresholds.max})`, // langsung pakai angka max
        data: Array(chartCategories.value.length).fill(thresholds.max),
        stroke: { dashArray: 5, width: 2 },
        color: '#FF0000',
      })
      baseSeries.push({
        name: `Batas Bawah (${thresholds.min})`, // langsung pakai angka min
        data: Array(chartCategories.value.length).fill(thresholds.min),
        stroke: { dashArray: 5, width: 2 },
        color: '#00AAFF',
      })
    }
  }

  chartSeries.value = baseSeries

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, categories: chartCategories.value },
  }
}

const selectAllParams = () => {
  if (chartData.value.length) {
    selectedParams.value = Object.keys(chartData.value[0]).filter(
      (k) => k !== 'waktu' && k !== 'stasiun',
    )
  }
}

const clearParams = () => {
  selectedParams.value = []
}

watch(chartData, () => {
  transformToChart()
})

watch(dataType, () => {
  currentPage.value = 1
  fetchData()
})

onMounted(() => {
  fetchData()
  fetchChartData()
})
</script>

<style>
@keyframes blink-smooth {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.blink-smooth {
  animation: blink-smooth 1.5s ease-in-out infinite;
}
</style>
