-- ============================================
-- MIGRATION: Allow authenticated users to read all profiles
-- Required for Community Chat & Peer Directory
-- ============================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Allow any logged-in user to see other users' profiles (needed for chat/peer directory)
CREATE POLICY "Authenticated users can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');
