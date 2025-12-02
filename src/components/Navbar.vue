<!-- src/components/Navbar.vue -->
<template>
  <aside class="w-64 bg-gray-900 text-gray-200 flex flex-col">
    <!-- Logo -->
    <div class="p-6 flex items-center gap-3">
      <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
          <path d="M22 10v6"/>
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
        </svg>
      </div>
      <div>
        <div class="text-lg font-bold">GradGuard</div>
        <div class="text-xs text-gray-400">RFID Manager</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-1">
      <router-link 
        to="/dashboard" 
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer"
        :class="isActive('/dashboard') ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="9" x="14" y="12" rx="1"/>
          <rect width="7" height="5" x="3" y="16" rx="1"/>
        </svg>
        <span class="font-medium">Dashboard</span>
      </router-link>

      <router-link 
        to="/student" 
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors  cursor-pointer"
        :class="isActive('/student') ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <circle cx="16" cy="7" r="4"/>
        </svg>
        <span class="font-medium">Students</span>
      </router-link>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 px-2 py-2 mb-2">
        <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
          {{ userInitial }}
        </div>
        <div class="flex-1 text-sm overflow-hidden">
          <div class="font-medium truncate">{{ auth.userEmail }}</div>
          <div class="text-xs text-gray-400">Administrator</div>
        </div>
      </div>
      
      <button 
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        <span class="text-sm font-medium">Sign Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const userInitial = computed(() => {
  const email = auth.userEmail || 'User'
  return email.charAt(0).toUpperCase()
})

const isActive = (path) => {
  return route.path === path
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>