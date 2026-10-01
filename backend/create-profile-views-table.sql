-- =====================================================
-- PlaceAI: Profile Views & Peer Watching Schema
-- Track student profile views and enable peer exploration
-- =====================================================

-- 1. Create table for tracking profile views
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id UUID NOT NULL,
  viewer_id UUID,
  viewer_name VARCHAR(200),
  viewer_role VARCHAR(200),
  viewer_college VARCHAR(200),
  viewer_avatar TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_user_id ON public.profile_views(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON public.profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON public.profile_views(viewed_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow anyone (authenticated or guest student via share link) to record a view
DROP POLICY IF EXISTS "Anyone can record profile views" ON public.profile_views;
CREATE POLICY "Anyone can record profile views"
  ON public.profile_views
  FOR INSERT
  WITH CHECK (true);

-- Allow users to see who viewed their profile, or viewers to see their own history
DROP POLICY IF EXISTS "Users can view views on their profile" ON public.profile_views;
CREATE POLICY "Users can view views on their profile"
  ON public.profile_views
  FOR SELECT
  USING (
    auth.uid() = profile_user_id 
    OR auth.uid() = viewer_id
    OR auth.role() = 'authenticated'
  );

-- 5. Ensure all authenticated students can read public profiles for peer watching
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Authenticated users can view all profiles'
  ) THEN
    CREATE POLICY "Authenticated users can view all profiles"
      ON public.user_profiles
      FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 6. Helper function to get profile view statistics
CREATE OR REPLACE FUNCTION get_profile_views_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_views INTEGER;
  v_unique_viewers INTEGER;
  v_today_views INTEGER;
BEGIN
  -- Total views count
  SELECT COUNT(*) INTO v_total_views
  FROM public.profile_views
  WHERE profile_user_id = p_user_id;

  -- Unique student viewers
  SELECT COUNT(DISTINCT viewer_id) INTO v_unique_viewers
  FROM public.profile_views
  WHERE profile_user_id = p_user_id AND viewer_id IS NOT NULL;

  -- Today's views
  SELECT COUNT(*) INTO v_today_views
  FROM public.profile_views
  WHERE profile_user_id = p_user_id
    AND viewed_at >= CURRENT_DATE;

  RETURN jsonb_build_object(
    'total_views', COALESCE(v_total_views, 0),
    'unique_viewers', COALESCE(v_unique_viewers, 0),
    'today_views', COALESCE(v_today_views, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
