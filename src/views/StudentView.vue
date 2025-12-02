<!-- src/views/StudentsView.vue -->
<template>
  <div class="flex h-screen bg-gray-50">
    <Navbar />
    
    <main class="flex-1 overflow-y-auto">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Student Management</h1>
            <p class="text-gray-600 mt-1">Edit or remove graduating students.</p>
          </div>
        </div>
      </div>

      <div class="p-8">
        <!-- Search Bar -->
        <div class="mb-6">
          <div class="relative max-w-md">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              v-model="studentsStore.searchQuery"
              type="text"
              placeholder="Search by name or RFID..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <!-- Students Grid -->
        <div v-if="studentsStore.loading" class="flex items-center justify-center py-12">
          <svg class="w-12 h-12 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="studentsStore.filteredStudents.length === 0" class="flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p class="mt-4 text-gray-500">No students found</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StudentCard
            v-for="student in studentsStore.filteredStudents"
            :key="student.id"
            :student="student"
            @edit="openEditModal"
            @delete="openDeleteModal"
          />
        </div>
      </div>
    </main>

    <!-- Edit Modal -->
    <StudentModal
      v-if="showModal"
      :student="selectedStudent"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      :student="selectedStudent"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import StudentCard from '@/components/StudentCard.vue'
import StudentModal from '@/components/StudentModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import { useStudentsStore } from '@/stores/students'
import { useNotificationStore } from '@/stores/Notification'

const notificationStore = useNotificationStore()

const studentsStore = useStudentsStore()

const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedStudent = ref(null)

// Modal handlers
const openEditModal = (student) => {
  selectedStudent.value = student
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStudent.value = null
}

const openDeleteModal = (student) => {
  selectedStudent.value = student
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedStudent.value = null
}

// Update student
const handleSave = async (studentData) => {
  try {
    console.log('Updating student:', selectedStudent.value.id, studentData)
    await studentsStore.updateStudent(selectedStudent.value.id, studentData)
    
    // Success notification
    notificationStore.success(
      'Student Updated',
      `${studentData.name} has been updated successfully.`
    )
    
    closeModal()
  } catch (error) {
    console.error('Failed to update student:', error)
    
    // Error notification
    notificationStore.error(
      'Update Failed',
      error.message || 'Failed to update student. Please try again.'
    )
  }
}

// Delete student
const handleDelete = async () => {
  const studentName = selectedStudent.value.name
  
  try {
    await studentsStore.deleteStudent(selectedStudent.value.id)
    
    // Success notification
    notificationStore.success(
      'Student Deleted',
      `${studentName} has been removed from the system.`
    )
    
    closeDeleteModal()
  } catch (error) {
    console.error('Failed to delete student:', error)
    
    // Error notification
    notificationStore.error(
      'Delete Failed',
      error.message || 'Failed to delete student. Please try again.'
    )
  }
}

onMounted(() => {
  studentsStore.fetchStudents()
})
</script>