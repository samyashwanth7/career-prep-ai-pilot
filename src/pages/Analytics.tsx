import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  Users,
  Award,
  Zap,
  Brain,
  Mic,
  Eye,
  MessageSquare,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
}

const Analytics = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('overall');

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
    
    // Calculate analytics
    const totalInterviews = userSessions.length;
    const averageScore = totalInterviews > 0 
      ? userSessions.reduce((sum: number, s: any) => sum + s.overallScore, 0) / totalInterviews
      : 0;
    
    const confidenceAvg = totalInterviews > 0
      ? userSessions.reduce((sum: number, s: any) => sum + (s.confidenceScore || 75), 0) / totalInterviews
      : 0;
    
    const communicationAvg = totalInterviews > 0
      ? userSessions.reduce((sum: number, s: any) => sum + (s.communicationScore || 80), 0) / totalInterviews
      : 0;

    // Generate mock weekly progress data
    const weeklyProgress = Array.from({ length: 8 }, (_, i) => ({
      week: `Week ${i + 1}`,
      overall: Math.max(60, Math.min(95, 70 + i * 3 + Math.random() * 10)),
      confidence: Math.max(50, Math.min(90, 65 + i * 2.5 + Math.random() * 8)),
      communication: Math.max(55, Math.min(92, 68 + i * 2.8 + Math.random() * 7)),
      technical: Math.max(45, Math.min(88, 60 + i * 3.2 + Math.random() * 12))
    }));

    // Skill breakdown
    const skillBreakdown = [
      { skill: 'Problem Solving', current: 82, target: 90, improvement: 5 },
      { skill: 'Communication', current: communicationAvg, target: 85, improvement: 3 },
      { skill: 'Confidence', current: confidenceAvg, target: 88, improvement: 7 },
      { skill: 'Technical Knowledge', current: 78, target: 85, improvement: 4 },
      { skill: 'Leadership', current: 74, target: 80, improvement: 2 },
      { skill: 'Cultural Fit', current: 86, target: 90, improvement: 1 }
    ];

    // Personality usage stats
    const personalityUsage = userSessions.reduce((acc: any, session: any) => {
      const personality = session.personalityId || 'professional';
      acc[personality] = (acc[personality] || 0) + 1;
      return acc;
    }, {});

    // Company performance stats
    const companyStats = userSessions.reduce((acc: any, session: any) => {
      const company = session.company;
      if (!acc[company]) {
        acc[company] = { sessions: 0, avgScore: 0, bestScore: 0 };
      }
      acc[company].sessions += 1;
      acc[company].avgScore = (acc[company].avgScore + session.overallScore) / acc[company].sessions;
      acc[company].bestScore = Math.max(acc[company].bestScore, session.overallScore);
      return acc;
    }, {});

    setAnalyticsData({
      totalInterviews,
      averageScore,
      confidenceAvg,
      communicationAvg,
      improvementRate: 12, // Mock improvement rate
      streakDays: 5, // Mock streak
      personalityUsage,
      companyStats,
      weeklyProgress,
      skillBreakdown,
      recentSessions: userSessions.slice(-5).reverse()
    });
  };

  const personalityColors = {
    professional: '#3B82F6',
    friendly: '#10B981',
    technical: '#8B5CF6',
    executive: '#F59E0B'
  };

  const personalityNames = {
    professional: 'Professional Alex',
    friendly: 'Friendly Sam',
    technical: 'Technical Morgan',
    executive: 'Executive Jordan'
  };

  if (!currentUser || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const pieData = Object.entries(analyticsData.personalityUsage).map(([key, value]) => ({
    name: personalityNames[key as keyof typeof personalityNames] || key,
    value,
    color: personalityColors[key as keyof typeof personalityColors] || '#6B7280'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
              <p className="text-gray-300">Detailed insights into your interview progress</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['7days', '30days', '90days', 'all'].map(timeframe => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="border-white/20 text-white"
              >
                {timeframe === '7days' ? '7D' : timeframe === '30days' ? '30D' : timeframe === '90days' ? '90D' : 'All'}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Interviews</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalInterviews}</p>
              </div>
              <Mic className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex items-center mt-4 text-green-400">
              <ChevronUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+{analyticsData.improvementRate}% this month</span>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">{Math.round(analyticsData.averageScore)}%</p>
              </div>
              <Target className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="mt-4">
              <Progress value={analyticsData.averageScore} className="h-2" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Confidence Level</p>
                <p className="text-2xl font-bold text-white">{Math.round(analyticsData.confidenceAvg)}%</p>
              </div>
              <Brain className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-4">
              <Progress value={analyticsData.confidenceAvg} className="h-2" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Practice Streak</p>
                <p className="text-2xl font-bold text-white">{analyticsData.streakDays} days</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex items-center mt-4 text-yellow-400">
              <Award className="w-4 h-4 mr-1" />
              <span className="text-sm">Keep it up!</span>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Over Time */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="overall" stroke="#8B5CF6" strokeWidth={3} />
                <Line type="monotone" dataKey="confidence" stroke="#06B6D4" strokeWidth={2} />
                <Line type="monotone" dataKey="communication" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="technical" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Personality Usage */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">AI Personality Usage</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No data available
              </div>
            )}
            <div className="space-y-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-300 text-sm">{entry.name}</span>
                  </div>
                  <span className="text-white font-semibold">{entry.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skill Breakdown */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Skill Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.skillBreakdown.map((skill, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-medium">{skill.skill}</h4>
                  <div className="flex items-center text-green-400">
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm">+{skill.improvement}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current</span>
                    <span className="text-white">{Math.round(skill.current)}%</span>
                  </div>
                  <Progress value={skill.current} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Target</span>
                    <span className="text-cyan-400">{skill.target}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Company Performance */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Company Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(analyticsData.companyStats).map(([company, stats]: [string, any]) => (
              <div key={company} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold capitalize mb-3">{company}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sessions</span>
                    <span className="text-white">{stats.sessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Score</span>
                    <span className="text-cyan-400">{Math.round(stats.avgScore)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Score</span>
                    <span className="text-green-400">{Math.round(stats.bestScore)}%</span>
                  </div>
                  <Progress value={stats.avgScore} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Sessions</h3>
          <div className="space-y-4">
            {analyticsData.recentSessions.map((session, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <div>
                    <div className="text-white font-medium">
                      {session.company} - {session.type}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{Math.round(session.overallScore)}%</div>
                  <div className="text-gray-400 text-sm">Overall Score</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
