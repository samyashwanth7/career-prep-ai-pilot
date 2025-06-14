
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  AlertCircle,
  CheckCircle,
  Zap,
  Users,
  Award
} from 'lucide-react';

interface AIInsightsProps {
  analyticsData: any;
}

const AIInsights: React.FC<AIInsightsProps> = ({ analyticsData }) => {
  const generateInsights = () => {
    const insights = [];
    
    // Performance trend analysis
    if (analyticsData.improvementRate > 10) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Excellent Progress',
        description: `Your performance has improved by ${analyticsData.improvementRate}% this month. Keep up the momentum!`,
        action: 'Continue your current practice schedule',
        priority: 'high'
      });
    } else if (analyticsData.improvementRate < 5) {
      insights.push({
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Slow Progress Detected',
        description: 'Your improvement rate has slowed down. Consider diversifying your practice approach.',
        action: 'Try different interview types or AI personalities',
        priority: 'medium'
      });
    }
    
    // Confidence analysis
    if (analyticsData.confidenceAvg < 70) {
      insights.push({
        type: 'improvement',
        icon: <Brain className="w-5 h-5" />,
        title: 'Confidence Building Opportunity',
        description: 'Your confidence scores suggest room for improvement in self-assurance during interviews.',
        action: 'Practice with the Friendly Sam personality for confidence building',
        priority: 'high'
      });
    }
    
    // Communication analysis
    if (analyticsData.communicationAvg > 85) {
      insights.push({
        type: 'positive',
        icon: <Award className="w-5 h-5" />,
        title: 'Strong Communication Skills',
        description: 'Your communication scores are excellent! This is a key strength to highlight.',
        action: 'Focus on maintaining this strength while developing other areas',
        priority: 'low'
      });
    }
    
    // Practice frequency analysis
    if (analyticsData.streakDays > 7) {
      insights.push({
        type: 'positive',
        icon: <Zap className="w-5 h-5" />,
        title: 'Consistent Practice Streak',
        description: `${analyticsData.streakDays} days of consistent practice! Consistency is key to improvement.`,
        action: 'Consider gradually increasing session difficulty',
        priority: 'medium'
      });
    }
    
    // Skills gap analysis
    const skillBreakdown = analyticsData.skillBreakdown || [];
    const weakestSkill = skillBreakdown.reduce((min, skill) => 
      skill.current < min.current ? skill : min, skillBreakdown[0] || { skill: 'Technical Knowledge', current: 70 }
    );
    
    if (weakestSkill && weakestSkill.current < 75) {
      insights.push({
        type: 'improvement',
        icon: <Target className="w-5 h-5" />,
        title: 'Skills Development Focus',
        description: `${weakestSkill.skill} is your area with the most growth potential.`,
        action: `Focus your next 3 sessions on ${weakestSkill.skill.toLowerCase()} related questions`,
        priority: 'high'
      });
    }
    
    // Industry-specific recommendations
    const topCompanies = Object.keys(analyticsData.companyStats || {});
    if (topCompanies.length > 1) {
      insights.push({
        type: 'insight',
        icon: <Users className="w-5 h-5" />,
        title: 'Company Preparation Pattern',
        description: `You've practiced with ${topCompanies.length} different companies. Consider specializing in your top 2 targets.`,
        action: 'Focus deeper preparation on your preferred companies',
        priority: 'medium'
      });
    }
    
    return insights;
  };

  const insights = generateInsights();
  
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'from-green-500 to-emerald-600';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'improvement': return 'from-blue-500 to-cyan-600';
      case 'insight': return 'from-purple-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400', 
      low: 'bg-green-500/20 text-green-400'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">AI Performance Insights</h3>
            <p className="text-gray-400 text-sm">Personalized recommendations based on your data</p>
          </div>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300">
          AI Generated
        </Badge>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Complete more interviews to unlock AI insights!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.slice(0, 4).map((insight, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)} flex items-center justify-center flex-shrink-0`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-white font-medium">{insight.title}</h4>
                    <Badge className={`text-xs ${getPriorityBadge(insight.priority)}`}>
                      {insight.priority} priority
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <p className="text-yellow-200 text-sm font-medium">Recommended Action:</p>
                    </div>
                    <p className="text-gray-300 text-sm mt-1 ml-6">{insight.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* AI Confidence Score */}
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">AI Confidence in Analysis</h4>
              <Badge className="bg-cyan-500/20 text-cyan-300">
                {analyticsData.totalInterviews >= 5 ? 'High' : analyticsData.totalInterviews >= 2 ? 'Medium' : 'Low'} Confidence
              </Badge>
            </div>
            <Progress 
              value={Math.min(100, (analyticsData.totalInterviews / 10) * 100)} 
              className="h-2 mb-2" 
            />
            <p className="text-gray-300 text-xs">
              Insights improve with more interview data. Complete {Math.max(0, 10 - analyticsData.totalInterviews)} more sessions for maximum accuracy.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIInsights;
