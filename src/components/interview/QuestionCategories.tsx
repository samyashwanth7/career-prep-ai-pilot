
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Lightbulb, Code, Target, MessageCircle } from 'lucide-react';

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  questionCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  examples: string[];
}

interface QuestionCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const categories: QuestionCategory[] = [
  {
    id: 'behavioral',
    name: 'Behavioral Questions',
    description: 'Questions about past experiences and how you handled situations',
    icon: <Users className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    questionCount: 25,
    difficulty: 'Intermediate',
    examples: [
      'Tell me about a time you overcame a challenge',
      'Describe a situation where you had to work with a difficult team member',
      'Give an example of when you showed leadership'
    ]
  },
  {
    id: 'technical',
    name: 'Technical Questions',
    description: 'Role-specific technical knowledge and problem-solving',
    icon: <Code className="w-5 h-5" />,
    color: 'from-purple-500 to-violet-500',
    questionCount: 30,
    difficulty: 'Advanced',
    examples: [
      'Explain the difference between SQL and NoSQL databases',
      'How would you optimize a slow-performing application?',
      'Design a system to handle 1 million concurrent users'
    ]
  },
  {
    id: 'situational',
    name: 'Situational Questions',
    description: 'Hypothetical scenarios to test decision-making skills',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
    questionCount: 20,
    difficulty: 'Intermediate',
    examples: [
      'How would you handle a tight deadline with limited resources?',
      'What would you do if you disagreed with your manager?',
      'How would you prioritize multiple urgent tasks?'
    ]
  },
  {
    id: 'communication',
    name: 'Communication Skills',
    description: 'Questions focused on communication and interpersonal skills',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    questionCount: 15,
    difficulty: 'Beginner',
    examples: [
      'How do you explain complex concepts to non-technical people?',
      'Describe your communication style',
      'How do you handle giving constructive feedback?'
    ]
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    description: 'Analytical thinking and creative problem-solving scenarios',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500',
    questionCount: 18,
    difficulty: 'Advanced',
    examples: [
      'Walk me through your problem-solving process',
      'How would you approach an unfamiliar technical challenge?',
      'Describe a time you found a creative solution to a problem'
    ]
  },
  {
    id: 'goals-motivation',
    name: 'Goals & Motivation',
    description: 'Questions about career goals, motivation, and cultural fit',
    icon: <Target className="w-5 h-5" />,
    color: 'from-teal-500 to-cyan-500',
    questionCount: 12,
    difficulty: 'Beginner',
    examples: [
      'Where do you see yourself in 5 years?',
      'What motivates you in your work?',
      'Why are you interested in this role?'
    ]
  }
];

const QuestionCategories: React.FC<QuestionCategoriesProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Select Interview Category</h2>
        <p className="text-gray-400">Choose the type of questions you want to practice</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 p-6 ${
              selectedCategory === category.id
                ? 'border-purple-500 bg-purple-500/20 scale-105'
                : 'bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 hover:scale-102'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
                {category.icon}
              </div>
              <Badge className={getDifficultyColor(category.difficulty)}>
                {category.difficulty}
              </Badge>
            </div>

            <h3 className="text-white font-semibold text-lg mb-2">{category.name}</h3>
            <p className="text-gray-300 text-sm mb-4">{category.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-cyan-400 font-medium">{category.questionCount} questions</span>
            </div>

            <div className="border-t border-white/20 pt-4">
              <div className="text-gray-400 text-xs mb-2">Example questions:</div>
              <ul className="space-y-1">
                {category.examples.slice(0, 2).map((example, index) => (
                  <li key={index} className="text-gray-300 text-xs flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span className="line-clamp-1">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionCategories;
export { categories };
