<!-- src/components/LoginForm.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const remember = ref(false)

// Email normalization and validation
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

const passwordValid = computed(() => 
  (password.value || '').length >= 6
)

const emailError = computed(() => 
  email.value && !emailValid.value 
    ? 'Enter a valid email address' 
    : ''
)

const passwordError = computed(() => 
  password.value && !passwordValid.value 
    ? 'Password must be at least 6 characters' 
    : ''
)

// Form submission
async function onSubmit() {
  if (!emailValid.value || !passwordValid.value) {
    notificationStore.warning(
      'Validation Error',
      'Please fix all validation errors before submitting.'
    )
    return
  }
  
  try {
    await auth.login(normalizedEmail.value, password.value)
    
    notificationStore.success(
      'Login Successful',
      'Welcome back! Redirecting to dashboard...'
    )
    
    // Delay redirect to show notification
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (e) {
    console.error('Login error:', e)
    
    notificationStore.error(
      'Login Failed',
      e.message || 'Invalid email or password. Please try again.'
    )
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
    <div class="grid md:grid-cols-2">
      <!-- Login Form -->
      <form @submit.prevent="onSubmit" class="p-6 md:p-8">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col gap-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p class="text-sm text-gray-500">
              Login to your admin account
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
              placeholder="admin@example.com"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''"
            />
            <p v-if="emailError" class="text-sm text-red-600">
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <router-link
                to="/forgot-password"
                class="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </router-link>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''"
            />
            <p v-if="passwordError" class="text-sm text-red-600">
              {{ passwordError }}
            </p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-2">
            <input
              id="remember"
              v-model="remember"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label
              for="remember"
              class="text-sm font-medium text-gray-700"
            >
              Remember me
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="auth.loading || !emailValid || !passwordValid"
          >
            {{ auth.loading ? 'Logging in...' : 'Login' }}
          </button>

          <!-- Register Link -->
          <p class="text-center text-sm text-gray-600">
            Don't have an account?
            <router-link to="/register" class="font-medium text-blue-600 hover:underline">
              Register
            </router-link>
          </p>
        </div>
      </form>

      <!-- Side Image -->
      <div class="relative hidden bg-gray-100 md:block">
        <img
          src="https://plus.unsplash.com/premium_photo-1713229182244-d617b76349d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdyYWR1YXRpb258ZW58MHx8MHx8fDA%3D"
          alt="Graduation"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div class="relative flex h-full items-center justify-center p-8">
          <div class="text-center">
            <h2 class="mb-4 text-3xl font-bold text-white">
              Smart Graduation Display
            </h2>
            <p class="text-lg text-white/90">
              IoT-powered RFID system
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>