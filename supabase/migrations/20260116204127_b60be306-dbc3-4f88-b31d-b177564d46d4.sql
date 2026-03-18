-- Add a policy that allows reading basic profile info for all users
-- The application should use public_profiles view for non-owner queries
-- This policy enables the view to work with security_invoker=on
CREATE POLICY "Anyone can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);