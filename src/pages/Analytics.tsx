import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIInsights from '@/components/AIInsights';
import AIAssistant from '@/components/AIAssistant';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import KeyMetrics from '@/components/analytics/KeyMetrics';
import ProgressOverTimeChart from '@/components/analytics/ProgressOverTimeChart';
import PersonalityUsagePie from '@/components/analytics/PersonalityUsagePie';
import SkillBreakdownGrid from '@/components/analytics/SkillBreakdownGrid';
import CompanyPerformanceGrid from '@/components/analytics/CompanyPerformanceGrid';
import RecentSessionsList from '@/components/analytics/RecentSessionsList';

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

  if (!currentUser || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <AnalyticsHeader
            onBack={() => navigate('/dashboard')}
          />
          <TimeframeSelector
            selected={selectedTimeframe}
            onSelect={setSelectedTimeframe}
          />
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <AIInsights analyticsData={analyticsData} />
        </div>

        {/* Key Metrics */}
        <KeyMetrics
          data={{
            totalInterviews: analyticsData.totalInterviews,
            improvementRate: analyticsData.improvementRate,
            averageScore: analyticsData.averageScore,
            confidenceAvg: analyticsData.confidenceAvg,
            streakDays: analyticsData.streakDays
          }}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ProgressOverTimeChart data={analyticsData.weeklyProgress} />
          </div>
          <div>
            <PersonalityUsagePie personalityUsage={analyticsData.personalityUsage} />
          </div>
        </div>

        {/* Skill Breakdown */}
        <SkillBreakdownGrid skills={analyticsData.skillBreakdown} />

        {/* Company Performance */}
        <CompanyPerformanceGrid companyStats={analyticsData.companyStats} />

        {/* Recent Sessions */}
        <RecentSessionsList sessions={analyticsData.recentSessions} />
      </div>
      <AIAssistant context="analytics" />
    </div>
  );
};

export default Analytics;
