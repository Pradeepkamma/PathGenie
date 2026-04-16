-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view shared results (no email)" ON public.shared_results;

-- Create a secure RPC function for single-row lookup
CREATE OR REPLACE FUNCTION public.get_shared_result_by_id(result_id uuid)
RETURNS TABLE (id uuid, results jsonb, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sr.id, sr.results, sr.created_at
  FROM public.shared_results sr
  WHERE sr.id = result_id
  LIMIT 1;
$$;