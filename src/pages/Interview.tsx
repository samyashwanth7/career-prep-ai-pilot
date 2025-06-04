
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'situational';
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InterviewSession {
  id: string;
  company: string;
  type: string;
  questions: Question[];
  responses: {
    questionId: string;
    audioBlob: string;
    duration: number;
    score: number;
  }[];
  startTime: Date;
  endTime?: Date;
  overallScore: number;
}

const Interview = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('');
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const companyQuestions = {
    google: {
      technical: [
        { id: '1', text: 'Implement an LRU Cache with O(1) get and put operations.', type: 'technical' as const, timeLimit: 120, difficulty: 'hard' as const },
        { id: '2', text: 'Design a system to handle 1 billion daily active users for a social media platform.', type: 'technical' as const, timeLimit: 120, difficulty: 'hard' as const },
        { id: '3', text: 'How would you find the longest palindromic substring in a given string?', type: 'technical' as const, timeLimit: 120, difficulty: 'medium' as const }
      ],
      behavioral: [
        { id: '4', text: 'Tell me about a time you had to influence someone without having direct authority over them.', type: 'behavioral' as const, timeLimit: 120, difficulty: 'medium' as const },
        { id: '5', text: 'Describe a situation where you had to work with ambiguous requirements.', type: 'behavioral' as const, timeLimit: 120, difficulty: 'medium' as const }
      ]
    },
    meta: {
      technical: [
        { id: '6', text: 'Design the architecture for a real-time chat system like WhatsApp.', type: 'technical' as const, timeLimit: 120, difficulty: 'hard' as const },
        { id: '7', text: 'How would you optimize the news feed algorithm for better user engagement?', type: 'technical' as const, timeLimit: 120, difficulty: 'hard' as const }
      ],
      behavioral: [
        { id: '8', text: 'Give me an example of when you moved fast and broke things. How did you handle it?', type: 'behavioral' as const, timeLimit: 120, difficulty: 'medium' as const },
        { id: '9', text: 'How would you improve Instagram Stories feature?', type: 'behavioral' as const, timeLimit: 120, difficulty: 'medium' as const }
      ]
    },
    amazon: {
      technical: [
        { id: '10', text: 'Design a distributed storage system like S3.', type: 'technical' as const, timeLimit: 120, difficulty: 'hard' as const },
        { id: '11', text: 'Implement a recommendation system for e-commerce products.', type: 'technical' as const, timeLimit: 120, difficulty: 'hard' as const }
      ],
      behavioral: [
        { id: '12', text: 'Tell me about a time you had to make a decision with incomplete information (Bias for Action).', type: 'behavioral' as const, timeLimit: 120, difficulty: 'medium' as const },
        { id: '13', text: 'Describe a situation where you had to dive deep into a problem (Dive Deep).', type: 'behavioral' as const, timeLimit: 120, difficulty: 'medium' as const }
      ]
    }
  };

  const startInterview = () => {
    if (!selectedCompany || !selectedType) return;
    
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
      score: Math.floor(Math.random() * 30) + 70 // Simulated score 70-100
    };
    
    setRecordedResponses(prev => [...prev, response]);
    
    // Move to next question or complete session
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
      questions,
      responses: recordedResponses,
      startTime: new Date(),
      endTime: new Date(),
      overallScore: recordedResponses.reduce((acc, r) => acc + r.score, 0) / recordedResponses.length
    };
    
    // Save session to localStorage
    const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    sessions.push(session);
    localStorage.setItem('interviewSessions', JSON.stringify(sessions));
    
    // Update user stats
    updateUserStats(session);
    
    setSessionComplete(true);
    
    // Clean up
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const updateUserStats = (session: InterviewSession) => {
    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    stats.totalInterviews = (stats.totalInterviews || 0) + 1;
    stats.averageScore = ((stats.averageScore || 0) + session.overallScore) / 2;
    stats.lastSessionDate = new Date().toISOString();
    localStorage.setItem('userStats', JSON.stringify(stats));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              You completed {questions.length} questions for {selectedCompany}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {recordedResponses.reduce((acc, r) => acc + r.score, 0) / recordedResponses.length}%
                </div>
                <div className="text-gray-400">Overall Score</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{questions.length}</div>
                <div className="text-gray-400">Questions</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {Math.floor(recordedResponses.reduce((acc, r) => acc + r.duration, 0) / 60)}m
                </div>
                <div className="text-gray-400">Total Time</div>
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
              <p className="text-sm text-gray-400">Real interview simulation with voice recording</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {!sessionStarted ? (
          /* Setup Phase */
          <div className="space-y-8">
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
                        <div className="text-gray-400 text-sm">
                          {company === 'google' && 'System design, coding, leadership'}
                          {company === 'meta' && 'Product sense, execution, culture'}
                          {company === 'amazon' && '14 leadership principles, customer obsession'}
                        </div>
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
                        <div className="text-gray-400 text-sm">
                          {type === 'technical' && 'Coding, system design, algorithms'}
                          {type === 'behavioral' && 'STAR method, leadership, culture fit'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={startInterview}
                disabled={!selectedCompany || !selectedType}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                Start Interview Session
              </Button>
            </Card>
          </div>
        ) : (
          /* Interview Phase */
          <div className="space-y-6">
            {/* Progress */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h3>
                  <p className="text-gray-400">
                    {selectedCompany} • {selectedType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{formatTime(timeLeft)}</div>
                  <div className="text-gray-400">Time remaining</div>
                </div>
              </div>
              <Progress 
                value={((currentQuestionIndex + 1) / questions.length) * 100} 
                className="mb-4"
              />
              <Progress 
                value={(timeLeft / 120) * 100} 
                className="h-2"
              />
            </Card>

            {/* Current Question */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="mb-6">
                <Badge 
                  className={`mb-4 ${
                    questions[currentQuestionIndex]?.type === 'technical' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {questions[currentQuestionIndex]?.type}
                </Badge>
                <h2 className="text-xl font-semibold text-white mb-4">
                  {questions[currentQuestionIndex]?.text}
                </h2>
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

            {/* Response History */}
            {recordedResponses.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Previous Responses</h3>
                <div className="space-y-3">
                  {recordedResponses.map((response, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <div className="text-white font-medium">Question {index + 1}</div>
                        <div className="text-gray-400 text-sm">{response.duration}s</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{response.score}%</div>
                        <div className="text-gray-400 text-sm">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Interview;
