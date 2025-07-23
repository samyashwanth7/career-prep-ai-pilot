import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Users, 
  Crown, 
  Building, 
  Briefcase, 
  GraduationCap,
  Zap,
  Clock,
  Target
} from 'lucide-react';

interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  questionCount: number;
  categories: string[];
}

const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Programming, algorithms, and system design questions',
    icon: <Code className="w-6 h-6" />,
    difficulty: 'Advanced',
    duration: '45-60 min',
    questionCount: 8,
    categories: ['Coding', 'Algorithms', 'System Design', 'Architecture']
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Soft skills, past experiences, and cultural fit',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'Intermediate',
    duration: '30-45 min',
    questionCount: 6,
    categories: ['Teamwork', 'Leadership', 'Problem Solving', 'Communication']
  },
  {
    id: 'leadership',
    title: 'Leadership Interview',
    description: 'Management scenarios and strategic thinking',
    icon: <Crown className="w-6 h-6" />,
    difficulty: 'Advanced',
    duration: '45-60 min',
    questionCount: 7,
    categories: ['Management', 'Strategy', 'Decision Making', 'Team Building']
  },
  {
    id: 'company-specific',
    title: 'Company-Specific',
    description: 'Tailored questions for specific companies',
    icon: <Building className="w-6 h-6" />,
    difficulty: 'Intermediate',
    duration: '30-45 min',
    questionCount: 10,
    categories: ['FAANG', 'Startups', 'Fortune 500', 'Remote Companies']
  },
  {
    id: 'industry-specific',
    title: 'Industry-Specific',
    description: 'Questions tailored to specific industries',
    icon: <Briefcase className="w-6 h-6" />,
    difficulty: 'Intermediate',
    duration: '30-45 min',
    questionCount: 8,
    categories: ['Healthcare', 'Finance', 'Education', 'Technology']
  },
  {
    id: 'entry-level',
    title: 'Entry Level',
    description: 'Perfect for new graduates and career changers',
    icon: <GraduationCap className="w-6 h-6" />,
    difficulty: 'Beginner',
    duration: '20-30 min',
    questionCount: 5,
    categories: ['Basic Skills', 'Motivation', 'Learning Ability', 'Potential']
  }
];

interface InterviewTypeSelectionProps {
  onSelectType: (type: InterviewType) => void;
}

export default function InterviewTypeSelection({ onSelectType }: InterviewTypeSelectionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Choose Your Interview Type
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the type of interview you'd like to practice. Each type includes AI-powered questions and real-time feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTERVIEW_TYPES.map((type) => (
          <Card 
            key={type.id}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border hover:border-primary/50"
            onClick={() => onSelectType(type)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{type.title}</h3>
                  </div>
                </div>
                <Badge className={getDifficultyColor(type.difficulty)}>
                  {type.difficulty}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {type.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{type.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{type.questionCount} questions</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-1">
                  {type.categories.slice(0, 3).map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {type.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{type.categories.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full mt-4" variant="outline">
                <Zap className="mr-2 w-4 h-4" />
                Start Practice
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-accent/10 rounded-xl p-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Questions Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">AI-Powered</div>
            <div className="text-sm text-muted-foreground">Real-time Feedback</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">Unlimited</div>
            <div className="text-sm text-muted-foreground">Practice Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">Track</div>
            <div className="text-sm text-muted-foreground">Your Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}