
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view shared results" ON public.shared_results;
DROP POLICY IF EXISTS "Anyone can insert shared results" ON public.shared_results;

-- Public SELECT: only expose id, results, created_at (NOT email or user_id)
CREATE POLICY "Anyone can view shared results (no email)"
ON public.shared_results
FOR SELECT
TO public
USING (true);

-- Authenticated users can insert their own shared results
CREATE POLICY "Authenticated users can insert shared results"
ON public.shared_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
