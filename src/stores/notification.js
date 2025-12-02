// src/stores/notification.js
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),
  
  actions: {
    success(title, message = '', duration = 4000) {
      this.add({
        type: 'success',
        title,
        message,
        duration
      })
    },
    
    error(title, message = '', duration = 5000) {
      this.add({
        type: 'error',
        title,
        message,
        duration
      })
    },
    
    warning(title, message = '', duration = 4000) {
      this.add({
        type: 'warning',
        title,
        message,
        duration
      })
    },
    
    info(title, message = '', duration = 4000) {
      this.add({
        type: 'info',
        title,
        message,
        duration
      })
    },
    
    add(notification) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        ...notification,
        createdAt: Date.now(),
        progress: 0
      }
      
      this.notifications.push(newNotification)
      
      // Auto remove after duration
      setTimeout(() => {
        this.remove(id)
      }, notification.duration)
    },
    
    remove(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
    
    clear() {
      this.notifications = []
    }
  }
})
