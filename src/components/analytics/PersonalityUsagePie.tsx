
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { personalityColors, personalityNames } from './analyticsUtils';

interface PersonalityUsagePieProps {
  personalityUsage: Record<string, number>;
}

const PersonalityUsagePie: React.FC<PersonalityUsagePieProps> = ({ personalityUsage }) => {
  const pieData = Object.entries(personalityUsage).map(([key, value]) => ({
    name: personalityNames[key as keyof typeof personalityNames] || key,
    value,
    color: personalityColors[key as keyof typeof personalityColors] || '#6B7280'
  }));

  return (
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
  );
};

export default PersonalityUsagePie;
