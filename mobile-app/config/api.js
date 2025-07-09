import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beclarjkdyyyiestutyi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlY2xhcmprZHl5eWllc3R1dHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjQ1MTUsImV4cCI6MjA2NzU0MDUxNX0.fBQRMmZVxYkL2_JcOhVoFSZiUHqFd3cYZjhE8xFYDiE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 