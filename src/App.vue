<script setup>
import { onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  if (userStore.token) {
    userStore.startIdleTimer()
  }
})

watch(
  () => userStore.token,
  (newToken) => {
    if (newToken) {
      userStore.startIdleTimer()
    } else {
      userStore.clearIdleTimer()
    }
  },
)
</script>

<template>
  <div>
    <router-view />
  </div>
</template>
