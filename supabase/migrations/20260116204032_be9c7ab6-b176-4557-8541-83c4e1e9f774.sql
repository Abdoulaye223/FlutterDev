-- Drop the existing view that has SECURITY DEFINER issue
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view with security_invoker=on to respect RLS of the querying user
CREATE VIEW public.public_profiles
WITH (security_invoker=on) AS
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
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;