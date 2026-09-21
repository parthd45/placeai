-- PlaceAI Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
-- This table stores additional user profile information
-- The auth.users table is managed by Supabase Auth

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email VARCHAR(255),
  mobile VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  resume_url TEXT,
  profile_image_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  education_level VARCHAR(50),
  college_name VARCHAR(200),
  course VARCHAR(100),
  graduation_year INTEGER,
  skills TEXT[], -- Array of skills
  experience JSONB, -- Array of work experience objects
  certifications JSONB, -- Array of certification objects
  projects JSONB, -- Array of project objects
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  -- Job preferences
  preferred_roles TEXT, -- Comma-separated preferred job roles
  preferred_locations TEXT, -- Comma-separated preferred locations
  expected_salary VARCHAR(100), -- Expected annual salary
  availability VARCHAR(50), -- e.g., 'Available immediately', 'Available in 1 month'
  -- Personal details
  dob DATE, -- Date of birth (alternative to date_of_birth)
  nationality VARCHAR(100), -- Nationality
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

-- ============================================
-- 2. TRAININGS TABLE
-- ============================================
-- Stores training programs and courses

CREATE TABLE IF NOT EXISTS public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- e.g., 'Technical', 'Soft Skills', 'Domain Specific'
  provider VARCHAR(200), -- Training provider/institution
  duration INTEGER, -- Duration in hours
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in-progress, completed, dropped
  completion_percentage INTEGER DEFAULT 0,
  certificate_url TEXT,
  grade VARCHAR(10),
  skills_learned TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trainings" ON public.trainings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trainings" ON public.trainings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trainings" ON public.trainings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trainings" ON public.trainings
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_trainings_user_id ON public.trainings(user_id);
CREATE INDEX idx_trainings_status ON public.trainings(status);

-- ============================================
-- 3. PLACEMENTS TABLE
-- ============================================
-- Stores job placement applications and status

CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  position VARCHAR(200) NOT NULL,
  job_description TEXT,
  location VARCHAR(200),
  job_type VARCHAR(50), -- Full-time, Part-time, Internship, Contract
  salary DECIMAL(12, 2),
  salary_currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'applied', -- applied, screening, interview, offered, accepted, rejected, withdrawn
  applied_date DATE DEFAULT CURRENT_DATE,
  interview_date TIMESTAMP WITH TIME ZONE,
  offer_date DATE,
  joining_date DATE,
  application_source VARCHAR(100), -- e.g., 'Campus Placement', 'Job Portal', 'Referral'
  recruiter_name VARCHAR(100),
  recruiter_email VARCHAR(255),
  recruiter_phone VARCHAR(20),
  notes TEXT,
  documents_url TEXT[], -- Array of document URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own placements" ON public.placements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own placements" ON public.placements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own placements" ON public.placements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own placements" ON public.placements
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_placements_user_id ON public.placements(user_id);
CREATE INDEX idx_placements_status ON public.placements(status);
CREATE INDEX idx_placements_applied_date ON public.placements(applied_date);

-- ============================================
-- 4. AI INTERACTIONS TABLE
-- ============================================
-- Stores AI chatbot interactions and recommendations

CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type VARCHAR(100), -- e.g., 'resume_review', 'interview_prep', 'career_advice', 'skill_recommendation'
  query TEXT NOT NULL,
  response TEXT,
  metadata JSONB, -- Additional structured data
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interactions" ON public.ai_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON public.ai_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON public.ai_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_type ON public.ai_interactions(interaction_type);
CREATE INDEX idx_ai_interactions_created_at ON public.ai_interactions(created_at DESC);

-- ============================================
-- 5. NOTIFICATIONS TABLE
-- ============================================
-- Stores user notifications

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50), -- e.g., 'placement_update', 'training_reminder', 'system'
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================
-- 6. STORAGE BUCKETS
-- ============================================
-- Create storage buckets for user files

INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-documents (resumes, certificates)
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for profile-images (public)
CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own profile images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 7. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at
  BEFORE UPDATE ON public.trainings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_placements_updated_at
  BEFORE UPDATE ON public.placements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 8. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================
-- Uncomment the following to add sample data for testing

/*
-- Insert sample training categories
INSERT INTO public.trainings (user_id, title, category, status)
SELECT 
  auth.uid(),
  'Sample Training',
  'Technical',
  'pending'
WHERE auth.uid() IS NOT NULL;
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database schema is now ready.
-- Next steps:
-- 1. Enable Email authentication in Supabase Dashboard
-- 2. Configure OAuth providers (Google, Facebook) if needed
-- 3. Test the authentication flow in your application
