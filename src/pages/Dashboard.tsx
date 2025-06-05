
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  BarChart3, 
  Briefcase, 
  User, 
  Play,
  TrendingUp,
  Calendar,
  Trophy,
  Target,
  FileText,
  MapPin,
  Zap,
  Clock,
  Star
} from 'lucide-react';
import Gamification from '@/components/Gamification';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    totalApplications: 0,
    responseRate: 0,
    currentStreak: 0,
    totalXP: 0,
    level: 1
  });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load user stats
    const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const userXP = JSON.parse(localStorage.getItem('userXP') || '{"totalXP": 0, "level": 1}');
    const parsedUser = JSON.parse(user);

    const userSessions = sessions.filter((s: any) => s.userId === parsedUser.id);
    const userApplications = applications.filter((a: any) => a.userId === parsedUser.id);

    setStats({
      totalInterviews: userSessions.length,
      avgScore: userSessions.length > 0 
        ? Math.round(userSessions.reduce((sum: number, s: any) => sum + s.overallScore, 0) / userSessions.length)
        : 0,
      totalApplications: userApplications.length,
      responseRate: Math.round(Math.random() * 15 + 5), // Simulated
      currentStreak: Math.floor(Math.random() * 7) + 1, // Simulated
      totalXP: userXP.totalXP,
      level: userXP.level
    });
  }, [navigate]);

  const quickActions = [
    {
      title: "AI Interview Practice",
      description: "General interview practice",
      icon: <Mic className="w-6 h-6" />,
      color: "from-purple-500 to-blue-500",
      onClick: () => navigate('/interview')
    },
    {
      title: "Company Practice",
      description: "Company-specific simulations",
      icon: <Building className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      onClick: () => navigate('/company-practice')
    },
    {
      title: "Career Roadmap",
      description: "Personalized learning path",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      onClick: () => navigate('/career-roadmap')
    },
    {
      title: "Resume Analyzer",
      description: "AI-powered optimization",
      icon: <FileText className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      onClick: () => navigate('/resume-analyzer')
    },
    {
      title: "Bulk Applications",
      description: "Apply to multiple jobs",
      icon: <Zap className="w-6 h-6" />,
      color: "from-pink-500 to-purple-500",
      onClick: () => navigate('/bulk-applications')
    },
    {
      title: "Job Search",
      description: "Find and apply to jobs",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
      onClick: () => navigate('/jobs')
    }
  ];

  const recentActivity = [
    { type: 'interview', message: 'Completed Google technical interview', time: '2 hours ago', score: 85 },
    { type: 'application', message: 'Applied to 5 new positions', time: '1 day ago' },
    { type: 'achievement', message: 'Earned "Week Warrior" badge', time: '2 days ago' },
    { type: 'roadmap', message: 'Completed React fundamentals phase', time: '3 days ago' }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="text-gray-300 mt-2">Ready to advance your career today?</p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem('currentUser');
              navigate('/');
            }}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <User className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="flex items-center">
                  <Mic className="w-8 h-8 text-purple-400 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Interviews</div>
                    <div className="text-2xl font-bold text-purple-400">{stats.totalInterviews}</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Avg Score</div>
                    <div className="text-2xl font-bold text-green-400">{stats.avgScore}%</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="flex items-center">
                  <Briefcase className="w-8 h-8 text-cyan-400 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Applications</div>
                    <div className="text-2xl font-bold text-cyan-400">{stats.totalApplications}</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Level</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.level}</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`p-4 rounded-lg bg-gradient-to-r ${action.color} hover:scale-105 transition-transform text-left`}
                  >
                    <div className="flex items-center mb-2">
                      <div className="text-white">{action.icon}</div>
                      <h3 className="text-white font-semibold ml-2 text-sm">{action.title}</h3>
                    </div>
                    <p className="text-white/80 text-xs">{action.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        activity.type === 'interview' ? 'bg-purple-400' :
                        activity.type === 'application' ? 'bg-cyan-400' :
                        activity.type === 'achievement' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}></div>
                      <div>
                        <div className="text-white text-sm">{activity.message}</div>
                        <div className="text-gray-400 text-xs">{activity.time}</div>
                      </div>
                    </div>
                    {activity.score && (
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Goals */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Weekly Goals</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Complete 5 interviews</span>
                    <span className="text-gray-400">{Math.min(stats.totalInterviews, 5)}/5</span>
                  </div>
                  <Progress value={(Math.min(stats.totalInterviews, 5) / 5) * 100} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Apply to 10 jobs</span>
                    <span className="text-gray-400">{Math.min(stats.totalApplications, 10)}/10</span>
                  </div>
                  <Progress value={(Math.min(stats.totalApplications, 10) / 10) * 100} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">7-day practice streak</span>
                    <span className="text-gray-400">{stats.currentStreak}/7</span>
                  </div>
                  <Progress value={(stats.currentStreak / 7) * 100} />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Navigate</h2>
              <div className="space-y-2">
                {[
                  { name: 'Interview Practice', path: '/interview', icon: <Mic className="w-4 h-4" /> },
                  { name: 'Company Practice', path: '/company-practice', icon: <Building className="w-4 h-4" /> },
                  { name: 'Career Roadmap', path: '/career-roadmap', icon: <MapPin className="w-4 h-4" /> },
                  { name: 'Resume Analyzer', path: '/resume-analyzer', icon: <FileText className="w-4 h-4" /> },
                  { name: 'Bulk Applications', path: '/bulk-applications', icon: <Zap className="w-4 h-4" /> },
                  { name: 'Job Search', path: '/jobs', icon: <Briefcase className="w-4 h-4" /> },
                  { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center p-3 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Gamification Component */}
            <Gamification />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
