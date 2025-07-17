import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  Trophy, 
  Calendar,
  BarChart3,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';

interface PeerStats {
  totalSessions: number;
  averageScore: number;
  streak: number;
  ranking: number;
  totalPeers: number;
  percentile: number;
}

interface PersonalStats {
  totalSessions: number;
  averageScore: number;
  streak: number;
  weekSessions: number;
  monthSessions: number;
  improvementRate: number;
}

const MyProgress: React.FC = () => {
  const { user } = useAuth();
  const [personalStats, setPersonalStats] = useState<PersonalStats>({
    totalSessions: 0,
    averageScore: 0,
    streak: 0,
    weekSessions: 0,
    monthSessions: 0,
    improvementRate: 0
  });
  const [peerStats, setPeerStats] = useState<PeerStats>({
    totalSessions: 0,
    averageScore: 0,
    streak: 0,
    ranking: 0,
    totalPeers: 0,
    percentile: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      // Fetch personal stats
      const { data: activities } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Calculate personal stats
      const totalSessions = activities?.length || 0;
      const averageScore = activities?.reduce((sum, activity) => sum + (activity.score_achieved || 0), 0) / totalSessions || 0;
      
      // Calculate week/month sessions
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      const weekSessions = activities?.filter(a => new Date(a.created_at) > weekAgo).length || 0;
      const monthSessions = activities?.filter(a => new Date(a.created_at) > monthAgo).length || 0;

      setPersonalStats({
        totalSessions,
        averageScore: Math.round(averageScore),
        streak: 5, // Mock data - would calculate from actual streaks
        weekSessions,
        monthSessions,
        improvementRate: 25 // Mock data - would calculate from historical scores
      });

      // Mock peer stats (would be calculated from peer group data)
      setPeerStats({
        totalSessions: 28,
        averageScore: 75,
        streak: 3,
        ranking: 4,
        totalPeers: 12,
        percentile: 80
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankingColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-400';
    if (percentile >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Progress</h1>
            <p className="text-muted-foreground">Track your interview skills and compare with peers</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            View Detailed Analytics
          </Button>
        </div>

        {/* Personal Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{personalStats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{personalStats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{personalStats.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{personalStats.weekSessions}</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">+{personalStats.improvementRate}%</div>
            <div className="text-sm text-muted-foreground">Improvement</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{peerStats.ranking}</div>
            <div className="text-sm text-muted-foreground">Peer Rank</div>
          </Card>
        </div>

        {/* Peer Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-foreground">Peer Group Ranking</h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className={`text-4xl font-bold ${getRankingColor(peerStats.percentile)}`}>
                  #{peerStats.ranking}
                </div>
                <div className="text-muted-foreground">out of {peerStats.totalPeers} peers</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Your Position</span>
                  <Badge className={getRankingColor(peerStats.percentile)}>
                    Top {100 - peerStats.percentile}%
                  </Badge>
                </div>
                <Progress value={peerStats.percentile} className="h-2" />
              </div>

              <div className="text-sm text-muted-foreground">
                You're performing better than {peerStats.percentile}% of peers with similar backgrounds
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-foreground">Performance Comparison</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sessions Completed</span>
                <div className="text-right">
                  <div className="text-foreground font-medium">You: {personalStats.totalSessions}</div>
                  <div className="text-muted-foreground text-sm">Avg: {peerStats.totalSessions}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <div className="text-right">
                  <div className="text-foreground font-medium">You: {personalStats.averageScore}%</div>
                  <div className="text-muted-foreground text-sm">Avg: {peerStats.averageScore}%</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <div className="text-right">
                  <div className="text-foreground font-medium">You: {personalStats.streak} days</div>
                  <div className="text-muted-foreground text-sm">Avg: {peerStats.streak} days</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Motivational Messages */}
        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-foreground">Motivation</h3>
          </div>
          <p className="text-foreground/90 mb-2">
            🚀 You're outperforming 80% of users in your peer group this week!
          </p>
          <p className="text-muted-foreground text-sm">
            Keep up the momentum! 2 more practice sessions and you'll beat your peer group average.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default MyProgress;