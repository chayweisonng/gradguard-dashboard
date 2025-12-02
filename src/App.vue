<template>
  <div class="min-h-screen">
    <router-view />
    <Notification />
  </div>
</template>

<script setup>
import Notification from '@/components/Notification.vue'
</script>