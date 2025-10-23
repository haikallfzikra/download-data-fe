<template>
  <div
    v-if="props.modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div class="relative bg-white rounded-lg w-full max-w-3xl p-4">
      <!-- Tombol close -->
      <button
        @click="emit('update:modelValue', false)"
        class="absolute top-4 right-4 text-gray-700 hover:text-black text-xl"
      >
        ✕
      </button>

      <!-- Video -->
      <video
        ref="videoEl"
        controls
        autoplay
        muted
        playsinline
        class="w-full h-[60vh] bg-black rounded"
      ></video>

      <!-- Fullscreen -->
      <div class="flex justify-end mt-2">
        <button
          @click="goFullscreen"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fullscreen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import Hls from 'hls.js'

const props = defineProps({
  modelValue: Boolean,
  src: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

const videoEl = ref(null)
let hls = null

watch(
  () => props.modelValue,
  (open) => {
    if (open) initPlayer()
    else destroyPlayer()
  },
)

watch(
  () => props.src,
  () => {
    if (props.modelValue) {
      destroyPlayer()
      initPlayer()
    }
  },
)

async function initPlayer() {
  const video = videoEl.value
  if (!video) return

  console.log('🎥 Load video URL:', props.src)

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = props.src
  } else if (Hls.isSupported()) {
    hls = new Hls()
    hls.loadSource(props.src)
    hls.attachMedia(video)
  } else {
    console.error('❌ HLS not supported')
  }

  try {
    await video.play()
  } catch (e) {
    console.warn('⚠️ Autoplay blocked, user must click play:', e)
  }
}

function destroyPlayer() {
  if (hls) {
    hls.destroy()
    hls = null
  }
  if (videoEl.value) {
    videoEl.value.pause()
    videoEl.value.removeAttribute('src')
    videoEl.value.load()
  }
}

onBeforeUnmount(() => destroyPlayer())
</script>
