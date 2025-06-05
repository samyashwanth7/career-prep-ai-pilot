
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Building,
  Users,
  Target,
  Clock,
  Mic,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Star,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  logo: string;
  culture: string[];
  values: string[];
  interviewStyle: string;
  avgSalary: string;
  difficulty: 'medium' | 'hard' | 'very-hard';
  industries: string[];
  commonQuestions: {
    technical: string[];
    behavioral: string[];
    cultural: string[];
    roleSpecific: string[];
  };
  interviewProcess: string[];
  tips: string[];
}

interface InterviewSession {
  id: string;
  companyId: string;
  role: string;
  type: 'technical' | 'behavioral' | 'cultural' | 'mixed';
  questions: string[];
  currentQuestion: number;
  recordings: string[];
  scores: number[];
  startTime: number;
  endTime?: number;
  feedback?: string;
}

const CompanyPractice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [userStats, setUserStats] = useState<any>({});

  const companies: Company[] = [
    {
      id: 'google',
      name: 'Google',
      logo: '🟡',
      culture: ['Innovation', 'Data-driven decisions', 'User focus', 'Collaboration'],
      values: ['Think big', 'Be bold', 'Do the right thing', 'Deliver results'],
      interviewStyle: 'Analytical and systematic approach with focus on problem-solving',
      avgSalary: '$180K - $350K',
      difficulty: 'very-hard',
      industries: ['Technology', 'AI/ML', 'Cloud Computing', 'Advertising'],
      commonQuestions: {
        technical: [
          'Design a URL shortener like bit.ly',
          'Implement LRU Cache',
          'How would you improve Google Search?',
          'Design YouTube\'s video streaming system',
          'Optimize a slow SQL query'
        ],
        behavioral: [
          'Tell me about a time you influenced without authority',
          'Describe a situation where you had to work with limited resources',
          'How do you handle ambiguous requirements?',
          'Tell me about a time you failed and what you learned'
        ],
        cultural: [
          'Why Google?',
          'How do you stay updated with technology trends?',
          'What would you do if you disagreed with your manager?',
          'How do you handle competing priorities?'
        ],
        roleSpecific: [
          'How would you approach A/B testing for a new feature?',
          'Explain how you would scale a system to handle 1B users',
          'What metrics would you track for a new product launch?'
        ]
      },
      interviewProcess: [
        'Initial Recruiter Screen (30 min)',
        'Technical Phone Interview (45 min)',
        'Virtual Onsite (4-5 rounds)',
        'Hiring Committee Review',
        'Final Executive Review'
      ],
      tips: [
        'Focus on scalability and efficiency',
        'Use data to support your answers',
        'Think out loud during problem-solving',
        'Ask clarifying questions',
        'Prepare for Googleyness & Leadership questions'
      ]
    },
    {
      id: 'meta',
      name: 'Meta (Facebook)',
      logo: '🔵',
      culture: ['Move fast', 'Be bold', 'Focus on impact', 'Be open'],
      values: ['Build social value', 'Move fast', 'Be bold', 'Focus on impact'],
      interviewStyle: 'Product-focused with emphasis on user impact and execution',
      avgSalary: '$170K - $320K',
      difficulty: 'very-hard',
      industries: ['Social Media', 'VR/AR', 'AI/ML', 'Messaging'],
      commonQuestions: {
        technical: [
          'Design Facebook News Feed',
          'How would you detect fake accounts?',
          'Design a chat system for 3 billion users',
          'Implement a recommendation algorithm',
          'How would you reduce app loading time?'
        ],
        behavioral: [
          'Tell me about a time you influenced without authority',
          'Describe a time you had to make a decision with incomplete information',
          'How do you handle feedback and criticism?',
          'Tell me about a time you challenged the status quo'
        ],
        cultural: [
          'Why Meta?',
          'How do you approach building in public?',
          'What does "move fast and break things" mean to you?',
          'How do you balance innovation with stability?'
        ],
        roleSpecific: [
          'How would you improve Instagram engagement?',
          'Design a feature to increase user retention',
          'How would you measure the success of WhatsApp?'
        ]
      },
      interviewProcess: [
        'Recruiter Screen (30 min)',
        'Technical Screen (45 min)',
        'Virtual Onsite (4-6 rounds)',
        'Cross-functional Review',
        'Final Decision'
      ],
      tips: [
        'Emphasize user impact and metrics',
        'Show passion for connecting people',
        'Demonstrate growth mindset',
        'Be prepared for product design questions',
        'Focus on execution and delivery'
      ]
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: '🟠',
      culture: ['Customer obsession', 'Ownership', 'Invent and simplify', 'High standards'],
      values: ['Leadership Principles', 'Customer first', 'Long-term thinking', 'Frugality'],
      interviewStyle: 'Behavioral interviews based on 14 Leadership Principles',
      avgSalary: '$160K - $300K',
      difficulty: 'hard',
      industries: ['E-commerce', 'Cloud Computing', 'Logistics', 'AI/ML'],
      commonQuestions: {
        technical: [
          'Design Amazon\'s recommendation system',
          'How would you handle peak traffic during Prime Day?',
          'Design a distributed cache system',
          'Optimize warehouse logistics system',
          'Design Amazon\'s search functionality'
        ],
        behavioral: [
          'Tell me about a time you had to make a difficult decision',
          'Describe a situation where you exceeded customer expectations',
          'How do you handle tight deadlines?',
          'Tell me about a time you failed to meet a commitment'
        ],
        cultural: [
          'Why Amazon?',
          'How do you embody customer obsession?',
          'Describe your approach to innovation',
          'How do you handle ambiguity?'
        ],
        roleSpecific: [
          'How would you improve the checkout experience?',
          'Design a system for real-time inventory management',
          'How would you reduce delivery times?'
        ]
      },
      interviewProcess: [
        'Initial Screen (30 min)',
        'Technical Assessment',
        'Virtual Onsite (5-7 rounds)',
        'Bar Raiser Interview',
        'Final Review'
      ],
      tips: [
        'Prepare STAR format examples for all 14 Leadership Principles',
        'Focus on customer impact',
        'Show ownership and accountability',
        'Demonstrate data-driven decision making',
        'Be prepared for deep technical discussions'
      ]
    },
    {
      id: 'apple',
      name: 'Apple',
      logo: '🍎',
      culture: ['Innovation', 'Attention to detail', 'Privacy', 'Quality'],
      values: ['Think different', 'Simplicity', 'Excellence', 'Privacy by design'],
      interviewStyle: 'Deep technical discussions with focus on attention to detail',
      avgSalary: '$170K - $330K',
      difficulty: 'very-hard',
      industries: ['Consumer Electronics', 'Software', 'Services', 'Hardware'],
      commonQuestions: {
        technical: [
          'How would you improve Siri?',
          'Design the iPhone\'s camera software',
          'Optimize battery life for iOS',
          'Design a secure payment system',
          'How would you handle privacy in data collection?'
        ],
        behavioral: [
          'Tell me about a time you paid attention to the smallest details',
          'Describe a project where you exceeded expectations',
          'How do you handle working under pressure?',
          'Tell me about a time you disagreed with a design decision'
        ],
        cultural: [
          'Why Apple?',
          'How do you approach design thinking?',
          'What does privacy mean to you?',
          'How do you balance innovation with usability?'
        ],
        roleSpecific: [
          'How would you design the next iPhone feature?',
          'Improve the App Store discovery experience',
          'Design a new Apple service'
        ]
      },
      interviewProcess: [
        'Recruiter Call (30 min)',
        'Technical Phone Screen (60 min)',
        'Onsite Interviews (4-6 rounds)',
        'Team Matching',
        'Final Approval'
      ],
      tips: [
        'Demonstrate passion for Apple products',
        'Show attention to detail in everything',
        'Focus on user experience',
        'Be prepared for deep technical questions',
        'Emphasize quality over quantity'
      ]
    }
  ];

  const roles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Product Manager',
    'Data Scientist',
    'Engineering Manager',
    'UX Designer',
    'DevOps Engineer',
    'Machine Learning Engineer'
  ];

  const interviewTypes = [
    { id: 'technical', name: 'Technical Interview', description: 'Coding and system design' },
    { id: 'behavioral', name: 'Behavioral Interview', description: 'Leadership and culture fit' },
    { id: 'cultural', name: 'Cultural Fit', description: 'Company values alignment' },
    { id: 'mixed', name: 'Mixed Round', description: 'Combination of all types' }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load user stats
    const stats = localStorage.getItem(`company_practice_stats_${JSON.parse(user).id}`);
    if (stats) {
      setUserStats(JSON.parse(stats));
    }
  }, [navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session && timeLeft > 0 && isRecording) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isRecording, session]);

  const startSession = async () => {
    if (!selectedCompany || !selectedRole || !interviewType) {
      toast({
        title: "Missing Information",
        description: "Please select company, role, and interview type.",
        variant: "destructive"
      });
      return;
    }

    const questions = generateQuestions(selectedCompany, interviewType);
    const newSession: InterviewSession = {
      id: `session_${Date.now()}`,
      companyId: selectedCompany.id,
      role: selectedRole,
      type: interviewType as any,
      questions,
      currentQuestion: 0,
      recordings: [],
      scores: [],
      startTime: Date.now()
    };

    setSession(newSession);
    setTimeLeft(120);

    toast({
      title: "Interview Started!",
      description: `Starting ${selectedCompany.name} ${interviewType} interview.`
    });
  };

  const generateQuestions = (company: Company, type: string): string[] => {
    const questionBank = company.commonQuestions;
    let questions: string[] = [];

    switch (type) {
      case 'technical':
        questions = [...questionBank.technical].sort(() => 0.5 - Math.random()).slice(0, 5);
        break;
      case 'behavioral':
        questions = [...questionBank.behavioral].sort(() => 0.5 - Math.random()).slice(0, 5);
        break;
      case 'cultural':
        questions = [...questionBank.cultural].sort(() => 0.5 - Math.random()).slice(0, 5);
        break;
      case 'mixed':
        questions = [
          ...questionBank.technical.slice(0, 2),
          ...questionBank.behavioral.slice(0, 2),
          ...questionBank.cultural.slice(0, 1)
        ].sort(() => 0.5 - Math.random());
        break;
    }

    return questions;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (session) {
            const updatedSession = { ...session };
            updatedSession.recordings[session.currentQuestion] = reader.result as string;
            setSession(updatedSession);
          }
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTimeLeft(120);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);

      toast({
        title: "Recording Saved",
        description: "Your answer has been recorded successfully."
      });
    }
  };

  const nextQuestion = () => {
    if (session && session.currentQuestion < session.questions.length - 1) {
      const updatedSession = { ...session };
      updatedSession.currentQuestion += 1;
      setSession(updatedSession);
      setTimeLeft(120);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    if (!session) return;

    const completedSession = {
      ...session,
      endTime: Date.now(),
      feedback: generateFeedback(session)
    };

    // Save session
    const sessions = JSON.parse(localStorage.getItem(`company_sessions_${currentUser.id}`) || '[]');
    sessions.push(completedSession);
    localStorage.setItem(`company_sessions_${currentUser.id}`, JSON.stringify(sessions));

    // Update stats
    const newStats = { ...userStats };
    if (!newStats[selectedCompany!.id]) {
      newStats[selectedCompany!.id] = { sessions: 0, avgScore: 0, bestScore: 0 };
    }
    newStats[selectedCompany!.id].sessions += 1;
    
    const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
    newStats[selectedCompany!.id].avgScore = Math.round(
      ((newStats[selectedCompany!.id].avgScore * (newStats[selectedCompany!.id].sessions - 1)) + mockScore) / 
      newStats[selectedCompany!.id].sessions
    );
    newStats[selectedCompany!.id].bestScore = Math.max(newStats[selectedCompany!.id].bestScore, mockScore);

    setUserStats(newStats);
    localStorage.setItem(`company_practice_stats_${currentUser.id}`, JSON.stringify(newStats));

    setSession(null);
    toast({
      title: "Interview Complete!",
      description: `You scored ${mockScore}/100. Check your feedback below.`
    });
  };

  const generateFeedback = (session: InterviewSession): string => {
    const tips = [
      "Great job structuring your answers using the STAR method",
      "Consider adding more specific metrics to your examples",
      "Your technical explanations were clear and well-articulated",
      "Work on reducing filler words and pauses",
      "Excellent demonstration of problem-solving skills"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
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
              <h1 className="text-3xl font-bold text-white">Company-Specific Practice</h1>
              <p className="text-gray-300">Prepare for top tech companies with realistic simulations</p>
            </div>
          </div>
        </div>

        {session ? (
          // Interview Session View
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{companies.find(c => c.id === session.companyId)?.logo}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {companies.find(c => c.id === session.companyId)?.name} Interview
                    </h2>
                    <p className="text-gray-300">{session.role} - {session.type} Round</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    Question {session.currentQuestion + 1} of {session.questions.length}
                  </div>
                  <div className={`text-lg font-bold ${timeLeft < 30 ? 'text-red-400' : 'text-cyan-400'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              <Progress value={(session.currentQuestion / session.questions.length) * 100} />
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {session.questions[session.currentQuestion]}
                </h3>
                <p className="text-gray-300">
                  Take your time to think, then click record when ready. You have 2 minutes to answer.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                )}

                {session.recordings[session.currentQuestion] && (
                  <Button
                    onClick={nextQuestion}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4"
                  >
                    {session.currentQuestion < session.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                  </Button>
                )}
              </div>

              {isRecording && (
                <div className="text-center mt-4">
                  <div className="text-red-400 animate-pulse">● Recording in progress...</div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          // Company Selection View
          <div className="space-y-8">
            {/* Company Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {companies.map(company => (
                <Card 
                  key={company.id} 
                  className={`bg-white/10 backdrop-blur-lg border-white/20 p-6 cursor-pointer transition-all ${
                    selectedCompany?.id === company.id ? 'border-purple-500 bg-purple-500/20' : 'hover:bg-white/15'
                  }`}
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{company.logo}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{company.name}</h3>
                        <p className="text-gray-300 text-sm">{company.avgSalary}</p>
                      </div>
                    </div>
                    <Badge className={`${
                      company.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      company.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {company.difficulty.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{company.interviewStyle}</p>

                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Core Values</h4>
                    <div className="flex flex-wrap gap-1">
                      {company.values.slice(0, 3).map(value => (
                        <Badge key={value} variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {userStats[company.id] && (
                    <div className="border-t border-white/20 pt-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-cyan-400">{userStats[company.id].sessions}</div>
                          <div className="text-xs text-gray-400">Sessions</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">{userStats[company.id].avgScore}</div>
                          <div className="text-xs text-gray-400">Avg Score</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-400">{userStats[company.id].bestScore}</div>
                          <div className="text-xs text-gray-400">Best Score</div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {selectedCompany && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Role Selection */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Select Role</h3>
                    <div className="space-y-2">
                      {roles.map(role => (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`w-full p-3 text-left rounded border transition-all ${
                            selectedRole === role
                              ? 'border-purple-500 bg-purple-500/20 text-white'
                              : 'border-white/20 text-gray-300 hover:border-white/40'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interview Type */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Interview Type</h3>
                    <div className="space-y-3">
                      {interviewTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setInterviewType(type.id)}
                          className={`w-full p-3 text-left rounded border transition-all ${
                            interviewType === type.id
                              ? 'border-cyan-500 bg-cyan-500/20 text-white'
                              : 'border-white/20 text-gray-300 hover:border-white/40'
                          }`}
                        >
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-gray-400">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Company Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Interview Process</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          {selectedCompany.interviewProcess.map((step, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-yellow-400 font-medium mb-2">Success Tips</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          {selectedCompany.tips.slice(0, 3).map((tip, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 mt-1"></div>
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={startSession}
                    disabled={!selectedRole || !interviewType}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start {selectedCompany.name} Interview
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPractice;
