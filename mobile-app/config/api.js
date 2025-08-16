// Import the createClient function from the Supabase JS library
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Supabase project URL
const supabaseUrl = 'https://beclarjkdyyyiestutyi.supabase.co';
// Define the Supabase anonymous public API key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlY2xhcmprZHl5eWllc3R1dHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjQ1MTUsImV4cCI6MjA2NzU0MDUxNX0.fBQRMmZVxYkL2_JcOhVoFSZiUHqFd3cYZjhE8xFYDiE';

// Create a Supabase client instance for making API requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: AsyncStorage,
    // Required for React Native/Expo
    detectSessionInUrl: false,
  },
});