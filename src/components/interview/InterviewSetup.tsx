
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Brain, Briefcase, Trophy } from 'lucide-react';
import QuestionCategories, { categories } from './QuestionCategories';

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  style: string;
  icon: React.ReactNode;
  color: string;
  traits: string[];
}

interface InterviewSetupProps {
  selectedCategory: string;
  selectedPersonality: string;
  onCategorySelect: (category: string) => void;
  onPersonalitySelect: (personality: string) => void;
  onStartInterview: () => void;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({
  selectedCategory,
  selectedPersonality,
  onCategorySelect,
  onPersonalitySelect,
  onStartInterview
}) => {
  const aiPersonalities: AIPersonality[] = [
    {
      id: 'professional',
      name: 'Professional Alex',
      description: 'Formal, structured approach with detailed feedback',
      style: 'Direct and thorough questioning style',
      icon: <User className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      traits: ['Formal', 'Detailed', 'Structured', 'Analytical']
    },
    {
      id: 'friendly',
      name: 'Friendly Sam',
      description: 'Warm, encouraging style that builds confidence',
      style: 'Supportive and conversational approach',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      traits: ['Encouraging', 'Warm', 'Patient', 'Supportive']
    },
    {
      id: 'technical',
      name: 'Technical Morgan',
      description: 'Deep technical focus with challenging questions',
      style: 'Technical depth and problem-solving focus',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600',
      traits: ['Technical', 'Challenging', 'Precise', 'Deep']
    },
    {
      id: 'executive',
      name: 'Executive Jordan',
      description: 'Senior-level scenarios and strategic thinking',
      style: 'High-level strategic and leadership focus',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      traits: ['Strategic', 'Leadership', 'Vision', 'Results']
    }
  ];

  return (
    <div className="space-y-8">
      <QuestionCategories
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />

      {selectedCategory && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 dark:bg-white/10 dark:border-white/20 bg-white border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Choose Your AI Interviewer</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {aiPersonalities.map(personality => (
              <button
                key={personality.id}
                onClick={() => onPersonalitySelect(personality.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedPersonality === personality.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${personality.color} flex items-center justify-center text-white mb-4`}>
                  {personality.icon}
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">{personality.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{personality.description}</p>
                <div className="flex flex-wrap gap-2">
                  {personality.traits.map(trait => (
                    <Badge key={trait} variant="outline" className="border-gray-500 text-muted-foreground text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={onStartInterview}
            disabled={!selectedCategory || !selectedPersonality}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          >
            Start AI Interview
          </Button>
        </Card>
      )}
    </div>
  );
};

export default InterviewSetup;
