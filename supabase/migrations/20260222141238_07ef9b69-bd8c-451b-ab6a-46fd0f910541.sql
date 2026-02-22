CREATE TABLE public.shared_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public read access so anyone with the link can view
ALTER TABLE public.shared_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared results" ON public.shared_results
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert shared results" ON public.shared_results
  FOR INSERT WITH CHECK (true);