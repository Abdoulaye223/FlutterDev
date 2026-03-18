-- Remove the overly permissive policy that still exposes all fields
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;