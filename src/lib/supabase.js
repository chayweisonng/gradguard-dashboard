import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: print config status in development
if (import.meta.env.DEV) {
  console.log('Supabase Config:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing',
    urlValue: supabaseUrl,
    keyPreview: supabaseAnonKey?.substring(0, 20) + '...'
  })
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Always create the client even if config is empty (to avoid null errors)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

// Test connection (only when properly configured)
if (isSupabaseConfigured) {
  Promise.resolve().then(async () => {
    try {
      const { error } = await supabase.from('students').select('id').limit(1)
      if (!error) {
        console.log('Supabase connection successful')
      } else {
        console.warn('Supabase connection failed:', error.message)
      }
    } catch (err) {
      console.error('Supabase connection error:', err?.message)
    }
  })
} else {
  console.error('Supabase NOT configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file')
}
