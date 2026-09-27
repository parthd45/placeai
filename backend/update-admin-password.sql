-- ========================================================
-- PlaceAI: Set / Reset Admin Password in Supabase Auth
-- Run this in your Supabase SQL Editor:
-- Dashboard (https://supabase.com/dashboard) -> SQL Editor -> New query -> Run
-- ========================================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. If admin user exists, update password to Placewise2005@
UPDATE auth.users
SET 
    encrypted_password = crypt('Placewise2005@', gen_salt('bf')),
    updated_at = now()
WHERE email = 'admin@placewise.tech';

-- 2. If admin user does NOT exist yet, create it with password Placewise2005@
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
SELECT 
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@placewise.tech',
    crypt('Placewise2005@', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Admin","last_name":"PlaceWise","role":"admin"}'::jsonb,
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@placewise.tech'
);

-- 3. Ensure corresponding profile in public.user_profiles
INSERT INTO public.user_profiles (
    user_id,
    email,
    first_name,
    last_name,
    current_designation,
    city,
    is_premium,
    premium_plan,
    created_at,
    updated_at
)
SELECT 
    id,
    'admin@placewise.tech',
    'Admin',
    'PlaceWise',
    'System Administrator',
    'India',
    true,
    'admin_granted',
    now(),
    now()
FROM auth.users
WHERE email = 'admin@placewise.tech'
ON CONFLICT (user_id) DO UPDATE
SET 
    email = 'admin@placewise.tech',
    first_name = 'Admin',
    last_name = 'PlaceWise',
    is_premium = true,
    premium_plan = 'admin_granted',
    updated_at = now();

-- ========================================================
-- Admin password set to: Placewise2005@
-- ========================================================
