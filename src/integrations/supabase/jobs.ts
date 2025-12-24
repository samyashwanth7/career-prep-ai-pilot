import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";

// Helper to upload a resume file to Supabase Storage (Phase 5 foundation)
export async function uploadResumeFile(userId: string, file: File): Promise<string> {
  // bucket = 'resumes', path = `${userId}/${Date.now()}_${file.name}`
  // This is a placeholder: actual upload requires pre-created bucket and RLS
  // In Phase 5, create the bucket and RLS, then update code to upload
  throw new Error("Resume file upload to Supabase Storage not yet implemented.");
}

// TODO: These functions require a job_applications table to be created in Supabase
// Uncomment and use once the table migration is applied

export async function fetchJobApplications(userId: string) {
  // Placeholder - table not yet created
  console.warn("job_applications table not yet created");
  return [];
}

export async function createJobApplication(userId: string, job: Job, resumeUrl: string, coverLetter: string) {
  // Placeholder - table not yet created
  console.warn("job_applications table not yet created");
  return null;
}

export function subscribeToJobApplications(userId: string, cb: (payload: any) => void) {
  // Placeholder - table not yet created
  console.warn("job_applications table not yet created");
  return null;
}
