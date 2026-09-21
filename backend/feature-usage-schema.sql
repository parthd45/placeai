-- =====================================================
-- Feature Usage Tracking Table
-- For Freemium Model - Track free user limits
-- =====================================================

-- Create feature_usage table
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('resume_analysis', 'mock_interview', 'career_recommendations', 'skill_analysis')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes for fast queries
  CONSTRAINT feature_usage_user_feature_time UNIQUE (user_id, feature, created_at)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature);
CREATE INDEX IF NOT EXISTS idx_feature_usage_created_at ON feature_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_feature ON feature_usage(user_id, feature);

-- Enable Row Level Security
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own usage
CREATE POLICY "Users can view own usage"
  ON feature_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own usage
CREATE POLICY "Users can insert own usage"
  ON feature_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Helper function to get monthly usage count
-- =====================================================

CREATE OR REPLACE FUNCTION get_monthly_usage(
  p_user_id UUID,
  p_feature TEXT,
  p_year_month TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM')
)
RETURNS INTEGER AS $$
DECLARE
  usage_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO usage_count
  FROM feature_usage
  WHERE user_id = p_user_id
    AND feature = p_feature
    AND TO_CHAR(created_at, 'YYYY-MM') = p_year_month;
  
  RETURN COALESCE(usage_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Helper function to check if user can use feature
-- =====================================================

CREATE OR REPLACE FUNCTION can_use_feature(
  p_user_id UUID,
  p_feature TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  is_premium BOOLEAN;
  usage_count INTEGER;
  feature_limit INTEGER;
BEGIN
  -- Check if user is premium
  SELECT is_premium INTO is_premium
  FROM user_profiles
  WHERE user_id = p_user_id;
  
  -- Premium users have unlimited access
  IF is_premium THEN
    RETURN TRUE;
  END IF;
  
  -- Set limits for free users
  feature_limit := CASE p_feature
    WHEN 'resume_analysis' THEN 3
    WHEN 'mock_interview' THEN 5
    WHEN 'career_recommendations' THEN 10
    WHEN 'skill_analysis' THEN 5
    ELSE 0
  END;
  
  -- Get current month usage
  usage_count := get_monthly_usage(p_user_id, p_feature);
  
  -- Check if under limit
  RETURN usage_count < feature_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SUMMARY
-- =====================================================
-- ✅ Created feature_usage table to track usage
-- ✅ Added RLS policies for security
-- ✅ Created helper functions for easy usage checking
-- ✅ Free users have monthly limits:
--    - 3 Resume Analyses
--    - 5 Mock Interviews
--    - 10 Career Recommendations
--    - 5 Skill Analyses
-- ✅ Premium users have unlimited access
-- =====================================================
