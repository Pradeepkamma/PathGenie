
-- Drop overly permissive policies on career_progress
DROP POLICY IF EXISTS "Anyone can insert progress" ON public.career_progress;
DROP POLICY IF EXISTS "Anyone can update progress" ON public.career_progress;
DROP POLICY IF EXISTS "Anyone can view progress by email" ON public.career_progress;

-- Add user_id column
ALTER TABLE public.career_progress ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- New secure policies
CREATE POLICY "Users can view own progress"
ON public.career_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.career_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.career_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
