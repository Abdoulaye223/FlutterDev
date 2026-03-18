-- Remove the permissive policy
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;

-- Drop the view
DROP VIEW IF EXISTS public.public_profiles;

-- Create a security definer function to get public profile data
-- This function runs with elevated privileges but only returns non-sensitive fields
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  social_links jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    username,
    full_name,
    avatar_url,
    bio,
    social_links,
    created_at,
    updated_at
  FROM public.profiles
  WHERE profiles.user_id = profile_user_id;
$$;

-- Create a function to get multiple public profiles
CREATE OR REPLACE FUNCTION public.get_public_profiles(profile_user_ids uuid[])
RETURNS TABLE (
  id uuid,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  social_links jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    username,
    full_name,
    avatar_url,
    bio,
    social_links,
    created_at,
    updated_at
  FROM public.profiles
  WHERE profiles.user_id = ANY(profile_user_ids);
$$;

-- Add policy for users to view their own FULL profile (including premium status)
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);