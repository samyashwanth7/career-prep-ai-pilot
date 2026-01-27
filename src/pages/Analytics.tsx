import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  Brain,
  Calendar,
  ChevronRight,
  Flame,
  Award,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AIInsights from '@/components/AIInsights';
import AIAssistant from '@/components/AIAssistant';

interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  confidenceAvg: number;
  communicationAvg: number;
  improvementRate: number;
  streakDays: number;
  personalityUsage: Record<string, number>;
  companyStats: Record<string, any>;
  weeklyProgress: any[];
  skillBreakdown: any[];
  recentSessions: any[];
  totalHours: number;
  questionsCompleted: number;
}

const Analytics = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
    loadAnalyticsData(JSON.parse(user));
  }, [navigate]);

  const loadAnalyticsData = (user: any) => {
    const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    const userSessions = sessions.filter((s: any) => s.userId === user.id);
    
    const totalInterviews = userSessions.length || 12; // Show sample data
    const averageScore = totalInterviews > 0 
      ? userSessions.reduce((sum: number, s: any) => sum + (s.overallScore || 78), 0) / totalInterviews
      : 78;
    
    const confidenceAvg = 76;
    const communicationAvg = 82;

    const weeklyProgress = Array.from({ length: 8 }, (_, i) => ({
      week: `Week ${i + 1}`,
      overall: Math.max(60, Math.min(95, 70 + i * 3 + Math.random() * 10)),
      confidence: Math.max(50, Math.min(90, 65 + i * 2.5 + Math.random() * 8)),
      communication: Math.max(55, Math.min(92, 68 + i * 2.8 + Math.random() * 7)),
      technical: Math.max(45, Math.min(88, 60 + i * 3.2 + Math.random() * 12))
    }));

    const skillBreakdown = [
      { skill: 'Problem Solving', current: 82, target: 90, trend: 'up' },
      { skill: 'Communication', current: communicationAvg, target: 85, trend: 'up' },
      { skill: 'Confidence', current: confidenceAvg, target: 88, trend: 'up' },
      { skill: 'Technical Knowledge', current: 78, target: 85, trend: 'stable' },
      { skill: 'Leadership', current: 74, target: 80, trend: 'up' },
      { skill: 'Cultural Fit', current: 86, target: 90, trend: 'down' }
    ];

    const personalityUsage = {
      professional: 5,
      friendly: 3,
      technical: 2,
      executive: 2
    };

    const companyStats = {
      'Google': { sessions: 3, avgScore: 82 },
      'Meta': { sessions: 2, avgScore: 78 },
      'Amazon': { sessions: 2, avgScore: 75 }
    };

    setAnalyticsData({
      totalInterviews,
      averageScore: Math.round(averageScore),
      confidenceAvg,
      communicationAvg,
      improvementRate: 15,
      streakDays: 5,
      personalityUsage,
      companyStats,
      weeklyProgress,
      skillBreakdown,
      recentSessions: userSessions.slice(-5).reverse(),
      totalHours: 8.5,
      questionsCompleted: 47
    });
  };

  if (!currentUser || !analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Progress Dashboard</h1>
              <p className="text-sm text-muted-foreground">Track your interview preparation journey</p>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {['7d', '30d', '90d', 'All'].map((tf) => (
              <Button
                key={tf}
                variant={selectedTimeframe === tf ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeframe(tf)}
                className={selectedTimeframe === tf ? 'gradient-primary text-white' : ''}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : 'All Time'}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.totalInterviews}</p>
                <p className="text-sm text-muted-foreground">Practice Sessions</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{analyticsData.improvementRate}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.questionsCompleted}</p>
                <p className="text-sm text-muted-foreground">Questions Completed</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">75% of weekly goal</p>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-success">Trending up</span>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.streakDays} Days</p>
                <p className="text-sm text-muted-foreground">Practice Streak</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7].map((day) => (
                  <div 
                    key={day} 
                    className={`w-4 h-4 rounded ${day <= analyticsData.streakDays ? 'bg-warning' : 'bg-muted'}`} 
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Performance Over Time</h3>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    Overall
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-success" />
                    Technical
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent" />
                    Behavioral
                  </span>
                </div>
              </div>
              
              {/* Simple Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.weeklyProgress.map((week, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-0.5 items-end justify-center h-48">
                      <div 
                        className="w-3 bg-primary rounded-t" 
                        style={{ height: `${week.overall}%` }}
                      />
                      <div 
                        className="w-3 bg-success rounded-t" 
                        style={{ height: `${week.technical}%` }}
                      />
                      <div 
                        className="w-3 bg-accent rounded-t" 
                        style={{ height: `${week.communication}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">W{index + 1}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skill Breakdown */}
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Skill Breakdown</h3>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {analyticsData.skillBreakdown.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                        <span className="text-sm font-semibold text-foreground">{skill.current}%</span>
                      </div>
                      <Progress value={skill.current} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Target: {skill.target}%
                      </p>
                    </div>
                    {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                    {skill.trend === 'down' && <TrendingUp className="w-4 h-4 text-destructive rotate-180" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Strengths & Weaknesses */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Strengths</h3>
              <div className="space-y-3">
                {['Communication', 'Problem Solving', 'Professionalism'].map((strength, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-foreground">{strength}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-4">Areas to Improve</h3>
              <div className="space-y-3">
                {['Technical Depth', 'Time Management', 'Specific Examples'].map((area, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="text-foreground">{area}</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs">
                      Practice
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'Behavioral', score: 85, date: 'Today' },
                  { type: 'Technical', score: 72, date: 'Yesterday' },
                  { type: 'Situational', score: 88, date: '2 days ago' },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{session.type} Interview</p>
                      <p className="text-xs text-muted-foreground">{session.date}</p>
                    </div>
                    <Badge className={session.score >= 80 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                      {session.score}%
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Sessions
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* Achievements */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Flame, label: '5 Day Streak', unlocked: true },
                  { icon: Trophy, label: 'First 90%', unlocked: true },
                  { icon: Award, label: '10 Sessions', unlocked: true },
                  { icon: Brain, label: 'Tech Master', unlocked: false },
                  { icon: Target, label: 'Perfectionist', unlocked: false },
                  { icon: Calendar, label: 'Monthly Goal', unlocked: false },
                ].map((achievement, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center p-3 rounded-lg ${
                      achievement.unlocked ? 'bg-primary/10' : 'bg-muted/30 opacity-50'
                    }`}
                  >
                    <achievement.icon className={`w-6 h-6 mb-2 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs text-center text-foreground">{achievement.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <AIAssistant context="analytics" />
    </div>
  );
};

export default Analytics;
