-- Add missing experience columns
-- Run this in Supabase SQL Editor

ALTER TABLE public.user_profiles 
ADD COLUMN experience_years INTEGER DEFAULT 0;

ALTER TABLE public.user_profiles 
ADD COLUMN experience_months INTEGER DEFAULT 0;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('experience_years', 'experience_months');
