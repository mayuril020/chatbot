import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nrgoqtcmulnwgcbxcyet.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZ29xdGNtdWxud2djYnhjeWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNDE3NjcsImV4cCI6MjEwODkxNzc2N30.aar840Y1VLFx6mlkS-fgzDBIHSIcinswBytySkoKLJw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);