-- Create challenge_submissions table
CREATE TABLE public.challenge_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  screenshots TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submission_comments table for feedback
CREATE TABLE public.submission_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_comments ENABLE ROW LEVEL SECURITY;

-- Submissions policies
CREATE POLICY "Anyone can view submissions" ON public.challenge_submissions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own submissions" ON public.challenge_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.challenge_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" ON public.challenge_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.submission_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.submission_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.submission_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for submission screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', true);

-- Storage policies
CREATE POLICY "Anyone can view submission images" ON storage.objects
  FOR SELECT USING (bucket_id = 'submissions');

CREATE POLICY "Authenticated users can upload submission images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own submission images" ON storage.objects
  FOR DELETE USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Triggers for updated_at
CREATE TRIGGER update_challenge_submissions_updated_at
  BEFORE UPDATE ON public.challenge_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();