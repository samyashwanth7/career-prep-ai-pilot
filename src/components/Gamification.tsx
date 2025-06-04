
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Target, Zap, Award, Star } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  requirement: number;
  xpReward: number;
}

interface XPSystem {
  currentXP: number;
  level: number;
  nextLevelXP: number;
  totalXP: number;
}

const Gamification = () => {
  const [xpSystem, setXPSystem] = useState<XPSystem>({
    currentXP: 0,
    level: 1,
    nextLevelXP: 500,
    totalXP: 0
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_interview',
      name: 'First Steps',
      description: 'Complete your first interview',
      icon: <Star className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      requirement: 1,
      xpReward: 100
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Practice for 7 days in a row',
      icon: <Flame className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      requirement: 7,
      xpReward: 300
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Score 90% or higher in 3 interviews',
      icon: <Target className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      requirement: 3,
      xpReward: 250
    },
    {
      id: 'company_explorer',
      name: 'Company Explorer',
      description: 'Practice with 5 different companies',
      icon: <Award className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      requirement: 5,
      xpReward: 200
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete 10 questions under time limit',
      icon: <Zap className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      requirement: 10,
      xpReward: 150
    }
  ]);

  useEffect(() => {
    loadGameData();
    checkForNewAchievements();
  }, []);

  const loadGameData = () => {
    const savedXP = localStorage.getItem('userXP');
    const savedAchievements = localStorage.getItem('userAchievements');
    
    if (savedXP) {
      setXPSystem(JSON.parse(savedXP));
    }
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  };

  const checkForNewAchievements = () => {
    const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    
    if (sessions.length === 0) return;

    const updatedAchievements = achievements.map(achievement => {
      let progress = 0;
      
      switch (achievement.id) {
        case 'first_interview':
          progress = sessions.length > 0 ? 1 : 0;
          break;
        case 'perfectionist':
          progress = sessions.filter((s: any) => s.overallScore >= 90).length;
          break;
        case 'company_explorer':
          const uniqueCompanies = new Set(sessions.map((s: any) => s.company));
          progress = uniqueCompanies.size;
          break;
        case 'speed_demon':
          progress = sessions.reduce((acc: number, s: any) => {
            return acc + s.responses.filter((r: any) => r.duration < 120).length;
          }, 0);
          break;
        // streak_master would need more complex date tracking
        default:
          break;
      }
      
      const unlocked = progress >= achievement.requirement;
      
      // Award XP if newly unlocked
      if (unlocked && !achievement.unlocked) {
        awardXP(achievement.xpReward);
      }
      
      return {
        ...achievement,
        progress: Math.min(progress, achievement.requirement),
        unlocked
      };
    });
    
    setAchievements(updatedAchievements);
    localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
  };

  const awardXP = (amount: number) => {
    setXPSystem(prevXP => {
      const newTotalXP = prevXP.totalXP + amount;
      const newCurrentXP = prevXP.currentXP + amount;
      
      // Level up logic
      let newLevel = prevXP.level;
      let newNextLevelXP = prevXP.nextLevelXP;
      let remainingXP = newCurrentXP;
      
      while (remainingXP >= newNextLevelXP) {
        remainingXP -= newNextLevelXP;
        newLevel++;
        newNextLevelXP = newLevel * 500; // Each level requires 500 more XP than the previous
      }
      
      const updatedXP = {
        currentXP: remainingXP,
        level: newLevel,
        nextLevelXP: newNextLevelXP,
        totalXP: newTotalXP
      };
      
      localStorage.setItem('userXP', JSON.stringify(updatedXP));
      return updatedXP;
    });
  };

  const getLevelName = (level: number) => {
    const levelNames = {
      1: 'Interview Newbie',
      2: 'Practice Padawan', 
      3: 'Interview Apprentice',
      4: 'Coding Warrior',
      5: 'Interview Master',
      6: 'FAANG Ready',
      7: 'Interview Legend'
    };
    return levelNames[level as keyof typeof levelNames] || `Level ${level} Expert`;
  };

  return (
    <div className="space-y-6">
      {/* XP and Level */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-lg border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{getLevelName(xpSystem.level)}</h3>
            <p className="text-gray-300">Level {xpSystem.level}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{xpSystem.totalXP}</div>
            <div className="text-gray-300">Total XP</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{xpSystem.currentXP} / {xpSystem.nextLevelXP} XP</span>
            <span className="text-gray-300">Next: {getLevelName(xpSystem.level + 1)}</span>
          </div>
          <Progress 
            value={(xpSystem.currentXP / xpSystem.nextLevelXP) * 100} 
            className="h-3"
          />
        </div>
      </Card>

      {/* Achievements */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Achievements
        </h3>
        <div className="grid gap-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-green-500/20 border-green-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-green-500/30 text-green-400'
                    : 'bg-gray-500/30 text-gray-400'
                }`}>
                  {achievement.icon}
                </div>
                <div>
                  <div className="font-medium text-white">{achievement.name}</div>
                  <div className="text-sm text-gray-400">{achievement.description}</div>
                  {!achievement.unlocked && (
                    <div className="mt-1">
                      <Progress 
                        value={(achievement.progress / achievement.requirement) * 100}
                        className="h-2 w-32"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {achievement.progress} / {achievement.requirement}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {achievement.unlocked ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    Unlocked!
                  </Badge>
                ) : (
                  <div className="text-yellow-400 font-medium">
                    +{achievement.xpReward} XP
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Gamification;
