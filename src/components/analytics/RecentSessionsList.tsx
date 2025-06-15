
import React from 'react';
import { Card } from '@/components/ui/card';

interface RecentSessionsListProps {
  sessions: any[];
}

const RecentSessionsList: React.FC<RecentSessionsListProps> = ({ sessions }) => (
  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Recent Sessions</h3>
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
            <div>
              <div className="text-white font-medium">
                {session.company} - {session.type}
              </div>
              <div className="text-gray-400 text-sm">
                {new Date(session.startTime).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">{Math.round(session.overallScore)}%</div>
            <div className="text-gray-400 text-sm">Overall Score</div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default RecentSessionsList;
