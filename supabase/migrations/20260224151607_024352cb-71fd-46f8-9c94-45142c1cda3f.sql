CREATE TABLE public.career_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  career_title TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  step_text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, career_title, step_index)
);

ALTER TABLE public.career_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view progress by email" ON public.career_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert progress" ON public.career_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update progress" ON public.career_progress FOR UPDATE USING (true) WITH CHECK (true);