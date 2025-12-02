<!-- src/components/RegisterForm.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/Notification'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirm = ref('')

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

const confirmValid = computed(() => 
  confirm.value === password.value && (confirm.value || '').length >= 6
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

const confirmError = computed(() => 
  confirm.value && !confirmValid.value 
    ? 'Passwords must match and be at least 6 characters' 
    : ''
)

async function onSubmit() {
  if (!emailValid.value || !passwordValid.value || !confirmValid.value) {
    notificationStore.warning(
      'Validation Error',
      'Please fix all validation errors before submitting.'
    )
    return
  }
  
  try {
    await auth.register(normalizedEmail.value, password.value)
    
    notificationStore.success(
      'Registration Successful!',
      'Please check your email to verify your account before logging in.',
      6000
    )
    
    // Clear form
    email.value = ''
    password.value = ''
    confirm.value = ''
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (e) {
    console.error('Registration error:', e)
    
    let errorTitle = 'Registration Failed'
    let errorMessage = 'An error occurred during registration.'
    
    if (e.message.includes('invalid')) {
      errorTitle = 'Invalid Email'
      errorMessage = 'Please use a real email address (e.g., Gmail, Outlook, Yahoo).'
    } else if (e.message.includes('already registered') || e.message.includes('already exists')) {
      errorTitle = 'Email Already Exists'
      errorMessage = 'This email is already registered. Please login instead.'
    } else {
      errorMessage = e.message || 'Please try again.'
    }
    
    notificationStore.error(errorTitle, errorMessage)
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
    <div class="grid md:grid-cols-2">
      <!-- Register Form -->
      <form @submit.prevent="onSubmit" class="p-6 md:p-8">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col gap-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900">
              Create an account
            </h1>
            <p class="text-sm text-gray-500">
              Enter your information to get started
            </p>
          </div>

          <!-- Info Box -->
          <div class="rounded-md border border-blue-200 bg-blue-50 p-3">
            <p class="text-sm text-blue-700">
              💡 Please use a real email address (e.g., Gmail, Outlook, Yahoo)
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
              placeholder="your.email@gmail.com"
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
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
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

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label for="confirm" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm"
              v-model="confirm"
              type="password"
              required
              minlength="6"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="confirmError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''"
            />
            <p v-if="confirmError" class="text-sm text-red-600">
              {{ confirmError }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="auth.loading || !emailValid || !passwordValid || !confirmValid"
          >
            {{ auth.loading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <!-- Login Link -->
          <p class="text-center text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-blue-600 hover:underline">
              Login
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
              Join Us Today
            </h2>
            <p class="text-lg text-white/90">
              Manage graduation displays with our IoT system
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>