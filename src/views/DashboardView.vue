<template>
  <div class="flex flex-col lg:flex-row h-screen bg-gray-50">
    <Navbar />
    
    <main class="flex-1 overflow-y-auto">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Live Dashboard</h1>
            <p class="text-gray-600 mt-1 text-sm sm:text-base">Monitor student graduation check-ins in real-time.</p>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              @click="toggleSound"
              class="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              :class="soundEnabled ? 'text-indigo-600' : 'text-gray-400'"
            >
              <svg v-if="soundEnabled" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="22" x2="16" y1="9" y2="15"/>
                <line x1="16" x2="22" y1="9" y2="15"/>
              </svg>
            </button>
            
            <button 
              @click="simulateScan"
              :disabled="isSimulating"
              class="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span class="hidden sm:inline">{{ isSimulating ? 'Simulating...' : 'Simulate RFID Scan' }}</span>
              <span class="sm:hidden">{{ isSimulating ? 'Simulating...' : 'Simulate' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-6 lg:p-8">
        <!-- Most Recent Scan -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Most Recent Scan
            </h2>
            <span v-if="announcing" class="text-xs sm:text-sm text-indigo-600 font-medium flex items-center gap-2">
              <svg class="animate-pulse" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <span class="hidden sm:inline">Announcing...</span>
            </span>
          </div>

          <!-- Waiting State -->
          <div v-if="!latestScan" class="flex flex-col items-center justify-center py-8 sm:py-12">
            <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-gray-500 text-sm sm:text-base">Waiting for first scan...</p>
          </div>

          <!-- Student Info -->
          <div v-else class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
            <img 
              :src="latestScan.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(latestScan.name)}&size=200&background=6366f1&color=fff`" 
              :alt="latestScan.name"
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
            />

            <div class="flex-1 text-center sm:text-left w-full">
              <h3 class="text-xl sm:text-2xl font-bold text-gray-900 uppercase">{{ latestScan.name ?? latestScan.student_name }}</h3>
              <p class="text-indigo-600 font-semibold mt-1 uppercase text-sm sm:text-base">{{ latestScan.course }}</p>
              <div class="mt-3 bg-indigo-50 border border-indigo-100 p-3 sm:p-4 rounded-lg">
                <p class="text-gray-700 italic text-sm sm:text-base">"{{ latestScan.message }}"</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-4 text-xs sm:text-sm text-gray-600">
                <span class="flex items-center justify-center sm:justify-start gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu-icon lucide-cpu"><path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/><path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/><path d="M20 12h2"/><path d="M20 17h2"/><path d="M20 7h2"/><path d="M7 20v2"/><path d="M7 2v2"/><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>
                  RFID: {{ latestScan.rfid_card_id }}
                </span>
                <span class="flex items-center justify-center sm:justify-start gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ formatTime(latestScan.scanned_at) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Active Monitoring Badge -->
        <div v-if="isMonitoring" class="mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-3 sm:px-4 py-2 w-fit mx-auto sm:mx-0">
          <span class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          Active Monitoring Session
        </div>

        <!-- Recent Scan History -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Recent Scan History</h2>
          </div>

          <!-- Empty State -->
          <div v-if="recentScans.length === 0" class="flex flex-col items-center justify-center py-8 sm:py-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300 sm:w-12 sm:h-12">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            <p class="mt-4 text-gray-500 text-sm sm:text-base">No scans recorded yet.</p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Course</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">RFID Tag</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="scan in recentScans" :key="scan.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                    {{ formatTime(scan.scanned_at) }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2 sm:gap-3">
                      <img 
                        :src="scan.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.student_name)}&size=100&background=6366f1&color=fff`"
                        :alt="scan.student_name"
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div>
                        <span class="font-medium text-gray-900 text-xs sm:text-sm block">{{ scan.student_name }}</span>
                        <span class="text-xs text-gray-600 md:hidden block capitalize">{{ scan.course }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                    {{ scan.course }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-gray-600 hidden lg:table-cell">
                    {{ scan.rfid_card_id }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { supabase } from '@/lib/supabase'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const latestScan = ref(null)
const recentScans = ref([])
const soundEnabled = ref(true)
const announcing = ref(false)
const isSimulating = ref(false)
const isMonitoring = ref(true)

let subscription = null

// Fetch recent scans from rfid_logs
const fetchRecentScans = async () => {
  try {
    const { data, error } = await supabase
      .from('rfid_logs')
      .select('id, rfid_card_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    if (data && data.length > 0) {
      // Fetch student info for each scan
      const scansWithStudents = await Promise.all(
        data.map(async (log) => {
          const { data: student } = await supabase
            .from('students')
            .select('*')
            .eq('rfid_card_id', log.rfid_card_id)
            .maybeSingle()

          return {
            id: log.id,
            scanned_at: log.created_at,
            rfid_card_id: log.rfid_card_id,
            student_name: student?.name || 'Unknown',
            course: student?.course || 'N/A',
            photo_url: student?.photo_url,
            message: student?.message
          }
        })
      )

      recentScans.value = scansWithStudents

      // Set latest scan
      if (scansWithStudents[0].student_name !== 'Unknown') {
        console.log('Latest scan:', scansWithStudents[0])
        latestScan.value = scansWithStudents[0]
      }
    }
  } catch (error) {
    console.error('Failed to fetch recent scans:', error)
  }
}

// Real-time subscription to rfid_logs
const subscribeToScans = () => {
  subscription = supabase
    .channel('rfid_logs_channel')
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'rfid_logs' 
      },
      async (payload) => {
        console.log('New RFID scan detected:', payload.new)
        
        const rfidCardId = payload.new.rfid_card_id
        
        // Fetch student info by RFID card ID
        const { data: student, error } = await supabase
          .from('students')
          .select('*')
          .eq('rfid_card_id', rfidCardId)
          .maybeSingle()

        if (error) {
          console.error('Error fetching student:', error)
          notificationStore.error(
            'Student Not Found',
            `RFID ${rfidCardId} is not registered.`
          )
          return
        }

        if (!student) {
          notificationStore.warning(
            'Unknown RFID Card',
            `Card ${rfidCardId} is not associated with any student.`
          )
          return
        }

        // Update latest scan
        latestScan.value = {
          id: payload.new.id,
          name: student.name,
          course: student.course,
          message: student.message,
          rfid_card_id: student.rfid_card_id,
          photo_url: student.photo_url,
          scanned_at: payload.new.created_at
        }

        // Success notification
        notificationStore.success(
          'Student Scanned',
          `Welcome ${student.name}!`
        )

        // Play TTS announcement
        if (soundEnabled.value) {
          const message = `Congratulations to ${student.name}, graduating from ${student.course}. ${student.message}`
          playAnnouncement(message)
        }

        // Refresh history
        await fetchRecentScans()
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to rfid_logs')
        isMonitoring.value = true
      }
    })
}

// TTS Function
const playAnnouncement = (message) => {
  announcing.value = true
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(message)
  utterance.rate = 0.9
  utterance.pitch = 1
  utterance.volume = 1
  
  utterance.onend = () => {
    announcing.value = false
  }
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event)
    announcing.value = false
  }
  
  window.speechSynthesis.speak(utterance)
}

// Toggle sound
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  
  notificationStore.info(
    soundEnabled.value ? 'Sound Enabled' : 'Sound Disabled',
    soundEnabled.value 
      ? 'Audio announcements will play for new scans.' 
      : 'Audio announcements are muted.'
  )
}

// Simulate scan (for testing)
const simulateScan = async () => {
  isSimulating.value = true
  
  // Get a random student
  const { data: students } = await supabase
    .from('students')
    .select('rfid_card_id')
    .limit(10)

  if (students && students.length > 0) {
    const randomStudent = students[Math.floor(Math.random() * students.length)]
    
    // Insert into rfid_logs
    const { error } = await supabase
      .from('rfid_logs')
      .insert({
        rfid_card_id: randomStudent.rfid_card_id
      })

    if (error) {
      console.error('Simulation error:', error)
      notificationStore.error('Simulation Failed', 'Could not simulate RFID scan.')
    }
  } else {
    notificationStore.warning('No Students', 'Please add students first.')
  }

  setTimeout(() => {
    isSimulating.value = false
  }, 1000)
}

// Format time
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

onMounted(async () => {
  await fetchRecentScans()
  subscribeToScans()
  
  notificationStore.info(
    'Dashboard Active',
    'Monitoring RFID scans in real-time.'
  )
})

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe()
    console.log('Unsubscribed from rfid_logs')
  }
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel()
})
</script>
