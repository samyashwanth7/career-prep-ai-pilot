
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, MicOff } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'situational';
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  personalityContext?: string;
}

interface InterviewSessionProps {
  currentQuestionIndex: number;
  questions: Question[];
  timeLeft: number;
  isRecording: boolean;
  liveConfidence: number;
  eyeContactScore: number;
  speechClarityScore: number;
  selectedCategory: string;
  selectedPersonality: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  getPersonalityById: (id: string) => any;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({
  currentQuestionIndex,
  questions,
  timeLeft,
  isRecording,
  liveConfidence,
  eyeContactScore,
  speechClarityScore,
  selectedCategory,
  selectedPersonality,
  onStartRecording,
  onStopRecording,
  getPersonalityById
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions[currentQuestionIndex]) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Progress and Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/10 backdrop-blur-lg border-white/20 dark:bg-white/10 dark:border-white/20 bg-white border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <p className="text-muted-foreground">
                {selectedCategory} • {getPersonalityById(selectedPersonality)?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{formatTime(timeLeft)}</div>
              <div className="text-muted-foreground">Time remaining</div>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-4" />
          <Progress value={(timeLeft / 120) * 100} className="h-2" />
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 dark:bg-white/10 dark:border-white/20 bg-white border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-4 h-4 text-cyan-400" />
            <h4 className="text-foreground font-semibold">Live AI Metrics</h4>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground text-sm">Confidence</span>
                <span className="text-cyan-400 font-semibold">{Math.round(liveConfidence)}%</span>
              </div>
              <Progress value={liveConfidence} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground text-sm">Eye Contact</span>
                <span className="text-green-400 font-semibold">{Math.round(eyeContactScore)}%</span>
              </div>
              <Progress value={eyeContactScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground text-sm">Speech Clarity</span>
                <span className="text-yellow-400 font-semibold">{Math.round(speechClarityScore)}%</span>
              </div>
              <Progress value={speechClarityScore} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Current Question */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 dark:bg-white/10 dark:border-white/20 bg-white border-gray-200 p-8">
        <div className="mb-6">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400">
            {questions[currentQuestionIndex]?.type}
          </Badge>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {questions[currentQuestionIndex]?.text}
          </h2>
          {questions[currentQuestionIndex]?.personalityContext && (
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
              <p className="text-purple-200 text-sm">
                <strong>{getPersonalityById(selectedPersonality)?.name}:</strong> {questions[currentQuestionIndex]?.personalityContext}
              </p>
            </div>
          )}
          <p className="text-muted-foreground">
            Take your time to think, then click the microphone to start recording your response.
          </p>
        </div>

        {/* Recording Controls */}
        <div className="text-center">
          <div className="mb-6">
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
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
          
          <div className="text-foreground">
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
  );
};

export default InterviewSession;
