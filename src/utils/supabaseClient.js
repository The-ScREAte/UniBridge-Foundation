import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkulcycejraywlvvemhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdWxjeWNlanJheXdsdnZlbWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTAxMzYsImV4cCI6MjA3MTYyNjEzNn0.r86qVAk1OlRpX1_BCzjNtrxtmO5g8SxTbFf5fY--Iuw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
