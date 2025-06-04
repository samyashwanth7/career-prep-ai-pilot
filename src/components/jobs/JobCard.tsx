
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  Building,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  hasApplied: boolean;
  isApplying: boolean;
  onSelect: (jobId: string) => void;
  onApply: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  hasApplied,
  isApplying,
  onSelect,
  onApply
}) => {
  return (
    <Card className={`bg-white/5 backdrop-blur-lg border-white/10 p-6 hover:bg-white/10 transition-all duration-300 ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(job.id)}
            disabled={hasApplied}
            className="mt-1 h-4 w-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-white">{job.title}</h3>
              {hasApplied && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Applied
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-3 text-gray-400">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{job.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.slice(0, 4).map((req, index) => (
                <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                  {req}
                </Badge>
              ))}
              {job.requirements.length > 4 && (
                <Badge variant="outline" className="border-gray-500/30 text-gray-400">
                  +{job.requirements.length - 4} more
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{job.applicants} applicants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{job.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => onApply(job)}
            disabled={hasApplied || isApplying}
            className={hasApplied ? 
              "bg-green-500/20 text-green-400 border-green-500/30" : 
              "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            }
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
