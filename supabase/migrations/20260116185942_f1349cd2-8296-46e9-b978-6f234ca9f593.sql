-- Fix handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name text;
  v_avatar_url text;
BEGIN
  -- Validate and truncate full_name (max 255 chars)
  v_full_name := substring(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 1, 255);
  IF v_full_name = '' THEN
    v_full_name := NULL;
  END IF;
  
  -- Validate avatar_url format (max 1000 chars, must be http/https)
  v_avatar_url := substring(COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''), 1, 1000);
  IF v_avatar_url IS NOT NULL AND v_avatar_url !~ '^https?://' THEN
    v_avatar_url := NULL;
  END IF;
  IF v_avatar_url = '' THEN
    v_avatar_url := NULL;
  END IF;
  
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, v_full_name, v_avatar_url);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;