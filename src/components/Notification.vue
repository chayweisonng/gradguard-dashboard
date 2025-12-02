<!-- src/components/Notification.vue -->
<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto w-80 bg-white rounded-lg shadow-lg border overflow-hidden"
        >
          <div class="p-4 flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <div v-if="notification.type === 'success'" class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              
              <!-- Error Icon -->
              <div v-else-if="notification.type === 'error'" class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" x2="9" y1="9" y2="15"/>
                  <line x1="9" x2="15" y1="9" y2="15"/>
                </svg>
              </div>
              
              <!-- Warning Icon -->
              <div v-else-if="notification.type === 'warning'" class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" x2="12" y1="9" y2="13"/>
                  <line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
              </div>
              
              <!-- Info Icon -->
              <div v-else class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 mb-1">
                {{ notification.title }}
              </h4>
              <p v-if="notification.message" class="text-sm text-gray-600">
                {{ notification.message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              @click="removeNotification(notification.id)"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="h-1 bg-gray-100">
            <div
              class="h-full transition-all duration-100 ease-linear"
              :class="progressClass(notification.type)"
              :style="{ width: getProgress(notification) + '%' }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const notifications = ref([])

let intervalId = null

onMounted(() => {
  // Sync with store
  notifications.value = notificationStore.notifications

  // Update progress every 100ms
  intervalId = setInterval(() => {
    const now = Date.now()
    notifications.value.forEach(notification => {
      const elapsed = now - notification.createdAt
      notification.progress = Math.min((elapsed / notification.duration) * 100, 100)
      
      if (notification.progress >= 100) {
        notificationStore.remove(notification.id)
      }
    })
  }, 100)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})



const progressClass = (type) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[type] || classes.info
}

const getProgress = (notification) => {
  return 100 - (notification.progress || 0)
}

const removeNotification = (id) => {
  notificationStore.remove(id)
}
</script>

<style scoped>
.notification-enter-active {
  animation: slideIn 0.3s ease-out;
}

.notification-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(400px) scale(0.8);
    opacity: 0;
  }
}
</style>