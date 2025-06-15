
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronUp } from 'lucide-react';

interface SkillBreakdownGridProps {
  skills: any[];
}

const SkillBreakdownGrid: React.FC<SkillBreakdownGridProps> = ({ skills }) => (
  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
    <h3 className="text-xl font-semibold text-white mb-6">Skill Breakdown</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
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
);

export default SkillBreakdownGrid;
