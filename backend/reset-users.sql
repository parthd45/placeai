-- ========================================================
-- PlaceAI Database Reset Script
-- Run this in your Supabase SQL Editor:
-- Dashboard (https://supabase.com/dashboard) -> SQL Editor -> New query -> Run
-- ========================================================

-- 1. Disable RLS temporarily to clean any orphaned records
TRUNCATE TABLE public.user_profiles CASCADE;

-- 2. Clean application tables if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feature_usage') THEN
        TRUNCATE TABLE public.feature_usage CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'job_applications') THEN
        TRUNCATE TABLE public.job_applications CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trainings') THEN
        TRUNCATE TABLE public.trainings CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'placements') THEN
        TRUNCATE TABLE public.placements CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_interactions') THEN
        TRUNCATE TABLE public.ai_interactions CASCADE;
    END IF;
END $$;

-- 3. Delete all registered accounts from Supabase Auth so anyone can register fresh
DELETE FROM auth.users;

-- ========================================================
-- Successfully cleaned all users and related data!
-- Now users can register and login from start.
-- ========================================================
