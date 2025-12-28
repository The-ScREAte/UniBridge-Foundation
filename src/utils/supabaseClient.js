import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkulcycejraywlvvemhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdWxjeWNlanJheXdsdnZlbWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTAxMzYsImV4cCI6MjA3MTYyNjEzNn0.r86qVAk1OlRpX1_BCzjNtrxtmO5g8SxTbFf5fY--Iuw';

// Create Supabase client with performance optimizations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'unibridge-web',
    },
  },
});

// Simple in-memory cache for frequently accessed data
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheManager = {
  get: (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    if (isExpired) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  set: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },
  
  clear: (key) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  },
};
