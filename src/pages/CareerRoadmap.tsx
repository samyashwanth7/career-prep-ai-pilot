
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Target, 
  BookOpen, 
  Code, 
  Trophy,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

interface Phase {
  id: string;
  name: string;
  duration: string;
  skills: string[];
  resources: { name: string; url: string; type: 'course' | 'article' | 'video' | 'practice' }[];
  projects: string[];
  milestone: string;
  completed: boolean;
  progress: number;
}

interface Roadmap {
  id: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  currentLevel: string;
  targetLevel: string;
  phases: Phase[];
  overallProgress: number;
  createdAt: string;
}

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(true);
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');

  const roleTemplates = {
    'frontend-developer': {
      phases: [
        {
          id: 'foundation',
          name: 'Foundation Phase',
          duration: '4-6 weeks',
          skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git/GitHub', 'Responsive Design'],
          resources: [
            { name: 'MDN Web Docs', url: '#', type: 'article' },
            { name: 'JavaScript30', url: '#', type: 'course' },
            { name: 'CSS Grid Garden', url: '#', type: 'practice' },
            { name: 'Git Tutorial', url: '#', type: 'video' }
          ],
          projects: ['Personal Portfolio', 'Landing Page', 'CSS Art Project'],
          milestone: 'Build a responsive portfolio website',
          completed: false,
          progress: 0
        },
        {
          id: 'frameworks',
          name: 'Framework Mastery',
          duration: '6-8 weeks',
          skills: ['React.js', 'Component Architecture', 'State Management', 'React Hooks', 'React Router'],
          resources: [
            { name: 'React Official Docs', url: '#', type: 'article' },
            { name: 'React Course', url: '#', type: 'course' },
            { name: 'React Patterns', url: '#', type: 'article' },
            { name: 'Hooks Deep Dive', url: '#', type: 'video' }
          ],
          projects: ['Todo App', 'Weather App', 'E-commerce Frontend'],
          milestone: 'Deploy a full React application',
          completed: false,
          progress: 0
        },
        {
          id: 'advanced',
          name: 'Advanced Development',
          duration: '8-10 weeks',
          skills: ['TypeScript', 'Testing (Jest/RTL)', 'Performance Optimization', 'Build Tools', 'State Management (Redux/Zustand)'],
          resources: [
            { name: 'TypeScript Handbook', url: '#', type: 'article' },
            { name: 'Testing Library', url: '#', type: 'course' },
            { name: 'Web Performance', url: '#', type: 'video' },
            { name: 'Redux Toolkit', url: '#', type: 'practice' }
          ],
          projects: ['Dashboard App', 'Real-time Chat', 'Progressive Web App'],
          milestone: 'Build production-ready applications',
          completed: false,
          progress: 0
        }
      ],
      difficulty: 'medium',
      estimatedTime: '18-24 weeks'
    },
    'data-scientist': {
      phases: [
        {
          id: 'foundation',
          name: 'Data Foundation',
          duration: '6-8 weeks',
          skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Statistics'],
          resources: [
            { name: 'Python for Data Science', url: '#', type: 'course' },
            { name: 'SQL Tutorial', url: '#', type: 'practice' },
            { name: 'Statistics Basics', url: '#', type: 'video' },
            { name: 'Pandas Cookbook', url: '#', type: 'article' }
          ],
          projects: ['Data Cleaning Project', 'SQL Analysis', 'Statistical Report'],
          milestone: 'Complete end-to-end data analysis',
          completed: false,
          progress: 0
        },
        {
          id: 'ml',
          name: 'Machine Learning',
          duration: '10-12 weeks',
          skills: ['Scikit-learn', 'Machine Learning Algorithms', 'Feature Engineering', 'Model Evaluation', 'Deep Learning Basics'],
          resources: [
            { name: 'Scikit-learn Guide', url: '#', type: 'article' },
            { name: 'ML Course', url: '#', type: 'course' },
            { name: 'Kaggle Learn', url: '#', type: 'practice' },
            { name: 'Deep Learning Intro', url: '#', type: 'video' }
          ],
          projects: ['Prediction Model', 'Classification Project', 'Neural Network'],
          milestone: 'Deploy ML model to production',
          completed: false,
          progress: 0
        },
        {
          id: 'advanced',
          name: 'Advanced Analytics',
          duration: '8-10 weeks',
          skills: ['TensorFlow/PyTorch', 'Big Data (Spark)', 'MLOps', 'Data Visualization', 'Cloud Platforms'],
          resources: [
            { name: 'TensorFlow Guide', url: '#', type: 'course' },
            { name: 'Apache Spark', url: '#', type: 'article' },
            { name: 'MLOps Practices', url: '#', type: 'video' },
            { name: 'Tableau/PowerBI', url: '#', type: 'practice' }
          ],
          projects: ['Deep Learning Model', 'Big Data Pipeline', 'ML Platform'],
          milestone: 'Build scalable ML infrastructure',
          completed: false,
          progress: 0
        }
      ],
      difficulty: 'hard',
      estimatedTime: '24-30 weeks'
    },
    'product-manager': {
      phases: [
        {
          id: 'foundation',
          name: 'PM Fundamentals',
          duration: '4-6 weeks',
          skills: ['Product Strategy', 'User Research', 'Market Analysis', 'Roadmapping', 'Metrics & KPIs'],
          resources: [
            { name: 'PM Handbook', url: '#', type: 'article' },
            { name: 'User Research Guide', url: '#', type: 'course' },
            { name: 'Product Metrics', url: '#', type: 'video' },
            { name: 'Roadmap Templates', url: '#', type: 'practice' }
          ],
          projects: ['Product Analysis', 'User Research Study', 'Feature Roadmap'],
          milestone: 'Create comprehensive product strategy',
          completed: false,
          progress: 0
        },
        {
          id: 'execution',
          name: 'Execution & Delivery',
          duration: '6-8 weeks',
          skills: ['Agile/Scrum', 'Stakeholder Management', 'Technical Understanding', 'Data Analysis', 'A/B Testing'],
          resources: [
            { name: 'Agile Methodology', url: '#', type: 'course' },
            { name: 'Stakeholder Management', url: '#', type: 'article' },
            { name: 'SQL for PMs', url: '#', type: 'practice' },
            { name: 'A/B Testing Guide', url: '#', type: 'video' }
          ],
          projects: ['Sprint Planning', 'Feature Launch', 'Metrics Dashboard'],
          milestone: 'Successfully launch a product feature',
          completed: false,
          progress: 0
        },
        {
          id: 'leadership',
          name: 'Strategic Leadership',
          duration: '6-8 weeks',
          skills: ['Strategic Thinking', 'Team Leadership', 'Business Strategy', 'Growth Hacking', 'Customer Success'],
          resources: [
            { name: 'Strategic Thinking', url: '#', type: 'course' },
            { name: 'Leadership Skills', url: '#', type: 'video' },
            { name: 'Growth Strategies', url: '#', type: 'article' },
            { name: 'Customer Success', url: '#', type: 'practice' }
          ],
          projects: ['Business Case', 'Growth Strategy', 'Team Leadership'],
          milestone: 'Drive significant business impact',
          completed: false,
          progress: 0
        }
      ],
      difficulty: 'medium',
      estimatedTime: '16-22 weeks'
    }
  };

  const availableRoles = [
    { id: 'frontend-developer', name: 'Frontend Developer', icon: '🎨' },
    { id: 'backend-developer', name: 'Backend Developer', icon: '⚙️' },
    { id: 'fullstack-developer', name: 'Full-Stack Developer', icon: '🔗' },
    { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
    { id: 'product-manager', name: 'Product Manager', icon: '🚀' },
    { id: 'ui-ux-designer', name: 'UI/UX Designer', icon: '🎭' },
    { id: 'devops-engineer', name: 'DevOps Engineer', icon: '🔧' },
    { id: 'mobile-developer', name: 'Mobile Developer', icon: '📱' }
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'HTML/CSS',
    'TypeScript', 'Java', 'C++', 'Machine Learning', 'Data Analysis',
    'Product Strategy', 'User Research', 'Design Thinking', 'Agile/Scrum',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL'
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load existing roadmap
    const savedRoadmap = localStorage.getItem(`roadmap_${JSON.parse(user).id}`);
    if (savedRoadmap) {
      setCurrentRoadmap(JSON.parse(savedRoadmap));
      setShowGenerator(false);
    }
  }, [navigate]);

  const generateRoadmap = () => {
    if (!selectedRole || !experience) {
      toast({
        title: "Missing Information",
        description: "Please select a role and experience level.",
        variant: "destructive"
      });
      return;
    }

    const template = roleTemplates[selectedRole as keyof typeof roleTemplates];
    if (!template) {
      toast({
        title: "Role Not Found",
        description: "Roadmap for this role is coming soon!",
        variant: "destructive"
      });
      return;
    }

    const roadmap: Roadmap = {
      id: Date.now().toString(),
      role: selectedRole,
      difficulty: template.difficulty,
      estimatedTime: template.estimatedTime,
      currentLevel: experience,
      targetLevel: selectedRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      phases: template.phases,
      overallProgress: 0,
      createdAt: new Date().toISOString()
    };

    // Adjust based on current skills
    roadmap.phases.forEach(phase => {
      const matchingSkills = phase.skills.filter(skill => 
        currentSkills.some(userSkill => 
          skill.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      phase.progress = Math.round((matchingSkills.length / phase.skills.length) * 100);
    });

    roadmap.overallProgress = Math.round(
      roadmap.phases.reduce((sum, phase) => sum + phase.progress, 0) / roadmap.phases.length
    );

    setCurrentRoadmap(roadmap);
    localStorage.setItem(`roadmap_${currentUser.id}`, JSON.stringify(roadmap));
    setShowGenerator(false);

    toast({
      title: "Roadmap Generated!",
      description: `Your personalized ${selectedRole.replace('-', ' ')} roadmap is ready.`
    });
  };

  const updatePhaseProgress = (phaseId: string, progress: number) => {
    if (!currentRoadmap) return;

    const updatedRoadmap = {
      ...currentRoadmap,
      phases: currentRoadmap.phases.map(phase =>
        phase.id === phaseId ? { ...phase, progress, completed: progress === 100 } : phase
      )
    };

    updatedRoadmap.overallProgress = Math.round(
      updatedRoadmap.phases.reduce((sum, phase) => sum + phase.progress, 0) / updatedRoadmap.phases.length
    );

    setCurrentRoadmap(updatedRoadmap);
    localStorage.setItem(`roadmap_${currentUser.id}`, JSON.stringify(updatedRoadmap));

    toast({
      title: "Progress Updated!",
      description: `Phase progress updated to ${progress}%`
    });
  };

  const resetRoadmap = () => {
    localStorage.removeItem(`roadmap_${currentUser.id}`);
    setCurrentRoadmap(null);
    setShowGenerator(true);
    setSelectedRole('');
    setCurrentSkills([]);
    setExperience('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (showGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Career Roadmap Generator</h1>
              <p className="text-gray-300">Create a personalized learning path for your dream role</p>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
            <div className="space-y-8">
              {/* Role Selection */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">What's your target role?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableRoles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedRole === role.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-2xl mb-2">{role.icon}</div>
                      <div className="text-white text-sm font-medium">{role.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Skills */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">What skills do you already have?</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setCurrentSkills(prev =>
                          prev.includes(skill)
                            ? prev.filter(s => s !== skill)
                            : [...prev, skill]
                        );
                      }}
                      className={`p-2 rounded text-sm transition-all ${
                        currentSkills.includes(skill)
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">What's your experience level?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'beginner', name: 'Beginner', desc: '0-1 years experience' },
                    { id: 'intermediate', name: 'Intermediate', desc: '1-3 years experience' },
                    { id: 'advanced', name: 'Advanced', desc: '3+ years experience' }
                  ].map(level => (
                    <button
                      key={level.id}
                      onClick={() => setExperience(level.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        experience === level.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-white font-medium">{level.name}</div>
                      <div className="text-gray-400 text-sm">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateRoadmap}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Generate My Roadmap
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white">
                {currentRoadmap?.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Roadmap
              </h1>
              <p className="text-gray-300">Your personalized learning path</p>
            </div>
          </div>
          <Button
            onClick={resetRoadmap}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Create New Roadmap
          </Button>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <div className="text-white font-semibold">Progress</div>
                <div className="text-2xl font-bold text-purple-400">{currentRoadmap?.overallProgress}%</div>
              </div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-cyan-400 mr-3" />
              <div>
                <div className="text-white font-semibold">Duration</div>
                <div className="text-lg font-bold text-cyan-400">{currentRoadmap?.estimatedTime}</div>
              </div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <div className="text-white font-semibold">Difficulty</div>
                <Badge className={`${
                  currentRoadmap?.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  currentRoadmap?.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {currentRoadmap?.difficulty?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <div className="text-white font-semibold">Phases</div>
                <div className="text-2xl font-bold text-green-400">{currentRoadmap?.phases.length}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-6">
          {currentRoadmap?.phases.map((phase, index) => (
            <Card key={phase.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    phase.completed ? 'bg-green-500' : phase.progress > 0 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {phase.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{phase.name}</h3>
                    <p className="text-gray-400">{phase.duration} • {phase.milestone}</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {phase.progress}% Complete
                </Badge>
              </div>

              <Progress value={phase.progress} className="mb-6" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skills */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Skills to Learn
                  </h4>
                  <div className="space-y-2">
                    {phase.skills.map(skill => (
                      <div key={skill} className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                        <span className="text-gray-300 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learning Resources
                  </h4>
                  <div className="space-y-2">
                    {phase.resources.map((resource, idx) => (
                      <div key={idx} className="flex items-center">
                        <Badge variant="outline" className="text-xs mr-2">
                          {resource.type}
                        </Badge>
                        <span className="text-gray-300 text-sm">{resource.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Practice Projects
                  </h4>
                  <div className="space-y-2">
                    {phase.projects.map(project => (
                      <div key={project} className="flex items-center">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                        <span className="text-gray-300 text-sm">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Controls */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Update Progress:</span>
                  {[25, 50, 75, 100].map(value => (
                    <Button
                      key={value}
                      size="sm"
                      variant={phase.progress >= value ? "default" : "outline"}
                      onClick={() => updatePhaseProgress(phase.id, value)}
                      className="text-xs"
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-500/10">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;
