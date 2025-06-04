
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Job } from '@/types/job';

interface ApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  resumeFile: File | null;
  coverLetter: string;
  isApplying: boolean;
  onResumeFileChange: (file: File | null) => void;
  onCoverLetterChange: (text: string) => void;
  onSubmit: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  resumeFile,
  coverLetter,
  isApplying,
  onResumeFileChange,
  onCoverLetterChange,
  onSubmit
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Apply to {job.company}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
          <p className="text-gray-400">{job.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Resume *</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => onResumeFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-300">
                  {resumeFile ? resumeFile.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Cover Letter *</label>
            <textarea
              value={coverLetter}
              onChange={(e) => onCoverLetterChange(e.target.value)}
              placeholder="Write a compelling cover letter..."
              className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isApplying || !resumeFile || !coverLetter.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              {isApplying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationModal;
