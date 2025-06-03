
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Briefcase, 
  BarChart3, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Clock,
  Trophy,
  Flame,
  PlayCircle,
  Settings,
  LogOut,
  User
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Initialize demo data if it doesn't exist
    initializeDemoData();
  }, [navigate]);

  const initializeDemoData = () => {
    if (!localStorage.getItem('userStats')) {
      const demoStats = {
        totalInterviews: 12,
        successRate: 78,
        averageScore: 82,
        streak: 5,
        level: 'Intermediate',
        xp: 2340,
        nextLevelXP: 3000
      };
      localStorage.setItem('userStats', JSON.stringify(demoStats));
    }

    if (!localStorage.getItem('recentActivity')) {
      const recentActivity = [
        { type: 'interview', company: 'Google', score: 85, date: '2024-01-15' },
        { type: 'interview', company: 'Meta', score: 78, date: '2024-01-14' },
        { type: 'application', company: 'Amazon', status: 'applied', date: '2024-01-13' },
        { type: 'interview', company: 'Apple', score: 91, date: '2024-01-12' }
      ];
      localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
  const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');

  const features = [
    {
      icon: Briefcase,
      title: "Job Applications",
      description: "Smart job search and bulk applications",
      path: "/jobs",
      color: "from-blue-500 to-cyan-500",
      count: "23 active"
    },
    {
      icon: Mic,
      title: "AI Interview",
      description: "Practice with voice recording and real-time feedback",
      path: "/interview",
      color: "from-purple-500 to-pink-500",
      count: "Start now"
    },
    {
      icon: Users,
      title: "Company Practice",
      description: "FAANG-specific interview preparation",
      path: "/companies",
      color: "from-green-500 to-emerald-500",
      count: "15 companies"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track your progress and performance",
      path: "/analytics",
      color: "from-orange-500 to-red-500",
      count: "View insights"
    }
  ];

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Interviewer</h1>
              <p className="text-sm text-gray-400">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">{currentUser.avatar || '👤'}</div>
              <div>
                <p className="text-white font-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-400">{stats.level || 'Beginner'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => navigate('/profile')}
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {currentUser.name}! 👋
          </h2>
          <p className="text-gray-400">Ready to ace your next interview? Let's continue your preparation journey.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                Level {stats.level}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.xp || 0}</div>
            <div className="text-sm text-gray-400">Experience Points</div>
            <Progress value={(stats.xp / stats.nextLevelXP) * 100} className="mt-2 h-2" />
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">+5%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.successRate || 0}%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm">↗ 12</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalInterviews || 0}</div>
            <div className="text-sm text-gray-400">Interviews Completed</div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 text-sm">🔥</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.streak || 0}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </Card>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Button
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => navigate(feature.path)}
                    >
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
                  <Badge variant="outline" className="border-white/20 text-gray-300">
                    {feature.count}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg ${
                        activity.type === 'interview' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      } flex items-center justify-center`}>
                        {activity.type === 'interview' ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {activity.type === 'interview' 
                            ? `Interview with ${activity.company}` 
                            : `Applied to ${activity.company}`
                          }
                        </p>
                        <p className="text-gray-400 text-xs">{activity.date}</p>
                      </div>
                    </div>
                    {activity.score && (
                      <Badge variant="outline" className="border-green-400/20 text-green-400">
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => navigate('/history')}
                >
                  View All Activity
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6 mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">This Week</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Interviews</span>
                  <span className="text-white font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Applications</span>
                  <span className="text-white font-medium">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Score</span>
                  <span className="text-white font-medium">84%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-lg border-white/10 p-8 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Recommended for You</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Practice Behavioral Questions</h4>
                <p className="text-gray-400 text-sm">Based on your target role, focus on leadership scenarios</p>
                <Button size="sm" className="mt-2 bg-purple-500 hover:bg-purple-600">
                  Start Practice
                </Button>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Google Interview Prep</h4>
                <p className="text-gray-400 text-sm">You've applied to Google - practice their specific format</p>
                <Button size="sm" className="mt-2 bg-cyan-500 hover:bg-cyan-600">
                  Practice Now
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
