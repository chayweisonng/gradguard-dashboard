import { defineStore } from 'pinia'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false
  }),
  getters: {
    isAuthenticated: (state) => !!state?.user,
    userEmail: (state) => state.user?.email
  },
  actions: {
    async register(email, password) {
      this.loading = true
      try {
        if (!isSupabaseConfigured) throw new Error('Supabase not configured')
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        return data
      } finally {
        this.loading = false
      }
    },
    async login(email, password) {
      this.loading = true
      try {
        if (!isSupabaseConfigured) throw new Error('Supabase not configured')
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        this.session = data.session
        this.user = data.user
        console.log(this.session)
        return data
      } finally {
        this.loading = false
      }
    },
    async logout() {
      try {
        if (isSupabaseConfigured) await supabase.auth.signOut()
      } catch {}
      this.session = null
      this.user = null
    },
    async resetPassword(email) {
      if (!isSupabaseConfigured) throw new Error('Supabase not configured')
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return data
    },
    async checkAuth() {
      if (!isSupabaseConfigured) {
        this.session = null
        this.user = null
        return
      }
      const { data } = await supabase.auth.getSession()
      this.session = data.session
      this.user = data.session?.user ?? null
    },
    initAuthListener() {
      supabase.auth.onAuthStateChange((event, session) => {
          console.log("AUTH EVENT:", event)

          this.session = session
          this.user = session?.user ?? null
      })
    }
    
  }
})
