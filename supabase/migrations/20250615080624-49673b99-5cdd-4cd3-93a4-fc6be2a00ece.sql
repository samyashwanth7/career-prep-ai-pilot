
-- Table: interview_sessions
CREATE TABLE public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  questions jsonb,
  answers jsonb,
  feedback jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: job_applications
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_title text,
  company text,
  job_data jsonb,
  resume_url text,
  cover_letter text,
  status text DEFAULT 'submitted',
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: user_progress
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_interviews int DEFAULT 0,
  total_applications int DEFAULT 0,
  streak int DEFAULT 0,
  weekly_stats jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and add user-limiting policies
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own data
CREATE POLICY "User can access own interview_sessions"
  ON public.interview_sessions
  USING (user_id = auth.uid());

CREATE POLICY "User can access own job_applications"
  ON public.job_applications
  USING (user_id = auth.uid());

CREATE POLICY "User can access own progress"
  ON public.user_progress
  USING (user_id = auth.uid());

-- Allow users to insert their own data
CREATE POLICY "User can insert interview_sessions"
  ON public.interview_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can insert job_applications"
  ON public.job_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can insert progress"
  ON public.user_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());
