
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import JobsHeader from '@/components/jobs/JobsHeader';
import JobsFilters from '@/components/jobs/JobsFilters';
import JobsList from '@/components/jobs/JobsList';
import ApplicationModal from '@/components/jobs/ApplicationModal';
import { Job } from '@/types/job';

const Jobs = () => {
  const navigate = useNavigate();
  const {
    jobs,
    filteredJobs,
    applications,
    filters,
    updateFilters,
    clearFilters,
    applyToJobs
  } = useJobs();
  
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Modal states
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const handleJobSelect = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSingleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleBulkApply = async () => {
    if (selectedJobs.size === 0) return;
    
    const selectedJobsList = jobs.filter(job => selectedJobs.has(job.id));
    setIsApplying(true);
    
    const success = await applyToJobs(
      selectedJobsList, 
      null, 
      "Auto-generated cover letter for bulk application.",
      currentUser
    );

    if (success) {
      setSelectedJobs(new Set());
    }
    setIsApplying(false);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob || !resumeFile || !coverLetter.trim()) return;
    
    setIsApplying(true);
    
    const success = await applyToJobs([selectedJob], resumeFile, coverLetter, currentUser);
    
    if (success) {
      setShowApplicationModal(false);
      setSelectedJob(null);
      setCoverLetter('');
      setResumeFile(null);
    }
    
    setIsApplying(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <JobsHeader
        filteredJobsCount={filteredJobs.length}
        selectedJobsCount={selectedJobs.size}
        applicationsCount={applications.filter(app => app.userId === currentUser.id).length}
        onBulkApply={handleBulkApply}
      />

      <main className="p-6 max-w-7xl mx-auto">
        <JobsFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          totalJobs={jobs.length}
          filteredJobs={filteredJobs.length}
        />

        <JobsList
          jobs={filteredJobs}
          selectedJobs={selectedJobs}
          applications={applications}
          currentUserId={currentUser.id}
          isApplying={isApplying}
          onJobSelect={handleJobSelect}
          onJobApply={handleSingleApply}
          onClearFilters={clearFilters}
        />
      </main>

      <ApplicationModal
        job={selectedJob}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        resumeFile={resumeFile}
        coverLetter={coverLetter}
        isApplying={isApplying}
        onResumeFileChange={setResumeFile}
        onCoverLetterChange={setCoverLetter}
        onSubmit={handleSubmitApplication}
      />
    </div>
  );
};

export default Jobs;
