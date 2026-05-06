-- Allow users to manage their own shared results and personal results
CREATE POLICY "Users can delete own shared results"
ON public.shared_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own results"
ON public.user_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own results"
ON public.user_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);