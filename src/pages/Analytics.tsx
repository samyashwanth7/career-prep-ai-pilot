
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load sessions and stats
    const userSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    
    setSessions(userSessions);
    setStats(userStats);
  }, [navigate]);

  // Process data for charts
  const processPerformanceData = () => {
    if (!sessions.length) return [];
    
    return sessions.map((session, index) => ({
      session: `Session ${index + 1}`,
      score: session.overallScore,
      company: session.company,
      type: session.type,
      date: new Date(session.startTime).toLocaleDateString()
    }));
  };

  const processSkillsData = () => {
    if (!sessions.length) return [];
    
    const skillAverages = {
      technical: 0,
      behavioral: 0,
      communication: 0,
      problemSolving: 0,
      leadership: 0,
      coding: 0
    };
    
    let counts = { ...skillAverages };
    
    sessions.forEach(session => {
      if (session.type === 'technical') {
        skillAverages.technical += session.overallScore;
        skillAverages.coding += session.overallScore;
        skillAverages.problemSolving += session.overallScore;
        counts.technical++;
        counts.coding++;
        counts.problemSolving++;
      } else if (session.type === 'behavioral') {
        skillAverages.behavioral += session.overallScore;
        skillAverages.communication += session.overallScore;
        skillAverages.leadership += session.overallScore;
        counts.behavioral++;
        counts.communication++;
        counts.leadership++;
      }
    });
    
    return Object.keys(skillAverages).map(skill => ({
      skill,
      score: counts[skill as keyof typeof counts] > 0 
        ? Math.round(skillAverages[skill as keyof typeof skillAverages] / counts[skill as keyof typeof counts])
        : 0,
      fullMark: 100
    }));
  };

  const processCompanyData = () => {
    if (!sessions.length) return [];
    
    const companyStats: { [key: string]: { total: number, count: number } } = {};
    
    sessions.forEach(session => {
      if (!companyStats[session.company]) {
        companyStats[session.company] = { total: 0, count: 0 };
      }
      companyStats[session.company].total += session.overallScore;
      companyStats[session.company].count++;
    });
    
    return Object.keys(companyStats).map(company => ({
      company,
      readiness: Math.round(companyStats[company].total / companyStats[company].count),
      sessions: companyStats[company].count
    }));
  };

  const processTypeData = () => {
    if (!sessions.length) return [];
    
    const typeStats: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      typeStats[session.type] = (typeStats[session.type] || 0) + 1;
    });
    
    return Object.keys(typeStats).map(type => ({
      name: type,
      value: typeStats[type]
    }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const performanceData = processPerformanceData();
  const skillsData = processSkillsData();
  const companyData = processCompanyData();
  const typeData = processTypeData();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
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
              <h1 className="text-xl font-bold text-white">Performance Analytics</h1>
              <p className="text-sm text-gray-400">Track your interview progress and insights</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {sessions.length}
            </div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">
                {sessions.length > 1 ? '↗' : ''}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {sessions.length > 0 
                ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-400">Average Score</div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm">🏆</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {sessions.length > 0 ? Math.max(...sessions.map(s => s.overallScore)) : 0}%
            </div>
            <div className="text-sm text-gray-400">Best Score</div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm">📈</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {sessions.length > 1
                ? Math.round(((sessions[sessions.length - 1]?.overallScore || 0) - (sessions[0]?.overallScore || 0)))
                : 0
              }%
            </div>
            <div className="text-sm text-gray-400">Improvement</div>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="performance" className="data-[state=active]:bg-white/20">
              Performance Trends
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-white/20">
              Skills Analysis
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-white/20">
              Company Readiness
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white/20">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="session" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No performance data yet. Complete some interviews to see your progress!
                </div>
              )}
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Interview Types Distribution</h3>
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No interview data yet. Start practicing to see your distribution!
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Skills Radar</h3>
              {skillsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={skillsData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
                    <PolarRadiusAxis 
                      angle={0} 
                      domain={[0, 100]} 
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Complete interviews to see your skills analysis!
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Company Readiness</h3>
              {companyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={companyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="company" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="readiness" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Practice with different companies to see your readiness scores!
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
                <div className="space-y-4">
                  {sessions.length === 0 ? (
                    <p className="text-gray-400">Complete some interviews to get personalized insights!</p>
                  ) : (
                    <>
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-medium mb-2">Strengths</h4>
                        <p className="text-gray-300">
                          {sessions.filter(s => s.overallScore > 80).length > 0
                            ? "You consistently perform well under pressure and provide structured answers."
                            : "Focus on practicing more to identify your strengths."}
                        </p>
                      </div>
                      <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                        <h4 className="text-orange-400 font-medium mb-2">Areas for Improvement</h4>
                        <p className="text-gray-300">
                          {sessions.filter(s => s.type === 'technical').length < sessions.filter(s => s.type === 'behavioral').length
                            ? "Consider practicing more technical interviews to balance your skills."
                            : "Work on behavioral questions using the STAR method for better structure."}
                        </p>
                      </div>
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <h4 className="text-green-400 font-medium mb-2">Recommendations</h4>
                        <p className="text-gray-300">
                          Based on your progress, we recommend focusing on {
                            companyData.length > 0 
                              ? `${companyData.sort((a, b) => a.readiness - b.readiness)[0]?.company} interview preparation`
                              : "building a consistent practice routine"
                          }.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {sessions.slice(-5).reverse().map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <div className="text-white font-medium capitalize">
                          {session.company} - {session.type}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={`${
                            session.overallScore >= 80 
                              ? 'bg-green-500/20 text-green-400'
                              : session.overallScore >= 60
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {Math.round(session.overallScore)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                      No sessions yet. Start practicing to see your history!
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
