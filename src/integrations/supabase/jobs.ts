import type { Job } from "@/types/job";

// These functions are placeholders for when the job_applications table is created
// For now, they use localStorage as a fallback

export async function uploadResumeFile(userId: string, file: File): Promise<string> {
  // Placeholder: actual upload requires pre-created bucket and RLS
  throw new Error("Resume file upload to Supabase Storage not yet implemented.");
}

export async function fetchJobApplications(userId: string) {
  // Use localStorage as fallback until database table is created
  try {
    const stored = localStorage.getItem(`job_applications_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
}

export async function createJobApplication(userId: string, job: Job, resumeUrl: string, coverLetter: string) {
  // Use localStorage as fallback until database table is created
  try {
    const applications = await fetchJobApplications(userId);
    const newApplication = {
      id: Date.now().toString(),
      user_id: userId,
      job_title: job.title,
      company: job.company,
      job_data: job,
      resume_url: resumeUrl,
      cover_letter: coverLetter,
      status: "submitted",
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    applications.push(newApplication);
    localStorage.setItem(`job_applications_${userId}`, JSON.stringify(applications));
    return newApplication;
  } catch (error) {
    console.error('Error creating job application:', error);
    throw error;
  }
}

export function subscribeToJobApplications(userId: string, cb: (payload: any) => void) {
  // Placeholder for real-time subscription - returns a no-op unsubscribe function
  return {
    unsubscribe: () => {}
  };
}
