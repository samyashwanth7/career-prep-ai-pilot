
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Target,
  Clock,
  BookOpen,
  Code,
  CheckCircle,
  Play,
  Award,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Resource {
  name: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'practice';
}

interface Phase {
  id: string;
  name: string;
  duration: string;
  skills: string[];
  resources: Resource[];
  projects: string[];
  milestone: string;
  completed: boolean;
  progress: number;
}

interface Roadmap {
  id: string;
  targetRole: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedWeeks: number;
  currentPhase: number;
  overallProgress: number;
  phases: Phase[];
  createdAt: string;
}

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const roles = [
    { id: 'frontend-developer', name: 'Frontend Developer', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
    { id: 'backend-developer', name: 'Backend Developer', skills: ['Node.js', 'Python', 'APIs', 'Databases'] },
    { id: 'fullstack-developer', name: 'Full Stack Developer', skills: ['Frontend', 'Backend', 'DevOps'] },
    { id: 'data-scientist', name: 'Data Scientist', skills: ['Python', 'Statistics', 'ML', 'SQL'] },
    { id: 'product-manager', name: 'Product Manager', skills: ['Strategy', 'Analytics', 'Leadership'] },
    { id: 'devops-engineer', name: 'DevOps Engineer', skills: ['AWS', 'Docker', 'CI/CD', 'Monitoring'] },
    { id: 'ui-ux-designer', name: 'UI/UX Designer', skills: ['Figma', 'Design Thinking', 'Prototyping'] }
  ];

  const experienceLevels = [
    { id: 'beginner', name: 'Beginner', description: 'New to the field' },
    { id: 'intermediate', name: 'Intermediate', description: '1-3 years experience' },
    { id: 'advanced', name: 'Advanced', description: '3+ years experience' }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load saved roadmap
    const savedRoadmap = localStorage.getItem(`roadmap_${JSON.parse(user).id}`);
    if (savedRoadmap) {
      setRoadmap(JSON.parse(savedRoadmap));
    }
  }, [navigate]);

  const generateRoadmapPhases = (role: string, experience: string): Phase[] => {
    const roadmapTemplates = {
      'frontend-developer': {
        beginner: [
          {
            id: 'foundation',
            name: 'Web Fundamentals',
            duration: '4-6 weeks',
            skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git/GitHub', 'Responsive Design'],
            resources: [
              { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'article' as const },
              { name: 'FreeCodeCamp', url: 'https://freecodecamp.org', type: 'course' as const },
              { name: 'JavaScript30', url: 'https://javascript30.com', type: 'practice' as const }
            ],
            projects: ['Personal Portfolio Website', 'Responsive Landing Page', 'JavaScript Calculator'],
            milestone: 'Build and deploy your first interactive website',
            completed: false,
            progress: 0
          },
          {
            id: 'frameworks',
            name: 'React Development',
            duration: '6-8 weeks', 
            skills: ['React.js', 'JSX', 'Components', 'State Management', 'React Router'],
            resources: [
              { name: 'React Documentation', url: 'https://react.dev', type: 'article' as const },
              { name: 'React Tutorial', url: 'https://react.dev/tutorial', type: 'course' as const },
              { name: 'React Challenges', url: 'https://reactjs.org/tutorial', type: 'practice' as const }
            ],
            projects: ['Todo App with React', 'Weather Dashboard', 'E-commerce Product Page'],
            milestone: 'Build a complete React application with routing',
            completed: false,
            progress: 0
          },
          {
            id: 'advanced',
            name: 'Advanced Frontend',
            duration: '4-6 weeks',
            skills: ['TypeScript', 'Testing (Jest)', 'State Management (Redux)', 'Performance Optimization'],
            resources: [
              { name: 'TypeScript Handbook', url: 'https://typescriptlang.org', type: 'article' as const },
              { name: 'Testing Library', url: 'https://testing-library.com', type: 'course' as const },
              { name: 'Redux Toolkit', url: 'https://redux-toolkit.js.org', type: 'practice' as const }
            ],
            projects: ['TypeScript React App', 'Tested Component Library', 'Redux State Management'],
            milestone: 'Deploy a production-ready application with tests',
            completed: false,
            progress: 0
          }
        ],
        intermediate: [
          {
            id: 'modern-react',
            name: 'Modern React Patterns',
            duration: '3-4 weeks',
            skills: ['React Hooks', 'Context API', 'Custom Hooks', 'Performance Optimization'],
            resources: [
              { name: 'React Hooks Guide', url: 'https://react.dev/hooks', type: 'article' as const },
              { name: 'Advanced React Patterns', url: 'https://kentcdodds.com', type: 'course' as const }
            ],
            projects: ['Custom Hook Library', 'Performance-Optimized Dashboard'],
            milestone: 'Master modern React patterns and optimization',
            completed: false,
            progress: 0
          }
        ]
      },
      'data-scientist': {
        beginner: [
          {
            id: 'python-basics',
            name: 'Python & Statistics Foundation',
            duration: '6-8 weeks',
            skills: ['Python Programming', 'NumPy', 'Pandas', 'Statistics', 'Data Visualization'],
            resources: [
              { name: 'Python.org Tutorial', url: 'https://python.org', type: 'course' as const },
              { name: 'Pandas Documentation', url: 'https://pandas.pydata.org', type: 'article' as const },
              { name: 'Kaggle Learn', url: 'https://kaggle.com/learn', type: 'practice' as const }
            ],
            projects: ['Data Analysis Project', 'Statistical Report', 'Visualization Dashboard'],
            milestone: 'Complete your first data analysis project',
            completed: false,
            progress: 0
          }
        ]
      }
    };

    const template = roadmapTemplates[role as keyof typeof roadmapTemplates];
    return template?.[experience as keyof typeof template] || [];
  };

  const generateRoadmap = () => {
    if (!selectedRole || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please select both a target role and experience level.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const phases = generateRoadmapPhases(selectedRole, experienceLevel);
      const difficulty = experienceLevel === 'beginner' ? 'easy' : 
                        experienceLevel === 'intermediate' ? 'medium' : 'hard' as const;
      
      const newRoadmap: Roadmap = {
        id: `roadmap_${Date.now()}`,
        targetRole: selectedRole,
        difficulty,
        estimatedWeeks: phases.reduce((total, phase) => {
          const weeks = parseInt(phase.duration.split('-')[0]);
          return total + weeks;
        }, 0),
        currentPhase: 0,
        overallProgress: 0,
        phases,
        createdAt: new Date().toISOString()
      };

      setRoadmap(newRoadmap);
      setIsGenerating(false);

      // Save roadmap
      localStorage.setItem(`roadmap_${currentUser.id}`, JSON.stringify(newRoadmap));

      toast({
        title: "Roadmap Generated!",
        description: `Your ${selectedRole.replace('-', ' ')} roadmap is ready.`
      });
    }, 2000);
  };

  const updatePhaseProgress = (phaseIndex: number, progress: number) => {
    if (!roadmap) return;

    const updatedRoadmap = { ...roadmap };
    updatedRoadmap.phases[phaseIndex].progress = progress;
    updatedRoadmap.phases[phaseIndex].completed = progress === 100;
    
    // Update overall progress
    const totalProgress = updatedRoadmap.phases.reduce((sum, phase) => sum + phase.progress, 0);
    updatedRoadmap.overallProgress = Math.round(totalProgress / updatedRoadmap.phases.length);

    setRoadmap(updatedRoadmap);
    localStorage.setItem(`roadmap_${currentUser.id}`, JSON.stringify(updatedRoadmap));

    if (progress === 100) {
      toast({
        title: "Phase Completed!",
        description: `Congratulations on completing ${updatedRoadmap.phases[phaseIndex].name}!`
      });
    }
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
              <h1 className="text-3xl font-bold text-white">Career Roadmap</h1>
              <p className="text-gray-300">Your personalized learning journey</p>
            </div>
          </div>
        </div>

        {!roadmap ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Select Your Target Role</h2>
              <div className="space-y-3">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedRole === role.id
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {role.skills.join(' • ')}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Experience Level */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Your Experience Level</h2>
              <div className="space-y-3">
                {experienceLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      experienceLevel === level.id
                        ? 'border-cyan-500 bg-cyan-500/20 text-white'
                        : 'border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-medium">{level.name}</div>
                    <div className="text-sm text-gray-400">{level.description}</div>
                  </button>
                ))}
              </div>

              <Button
                onClick={generateRoadmap}
                disabled={isGenerating || !selectedRole || !experienceLevel}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                {isGenerating ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Generate My Roadmap
                  </>
                )}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Roadmap Overview */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{roadmap.estimatedWeeks}</div>
                  <div className="text-gray-300">Weeks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{roadmap.phases.length}</div>
                  <div className="text-gray-300">Phases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{roadmap.overallProgress}%</div>
                  <div className="text-gray-300">Complete</div>
                </div>
                <div className="text-center">
                  <Badge className={`${
                    roadmap.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    roadmap.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {roadmap.difficulty.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <Progress value={roadmap.overallProgress} className="mt-4" />
            </Card>

            {/* Roadmap Phases */}
            <div className="space-y-6">
              {roadmap.phases.map((phase, index) => (
                <Card key={phase.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        phase.completed ? 'bg-green-500' : phase.progress > 0 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {phase.completed ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{phase.name}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {phase.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{phase.progress}%</div>
                      <Button
                        onClick={() => {
                          const newProgress = phase.progress === 100 ? 0 : 
                                           phase.progress >= 75 ? 100 :
                                           phase.progress >= 50 ? 75 :
                                           phase.progress >= 25 ? 50 : 25;
                          updatePhaseProgress(index, newProgress);
                        }}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 mt-2"
                      >
                        Update Progress
                      </Button>
                    </div>
                  </div>

                  <Progress value={phase.progress} className="mb-4" />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Skills */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Code className="w-4 h-4 mr-2" />
                        Skills to Learn
                      </h4>
                      <div className="space-y-1">
                        {phase.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="border-purple-500/30 text-purple-400 mr-2 mb-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learning Resources
                      </h4>
                      <div className="space-y-2">
                        {phase.resources.map((resource, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              resource.type === 'article' ? 'bg-blue-400' :
                              resource.type === 'video' ? 'bg-red-400' :
                              resource.type === 'course' ? 'bg-green-400' : 'bg-yellow-400'
                            }`}></div>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                               className="text-gray-300 hover:text-white transition-colors">
                              {resource.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Practice Projects
                      </h4>
                      <div className="space-y-1">
                        {phase.projects.map(project => (
                          <div key={project} className="text-sm text-gray-300">
                            • {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Milestone */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-white font-medium">Milestone: </span>
                      <span className="text-gray-300 ml-1">{phase.milestone}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;
