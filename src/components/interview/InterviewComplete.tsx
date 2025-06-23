
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface InterviewCompleteProps {
  questionsLength: number;
  selectedPersonality: string;
  onViewHistory: () => void;
  onPracticeAgain: () => void;
  getPersonalityById: (id: string) => any;
}

const InterviewComplete: React.FC<InterviewCompleteProps> = ({
  questionsLength,
  selectedPersonality,
  onViewHistory,
  onPracticeAgain,
  getPersonalityById
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 dark:bg-white/10 dark:border-white/20 bg-white border-gray-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-4">Interview Complete!</h2>
        <p className="text-muted-foreground mb-6">
          You completed {questionsLength} questions with {getPersonalityById(selectedPersonality)?.name}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onViewHistory}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          >
            View History
          </Button>
          <Button
            onClick={onPracticeAgain}
            variant="outline"
            className="border-white/20 text-foreground hover:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10 border-gray-200 hover:bg-gray-100"
          >
            Practice Again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InterviewComplete;
