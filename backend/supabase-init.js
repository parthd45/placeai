/**
 * Supabase Configuration Initialization
 * This file must be included FIRST, before auth-service.js
 */

(function () {
  'use strict';

  // Your Supabase credentials - DO NOT CHANGE
  const SUPABASE_URL = 'https://igilmfqfxsiaggkgkwoq.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaWxtZnFmeHNpYWdna2drd29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMxNTUsImV4cCI6MjA4MjkzOTE1NX0._NgbNTEtefMiuOfaubTRugIKd9I9IzyKvEYrWe4cKxQ';

  // Set global variables that auth-service.js will use
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

  // Create custom storage that uses localStorage for persistent sessions
  // This ensures sessions persist even after browser is closed
  const persistentStorage = {
    getItem: (key) => {
      const value = localStorage.getItem(key);
      console.log(`Storage getItem: ${key} = ${value ? 'found' : 'not found'}`);
      return value;
    },
    setItem: (key, value) => {
      console.log(`Storage setItem: ${key}`);
      localStorage.setItem(key, value);
    },
    removeItem: (key) => {
      console.log(`Storage removeItem: ${key}`);
      localStorage.removeItem(key);
    }
  };

  // Initialize Supabase client with persistent storage
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: persistentStorage,
      storageKey: 'supabase.auth.token', // Consistent key for session storage
      autoRefreshToken: true,
      persistSession: true, // Persist in localStorage
      detectSessionInUrl: true, // Important for OAuth callbacks
      flowType: 'pkce' // Use PKCE flow for better security
    }
  });

  console.log('✅ Supabase configured with persistent storage (auto-login enabled)');
})();
