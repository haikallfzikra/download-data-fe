<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'

const props = defineProps({
  modelValue: Boolean,
  location: String,
  lat: Number,
  lng: Number,
})
const emit = defineEmits(['update:modelValue'])

const map = ref(null)
const mapElement = ref(null)
const marker = ref(null)

async function geocodeLocation(locationName) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch (err) {
    console.error('Geocoding error:', err)
  }
  return [-6.2, 106.8] // fallback Jakarta
}

function destroyMap() {
  if (map.value) {
    map.value.off()
    map.value.remove()
    map.value = null
    marker.value = null
  }
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick() // ⬅️ pastikan DOM <div ref="mapElement"> sudah ada

      let position
      if (props.lat != null && props.lng != null) {
        position = [props.lat, props.lng]
      } else {
        position = await geocodeLocation(props.location)
      }

      destroyMap()

      map.value = L.map(mapElement.value).setView(position, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map.value)

      marker.value = L.marker(position)
        .addTo(map.value)
        .bindPopup(props.location || 'Selected Location')
        .openPopup()

      setTimeout(() => {
        map.value?.invalidateSize()
      }, 200)
    } else {
      destroyMap()
    }
  },
)

onBeforeUnmount(() => {
  destroyMap()
})
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-lg">
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-2 border-b">
        <h2 class="text-lg font-semibold">Map: {{ location }}</h2>
        <button class="text-red-600 font-bold" @click="emit('update:modelValue', false)">✕</button>
      </div>

      <!-- Map -->
      <div ref="mapElement" class="w-full h-[400px]"></div>
    </div>
  </div>
</template>
