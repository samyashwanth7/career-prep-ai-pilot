
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Target, Brain, Zap, ChevronUp, Award } from 'lucide-react';

interface KeyMetricsProps {
  data: {
    totalInterviews: number;
    improvementRate: number;
    averageScore: number;
    confidenceAvg: number;
    streakDays: number;
  };
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Total Interviews</p>
          <p className="text-2xl font-bold text-white">{data.totalInterviews}</p>
        </div>
        <Mic className="w-8 h-8 text-purple-400" />
      </div>
      <div className="flex items-center mt-4 text-green-400">
        <ChevronUp className="w-4 h-4 mr-1" />
        <span className="text-sm">+{data.improvementRate}% this month</span>
      </div>
    </Card>

    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Average Score</p>
          <p className="text-2xl font-bold text-white">{Math.round(data.averageScore)}%</p>
        </div>
        <Target className="w-8 h-8 text-cyan-400" />
      </div>
      <div className="mt-4">
        <Progress value={data.averageScore} className="h-2" />
      </div>
    </Card>

    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Confidence Level</p>
          <p className="text-2xl font-bold text-white">{Math.round(data.confidenceAvg)}%</p>
        </div>
        <Brain className="w-8 h-8 text-green-400" />
      </div>
      <div className="mt-4">
        <Progress value={data.confidenceAvg} className="h-2" />
      </div>
    </Card>

    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Practice Streak</p>
          <p className="text-2xl font-bold text-white">{data.streakDays} days</p>
        </div>
        <Zap className="w-8 h-8 text-yellow-400" />
      </div>
      <div className="flex items-center mt-4 text-yellow-400">
        <Award className="w-4 h-4 mr-1" />
        <span className="text-sm">Keep it up!</span>
      </div>
    </Card>
  </div>
);

export default KeyMetrics;
