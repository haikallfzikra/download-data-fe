// stores/user.js
import { defineStore } from 'pinia'

let idleTimer = null

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || {
      id: null,
      email: '',
      name: '',
      station_id: null,
      module_app_id: null,
      category: null,
    },
  }),
  actions: {
    setUserData(payload) {
      this.token = payload.token
      this.user = payload.user
      localStorage.setItem('token', payload.token)
      localStorage.setItem('user', JSON.stringify(payload.user))
      this.startIdleTimer()
    },
    logout() {
      this.token = null
      this.user = {
        id: null,
        email: '',
        name: '',
        station_id: null,
        module_app_id: null,
        category: null,
      }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.clearIdleTimer()
    },
    startIdleTimer() {
      this.clearIdleTimer()
      const IDLE_TIMEOUT = 10 * 60 * 1000 // 10 menit
      idleTimer = setTimeout(() => {
        this.logout()
        window.location.href = '/login'
      }, IDLE_TIMEOUT)
      ;['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach((evt) => {
        window.addEventListener(evt, this.resetIdleTimer)
      })
    },
    resetIdleTimer() {
      if (idleTimer) {
        clearTimeout(idleTimer)
        this.startIdleTimer()
      }
    },
    clearIdleTimer() {
      if (idleTimer) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
    },
  },
})
