<template>
  <section class="p-4">
    <div class="title mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mt-10 sm:mt-2 mb-1">System Reports</h2>
      <div class="text-sm text-gray-500">
        Monitor your system performance accross different time intervals
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white border border-gray-200 rounded-lg shadow p-4"
      >
        <div class="flex items-center mb-4">
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16h8M8 12h8m-6-8h4a2 2 0 012 2v12a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z"
            ></path>
          </svg>
          <h3 class="ml-2 text-lg font-medium text-gray-800">{{ card.title }}</h3>
        </div>

        <div class="space-y-4">
          <div v-if="card.fields.date">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              v-model="selectedDate"
              type="date"
              class="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div v-if="card.fields.month">
            <label class="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
            <select
              v-model="selectedMonth"
              class="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          <div v-if="card.fields.year">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <input
              type="number"
              v-model="selectedYear"
              class="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              min="2000"
              :max="new Date().getFullYear()"
              placeholder="e.g. 2024"
            />
          </div>
        </div>

        <button
          @click="handleDownload(card.id)"
          class="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition font-semibold py-2 rounded text-white"
        >
          Download
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const selectedDate = ref('')
const selectedMonth = ref('')
const selectedYear = ref(new Date().getFullYear())
const userStore = useUserStore()

const handleDownload = (cardId) => {
  if (cardId === 1) {
    download2Menit()
  } else if (cardId === 2) {
    downloadHourly()
  } else if (cardId === 3) {
    downloadDaily()
  } else {
    alert('Fitur belum tersedia untuk tipe ini')
  }
}

const download2Menit = async () => {
  if (!selectedDate.value) {
    alert('Tanggal harus dipilih')
    return
  }

  const selected = new Date(selectedDate.value)
  selected.setHours(0, 0, 0, 0)
  const fromDate = new Date(selected.getTime() - selected.getTimezoneOffset() * 60000).toISOString()

  const to = new Date(selected)
  to.setHours(23, 59, 59, 999)
  const toDate = new Date(to.getTime() - to.getTimezoneOffset() * 60000).toISOString()

  console.log("fromDate", fromDate, "toDate", toDate);

  const payload = {
    from_date: fromDate,
    to_date: toDate,
  }

  try {
    const response = await axios.post(
      'http://localhost:3000/download/2menit',
      payload,
      { responseType: 'blob' }
    )

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const filename = `report_2min_${selectedDate.value}.xlsx`
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    alert('Gagal: ' + (err.response?.data?.message || err.message))
  }
}

const downloadHourly = async () => {
  if (!selectedDate.value) {
    alert('Tanggal harus dipilih')
    return
  }

  const fromDate = `${selectedDate.value}T00:00:00`
  const toDate = `${selectedDate.value}T23:59:59.999`

  console.log("fromDate", fromDate, "toDate", toDate)

  const payload = {
    from_date: fromDate,
    to_date: toDate,
  }

  try {
    const response = await axios.post(
      'http://localhost:3000/download/hourly',
      payload,
      { responseType: 'blob' }
    )

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const filename = `report_hourly_${selectedDate.value}.xlsx`
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    alert('Gagal: ' + (err.response?.data?.message || err.message))
  }
}


const downloadDaily = async () => {
  if (!selectedMonth.value || !selectedYear.value) {
    alert('Bulan dan Tahun harus dipilih')
    return
  }

  const month = selectedMonth.value
  const year = selectedYear.value

  const payload = { month, year }

  try {
    const response = await axios.post(
      'http://localhost:3000/download/daily',
      payload,
      { responseType: 'blob' }
    )

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const filename = `report_daily_${year}_${month}.xlsx`
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    alert('Gagal: ' + (err.response?.data?.message || err.message))
  }
}



const allCards = {
  default: [
    { id: 1, title: '2 Menit', fields: { station: true, date: true } },
    {
      id: 2,
      title: 'Hourly',
      fields: { station: true, date: true },
    },
    { id: 3, title: 'Daily', fields: { station: true, month: true, year: true } },
  ],
}


const cards = computed(() => {
  return userStore.user.category === 'wqms' ? allCards.wqms : allCards.default
})

</script>
