
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Star,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface FeedbackMetrics {
  specificity: number;
  relevance: number;
  impact: number;
  structure: number;
  starMethod: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
    score: number;
  };
  fluency: {
    pauseCount: number;
    hesitations: number;
    overallFlow: 'Smooth' | 'Some hesitations' | 'Choppy';
  };
  overallScore: number;
}

interface InterviewFeedbackProps {
  questionText: string;
  transcription: string;
  duration: number;
  metrics: FeedbackMetrics;
  suggestions: string[];
  questionType: 'technical' | 'behavioral' | 'situational';
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
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFlowIcon = (flow: string) => {
    switch (flow) {
      case 'Smooth':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Some hesitations':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Interview Performance</h3>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(metrics.overallScore)}`}>
              {metrics.overallScore}%
            </div>
            <div className="text-gray-400 text-sm">Overall Score</div>
          </div>
        </div>
        <Progress value={metrics.overallScore} className="h-3" />
      </Card>

      {/* Content Analysis */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h4 className="text-white font-semibold">Content Quality Analysis</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(metrics.specificity)}`}>
              {metrics.specificity}%
            </div>
            <div className="text-gray-400 text-sm">Specificity</div>
            <div className="text-xs text-gray-500 mt-1">Concrete examples</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(metrics.relevance)}`}>
              {metrics.relevance}%
            </div>
            <div className="text-gray-400 text-sm">Relevance</div>
            <div className="text-xs text-gray-500 mt-1">On-topic response</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(metrics.impact)}`}>
              {metrics.impact}%
            </div>
            <div className="text-gray-400 text-sm">Impact</div>
            <div className="text-xs text-gray-500 mt-1">Quantified results</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(metrics.structure)}`}>
              {metrics.structure}%
            </div>
            <div className="text-gray-400 text-sm">Structure</div>
            <div className="text-xs text-gray-500 mt-1">Clear organization</div>
          </div>
        </div>

        {questionType === 'behavioral' && (
          <div className="border-t border-white/20 pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <h5 className="text-white font-medium">STAR Method Analysis</h5>
              <Badge className={`ml-auto ${getScoreColor(metrics.starMethod.score)}`}>
                {metrics.starMethod.score}%
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(metrics.starMethod).slice(0, 4).map(([component, present]) => (
                <div key={component} className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    present ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {present ? '✓' : '×'}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">{component}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Fluency Analysis */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">Fluency & Delivery</h4>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{duration}s</div>
            <div className="text-gray-400 text-sm">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{metrics.fluency.pauseCount}</div>
            <div className="text-gray-400 text-sm">Long Pauses</div>
            <div className="text-xs text-gray-500 mt-1">&gt;2 seconds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{metrics.fluency.hesitations}</div>
            <div className="text-gray-400 text-sm">Hesitations</div>
            <div className="text-xs text-gray-500 mt-1">Stutters/repeats</div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            {getFlowIcon(metrics.fluency.overallFlow)}
            <span className="text-white">Overall Flow</span>
          </div>
          <Badge variant="outline" className="border-gray-500 text-gray-300">
            {metrics.fluency.overallFlow}
          </Badge>
        </div>
      </Card>

      {/* Specific Suggestions */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">Improvement Suggestions</h4>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-semibold mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Response Transcript */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h4 className="text-white font-semibold">Your Response</h4>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Question:</div>
          <p className="text-white mb-4 font-medium">{questionText}</p>
          
          <div className="text-sm text-gray-400 mb-2">Your Answer:</div>
          <p className="text-gray-300 leading-relaxed">{transcription}</p>
        </div>
      </Card>
    </div>
  );
};

export default InterviewFeedback;
