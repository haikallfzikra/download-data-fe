<!-- src/components/report/MonthlyReportCard.vue -->
<template>
  <div class="bg-white rounded-xl shadow p-4 space-y-4">
    <div class="text-lg font-semibold">Monthly Report</div>

    <div class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block mb-1">Tahun</label>
        <input type="number" v-model="form.year" class="input" />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label class="block mb-1">Bulan</label>
        <select v-model="form.month" class="input">
          <option disabled value="">Pilih Bulan</option>
          <option v-for="(m, index) in 12" :key="index" :value="index + 1">
            {{ new Date(0, index).toLocaleString('default', { month: 'long' }) }}
          </option>
        </select>
      </div>

      <div class="flex-1 min-w-[200px]">
        <label class="block mb-1">Parameter</label>
        <select v-model="form.parameter" class="input">
          <option disabled value="">Pilih Parameter</option>
          <option v-for="param in availableParams" :key="param" :value="param">{{ param }}</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="downloadReport"
      >
        Download
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  userId: Number,
  moduleId: Number,
  stationId: Number,
  availableParams: Array, // seperti ['temp', 'humidity', 'pm10', ...]
})

const form = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  parameter: '',
})

const downloadReport = async () => {
  if (!form.value.parameter) {
    alert('Pilih parameter terlebih dahulu.')
    return
  }

  try {
    await axios.post('/download/monthly', {
      user_id: props.userId,
      module_id: props.moduleId,
      station_id: props.stationId,
      year: form.value.year,
      month: form.value.month,
      parameter: form.value.parameter,
    })

    alert('Permintaan download telah dikirim.')
  } catch (err) {
    console.error(err)
    alert('Gagal mengirim permintaan download.')
  }
}
</script>

<style scoped>
.input {
  width: 80%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
