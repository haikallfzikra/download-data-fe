<template>
  <div class="flex">
    <!-- Tombol toggle untuk membuka sidebar (hanya mobile) -->
    <button
      v-if="!isOpen"
      class="md:hidden fixed top-3 left-3 z-50 bg-blue-600 p-2 w-10 rounded-lg text-white"
      @click="isOpen = true"
    >
      ☰
    </button>

    <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden" @click="isOpen = false"></div>

    <!-- Sidebar -->
    <aside
      class="w-64 h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex flex-col p-4 text-white fixed top-0 left-0 transform transition-transform duration-300 z-40 md:relative md:translate-x-0"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 gap-2">
        <div class="p-2 rounded-lg">
          <img src="../../assets/image/LOGO-CBI-W-2048x332-i208zh7E (1).png" alt="Logo" />
        </div>
        <!-- Tombol close hanya mobile -->
        <div class="close-button">
          <button class="md:hidden font-bold p-2 rounded-lg text-white" @click="isOpen = false">
            ✕
          </button>
        </div>
      </div>

      <!-- Menu -->
      <nav class="flex flex-col space-y-2">
        <a
          href="#"
          @click.prevent="navigate('/')"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition',
            isActive('/')
              ? 'bg-blue-900/40 border border-blue-500 shadow-inner text-white'
              : 'text-gray-400 hover:bg-blue-800/30 hover:text-white',
          ]"
        >
          📊 Report
        </a>

        <a
          v-if="userStore.user.category === 'aqms' || userStore.user.category === 'wqms'"
          href="#"
          @click.prevent="navigate('/data')"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition',
            isActive('/data')
              ? 'bg-blue-900/40 border border-blue-500 shadow-inner text-white'
              : 'text-gray-400 hover:bg-blue-800/30 hover:text-white',
          ]"
        >
          📂 Data
        </a>

        <a
          v-if="userStore.user.category === 'aqms'"
          href="#"
          @click.prevent="navigate('/ispu')"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition',
            isActive('/ispu')
              ? 'bg-blue-900/40 border border-blue-500 shadow-inner text-white'
              : 'text-gray-400 hover:bg-blue-800/30 hover:text-white',
          ]"
        >
          📟 ISPU Data
        </a>
        <a
          v-if="userStore.user.category === 'awlr'"
          href="#"
          @click.prevent="navigate('/awlr')"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition',
            isActive('/awlr')
              ? 'bg-blue-900/40 border border-blue-500 shadow-inner text-white'
              : 'text-gray-400 hover:bg-blue-800/30 hover:text-white',
          ]"
        >
          📁 AWLR Data
        </a>

        <a
          href="#"
          @click.prevent="navigate('/monitoring')"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition',
            isActive('/monitoring')
              ? 'bg-blue-900/40 border border-blue-500 shadow-inner text-white'
              : 'text-gray-400 hover:bg-blue-800/30 hover:text-white',
          ]"
          v-if="userStore.user.category === 'wqms'"
        >
          🖥️ Sparing Monitoring
        </a>
      </nav>

      <!-- Footer -->
      <div class="mt-auto">
        <div class="p-3 bg-blue-900/30 rounded-lg flex items-center gap-2 text-green-400 text-sm">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          All Systems Online
        </div>
        <button @click="handleLogout" class="mt-4 text-left text-red-500 hover:text-red-400">
          Logout
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const isOpen = ref(false)

const navigate = (path) => {
  router.push(path)
}

const isActive = (path) => router.currentRoute.value.path === path

const handleLogout = () => {
  if (confirm('Yakin ingin logout?')) {
    userStore.logout()
    router.push('/login')
  }
}
</script>
