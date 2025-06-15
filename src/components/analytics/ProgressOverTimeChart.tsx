
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressOverTimeChartProps {
  data: any[];
}

const ProgressOverTimeChart: React.FC<ProgressOverTimeChartProps> = ({ data }) => (
  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Progress Over Time</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="week" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="overall" stroke="#8B5CF6" strokeWidth={3} />
        <Line type="monotone" dataKey="confidence" stroke="#06B6D4" strokeWidth={2} />
        <Line type="monotone" dataKey="communication" stroke="#10B981" strokeWidth={2} />
        <Line type="monotone" dataKey="technical" stroke="#F59E0B" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export default ProgressOverTimeChart;
