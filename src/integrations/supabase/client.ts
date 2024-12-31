import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jxqeoenhiqdtzzqbjwqz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cWVvZW5oaXFkdHp6cWJqd3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjk0NzAsImV4cCI6MjAxOTY0NTQ3MH0.GqI0Vf2pQgwFsU5o6Y5p4WwXNuMPXk7FHm9z_2_4GQw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})