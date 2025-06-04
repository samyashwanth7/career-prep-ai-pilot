
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface JobsHeaderProps {
  filteredJobsCount: number;
  selectedJobsCount: number;
  applicationsCount: number;
  onBulkApply: () => void;
}

const JobsHeader: React.FC<JobsHeaderProps> = ({
  filteredJobsCount,
  selectedJobsCount,
  applicationsCount,
  onBulkApply
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Job Search</h1>
            <p className="text-sm text-gray-400">{filteredJobsCount} jobs available</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {selectedJobsCount > 0 && (
            <Button
              onClick={onBulkApply}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              Apply to {selectedJobsCount} Jobs
            </Button>
          )}
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate('/applications')}
          >
            My Applications ({applicationsCount})
          </Button>
        </div>
      </div>
    </header>
  );
};

export default JobsHeader;
