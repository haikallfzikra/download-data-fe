<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800"
  >
    <div
      class="bg-blue-950/40 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md text-white"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="bg-blue-800 p-3 rounded-xl">
          <img
            src="../../assets/image/LOGO-CBI-W-2048x332-i208zh7E.png"
            alt="Logo"
            class="w-12 h-12"
          />
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-center">System Monitor</h1>
      <p class="text-sm text-blue-300 text-center mb-8">Secure Access Portal</p>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Username</label>
          <input
            v-model="email"
            type="text"
            placeholder="Enter your username"
            class="w-full bg-blue-900/40 border border-blue-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400"
            required
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full bg-blue-900/40 border border-blue-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400"
            required
          />
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="remember" class="accent-blue-600" />
            Remember me
          </label>
          <a href="#" class="text-blue-400 hover:text-blue-300">Forgot password?</a>
        </div>

        <button
          type="submit"
          class="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition font-semibold"
        >
          ACCESS SYSTEM
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-xs text-center text-blue-300">
        Authorized personnel only • Secure connection established <br />
        <span class="text-green-400">● System Online</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { nextTick } from 'vue'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()
const userStore = useUserStore()

async function handleLogin() {
  error.value = null

  try {
    const response = await axios.post('https://v2.cbi.mdtapps.id/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    userStore.setUserData(response.data)

    await nextTick()
    router.push('/')
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'Gagal login. Coba lagi.'
  }
}
</script>
