
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompanyPerformanceGridProps {
  companyStats: Record<string, any>;
}

const CompanyPerformanceGrid: React.FC<CompanyPerformanceGridProps> = ({ companyStats }) => (
  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
    <h3 className="text-xl font-semibold text-white mb-6">Company Performance</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(companyStats).map(([company, stats]: [string, any]) => (
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
);

export default CompanyPerformanceGrid;
