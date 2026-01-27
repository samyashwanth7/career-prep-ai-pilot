import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, MicOff, Clock, Star, Lightbulb, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/data/expandedQuestionBank';

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

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  const getDifficultyStars = (difficulty: string) => {
    const levels: Record<string, number> = {
      entry: 1,
      mid: 2,
      senior: 3,
      executive: 4
    };
    return levels[difficulty] || 2;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      entry: 'text-success',
      mid: 'text-warning',
      senior: 'text-destructive',
      executive: 'text-accent'
    };
    return colors[difficulty] || 'text-muted-foreground';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      behavioral: 'bg-primary/10 text-primary border-primary/20',
      technical: 'bg-accent/10 text-accent border-accent/20',
      situational: 'bg-warning/10 text-warning border-warning/20',
      'industry-specific': 'bg-success/10 text-success border-success/20'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <Card className="bg-card border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge className={getTypeColor(currentQuestion.type)}>
              {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1)} Interview
            </Badge>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Progress Bar */}
            <div className="w-32 hidden sm:block">
              <Progress 
                value={((currentQuestionIndex + 1) / questions.length) * 100} 
                className="h-2" 
              />
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
            
            {/* Difficulty */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < getDifficultyStars(currentQuestion.difficulty) 
                      ? `fill-current ${getDifficultyColor(currentQuestion.difficulty)}` 
                      : 'text-muted'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Question Card */}
          <Card className="bg-card border-border p-8">
            <div className="space-y-4">
              {/* Question Number & Category */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Q{currentQuestionIndex + 1}
                </span>
                {currentQuestion.category && (
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.category.replace('-', ' ')}
                  </Badge>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>
          </Card>

          {/* Recording Area */}
          <Card className="bg-card border-border p-8">
            <div className="text-center space-y-6">
              {/* Recording Button */}
              <div className="flex justify-center">
                <button
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 ${
                    isRecording
                      ? 'border-destructive bg-destructive/10 hover:bg-destructive/20'
                      : 'border-primary bg-primary/10 hover:bg-primary/20'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-destructive mx-auto" />
                  ) : (
                    <Mic className="w-10 h-10 text-primary mx-auto" />
                  )}
                  
                  {isRecording && (
                    <span className="absolute -inset-2 rounded-full border-2 border-destructive/30 animate-ping" />
                  )}
                </button>
              </div>

              <p className="text-muted-foreground">
                {isRecording 
                  ? 'Recording... Click to stop and get AI feedback' 
                  : 'Click the microphone to start recording your answer'}
              </p>

              {/* Audio Waveform Animation */}
              {isRecording && (
                <div className="flex justify-center items-end gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Button
                  variant={isRecording ? 'default' : 'outline'}
                  size="lg"
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={isRecording ? 'bg-success hover:bg-success/90 text-white' : ''}
                >
                  {isRecording ? (
                    <>Submit Answer</>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Record Voice Answer
                    </>
                  )}
                </Button>
                
                <Button variant="ghost" className="text-muted-foreground">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Question
                </Button>
                
                <Button variant="ghost" className="text-muted-foreground">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Live Metrics */}
          <Card className="bg-card border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Live AI Metrics</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-sm font-semibold text-primary">{Math.round(liveConfidence)}%</span>
                </div>
                <Progress value={liveConfidence} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Eye Contact</span>
                  <span className="text-sm font-semibold text-success">{Math.round(eyeContactScore)}%</span>
                </div>
                <Progress value={eyeContactScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Speech Clarity</span>
                  <span className="text-sm font-semibold text-warning">{Math.round(speechClarityScore)}%</span>
                </div>
                <Progress value={speechClarityScore} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="bg-card border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-warning" />
              <h4 className="font-semibold text-foreground">Tips</h4>
            </div>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use the STAR method for behavioral questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Include specific examples with measurable results
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Speak clearly and maintain a steady pace
              </li>
            </ul>
          </Card>

          {/* Timer Details */}
          <Card className="bg-card border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-semibold text-foreground">Time</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recommended</span>
                <span className="text-foreground">{formatTime(currentQuestion.timeRecommendation || 120)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Elapsed</span>
                <span className="text-foreground">{formatTime(120 - timeLeft)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
