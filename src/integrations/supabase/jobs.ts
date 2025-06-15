
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";

// --- No change to fetchJobApplications ---

export async function fetchJobApplications(userId: string) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", userId)
    .order("applied_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createJobApplication(userId: string, job: Job, resumeUrl: string, coverLetter: string) {
  const { error, data } = await supabase
    .from("job_applications")
    .insert([
      {
        user_id: userId,
        job_title: job.title,
        company: job.company,
        job_data: job as any,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        status: "submitted",
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function subscribeToJobApplications(userId: string, cb: (payload: any) => void) {
  const channel = supabase
    .channel("job-apps")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "job_applications", filter: `user_id=eq.${userId}` },
      cb
    )
    .subscribe();
  return channel;
}
