
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  Zap,
  Search,
  Filter,
  Send,
  CheckCircle,
  Clock,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Target,
  TrendingUp,
  FileText,
  Mail,
  Users,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  industry: string;
  skills: string[];
  posted: string;
  description: string;
  benefits: string[];
  matchScore: number;
}

interface Application {
  id: string;
  jobId: string;
  company: string;
  position: string;
  appliedAt: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'rejected' | 'offer';
  coverLetter: string;
  customResume: string;
  followUpDate?: string;
}

interface BulkApplicationSettings {
  coverLetterStyle: 'professional' | 'creative' | 'technical';
  resumeEmphasis: 'skills' | 'experience' | 'projects';
  salaryStrategy: 'market-rate' | 'negotiable' | 'competitive';
  followUpSchedule: '1-week' | '2-weeks' | '1-month';
  autoPersonalization: boolean;
}

const BulkApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<Application[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    type: '',
    experience: '',
    industry: ''
  });
  const [settings, setSettings] = useState<BulkApplicationSettings>({
    coverLetterStyle: 'professional',
    resumeEmphasis: 'experience',
    salaryStrategy: 'market-rate',
    followUpSchedule: '1-week',
    autoPersonalization: true
  });
  const [showSettings, setShowSettings] = useState(false);

  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$140K - $180K',
      type: 'full-time',
      experience: 'senior',
      industry: 'Technology',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      posted: '2 days ago',
      description: 'We are looking for a senior frontend developer...',
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
      matchScore: 95
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$120K - $160K',
      type: 'full-time',
      experience: 'mid',
      industry: 'Fintech',
      skills: ['Python', 'React', 'PostgreSQL', 'Docker'],
      posted: '1 day ago',
      description: 'Join our growing fintech startup...',
      benefits: ['Equity', 'Flexible Hours', 'Learning Budget'],
      matchScore: 88
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'BigTech Inc',
      location: 'Seattle, WA',
      salary: '$150K - $200K',
      type: 'full-time',
      experience: 'senior',
      industry: 'Technology',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
      posted: '3 days ago',
      description: 'Lead product development for our core platform...',
      benefits: ['Health Insurance', 'Stock Options', 'Gym Membership'],
      matchScore: 82
    },
    {
      id: '4',
      title: 'Data Scientist',
      company: 'AI Innovations',
      location: 'Boston, MA',
      salary: '$130K - $170K',
      type: 'full-time',
      experience: 'mid',
      industry: 'AI/ML',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      posted: '1 week ago',
      description: 'Build ML models to drive business insights...',
      benefits: ['Research Time', 'Conference Budget', 'Remote Work'],
      matchScore: 91
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'CloudFirst',
      location: 'Austin, TX',
      salary: '$125K - $165K',
      type: 'full-time',
      experience: 'mid',
      industry: 'Cloud Computing',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
      posted: '4 days ago',
      description: 'Scale our cloud infrastructure...',
      benefits: ['Health Insurance', 'PTO', 'Stock Options'],
      matchScore: 87
    }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load mock jobs
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);

    // Load existing applications
    const savedApplications = localStorage.getItem(`bulk_applications_${JSON.parse(user).id}`);
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, [navigate]);

  useEffect(() => {
    // Filter jobs based on search and filters
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(job => 
          job[key as keyof typeof filters]?.toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    setFilteredJobs(filtered);
  }, [searchTerm, filters, jobs]);

  const generateCoverLetter = (job: Job, style: string): string => {
    const templates = {
      professional: `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my extensive experience in ${job.skills.slice(0, 3).join(', ')}, I am confident I would be a valuable addition to your team.

In my previous roles, I have successfully delivered high-impact projects that align with your requirements. My expertise in ${job.skills[0]} and ${job.skills[1]} would enable me to contribute immediately to your ongoing initiatives.

I am particularly excited about ${job.company}'s innovative approach and would welcome the opportunity to discuss how my skills can contribute to your continued success.

Thank you for your consideration.

Best regards,
${currentUser?.name || 'Your Name'}`,

      creative: `Hi there! 👋

I couldn't help but get excited when I saw the ${job.title} opening at ${job.company}. As someone passionate about ${job.skills[0]} and ${job.skills[1]}, this role feels like the perfect match!

What caught my attention:
• Your focus on ${job.industry} innovation
• The opportunity to work with ${job.skills.join(', ')}
• ${job.company}'s reputation for ${job.benefits[0]}

I've been building amazing things with ${job.skills.slice(0, 2).join(' and ')}, and I'd love to bring that energy to your team. Let's chat about how we can create something awesome together!

Looking forward to hearing from you,
${currentUser?.name || 'Your Name'}`,

      technical: `Subject: ${job.title} Application - Strong Technical Background

Dear ${job.company} Team,

I am applying for the ${job.title} position, bringing ${job.experience}-level expertise in:

Technical Skills:
${job.skills.map(skill => `• ${skill}`).join('\n')}

Relevant Experience:
• Successfully architected and deployed scalable applications
• Implemented best practices in ${job.skills[0]} development
• Led technical initiatives resulting in improved performance and reliability

My technical approach aligns with modern development practices, and I'm excited about the opportunity to contribute to ${job.company}'s technical excellence.

I have attached my resume and would appreciate the opportunity to discuss my qualifications further.

Best regards,
${currentUser?.name || 'Your Name'}`
    };

    return templates[style as keyof typeof templates] || templates.professional;
  };

  const calculateMatchScore = (job: Job): number => {
    // Mock calculation based on user skills vs job requirements
    const userSkills = ['React', 'JavaScript', 'Python', 'AWS', 'Node.js']; // This would come from user profile
    const matchingSkills = job.skills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.min(95, Math.round((matchingSkills.length / job.skills.length) * 100) + Math.floor(Math.random() * 10));
  };

  const toggleJobSelection = (jobId: string) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const selectAllJobs = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const bulkApply = async () => {
    if (selectedJobs.size === 0) {
      toast({
        title: "No Jobs Selected",
        description: "Please select at least one job to apply to.",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    setApplicationProgress(0);

    const selectedJobsList = filteredJobs.filter(job => selectedJobs.has(job.id));
    const newApplications: Application[] = [];

    for (let i = 0; i < selectedJobsList.length; i++) {
      const job = selectedJobsList[i];
      
      // Simulate application creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const application: Application = {
        id: `app_${Date.now()}_${job.id}`,
        jobId: job.id,
        company: job.company,
        position: job.title,
        appliedAt: new Date().toISOString(),
        status: 'pending',
        coverLetter: generateCoverLetter(job, settings.coverLetterStyle),
        customResume: `Tailored resume emphasizing ${settings.resumeEmphasis} for ${job.title} position`,
        followUpDate: new Date(Date.now() + (settings.followUpSchedule === '1-week' ? 7 : 
                                            settings.followUpSchedule === '2-weeks' ? 14 : 30) * 24 * 60 * 60 * 1000).toISOString()
      };

      newApplications.push(application);
      setApplicationProgress(((i + 1) / selectedJobsList.length) * 100);
    }

    const updatedApplications = [...applications, ...newApplications];
    setApplications(updatedApplications);
    localStorage.setItem(`bulk_applications_${currentUser.id}`, JSON.stringify(updatedApplications));

    setIsApplying(false);
    setSelectedJobs(new Set());

    toast({
      title: "Applications Submitted!",
      description: `Successfully applied to ${selectedJobsList.length} positions. Check your application status below.`
    });
  };

  const hasApplied = (jobId: string): boolean => {
    return applications.some(app => app.jobId === jobId);
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const reviewing = applications.filter(app => app.status === 'reviewing').length;
    const interviewed = applications.filter(app => app.status === 'interviewed').length;
    const responseRate = total > 0 ? Math.round(((reviewing + interviewed) / total) * 100) : 0;

    return { total, pending, reviewing, interviewed, responseRate };
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const stats = getApplicationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Mass Applications</h1>
              <p className="text-gray-300">Apply to multiple jobs with personalized applications</p>
            </div>
          </div>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Target className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{filteredJobs.length}</div>
              <div className="text-gray-300 text-sm">Available Jobs</div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{selectedJobs.size}</div>
              <div className="text-gray-300 text-sm">Selected</div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.total}</div>
              <div className="text-gray-300 text-sm">Total Applied</div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.responseRate}%</div>
              <div className="text-gray-300 text-sm">Response Rate</div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.interviewed}</div>
              <div className="text-gray-300 text-sm">Interviews</div>
            </div>
          </Card>
        </div>

        {/* Application Settings */}
        {showSettings && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Application Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Cover Letter Style</label>
                <select 
                  value={settings.coverLetterStyle}
                  onChange={(e) => setSettings({...settings, coverLetterStyle: e.target.value as any})}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Resume Emphasis</label>
                <select 
                  value={settings.resumeEmphasis}
                  onChange={(e) => setSettings({...settings, resumeEmphasis: e.target.value as any})}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="skills">Skills</option>
                  <option value="experience">Experience</option>
                  <option value="projects">Projects</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Salary Strategy</label>
                <select 
                  value={settings.salaryStrategy}
                  onChange={(e) => setSettings({...settings, salaryStrategy: e.target.value as any})}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="market-rate">Market Rate</option>
                  <option value="negotiable">Negotiable</option>
                  <option value="competitive">Competitive</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Follow-up Schedule</label>
                <select 
                  value={settings.followUpSchedule}
                  onChange={(e) => setSettings({...settings, followUpSchedule: e.target.value as any})}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="1-week">1 Week</option>
                  <option value="2-weeks">2 Weeks</option>
                  <option value="1-month">1 Month</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="p-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
            <select 
              value={filters.experience}
              onChange={(e) => setFilters({...filters, experience: e.target.value})}
              className="p-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="">All Levels</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
            <Button
              onClick={selectAllJobs}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {selectedJobs.size === filteredJobs.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          {selectedJobs.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-lg">
              <span className="text-white">
                {selectedJobs.size} jobs selected for bulk application
              </span>
              <Button
                onClick={bulkApply}
                disabled={isApplying}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                {isApplying ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Applying... {Math.round(applicationProgress)}%
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Apply to {selectedJobs.size} Jobs
                  </>
                )}
              </Button>
            </div>
          )}

          {isApplying && (
            <div className="mt-4">
              <Progress value={applicationProgress} />
              <div className="text-center text-gray-300 mt-2">
                Processing applications... {Math.round(applicationProgress)}%
              </div>
            </div>
          )}
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <Card key={job.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Checkbox
                    checked={selectedJobs.has(job.id)}
                    onCheckedChange={() => toggleJobSelection(job.id)}
                    disabled={hasApplied(job.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          job.matchScore >= 90 ? 'bg-green-500/20 text-green-400' :
                          job.matchScore >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {job.matchScore}% Match
                        </Badge>
                        {hasApplied(job.id) && (
                          <Badge className="bg-blue-500/20 text-blue-400">
                            Applied
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-300 text-sm mb-3">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.posted}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-300 text-sm">{job.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkApplications;
