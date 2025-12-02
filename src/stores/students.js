import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    students: [],
    loading: false,
    searchQuery: '',
    courseFilter: null
  }),
  
  getters: {
    filteredStudents: (state) => {
      let list = state.students
      
      // Search filter
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase()
        list = list.filter(s => 
          s.name.toLowerCase().includes(q) || 
          s.rfid_card_id.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q)
        )
      }
      
      // Course filter
      if (state.courseFilter) {
        list = list.filter(s => s.course === state.courseFilter)
      }
      
      return list
    },
    
    totalStudents: (state) => state.students.length,
    
    studentById: (state) => (id) => state.students.find(s => s.id === id),
    
    uniqueCourses: (state) => {
      const courses = state.students.map(s => s.course).filter(Boolean)
      return [...new Set(courses)].sort()
    }
  },
  
  actions: {
    async fetchStudents() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('created_at', { ascending: false })
          
        if (error) throw error
        this.students = data || []
      } catch (error) {
        console.error('Failed to fetch students:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateStudent(id, studentData) {
      try {
        const { data, error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', id)
          .select('*')
          .single()
        
        if (error) throw error
        
        // Update local state
        const index = this.students.findIndex(s => s.id === id)
        if (index !== -1) {
          this.students[index] = data
        }
        
        return data
      } catch (error) {
        console.error('Failed to update student:', error)
        throw error
      }
    },
    
    async deleteStudent(id) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id)
          
        if (error) throw error
        
        // Remove from local state
        this.students = this.students.filter(s => s.id !== id)
      } catch (error) {
        console.error('Failed to delete student:', error)
        throw error
      }
    },
    
    setSearchQuery(query) {
      this.searchQuery = query
    },
    
    setCourseFilter(course) {
      this.courseFilter = course
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.courseFilter = null
    }
  }
})
