import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Star,
  MessageSquare,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Share2,
  Bookmark,
  RefreshCw
} from 'lucide-react';

interface FeedbackMetrics {
  specificity: number;
  relevance: number;
  impact: number;
  structure: number;
  starMethod?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
    score: number;
  };
  fluency?: {
    pauseCount: number;
    hesitations: number;
    overallFlow: 'Smooth' | 'Some hesitations' | 'Choppy';
  };
  overallScore: number;
  strengths?: string[];
  improvements?: string[];
  communicationClarity?: number;
  confidence?: number;
}

interface InterviewFeedbackProps {
  questionText: string;
  transcription: string;
  duration: number;
  metrics: FeedbackMetrics;
  suggestions: string[];
  questionType: 'technical' | 'behavioral' | 'situational' | 'industry-specific';
}

const InterviewFeedback: React.FC<InterviewFeedbackProps> = ({
  questionText,
  transcription,
  duration,
  metrics,
  suggestions,
  questionType
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success/10 border-success/20';
    if (score >= 60) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-success';
    if (score >= 60) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const getMessage = (score: number) => {
    if (score >= 90) return "Excellent response! 🎉";
    if (score >= 80) return "Great job! 👏";
    if (score >= 70) return "Good effort! 💪";
    if (score >= 60) return "Getting there! 📈";
    return "Keep practicing! 💡";
  };

  const getFlowIcon = (flow?: string) => {
    switch (flow) {
      case 'Smooth':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Some hesitations':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  // Calculate circumference for circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (metrics.overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Overall Score Card - Full Width */}
      <Card className={`bg-card border ${getScoreBgColor(metrics.overallScore)} p-8`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular Score Display */}
          <div className="flex items-center gap-8">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className={`${getScoreRingColor(metrics.overallScore)} transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {Math.round(metrics.overallScore)}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-semibold text-foreground mb-2">
                {getMessage(metrics.overallScore)}
              </p>
              <p className="text-muted-foreground">
                You scored higher than 65% of users on this question type
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{duration}s</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{transcription.split(' ').length}</p>
              <p className="text-sm text-muted-foreground">Words</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Clarity', value: metrics.specificity, icon: Target, description: 'Concrete examples' },
          { label: 'Structure', value: metrics.structure, icon: BarChart3, description: 'Clear organization' },
          { label: 'Content', value: metrics.relevance, icon: Brain, description: 'On-topic response' },
          { label: 'Impact', value: metrics.impact, icon: TrendingUp, description: 'Quantified results' },
        ].map((metric, index) => (
          <Card key={index} className="bg-card border-border p-5 hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${getScoreBgColor(metric.value)} flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${getScoreColor(metric.value)}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className={`text-xl font-bold ${getScoreColor(metric.value)}`}>{metric.value}%</p>
              </div>
            </div>
            <Progress value={metric.value} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
          </Card>
        ))}
      </div>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <Card className="bg-success/5 border-success/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-success" />
            <h4 className="font-semibold text-foreground">What You Did Well</h4>
          </div>
          <ul className="space-y-3">
            {(metrics.strengths || [
              'Clear communication style',
              'Good use of specific examples',
              'Professional tone maintained'
            ]).map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center text-xs mt-0.5">✓</span>
                <span className="text-foreground/90">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Improvements Card */}
        <Card className="bg-warning/5 border-warning/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h4 className="font-semibold text-foreground">How to Improve</h4>
          </div>
          <ul className="space-y-3">
            {(metrics.improvements || suggestions.slice(0, 3)).map((improvement, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs mt-0.5">!</span>
                <span className="text-foreground/90">{improvement}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* STAR Method Analysis (for behavioral questions) */}
      {(questionType === 'behavioral' || questionType === 'situational') && metrics.starMethod && (
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              <h4 className="font-semibold text-foreground">STAR Method Analysis</h4>
            </div>
            <Badge className={getScoreBgColor(metrics.starMethod.score)}>
              <span className={getScoreColor(metrics.starMethod.score)}>{metrics.starMethod.score}%</span>
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: 'situation', label: 'Situation', desc: 'Context provided' },
              { key: 'task', label: 'Task', desc: 'Role defined' },
              { key: 'action', label: 'Action', desc: 'Steps taken' },
              { key: 'result', label: 'Result', desc: 'Outcome shown' }
            ].map((item) => {
              const present = metrics.starMethod?.[item.key as keyof typeof metrics.starMethod];
              return (
                <div key={item.key} className="text-center">
                  <div className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    present ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {present ? <CheckCircle className="w-6 h-6" /> : <span className="text-xl">—</span>}
                  </div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Pro Tips */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Pro Interviewer Tips</h4>
        </div>
        <div className="space-y-3">
          {suggestions.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                {index + 1}
              </span>
              <p className="text-foreground/90 text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Response Transcript (Collapsible) */}
      <Card className="bg-card border-border p-6">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-semibold text-foreground">Your Response</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
          </summary>
          
          <div className="mt-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Question:</p>
              <p className="text-foreground font-medium">{questionText}</p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Answer:</p>
              <p className="text-foreground/90 leading-relaxed">{transcription || 'No transcription available'}</p>
            </div>
          </div>
        </details>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Practice Similar Question
        </Button>
        <Button variant="outline" className="gap-2">
          <Bookmark className="w-4 h-4" />
          Save Feedback
        </Button>
        <Button variant="ghost" className="gap-2 text-muted-foreground">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </div>
    </div>
  );
};

export default InterviewFeedback;
