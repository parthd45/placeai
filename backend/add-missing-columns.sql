-- Migration: Add missing columns to user_profiles table
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query

-- Add the experience column to store work experience as JSON
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS experience JSONB;

-- Add job preference columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS preferred_roles TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS preferred_locations TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS expected_salary VARCHAR(100);

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS availability VARCHAR(50);

-- Add personal details columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS dob DATE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

-- Add certifications column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS certifications JSONB;

-- Add projects column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS projects JSONB;

-- Add designation column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS current_designation VARCHAR(200);

-- Add location column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS location VARCHAR(200);

-- Add total experience columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS experience_months INTEGER DEFAULT 0;

-- Add comments to document the columns
COMMENT ON COLUMN public.user_profiles.experience IS 'Stores work experience as an array of objects with fields: company_name, designation, duration, description';
COMMENT ON COLUMN public.user_profiles.preferred_roles IS 'Comma-separated list of preferred job roles';
COMMENT ON COLUMN public.user_profiles.preferred_locations IS 'Comma-separated list of preferred work locations';
COMMENT ON COLUMN public.user_profiles.expected_salary IS 'Expected annual salary';
COMMENT ON COLUMN public.user_profiles.availability IS 'Job availability status (e.g., Available immediately, Available in 1 month)';
COMMENT ON COLUMN public.user_profiles.dob IS 'Date of birth';
COMMENT ON COLUMN public.user_profiles.nationality IS 'Nationality';
COMMENT ON COLUMN public.user_profiles.certifications IS 'Stores certifications as an array of objects';
COMMENT ON COLUMN public.user_profiles.projects IS 'Stores projects as an array of objects';
COMMENT ON COLUMN public.user_profiles.current_designation IS 'Current job designation/role';
COMMENT ON COLUMN public.user_profiles.location IS 'User location/city';
COMMENT ON COLUMN public.user_profiles.experience_years IS 'Total years of experience';
COMMENT ON COLUMN public.user_profiles.experience_months IS 'Total months of experience (0-11)';

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('experience', 'preferred_roles', 'preferred_locations', 'expected_salary', 'availability', 'dob', 'nationality', 'certifications', 'projects', 'current_designation', 'location', 'experience_years', 'experience_months')
ORDER BY column_name;
