
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicants: number;
  rating: number;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  resume: string;
  coverLetter: string;
  status: 'submitted' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  appliedAt: string;
  lastUpdated: string;
}

export interface JobFilters {
  searchTerm: string;
  locationFilter: string;
  typeFilter: string;
  experienceFilter: string;
  salaryFilter: string;
}
