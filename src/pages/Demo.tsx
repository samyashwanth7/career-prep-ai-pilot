import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Mic, 
  Clock,
  TrendingUp,
  Target,
  Star
} from 'lucide-react';

const DEMO_SCENARIOS = [
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Practice common behavioral questions',
    duration: '10 min',
    difficulty: 'Medium',
    questions: [
      "Tell me about a time when you had to work with a difficult team member.",
      "Describe a challenging project you led and how you handled obstacles.",
      "Give me an example of when you had to adapt to significant changes."
    ]
  },
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Software engineering focused questions',
    duration: '15 min',
    difficulty: 'Hard',
    questions: [
      "Explain the difference between REST and GraphQL APIs.",
      "How would you optimize a slow-performing database query?",
      "Walk me through your approach to debugging a production issue."
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership Interview',
    description: 'Management and leadership scenarios',
    duration: '12 min',
    difficulty: 'Medium',
    questions: [
      "How do you motivate underperforming team members?",
      "Describe your approach to setting team goals and priorities.",
      "Tell me about a time you had to make an unpopular decision."
    ]
  }
];

export default function Demo() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = DEMO_SCENARIOS.find(s => s.id === selectedScenario);

  const startRecording = () => {
    setIsRecording(true);
    // Simulate stopping after 30 seconds
    setTimeout(() => {
      setIsRecording(false);
      setShowFeedback(true);
    }, 3000); // Shortened for demo
  };

  const nextQuestion = () => {
    if (scenario && currentQuestion < scenario.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    }
  };

  const resetDemo = () => {
    setSelectedScenario(null);
    setCurrentQuestion(0);
    setIsRecording(false);
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            🎯 Interactive Demo
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Try AceInterview AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our AI-powered interview practice without signing up. Choose a scenario and see how our platform works.
          </p>
        </div>

        {!selectedScenario ? (
          /* Scenario Selection */
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
              Choose Your Demo Interview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_SCENARIOS.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className="p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{scenario.title}</h3>
                    <Badge variant={scenario.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{scenario.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {scenario.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {scenario.questions.length} questions
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    Start Demo
                    <Play className="ml-2 w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Demo Interview Interface */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{scenario?.title}</h2>
                <p className="text-muted-foreground">Demo Question {currentQuestion + 1} of {scenario?.questions.length}</p>
              </div>
              <Button variant="outline" onClick={resetDemo}>
                <RotateCcw className="mr-2 w-4 h-4" />
                Try Different Scenario
              </Button>
            </div>

            {/* Question Card */}
            <Card className="p-8">
              <div className="text-center space-y-6">
                <Badge variant="outline" className="text-sm">
                  Demo Question
                </Badge>
                <h3 className="text-xl font-medium text-foreground">
                  {scenario?.questions[currentQuestion]}
                </h3>
                
                {!isRecording && !showFeedback && (
                  <Button size="lg" onClick={startRecording} className="px-8">
                    <Mic className="mr-2 w-5 h-5" />
                    Start Recording Answer
                  </Button>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-foreground">Recording your response...</span>
                    </div>
                    <Button variant="outline" onClick={() => setIsRecording(false)}>
                      <Pause className="mr-2 w-4 h-4" />
                      Stop Recording
                    </Button>
                  </div>
                )}

                {showFeedback && (
                  <div className="space-y-4">
                    <div className="bg-secondary/50 p-6 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <TrendingUp className="mr-2 w-5 h-5 text-green-500" />
                        AI Feedback
                      </h4>
                      <div className="space-y-2 text-left">
                        <p className="text-foreground">
                          <strong>Strengths:</strong> Clear structure using the STAR method, specific examples with quantifiable results.
                        </p>
                        <p className="text-foreground">
                          <strong>Areas for improvement:</strong> Consider adding more details about the impact of your actions.
                        </p>
                        <p className="text-foreground">
                          <strong>Score:</strong> <span className="text-green-600 font-semibold">8.2/10</span>
                        </p>
                      </div>
                    </div>
                    
                    {currentQuestion < (scenario?.questions.length || 0) - 1 ? (
                      <Button onClick={nextQuestion}>
                        Next Question
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="text-lg font-semibold text-foreground mb-2">Demo Complete!</h4>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                            <span className="ml-2 text-foreground font-semibold">Overall Score: 8.5/10</span>
                          </div>
                        </div>
                        <div className="flex gap-4 justify-center">
                          <Button asChild>
                            <Link to="/auth">
                              Get Full Access
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" onClick={resetDemo}>
                            Try Another Demo
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Demo Limitations */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-accent/10 border-accent/20">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              This is a Limited Demo
            </h3>
            <p className="text-muted-foreground mb-4">
              The full platform includes unlimited practice sessions, detailed analytics, peer comparisons, and 100+ interview scenarios.
            </p>
            <Button asChild>
              <Link to="/auth">
                Unlock Full Platform
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}