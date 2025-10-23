<template>
  <div class="flex flex-col sm:flex-row h-screen bg-gray-50">
    <Sidebar />
    <main class="flex-1 overflow-y-auto w-full">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar/SidebarArea.vue'
</script>
