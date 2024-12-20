import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://hbqoafwfjbosmsukeznn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});