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

// Cache with in-memory + localStorage persistence so we can render fast on reload
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const PERSIST_PREFIX = 'ub_cache_';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readPersisted = (key) => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(`${PERSIST_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
    if (isExpired) {
      window.localStorage.removeItem(`${PERSIST_PREFIX}${key}`);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.warn('Cache read failed, ignoring persisted cache:', err);
    return null;
  }
};

const writePersisted = (key, data) => {
  if (!canUseStorage()) return;
  try {
    const payload = JSON.stringify({ timestamp: Date.now(), data });
    window.localStorage.setItem(`${PERSIST_PREFIX}${key}`, payload);
  } catch (err) {
    console.warn('Cache write failed, continuing without persistence:', err);
  }
};

export const cacheManager = {
  // Get cache with fallback to persisted storage and TTL
  get: (key) => {
    const cached = cache.get(key);
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
      if (isExpired) {
        cache.delete(key);
      } else {
        return cached.data;
      }
    }

    const persisted = readPersisted(key);
    if (persisted !== null) {
      cache.set(key, { data: persisted, timestamp: Date.now() });
      return persisted;
    }

    return null;
  },

  // Store in memory and persist to localStorage
  set: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    writePersisted(key, data);
  },

  // Clear one or all cache entries
  clear: (key) => {
    if (key) {
      cache.delete(key);
      if (canUseStorage()) {
        window.localStorage.removeItem(`${PERSIST_PREFIX}${key}`);
      }
    } else {
      cache.clear();
      if (canUseStorage()) {
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith(PERSIST_PREFIX))
          .forEach((k) => window.localStorage.removeItem(k));
      }
    }
  },
};
