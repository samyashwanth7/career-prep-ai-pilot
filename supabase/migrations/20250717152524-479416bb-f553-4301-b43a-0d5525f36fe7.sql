-- Create authentication and user profiles system
-- First ensure we have the necessary tables for peer comparison

-- Create user profiles table for detailed user information
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  career_level text CHECK (career_level IN ('entry', 'mid', 'senior')),
  industry text,
  target_role text,
  years_experience integer DEFAULT 0,
  job_status text CHECK (job_status IN ('student', 'employed', 'job_seeking')),
  skill_assessment_score integer DEFAULT 0,
  peer_group_id uuid,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create peer groups table
CREATE TABLE public.peer_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text,
  member_count integer DEFAULT 0,
  average_stats jsonb DEFAULT '{}',
  criteria jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create user activities table for tracking progress
CREATE TABLE public.user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  score_achieved integer,
  duration_seconds integer,
  improvement_rate numeric,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for peer_groups (users can only see their group stats)
CREATE POLICY "Users can view their peer group"
  ON public.peer_groups FOR SELECT
  USING (
    id IN (
      SELECT peer_group_id 
      FROM public.user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for user_activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view anonymized peer activities"
  ON public.user_activities FOR SELECT
  USING (
    user_id IN (
      SELECT up.user_id 
      FROM public.user_profiles up
      JOIN public.user_profiles my_profile ON my_profile.peer_group_id = up.peer_group_id
      WHERE my_profile.user_id = auth.uid()
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_groups_updated_at
  BEFORE UPDATE ON public.peer_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();