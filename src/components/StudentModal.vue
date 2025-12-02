<!-- src/components/StudentModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Edit Student</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Photo Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Student Photo
          </label>
          <div class="flex items-center gap-4">
            <img 
              :src="photoPreview || form.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&size=200&background=6366f1&color=fff`"
              :alt="form.name"
              class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <div class="flex-1">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                :disabled="uploading"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {{ uploading ? 'Uploading...' : 'Choose Photo' }}
              </button>
              <p class="mt-1 text-xs text-gray-500">JPG, PNG or GIF (max 2MB)</p>
            </div>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            minlength="2"
            maxlength="100"
            pattern="[A-Za-z\s\-']+"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="nameError ? 'border-red-500' : ''"
            placeholder="e.g. John Doe Smith"
            @input="validateName"
          />
          <div class="flex items-center justify-between mt-1">
            <p v-if="nameError" class="text-xs text-red-600">{{ nameError }}</p>
            <p class="text-xs text-gray-500 ml-auto">{{ form.name.length }}/100</p>
          </div>
          <p class="mt-1 text-xs text-gray-500">Enter full name (letters, spaces, hyphens only)</p>
        </div>

        <!-- Course / Major -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Course / Major <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.course"
            type="text"
            required
            minlength="5"
            maxlength="150"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="courseError ? 'border-red-500' : ''"
            placeholder="e.g. Bachelor in Information Technology"
            @input="validateCourse"
          />
          <div class="flex items-center justify-between mt-1">
            <p v-if="courseError" class="text-xs text-red-600">{{ courseError }}</p>
            <p class="text-xs text-gray-500 ml-auto">{{ form.course.length }}/150</p>
          </div>
          <p class="mt-1 text-xs text-gray-500">Enter the full course name (min. 5 characters)</p>
        </div>

        <!-- RFID Tag ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            RFID Tag ID <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.rfid_card_id"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
            placeholder="e.g. A1B2C3D4"
            disabled
          />
        </div>

        <!-- Display Message -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">
              Display Message <span class="text-red-500">*</span>
            </label>
            <button 
              type="button"
              @click="generateMessage"
              class="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              Generate with AI
            </button>
          </div>
          <textarea
            v-model="form.message"
            rows="3"
            required
            minlength="10"
            maxlength="500"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            :class="messageError ? 'border-red-500' : ''"
            placeholder="Enter congratulations message..."
            @input="validateMessage"
          ></textarea>
          <div class="flex items-center justify-between mt-1">
            <p v-if="messageError" class="text-xs text-red-600">{{ messageError }}</p>
            <p class="text-xs" :class="form.message.length < 10 ? 'text-red-500' : 'text-gray-500'">
              {{ form.message.length }}/500 (min. 10)
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || uploading || !isFormValid"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ loading ? 'Saving...' : 'Save Student' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const studentsStore = useStudentsStore()
const notificationStore = useNotificationStore()
const loading = ref(false)
const uploading = ref(false)
const photoPreview = ref(null)
const fileInput = ref(null)

// Validation errors
const nameError = ref('')
const courseError = ref('')
const messageError = ref('')

const form = ref({
  name: '',
  course: '',
  rfid_card_id: '',
  message: '',
  photo_url: ''
})

// Populate form with student data
watch(() => props.student, (student) => {
  if (student) {
    form.value = {
      name: student.name || '',
      course: student.course || '',
      rfid_card_id: student.rfid_card_id || '',
      message: student.message || '',
      photo_url: student.photo_url || ''
    }
  }
}, { immediate: true })

// Validation functions
const validateName = () => {
  const name = form.value.name.trim()
  
  if (name.length < 2) {
    nameError.value = 'Name must be at least 2 characters'
    return false
  }
  
  if (name.length > 100) {
    nameError.value = 'Name must not exceed 100 characters'
    return false
  }
  
  if (!/^[A-Za-z\s\-']+$/.test(name)) {
    nameError.value = 'Name can only contain letters, spaces, hyphens, and apostrophes'
    return false
  }
  
  nameError.value = ''
  return true
}

const validateCourse = () => {
  const course = form.value.course.trim()
  
  if (course.length < 5) {
    courseError.value = 'Course name must be at least 5 characters'
    return false
  }
  
  if (course.length > 150) {
    courseError.value = 'Course name must not exceed 150 characters'
    return false
  }
  
  courseError.value = ''
  return true
}

const validateMessage = () => {
  const message = form.value.message.trim()
  
  if (message.length < 10) {
    messageError.value = 'Message must be at least 10 characters'
    return false
  }
  
  if (message.length > 500) {
    messageError.value = 'Message must not exceed 500 characters'
    return false
  }
  
  messageError.value = ''
  return true
}

// Check if form is valid
const isFormValid = computed(() => {
  return (
    form.value.name.trim().length >= 2 &&
    form.value.name.trim().length <= 100 &&
    form.value.course.trim().length >= 5 &&
    form.value.course.trim().length <= 150 &&
    form.value.message.trim().length >= 10 &&
    form.value.message.trim().length <= 500 &&
    !nameError.value &&
    !courseError.value &&
    !messageError.value
  )
})

// Handle file upload
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    notificationStore.warning(
      'Invalid File Type',
      'Please select an image file (JPG, PNG, or GIF).'
    )
    return
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    notificationStore.warning(
      'File Too Large',
      'Please select an image smaller than 2MB.'
    )
    return
  }

  // Preview
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Upload to Supabase
  try {
    uploading.value = true
    const publicUrl = await studentsStore.uploadPhoto(file)
    form.value.photo_url = publicUrl
    
    notificationStore.success(
      'Photo Uploaded',
      'Student photo has been uploaded successfully.'
    )
  } catch (error) {
    console.error('Upload failed:', error)
    
    notificationStore.error(
      'Upload Failed',
      'Failed to upload photo. Please try again.'
    )
    
    photoPreview.value = null
  } finally {
    uploading.value = false
  }
}

// AI Message Generator
const generateMessage = () => {
  const name = form.value.name.trim() || 'graduate'
  const course = form.value.course.trim() || 'your studies'
  
  const messages = [
    `Congratulations on your outstanding achievement in ${course}, ${name}!`,
    `Well done, ${name}! May your success in ${course} continue to grow!`,
    `Amazing work, ${name}! Your dedication to ${course} has truly paid off!`,
    `Congratulations ${name}! The future is bright for you in ${course}!`,
    `${name}, your hard work in ${course} has led to this incredible moment!`
  ]
  
  form.value.message = messages[Math.floor(Math.random() * messages.length)]
  
  notificationStore.info(
    'Message Generated',
    'A congratulatory message has been generated with AI.'
  )
}

const handleSubmit = async () => {
  // Validate all fields
  const isNameValid = validateName()
  const isCourseValid = validateCourse()
  const isMessageValid = validateMessage()
  
  if (!isNameValid || !isCourseValid || !isMessageValid) {
    notificationStore.warning(
      'Validation Error',
      'Please fix all validation errors before submitting.'
    )
    return
  }
  
  loading.value = true
  try {
    // Trim all string fields
    const cleanedData = {
      name: form.value.name.trim(),
      course: form.value.course.trim(),
      rfid_card_id: form.value.rfid_card_id.trim().toUpperCase(),
      message: form.value.message.trim(),
      photo_url: form.value.photo_url
    }
    
    await emit('save', cleanedData)
  } catch (error) {
    console.error('Save failed:', error)
  } finally {
    loading.value = false
  }
}
</script>