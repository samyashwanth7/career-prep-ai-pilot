import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import InterviewSetup from '@/components/interview/InterviewSetup';
import InterviewSession from '@/components/interview/InterviewSession';
import InterviewFeedback from '@/components/interview/InterviewFeedback';
import InterviewHistory from '@/components/interview/InterviewHistory';
import InterviewComplete from '@/components/interview/InterviewComplete';

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  style: string;
  icon: React.ReactNode;
  color: string;
  traits: string[];
}

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'situational';
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  personalityContext?: string;
}

interface InterviewSession {
  id: string;
  category: string;
  questionText: string;
  transcription: string;
  overallScore: number;
  duration: number;
  date: string;
  feedback: {
    specificity: number;
    relevance: number;
    impact: number;
    structure: number;
    suggestions: string[];
  };
}

const Interview = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'setup' | 'interview' | 'feedback' | 'history'>('setup');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [liveConfidence, setLiveConfidence] = useState(75);
  const [eyeContactScore, setEyeContactScore] = useState(80);
  const [speechClarityScore, setSpeechClarityScore] = useState(85);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const aiPersonalities: AIPersonality[] = [
    {
      id: 'professional',
      name: 'Professional Alex',
      description: 'Formal, structured approach with detailed feedback',
      style: 'Direct and thorough questioning style',
      icon: <User className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      traits: ['Formal', 'Detailed', 'Structured', 'Analytical']
    },
    {
      id: 'friendly',
      name: 'Friendly Sam',
      description: 'Warm, encouraging style that builds confidence',
      style: 'Supportive and conversational approach',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      traits: ['Encouraging', 'Warm', 'Patient', 'Supportive']
    },
    {
      id: 'technical',
      name: 'Technical Morgan',
      description: 'Deep technical focus with challenging questions',
      style: 'Technical depth and problem-solving focus',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600',
      traits: ['Technical', 'Challenging', 'Precise', 'Deep']
    },
    {
      id: 'executive',
      name: 'Executive Jordan',
      description: 'Senior-level scenarios and strategic thinking',
      style: 'High-level strategic and leadership focus',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      traits: ['Strategic', 'Leadership', 'Vision', 'Results']
    }
  ];

  // Generate questions based on selected category
  const generateQuestionsForCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];

    // Sample questions for each category - in a real app, these would come from a database
    const questionBank = {
      behavioral: [
        {
          id: '1',
          text: 'Tell me about a time you overcame a significant challenge at work.',
          type: 'behavioral' as const,
          timeLimit: 120,
          difficulty: 'medium' as const,
          personalityContext: 'Focus on the specific actions you took and the results you achieved.'
        },
        {
          id: '2',
          text: 'Describe a situation where you had to work with a difficult team member.',
          type: 'behavioral' as const,
          timeLimit: 120,
          difficulty: 'medium' as const,
          personalityContext: 'Show me your interpersonal and conflict resolution skills.'
        }
      ],
      technical: [
        {
          id: '3',
          text: 'Explain the difference between SQL and NoSQL databases and when you would use each.',
          type: 'technical' as const,
          timeLimit: 120,
          difficulty: 'hard' as const,
          personalityContext: 'Walk me through your technical reasoning and provide specific examples.'
        },
        {
          id: '4',
          text: 'How would you optimize a slow-performing web application?',
          type: 'technical' as const,
          timeLimit: 120,
          difficulty: 'hard' as const,
          personalityContext: 'Consider both frontend and backend optimization strategies.'
        }
      ],
      situational: [
        {
          id: '5',
          text: 'How would you handle a tight deadline with limited resources?',
          type: 'situational' as const,
          timeLimit: 120,
          difficulty: 'medium' as const,
          personalityContext: 'Show me your prioritization and problem-solving approach.'
        }
      ],
      communication: [
        {
          id: '6',
          text: 'How do you explain complex technical concepts to non-technical stakeholders?',
          type: 'situational' as const,
          timeLimit: 120,
          difficulty: 'easy' as const,
          personalityContext: 'Demonstrate your communication adaptation skills.'
        }
      ],
      'problem-solving': [
        {
          id: '7',
          text: 'Walk me through your process for approaching an unfamiliar technical problem.',
          type: 'technical' as const,
          timeLimit: 120,
          difficulty: 'hard' as const,
          personalityContext: 'Show me your analytical thinking and methodology.'
        }
      ],
      'goals-motivation': [
        {
          id: '8',
          text: 'Where do you see yourself in 5 years and how does this role fit into your career goals?',
          type: 'behavioral' as const,
          timeLimit: 120,
          difficulty: 'easy' as const,
          personalityContext: 'Help me understand your career vision and motivation.'
        }
      ]
    };

    return questionBank[categoryId as keyof typeof questionBank] || [];
  };

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  // Simulate real-time confidence and metrics updates
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setLiveConfidence(prev => Math.max(40, Math.min(100, prev + (Math.random() - 0.5) * 10)));
        setEyeContactScore(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 8)));
        setSpeechClarityScore(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 6)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const startInterview = () => {
    if (!selectedCategory || !selectedPersonality) return;
    
    const categoryQuestions = generateQuestionsForCategory(selectedCategory);
    setQuestions(categoryQuestions);
    setCurrentView('interview');
    setTimeLeft(120);
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        saveCurrentResponse();
      };
      
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  };

  const startRecording = async () => {
    if (!mediaRecorder) {
      const accessGranted = await requestMicrophoneAccess();
      if (!accessGranted) return;
    }
    
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const generateMockTranscription = () => {
    const mockTranscriptions = [
      "In my previous role as a software engineer, I faced a challenging situation where our main database server went down during peak hours. The situation required immediate action as it was affecting thousands of users. My task was to restore service while minimizing data loss. I quickly assembled a team, implemented our disaster recovery protocol, and coordinated with the infrastructure team to switch to our backup systems. As a result, we restored service within 45 minutes and prevented any data loss, which was much faster than our target recovery time of 2 hours.",
      "I believe the key difference between SQL and NoSQL databases lies in their structure and use cases. SQL databases like PostgreSQL use a structured, tabular format with predefined schemas, making them ideal for complex relationships and ACID transactions. NoSQL databases like MongoDB offer more flexibility with document-based storage, making them better for rapid scaling and handling unstructured data. In my experience, I've used SQL for financial applications where data integrity is crucial, and NoSQL for content management systems where scalability and flexibility are priorities.",
      "When facing tight deadlines with limited resources, I start by clearly defining the scope and identifying the must-have versus nice-to-have features. I prioritize tasks based on impact and effort required, communicate transparently with stakeholders about what's realistic, and look for opportunities to leverage existing solutions or automate repetitive tasks. In one project, I had to deliver a client portal in half the expected time, so I used a pre-built framework and focused on core functionality first, delivering a working solution on time while planning phase-two enhancements."
    ];
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  };

  const generateMockFeedback = (questionType: string, transcription: string) => {
    const baseMetrics = {
      specificity: Math.floor(Math.random() * 30) + 65,
      relevance: Math.floor(Math.random() * 25) + 70,
      impact: Math.floor(Math.random() * 35) + 60,
      structure: Math.floor(Math.random() * 25) + 70,
      starMethod: {
        situation: transcription.toLowerCase().includes('situation') || transcription.toLowerCase().includes('faced'),
        task: transcription.toLowerCase().includes('task') || transcription.toLowerCase().includes('required'),
        action: transcription.toLowerCase().includes('action') || transcription.toLowerCase().includes('implemented'),
        result: transcription.toLowerCase().includes('result') || transcription.toLowerCase().includes('achieved'),
        score: 0
      },
      fluency: {
        pauseCount: Math.floor(Math.random() * 5) + 1,
        hesitations: Math.floor(Math.random() * 3) + 1,
        overallFlow: 'Smooth' as 'Smooth' | 'Some hesitations' | 'Choppy'
      },
      overallScore: 0
    };

    // Calculate STAR method score
    const starCount = Object.values(baseMetrics.starMethod).slice(0, 4).filter(Boolean).length;
    baseMetrics.starMethod.score = (starCount / 4) * 100;

    // Calculate overall score
    baseMetrics.overallScore = Math.round(
      (baseMetrics.specificity + baseMetrics.relevance + baseMetrics.impact + baseMetrics.structure) / 4
    );

    const suggestions = [
      "Try to include more specific metrics and numbers to quantify your achievements.",
      "Structure your response using the STAR method for better clarity.",
      "Consider adding more details about the challenges you overcame.",
      "Explain the long-term impact or lessons learned from this experience."
    ];

    return {
      metrics: baseMetrics,
      suggestions: suggestions.slice(0, Math.floor(Math.random() * 2) + 2)
    };
  };

  const saveCurrentResponse = async () => {
    if (audioChunks.length === 0) return;
    
    // Generate mock transcription and feedback
    const transcription = generateMockTranscription();
    const feedback = generateMockFeedback(questions[currentQuestionIndex].type, transcription);
    
    setCurrentTranscription(transcription);
    setCurrentFeedback({
      questionText: questions[currentQuestionIndex].text,
      transcription,
      duration: 120 - timeLeft,
      ...feedback,
      questionType: questions[currentQuestionIndex].type
    });

    // Save to localStorage for history
    const session: InterviewSession = {
      id: Date.now().toString(),
      category: selectedCategory,
      questionText: questions[currentQuestionIndex].text,
      transcription,
      overallScore: feedback.metrics.overallScore,
      duration: 120 - timeLeft,
      date: new Date().toISOString(),
      feedback: {
        specificity: feedback.metrics.specificity,
        relevance: feedback.metrics.relevance,
        impact: feedback.metrics.impact,
        structure: feedback.metrics.structure,
        suggestions: feedback.suggestions
      }
    };

    const existingSessions = JSON.parse(localStorage.getItem(`interview_history_${currentUser.id}`) || '[]');
    existingSessions.push(session);
    localStorage.setItem(`interview_history_${currentUser.id}`, JSON.stringify(existingSessions));
    
    setCurrentView('feedback');
    setAudioChunks([]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(120);
      setCurrentView('interview');
      setCurrentFeedback(null);
    } else {
      setSessionComplete(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalityById = (id: string) => {
    return aiPersonalities.find(p => p.id === id);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <InterviewComplete
          questionsLength={questions.length}
          selectedPersonality={selectedPersonality}
          onViewHistory={() => setCurrentView('history')}
          onPracticeAgain={() => window.location.reload()}
          getPersonalityById={getPersonalityById}
        />
        <AIAssistant context="interview-complete" />
      </div>
    );
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
            <div>
              <h1 className="text-xl font-bold text-white">AI Interview Practice</h1>
              <p className="text-sm text-gray-400">Advanced interview coaching with detailed feedback</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => setCurrentView('history')}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {currentView === 'setup' && (
          <InterviewSetup
            selectedCategory={selectedCategory}
            selectedPersonality={selectedPersonality}
            onCategorySelect={setSelectedCategory}
            onPersonalitySelect={setSelectedPersonality}
            onStartInterview={startInterview}
          />
        )}

        {currentView === 'interview' && (
          <InterviewSession
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
            timeLeft={timeLeft}
            isRecording={isRecording}
            liveConfidence={liveConfidence}
            eyeContactScore={eyeContactScore}
            speechClarityScore={speechClarityScore}
            selectedCategory={selectedCategory}
            selectedPersonality={selectedPersonality}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            getPersonalityById={getPersonalityById}
          />
        )}

        {currentView === 'feedback' && currentFeedback && (
          <div className="space-y-6">
            <InterviewFeedback
              questionText={currentFeedback.questionText}
              transcription={currentFeedback.transcription}
              duration={currentFeedback.duration}
              metrics={currentFeedback.metrics}
              suggestions={currentFeedback.suggestions}
              questionType={currentFeedback.questionType}
            />
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </Button>
              <Button
                onClick={() => setCurrentView('setup')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back to Setup
              </Button>
            </div>
          </div>
        )}

        {currentView === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Interview History</h2>
              <Button
                onClick={() => setCurrentView('setup')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                New Interview
              </Button>
            </div>
            <InterviewHistory currentUser={currentUser} />
          </div>
        )}
      </main>
      
      <AIAssistant context="interview" />
    </div>
  );
};

export default Interview;
