
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface AIAssistantButtonProps {
  onClick: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg z-50"
    >
      <Bot className="w-6 h-6" />
    </Button>
  );
};

export default AIAssistantButton;
