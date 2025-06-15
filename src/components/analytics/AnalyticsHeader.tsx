
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AnalyticsHeaderProps {
  onBack: () => void;
  className?: string;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ onBack, className }) => (
  <div className={`flex items-center ${className || ''}`}>
    <Button
      variant="ghost"
      onClick={onBack}
      className="text-white hover:bg-white/10 mr-4"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
    <div>
      <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
      <p className="text-gray-300">AI-powered insights into your interview progress</p>
    </div>
  </div>
);

export default AnalyticsHeader;
