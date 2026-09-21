-- Add education array column
-- Run this in Supabase SQL Editor

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS education JSONB;

COMMENT ON COLUMN public.user_profiles.education IS 'Stores education history as an array of objects';

-- Verify column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'education';
