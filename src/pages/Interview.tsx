import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, CheckCircle, User, Brain, Briefcase, Trophy } from 'lucide-react';

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
  company: string;
  type: string;
  personalityId: string;
  questions: Question[];
  responses: {
    questionId: string;
    audioBlob: string;
    duration: number;
    score: number;
    confidence: number;
    eyeContact: number;
    speechClarity: number;
  }[];
  startTime: Date;
  endTime?: Date;
  overallScore: number;
  confidenceScore: number;
  communicationScore: number;
}

const Interview = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [recordedResponses, setRecordedResponses] = useState<any[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [liveConfidence, setLiveConfidence] = useState(75);
  const [eyeContactScore, setEyeContactScore] = useState(80);
  const [speechClarityScore, setSpeechClarityScore] = useState(85);
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

  const companyQuestions = {
    google: {
      technical: [
        { 
          id: '1', 
          text: 'Implement an LRU Cache with O(1) get and put operations.', 
          type: 'technical' as const, 
          timeLimit: 120, 
          difficulty: 'hard' as const,
          personalityContext: 'Focus on your approach to system design and optimization.'
        },
        { 
          id: '2', 
          text: 'Design a system to handle 1 billion daily active users for a social media platform.', 
          type: 'technical' as const, 
          timeLimit: 120, 
          difficulty: 'hard' as const,
          personalityContext: 'Walk me through your scalability considerations.'
        }
      ],
      behavioral: [
        { 
          id: '4', 
          text: 'Tell me about a time you had to influence someone without having direct authority over them.', 
          type: 'behavioral' as const, 
          timeLimit: 120, 
          difficulty: 'medium' as const,
          personalityContext: 'I\'m interested in your leadership and influence strategies.'
        }
      ]
    },
    meta: {
      technical: [
        { 
          id: '6', 
          text: 'Design the architecture for a real-time chat system like WhatsApp.', 
          type: 'technical' as const, 
          timeLimit: 120, 
          difficulty: 'hard' as const,
          personalityContext: 'Consider the real-time aspects and user experience.'
        }
      ],
      behavioral: [
        { 
          id: '8', 
          text: 'Give me an example of when you moved fast and broke things. How did you handle it?', 
          type: 'behavioral' as const, 
          timeLimit: 120, 
          difficulty: 'medium' as const,
          personalityContext: 'Show me how you balance speed with quality.'
        }
      ]
    },
    amazon: {
      technical: [
        { 
          id: '10', 
          text: 'Design a distributed storage system like S3.', 
          type: 'technical' as const, 
          timeLimit: 120, 
          difficulty: 'hard' as const,
          personalityContext: 'Focus on reliability and customer obsession in your design.'
        }
      ],
      behavioral: [
        { 
          id: '12', 
          text: 'Tell me about a time you had to make a decision with incomplete information (Bias for Action).', 
          type: 'behavioral' as const, 
          timeLimit: 120, 
          difficulty: 'medium' as const,
          personalityContext: 'Demonstrate how you embody our leadership principles.'
        }
      ]
    }
  };

  const startInterview = () => {
    if (!selectedCompany || !selectedType || !selectedPersonality) return;
    
    const companyQuestionSet = companyQuestions[selectedCompany as keyof typeof companyQuestions];
    const typeQuestions = companyQuestionSet[selectedType as keyof typeof companyQuestionSet] || [];
    
    setQuestions(typeQuestions);
    setSessionStarted(true);
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

  const saveCurrentResponse = async () => {
    if (audioChunks.length === 0) return;
    
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const base64Audio = await blobToBase64(audioBlob);
    
    const response = {
      questionId: questions[currentQuestionIndex].id,
      audioBlob: base64Audio,
      duration: 120 - timeLeft,
      score: Math.floor(Math.random() * 30) + 70,
      confidence: liveConfidence,
      eyeContact: eyeContactScore,
      speechClarity: speechClarityScore
    };
    
    setRecordedResponses(prev => [...prev, response]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(120);
      setAudioChunks([]);
    } else {
      completeSession();
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const completeSession = () => {
    const session: InterviewSession = {
      id: Date.now().toString(),
      company: selectedCompany,
      type: selectedType,
      personalityId: selectedPersonality,
      questions,
      responses: recordedResponses,
      startTime: new Date(),
      endTime: new Date(),
      overallScore: recordedResponses.reduce((acc, r) => acc + r.score, 0) / recordedResponses.length,
      confidenceScore: recordedResponses.reduce((acc, r) => acc + r.confidence, 0) / recordedResponses.length,
      communicationScore: recordedResponses.reduce((acc, r) => acc + (r.eyeContact + r.speechClarity) / 2, 0) / recordedResponses.length
    };
    
    const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    sessions.push(session);
    localStorage.setItem('interviewSessions', JSON.stringify(sessions));
    
    updateUserStats(session);
    setSessionComplete(true);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const updateUserStats = (session: InterviewSession) => {
    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    stats.totalInterviews = (stats.totalInterviews || 0) + 1;
    stats.averageScore = ((stats.averageScore || 0) + session.overallScore) / 2;
    stats.lastSessionDate = new Date().toISOString();
    stats.confidenceAvg = ((stats.confidenceAvg || 0) + session.confidenceScore) / 2;
    stats.communicationAvg = ((stats.communicationAvg || 0) + session.communicationScore) / 2;
    localStorage.setItem('userStats', JSON.stringify(stats));
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
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Interview Complete!</h2>
            <p className="text-gray-300 mb-6">
              You completed {questions.length} questions with {getPersonalityById(selectedPersonality)?.name}
            </p>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {Math.round(recordedResponses.reduce((acc, r) => acc + r.score, 0) / recordedResponses.length)}%
                </div>
                <div className="text-gray-400">Overall Score</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400">
                  {Math.round(recordedResponses.reduce((acc, r) => acc + r.confidence, 0) / recordedResponses.length)}%
                </div>
                <div className="text-gray-400">Confidence</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(recordedResponses.reduce((acc, r) => acc + r.eyeContact, 0) / recordedResponses.length)}%
                </div>
                <div className="text-gray-400">Eye Contact</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {Math.round(recordedResponses.reduce((acc, r) => acc + r.speechClarity, 0) / recordedResponses.length)}%
                </div>
                <div className="text-gray-400">Speech Clarity</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/analytics')}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                View Analytics
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Practice Again
              </Button>
            </div>
          </Card>
        </div>
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
              <p className="text-sm text-gray-400">Real interview simulation with AI personalities</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {!sessionStarted ? (
          /* Setup Phase */
          <div className="space-y-8">
            {/* AI Personality Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Choose Your AI Interviewer</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {aiPersonalities.map(personality => (
                  <button
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      selectedPersonality === personality.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${personality.color} flex items-center justify-center text-white mb-4`}>
                      {personality.icon}
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{personality.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{personality.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {personality.traits.map(trait => (
                        <Badge key={trait} variant="outline" className="border-gray-500 text-gray-300 text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Setup Your Interview</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-white font-medium mb-3">Select Company</label>
                  <div className="grid gap-3">
                    {Object.keys(companyQuestions).map(company => (
                      <button
                        key={company}
                        onClick={() => setSelectedCompany(company)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCompany === company
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-white font-medium capitalize">{company}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">Interview Type</label>
                  <div className="grid gap-3">
                    {['technical', 'behavioral'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedType === type
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-white font-medium capitalize">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={startInterview}
                disabled={!selectedCompany || !selectedType || !selectedPersonality}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                Start Interview with {selectedPersonality ? getPersonalityById(selectedPersonality)?.name : 'AI'}
              </Button>
            </Card>
          </div>
        ) : (
          /* Interview Phase */
          <div className="space-y-6">
            {/* Progress and Live Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h3>
                    <p className="text-gray-400">
                      {selectedCompany} • {selectedType} • {getPersonalityById(selectedPersonality)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{formatTime(timeLeft)}</div>
                    <div className="text-gray-400">Time remaining</div>
                  </div>
                </div>
                <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-4" />
                <Progress value={(timeLeft / 120) * 100} className="h-2" />
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h4 className="text-white font-semibold mb-4">Live Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Confidence</span>
                      <span className="text-cyan-400 font-semibold">{Math.round(liveConfidence)}%</span>
                    </div>
                    <Progress value={liveConfidence} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Eye Contact</span>
                      <span className="text-green-400 font-semibold">{Math.round(eyeContactScore)}%</span>
                    </div>
                    <Progress value={eyeContactScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Speech Clarity</span>
                      <span className="text-yellow-400 font-semibold">{Math.round(speechClarityScore)}%</span>
                    </div>
                    <Progress value={speechClarityScore} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Current Question */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="mb-6">
                <Badge className="mb-4 bg-blue-500/20 text-blue-400">
                  {questions[currentQuestionIndex]?.type}
                </Badge>
                <h2 className="text-xl font-semibold text-white mb-4">
                  {questions[currentQuestionIndex]?.text}
                </h2>
                {questions[currentQuestionIndex]?.personalityContext && (
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                    <p className="text-purple-200 text-sm">
                      <strong>{getPersonalityById(selectedPersonality)?.name}:</strong> {questions[currentQuestionIndex]?.personalityContext}
                    </p>
                  </div>
                )}
                <p className="text-gray-400">
                  Take your time to think, then click the microphone to start recording your response.
                </p>
              </div>

              {/* Recording Controls */}
              <div className="text-center">
                <div className="mb-6">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full border-4 transition-all ${
                      isRecording
                        ? 'border-red-500 bg-red-500/20 animate-pulse'
                        : 'border-purple-500 bg-purple-500/20 hover:bg-purple-500/30'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-8 h-8 text-red-400 mx-auto" />
                    ) : (
                      <Mic className="w-8 h-8 text-purple-400 mx-auto" />
                    )}
                  </button>
                </div>
                
                <div className="text-white">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </div>
                
                {isRecording && (
                  <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-purple-500 rounded animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Interview;
