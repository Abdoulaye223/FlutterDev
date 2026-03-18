-- Add upvotes table for submissions
CREATE TABLE public.submission_upvotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(submission_id, user_id)
);

-- Enable RLS
ALTER TABLE public.submission_upvotes ENABLE ROW LEVEL SECURITY;

-- Policies for upvotes
CREATE POLICY "Anyone can view upvotes" 
ON public.submission_upvotes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can upvote" 
ON public.submission_upvotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their upvotes" 
ON public.submission_upvotes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add social share tracking (optional analytics)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';

-- Create index for faster leaderboard queries
CREATE INDEX idx_submissions_user_id ON public.challenge_submissions(user_id);
CREATE INDEX idx_upvotes_submission_id ON public.submission_upvotes(submission_id);
CREATE INDEX idx_user_challenges_completed ON public.user_challenges(user_id, status) WHERE status = 'completed';