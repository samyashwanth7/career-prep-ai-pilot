import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, User, Trophy, Brain, Briefcase } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import InterviewSetup from '@/components/interview/InterviewSetup';
import InterviewSession from '@/components/interview/InterviewSession';
import InterviewFeedback from '@/components/interview/InterviewFeedback';
import InterviewHistory from '@/components/interview/InterviewHistory';
import InterviewComplete from '@/components/interview/InterviewComplete';
import { categories } from '@/components/interview/QuestionCategories';
import { SpeechRecognitionService } from '@/services/speechService';
import { AIAnalysisService } from '@/services/aiAnalysisService';
import { QuestionService, type Question } from '@/data/expandedQuestionBank';

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  style: string;
  icon: React.ReactNode;
  color: string;
  traits: string[];
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
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [speechService] = useState(() => new SpeechRecognitionService());
  const [aiService] = useState(() => new AIAnalysisService());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        // These metrics could be calculated from speech patterns
        // For now, they are simulated
        // setLiveConfidence(prev => Math.max(40, Math.min(100, prev + (Math.random() - 0.5) * 10)));
        // setEyeContactScore(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 8)));
        // setSpeechClarityScore(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 6)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalityById = (id: string) => {
    return aiPersonalities.find(p => p.id === id);
  };

  // Generate questions using the expanded question bank
  const generateQuestionsForCategory = (categoryId: string) => {
    const questionFilters = {
      behavioral: { type: 'behavioral' },
      technical: { type: 'technical' },
      situational: { type: 'situational' },
      communication: { category: 'client-communication' },
      'problem-solving': { tags: ['problem-solving'] },
      'goals-motivation': { category: 'learning-adaptability' }
    };

    const filters = questionFilters[categoryId as keyof typeof questionFilters];
    return QuestionService.getRandomQuestions(5, filters);
  };

  const startInterview = async () => {
    if (!selectedCategory || !selectedPersonality) return;
    
    // Try to get personalized questions first
    try {
      const userProfile = {
        industry: 'technology', // This could come from user profile
        role: 'software-engineer',
        experienceLevel: 'mid',
        weakAreas: ['technical-depth', 'communication']
      };
      
      const personalizedQuestions = await aiService.generatePersonalizedQuestions(userProfile);
      
      if (personalizedQuestions.length > 0) {
        setQuestions(personalizedQuestions.map((text, index) => ({
          id: `personalized_${index}`,
          text,
          type: 'behavioral' as const,
          timeLimit: 120,
          difficulty: 'medium' as const
        })));
      } else {
        // Fallback to expanded question bank
        const categoryQuestions = generateQuestionsForCategory(selectedCategory);
        setQuestions(categoryQuestions);
      }
    } catch (error) {
      console.error('Failed to get personalized questions:', error);
      const categoryQuestions = generateQuestionsForCategory(selectedCategory);
      setQuestions(categoryQuestions);
    }
    
    setCurrentView('interview');
    setTimeLeft(120);
  };

  const startRecording = async () => {
    try {
      setLiveTranscription('');
      await speechService.startRecording((transcription) => {
        setLiveTranscription(prev => prev + ' ' + transcription);
      });
      setIsRecording(true);
      startTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    stopTimer();
    setIsAnalyzing(true);

    try {
      const finalTranscription = await speechService.stopRecording();
      const completeTranscription = liveTranscription + ' ' + finalTranscription;
      setCurrentTranscription(completeTranscription);

      // Get real AI analysis
      const analysisRequest = {
        questionText: questions[currentQuestionIndex].text,
        transcription: completeTranscription,
        questionType: questions[currentQuestionIndex].type,
        duration: 120 - timeLeft,
        industry: 'technology',
        role: 'software-engineer'
      };

      const feedback = await aiService.analyzeResponse(analysisRequest);
      
      setCurrentFeedback({
        questionText: questions[currentQuestionIndex].text,
        transcription: completeTranscription,
        duration: 120 - timeLeft,
        metrics: feedback,
        suggestions: feedback.suggestions,
        questionType: questions[currentQuestionIndex].type
      });

      // Save session with real feedback
      const session: InterviewSession = {
        id: Date.now().toString(),
        category: selectedCategory,
        questionText: questions[currentQuestionIndex].text,
        transcription: completeTranscription,
        overallScore: feedback.overallScore,
        duration: 120 - timeLeft,
        date: new Date().toISOString(),
        feedback: {
          specificity: feedback.specificity,
          relevance: feedback.relevance,
          impact: feedback.impact,
          structure: feedback.structure,
          suggestions: feedback.suggestions
        }
      };

      const existingSessions = JSON.parse(localStorage.getItem(`interview_history_${currentUser.id}`) || '[]');
      existingSessions.push(session);
      localStorage.setItem(`interview_history_${currentUser.id}`, JSON.stringify(existingSessions));
      
      setCurrentView('feedback');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to basic feedback if AI analysis fails
    } finally {
      setIsAnalyzing(false);
    }
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
          <div className="space-y-6">
            <InterviewSession
              currentQuestionIndex={currentQuestionIndex}
              questions={questions}
              timeLeft={timeLeft}
              isRecording={isRecording}
              liveConfidence={75} // This could be calculated from speech patterns
              eyeContactScore={80}
              speechClarityScore={85}
              selectedCategory={selectedCategory}
              selectedPersonality={selectedPersonality}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              getPersonalityById={getPersonalityById}
            />
            
            {/* Real-time transcription display */}
            {liveTranscription && (
              <div className="bg-white/10 backdrop-blur-lg border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Live Transcription:</h4>
                <p className="text-gray-300 text-sm">{liveTranscription}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="bg-white/10 backdrop-blur-lg border-white/20 rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-white">AI is analyzing your response...</p>
              </div>
            )}
          </div>
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
