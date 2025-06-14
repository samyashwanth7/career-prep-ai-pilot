
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  MapPin, 
  Target, 
  Book, 
  CheckCircle, 
  Clock,
  Star,
  Rocket,
  Code,
  Palette,
  BarChart3,
  Users,
  Briefcase,
  Brain,
  ChevronRight,
  Play,
  Award,
  TrendingUp
} from 'lucide-react';

interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  roles: string[];
  averageSalary: string;
  growthRate: string;
  skills: string[];
  certifications: string[];
  roadmap: RoadmapPhase[];
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  resources: Resource[];
  projects: string[];
  milestones: string[];
}

interface Resource {
  type: 'course' | 'book' | 'article' | 'video' | 'practice';
  title: string;
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
}

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryTemplate | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<any>({});

  const industryTemplates: IndustryTemplate[] = [
    {
      id: 'software-engineering',
      name: 'Software Engineering',
      description: 'Build applications, systems, and platforms that power the digital world',
      icon: <Code className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-600',
      roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Mobile Developer'],
      averageSalary: '$95K - $180K',
      growthRate: '+22% (Much faster than average)',
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure Fundamentals'],
      roadmap: [
        {
          id: 'fundamentals',
          title: 'Programming Fundamentals',
          description: 'Master the basics of programming and computer science',
          duration: '3-4 months',
          difficulty: 'beginner',
          skills: ['HTML/CSS', 'JavaScript', 'Git', 'Problem Solving', 'Algorithms'],
          resources: [
            { type: 'course', title: 'Complete Web Development Bootcamp', provider: 'Udemy', duration: '40 hours', difficulty: 'beginner' },
            { type: 'book', title: 'Eloquent JavaScript', provider: 'Marijn Haverbeke', duration: '2 weeks', difficulty: 'beginner' },
            { type: 'practice', title: 'FreeCodeCamp', provider: 'FreeCodeCamp', duration: 'Ongoing', difficulty: 'beginner' }
          ],
          projects: ['Personal Portfolio Website', 'Simple Calculator', 'To-Do List App'],
          milestones: ['Build first website', 'Complete 50 coding challenges', 'Create GitHub profile']
        },
        {
          id: 'frontend-development',
          title: 'Frontend Development',
          description: 'Learn modern frontend frameworks and build user interfaces',
          duration: '4-5 months',
          difficulty: 'intermediate',
          skills: ['React', 'TypeScript', 'Responsive Design', 'State Management', 'Testing'],
          resources: [
            { type: 'course', title: 'React - The Complete Guide', provider: 'Udemy', duration: '50 hours', difficulty: 'intermediate' },
            { type: 'course', title: 'TypeScript for JavaScript Developers', provider: 'Microsoft Learn', duration: '15 hours', difficulty: 'intermediate' }
          ],
          projects: ['E-commerce Website', 'Weather App', 'Social Media Dashboard'],
          milestones: ['Deploy first React app', 'Master TypeScript', 'Build responsive designs']
        },
        {
          id: 'backend-development',
          title: 'Backend Development',
          description: 'Build APIs, databases, and server-side applications',
          duration: '4-6 months',
          difficulty: 'intermediate',
          skills: ['Node.js', 'Express', 'Database Design', 'RESTful APIs', 'Authentication'],
          resources: [
            { type: 'course', title: 'Node.js Complete Guide', provider: 'Academind', duration: '35 hours', difficulty: 'intermediate' },
            { type: 'book', title: 'Database Design for Mere Mortals', provider: 'Michael Hernandez', duration: '3 weeks', difficulty: 'intermediate' }
          ],
          projects: ['REST API', 'Chat Application', 'Blog Platform'],
          milestones: ['Build full-stack app', 'Deploy to cloud', 'Implement authentication']
        },
        {
          id: 'advanced-topics',
          title: 'Advanced Topics & Specialization',
          description: 'Master advanced concepts and specialize in your chosen area',
          duration: '6-8 months',
          difficulty: 'advanced',
          skills: ['System Design', 'Microservices', 'DevOps', 'Performance Optimization', 'Security'],
          resources: [
            { type: 'course', title: 'System Design Interview', provider: 'AlgoExpert', duration: '25 hours', difficulty: 'advanced' },
            { type: 'book', title: 'Designing Data-Intensive Applications', provider: 'Martin Kleppmann', duration: '6 weeks', difficulty: 'advanced' }
          ],
          projects: ['Microservices Architecture', 'Real-time Application', 'Open Source Contribution'],
          milestones: ['Design scalable system', 'Contribute to open source', 'Lead a project']
        }
      ]
    },
    {
      id: 'data-science',
      name: 'Data Science & Analytics',
      description: 'Extract insights from data to drive business decisions and innovation',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-green-500 to-teal-600',
      roles: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst'],
      averageSalary: '$85K - $165K',
      growthRate: '+31% (Much faster than average)',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Tableau', 'TensorFlow'],
      certifications: ['Google Data Analytics', 'AWS Machine Learning', 'Microsoft Data Scientist Associate'],
      roadmap: [
        {
          id: 'statistics-math',
          title: 'Statistics & Mathematics',
          description: 'Build strong foundation in statistics and mathematical concepts',
          duration: '2-3 months',
          difficulty: 'beginner',
          skills: ['Statistics', 'Probability', 'Linear Algebra', 'Calculus', 'Hypothesis Testing'],
          resources: [
            { type: 'course', title: 'Statistics for Data Science', provider: 'Coursera', duration: '30 hours', difficulty: 'beginner' },
            { type: 'book', title: 'Think Stats', provider: 'Allen Downey', duration: '2 weeks', difficulty: 'beginner' }
          ],
          projects: ['Statistical Analysis Report', 'A/B Testing Analysis'],
          milestones: ['Complete statistics course', 'Conduct first analysis']
        },
        {
          id: 'programming-tools',
          title: 'Programming & Tools',
          description: 'Learn Python, R, and essential data science tools',
          duration: '3-4 months',
          difficulty: 'intermediate',
          skills: ['Python', 'R', 'Pandas', 'NumPy', 'Jupyter', 'Git'],
          resources: [
            { type: 'course', title: 'Python for Data Science', provider: 'DataCamp', duration: '25 hours', difficulty: 'intermediate' },
            { type: 'practice', title: 'Kaggle Learn', provider: 'Kaggle', duration: 'Ongoing', difficulty: 'intermediate' }
          ],
          projects: ['Data Cleaning Project', 'Exploratory Data Analysis', 'Web Scraping Project'],
          milestones: ['Master pandas library', 'Complete first dataset analysis']
        }
      ]
    },
    {
      id: 'product-management',
      name: 'Product Management',
      description: 'Lead product strategy and drive innovation from concept to launch',
      icon: <Rocket className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      roles: ['Product Manager', 'Senior Product Manager', 'Product Owner', 'Director of Product'],
      averageSalary: '$100K - $200K',
      growthRate: '+19% (Much faster than average)',
      skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Roadmapping', 'A/B Testing'],
      certifications: ['Certified Scrum Product Owner', 'Google Product Management', 'Product Management Certificate'],
      roadmap: [
        {
          id: 'pm-fundamentals',
          title: 'Product Management Fundamentals',
          description: 'Learn core PM concepts and methodologies',
          duration: '2-3 months',
          difficulty: 'beginner',
          skills: ['Product Strategy', 'Market Research', 'User Stories', 'Roadmapping'],
          resources: [
            { type: 'course', title: 'Introduction to Product Management', provider: 'Coursera', duration: '20 hours', difficulty: 'beginner' },
            { type: 'book', title: 'Inspired', provider: 'Marty Cagan', duration: '1 week', difficulty: 'beginner' }
          ],
          projects: ['Product Strategy Document', 'Market Research Report'],
          milestones: ['Create first roadmap', 'Conduct user interviews']
        }
      ]
    },
    {
      id: 'ux-design',
      name: 'UX/UI Design',
      description: 'Create intuitive and beautiful user experiences for digital products',
      icon: <Palette className="w-8 h-8" />,
      color: 'from-pink-500 to-purple-600',
      roles: ['UX Designer', 'UI Designer', 'Product Designer', 'Design Lead'],
      averageSalary: '$75K - $140K',
      growthRate: '+13% (Faster than average)',
      skills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Design Systems', 'Usability Testing'],
      certifications: ['Google UX Design Certificate', 'Adobe Certified Expert', 'Interaction Design Foundation'],
      roadmap: [
        {
          id: 'design-fundamentals',
          title: 'Design Fundamentals',
          description: 'Learn design principles and user-centered design process',
          duration: '2-3 months',
          difficulty: 'beginner',
          skills: ['Design Principles', 'Color Theory', 'Typography', 'Layout', 'User Psychology'],
          resources: [
            { type: 'course', title: 'Google UX Design Certificate', provider: 'Coursera', duration: '40 hours', difficulty: 'beginner' },
            { type: 'book', title: 'Don\'t Make Me Think', provider: 'Steve Krug', duration: '1 week', difficulty: 'beginner' }
          ],
          projects: ['App Redesign', 'Website Mockup'],
          milestones: ['Complete first design', 'Build design portfolio']
        }
      ]
    }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
    
    // Load user progress
    const progress = localStorage.getItem(`roadmap_progress_${JSON.parse(user).id}`);
    if (progress) {
      setUserProgress(JSON.parse(progress));
    }
  }, [navigate]);

  const saveProgress = (industryId: string, phaseId: string, completed: boolean) => {
    const newProgress = { ...userProgress };
    if (!newProgress[industryId]) {
      newProgress[industryId] = {};
    }
    newProgress[industryId][phaseId] = completed;
    setUserProgress(newProgress);
    localStorage.setItem(`roadmap_progress_${currentUser.id}`, JSON.stringify(newProgress));
  };

  const getPhaseProgress = (industryId: string, phaseId: string) => {
    return userProgress[industryId]?.[phaseId] || false;
  };

  const getIndustryProgress = (industry: IndustryTemplate) => {
    const completedPhases = industry.roadmap.filter(phase => 
      getPhaseProgress(industry.id, phase.id)
    ).length;
    return (completedPhases / industry.roadmap.length) * 100;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              <h1 className="text-3xl font-bold text-white">Career Roadmap</h1>
              <p className="text-gray-300">Personalized learning paths for your career goals</p>
            </div>
          </div>
        </div>

        {!selectedIndustry ? (
          /* Industry Selection */
          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Choose Your Career Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {industryTemplates.map(industry => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry)}
                    className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-all text-left group"
                  >
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${industry.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {industry.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{industry.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{industry.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Salary</span>
                        <span className="text-green-400 font-semibold">{industry.averageSalary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth Rate</span>
                        <span className="text-cyan-400 font-semibold">{industry.growthRate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-2">Key Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {industry.skills.slice(0, 4).map(skill => (
                            <Badge key={skill} variant="outline" className="border-gray-500 text-gray-300 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {industry.skills.length > 4 && (
                            <Badge variant="outline" className="border-gray-500 text-gray-300 text-xs">
                              +{industry.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      {userProgress[industry.id] && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-purple-400">{Math.round(getIndustryProgress(industry))}%</span>
                          </div>
                          <Progress value={getIndustryProgress(industry)} className="h-2" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Detailed Roadmap */
          <div className="space-y-8">
            {/* Industry Overview */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${selectedIndustry.color} flex items-center justify-center text-white mr-6`}>
                    {selectedIndustry.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedIndustry.name}</h2>
                    <p className="text-gray-300">{selectedIndustry.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedIndustry(null)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Change Path
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Popular Roles</h4>
                  <div className="space-y-2">
                    {selectedIndustry.roles.map(role => (
                      <div key={role} className="text-gray-300 text-sm">{role}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIndustry.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="border-gray-500 text-gray-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Certifications</h4>
                  <div className="space-y-2">
                    {selectedIndustry.certifications.map(cert => (
                      <div key={cert} className="text-gray-300 text-sm flex items-center">
                        <Award className="w-3 h-3 text-yellow-400 mr-2" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Roadmap Phases */}
            <div className="space-y-6">
              {selectedIndustry.roadmap.map((phase, index) => {
                const isCompleted = getPhaseProgress(selectedIndustry.id, phase.id);
                const isActive = index === currentPhase;
                
                return (
                  <Card key={phase.id} className={`bg-white/10 backdrop-blur-lg border-white/20 p-6 ${isActive ? 'border-purple-500' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                          isCompleted ? 'bg-green-500' : isActive ? 'bg-purple-500' : 'bg-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <span className="text-white font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{phase.title}</h3>
                          <p className="text-gray-300">{phase.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className={`${
                              phase.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                              phase.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {phase.difficulty}
                            </Badge>
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {phase.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => saveProgress(selectedIndustry.id, phase.id, !isCompleted)}
                        variant={isCompleted ? "default" : "outline"}
                        className={isCompleted ? "bg-green-500 hover:bg-green-600" : "border-white/20 text-white hover:bg-white/10"}
                      >
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Skills to Learn</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {phase.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <h4 className="text-white font-semibold mb-3">Projects</h4>
                        <div className="space-y-2">
                          {phase.projects.map(project => (
                            <div key={project} className="text-gray-300 text-sm flex items-center">
                              <Code className="w-3 h-3 text-purple-400 mr-2" />
                              {project}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">Learning Resources</h4>
                        <div className="space-y-3">
                          {phase.resources.map((resource, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-white font-medium text-sm">{resource.title}</h5>
                                <Badge variant="outline" className="border-gray-500 text-gray-300 text-xs">
                                  {resource.type}
                                </Badge>
                              </div>
                              <div className="text-gray-400 text-xs">
                                {resource.provider} • {resource.duration}
                              </div>
                            </div>
                          ))}
                        </div>

                        <h4 className="text-white font-semibold mb-3 mt-4">Milestones</h4>
                        <div className="space-y-2">
                          {phase.milestones.map(milestone => (
                            <div key={milestone} className="text-gray-300 text-sm flex items-center">
                              <Target className="w-3 h-3 text-green-400 mr-2" />
                              {milestone}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;
