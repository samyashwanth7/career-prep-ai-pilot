import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  Building,
  Users,
  Star,
  Upload,
  CheckCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface Job {
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

interface JobApplication {
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

const Jobs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');
  
  // Modal states
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Sample job data
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$150k - $200k',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Join our team to build the next generation of web experiences.',
      requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
      benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours'],
      postedDate: '2024-01-15',
      applicants: 45,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      salary: '$140k - $180k',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Build scalable applications that connect billions of people.',
      requirements: ['React', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL'],
      benefits: ['Health Insurance', 'Stock Options', 'Remote Work'],
      postedDate: '2024-01-14',
      applicants: 67,
      rating: 4.6
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$130k - $170k',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Help us scale our e-commerce platform to new heights.',
      requirements: ['Java', 'AWS', 'Microservices', 'Docker', 'Kubernetes'],
      benefits: ['Health Insurance', 'Stock Options', 'Career Growth'],
      postedDate: '2024-01-13',
      applicants: 89,
      rating: 4.4
    },
    {
      id: '4',
      title: 'Backend Developer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      salary: '$145k - $190k',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Build the infrastructure that powers global streaming.',
      requirements: ['Java', 'Scala', 'Microservices', 'AWS', 'Kafka'],
      benefits: ['Health Insurance', 'Unlimited PTO', 'Stock Options'],
      postedDate: '2024-01-12',
      applicants: 34,
      rating: 4.7
    },
    {
      id: '5',
      title: 'Frontend Engineer',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      salary: '€80k - €110k',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Create amazing music experiences for millions of users.',
      requirements: ['React', 'TypeScript', 'Redux', 'CSS', 'Testing'],
      benefits: ['Health Insurance', 'Music Subscription', 'Flexible Location'],
      postedDate: '2024-01-11',
      applicants: 56,
      rating: 4.5
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      company: 'Uber',
      location: 'San Francisco, CA',
      salary: '$140k - $180k',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Scale our infrastructure to handle millions of rides.',
      requirements: ['Kubernetes', 'AWS', 'Terraform', 'Python', 'Docker'],
      benefits: ['Health Insurance', 'Stock Options', 'Commuter Benefits'],
      postedDate: '2024-01-10',
      applicants: 23,
      rating: 4.3
    }
  ];

  useEffect(() => {
    // Load current user
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Initialize jobs and applications
    const savedJobs = localStorage.getItem('availableJobs');
    if (!savedJobs) {
      localStorage.setItem('availableJobs', JSON.stringify(sampleJobs));
      setJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
    } else {
      const parsedJobs = JSON.parse(savedJobs);
      setJobs(parsedJobs);
      setFilteredJobs(parsedJobs);
    }

    // Load user applications
    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, [navigate]);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !locationFilter || locationFilter === 'all' || job.location.includes(locationFilter);
      const matchesType = !typeFilter || typeFilter === 'all' || job.type === typeFilter;
      const matchesExperience = !experienceFilter || experienceFilter === 'all' || job.experience === experienceFilter;
      const matchesSalary = !salaryFilter || salaryFilter === 'all' || checkSalaryRange(job.salary, salaryFilter);

      return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesSalary;
    });

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, typeFilter, experienceFilter, salaryFilter, jobs]);

  const checkSalaryRange = (jobSalary: string, filterRange: string) => {
    // Simple salary range checking - in real app would be more sophisticated
    const salaryNum = parseInt(jobSalary.replace(/[^0-9]/g, ''));
    switch (filterRange) {
      case 'under-100k': return salaryNum < 100000;
      case '100k-150k': return salaryNum >= 100000 && salaryNum <= 150000;
      case 'over-150k': return salaryNum > 150000;
      default: return true;
    }
  };

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

  const handleBulkApply = () => {
    if (selectedJobs.size === 0) {
      toast({
        title: "No jobs selected",
        description: "Please select at least one job to apply.",
        variant: "destructive"
      });
      return;
    }
    
    // For bulk apply, we'll use a simplified process
    const selectedJobsList = jobs.filter(job => selectedJobs.has(job.id));
    applyToJobs(selectedJobsList, null, "Auto-generated cover letter for bulk application.");
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const applyToJobs = async (jobsToApply: Job[], resume: File | null, coverLetterText: string) => {
    setIsApplying(true);
    
    try {
      let resumeBase64 = '';
      if (resume) {
        resumeBase64 = await fileToBase64(resume);
      }

      const newApplications: JobApplication[] = [];
      
      for (const job of jobsToApply) {
        // Check if already applied
        const existingApplication = applications.find(app => 
          app.jobId === job.id && app.userId === currentUser.id
        );
        
        if (existingApplication) {
          continue; // Skip if already applied
        }

        const application: JobApplication = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          jobId: job.id,
          job: job,
          resume: resumeBase64,
          coverLetter: coverLetterText,
          status: 'submitted',
          appliedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        newApplications.push(application);
      }

      // Save applications
      const updatedApplications = [...applications, ...newApplications];
      setApplications(updatedApplications);
      localStorage.setItem('jobApplications', JSON.stringify(updatedApplications));
      
      // Update user stats
      const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
      userStats.totalApplications = (userStats.totalApplications || 0) + newApplications.length;
      userStats.applicationsThisWeek = (userStats.applicationsThisWeek || 0) + newApplications.length;
      localStorage.setItem('userStats', JSON.stringify(userStats));

      toast({
        title: "Applications submitted!",
        description: `Successfully applied to ${newApplications.length} job(s).`,
      });

      // Clear selections and close modal
      setSelectedJobs(new Set());
      setShowApplicationModal(false);
      setSelectedJob(null);
      setCoverLetter('');
      setResumeFile(null);

    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSubmitApplication = () => {
    if (!selectedJob) return;
    
    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume to apply.",
        variant: "destructive"
      });
      return;
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a cover letter.",
        variant: "destructive"
      });
      return;
    }

    applyToJobs([selectedJob], resumeFile, coverLetter);
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId && app.userId === currentUser?.id);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setTypeFilter('all');
    setExperienceFilter('all');
    setSalaryFilter('all');
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
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
              <p className="text-sm text-gray-400">{filteredJobs.length} jobs available</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {selectedJobs.size > 0 && (
              <Button
                onClick={handleBulkApply}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                Apply to {selectedJobs.size} Jobs
              </Button>
            )}
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/applications')}
            >
              My Applications ({applications.filter(app => app.userId === currentUser.id).length})
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid lg:grid-cols-6 gap-4 mb-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry">Entry Level</SelectItem>
                <SelectItem value="Mid">Mid Level</SelectItem>
                <SelectItem value="Senior">Senior Level</SelectItem>
                <SelectItem value="Lead">Lead/Principal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={salaryFilter} onValueChange={setSalaryFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Salaries</SelectItem>
                <SelectItem value="under-100k">Under $100k</SelectItem>
                <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                <SelectItem value="over-150k">Over $150k</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {(searchTerm || (locationFilter && locationFilter !== 'all') || (typeFilter && typeFilter !== 'all') || (experienceFilter && experienceFilter !== 'all') || (salaryFilter && salaryFilter !== 'all')) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => {
            const applied = hasApplied(job.id);
            const selected = selectedJobs.has(job.id);
            
            return (
              <Card key={job.id} className={`bg-white/5 backdrop-blur-lg border-white/10 p-6 hover:bg-white/10 transition-all duration-300 ${selected ? 'ring-2 ring-purple-500' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleJobSelect(job.id)}
                      disabled={applied}
                      className="mt-1 h-4 w-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        {applied && (
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
                      onClick={() => handleSingleApply(job)}
                      disabled={applied || isApplying}
                      className={applied ? 
                        "bg-green-500/20 text-green-400 border-green-500/30" : 
                        "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                      }
                    >
                      {applied ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria or clearing filters.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Apply to {selectedJob.company}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedJob.title}</h3>
              <p className="text-gray-400">{selectedJob.description}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Resume *</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
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
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a compelling cover letter..."
                  className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowApplicationModal(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitApplication}
                  disabled={isApplying || !resumeFile || !coverLetter.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Jobs;
