
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import JobCard from './JobCard';
import { Job } from '@/types/job';

interface JobsListProps {
  jobs: Job[];
  selectedJobs: Set<string>;
  applications: any[];
  currentUserId: string;
  isApplying: boolean;
  onJobSelect: (jobId: string) => void;
  onJobApply: (job: Job) => void;
  onClearFilters: () => void;
}

const JobsList: React.FC<JobsListProps> = ({
  jobs,
  selectedJobs,
  applications,
  currentUserId,
  isApplying,
  onJobSelect,
  onJobApply,
  onClearFilters
}) => {
  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId && app.userId === currentUserId);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
        <p className="text-gray-400 mb-4">Try adjusting your search criteria or clearing filters.</p>
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSelected={selectedJobs.has(job.id)}
          hasApplied={hasApplied(job.id)}
          isApplying={isApplying}
          onSelect={onJobSelect}
          onApply={onJobApply}
        />
      ))}
    </div>
  );
};

export default JobsList;
