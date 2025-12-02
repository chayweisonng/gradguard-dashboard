<!-- src/components/ForgotPasswordForm.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/Notification'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const email = ref('')

const normalizedEmail = computed(() => 
  email.value
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[`"'""'']/g, '')
    .trim()
    .toLowerCase()
)

const emailValid = computed(() => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value)
)

const emailError = computed(() => 
  email.value && !emailValid.value 
    ? 'Enter a valid email address' 
    : ''
)

async function onSubmit() {
  if (!emailValid.value) {
    notificationStore.warning(
      'Invalid Email',
      'Please enter a valid email address.'
    )
    return
  }
  
  try {
    await auth.resetPassword(normalizedEmail.value)
    
    notificationStore.success(
      'Reset Email Sent',
      'Please check your inbox for the password reset link.',
      6000
    )
    
    email.value = ''
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (e) {
    console.error('Reset password error:', e)
    
    notificationStore.error(
      'Failed to Send Reset Email',
      e.message || 'An error occurred. Please try again.'
    )
  }
}
</script>

<template>
  <div class="w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
    <form @submit.prevent="onSubmit" class="p-6 md:p-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-2 text-center">
          <h1 class="text-2xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p class="text-sm text-gray-500">
            Enter your email to receive a password reset link
          </p>
        </div>

        <!-- Email Field -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="your.email@example.com"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''"
          />
          <p v-if="emailError" class="text-sm text-red-600">
            {{ emailError }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="auth.loading || !emailValid"
        >
          {{ auth.loading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <!-- Back to Login -->
        <p class="text-center text-sm text-gray-600">
          Remember your password?
          <router-link to="/login" class="font-medium text-blue-600 hover:underline">
            Back to login
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>