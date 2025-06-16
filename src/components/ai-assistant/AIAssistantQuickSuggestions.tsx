
import React from 'react';
import { Button } from '@/components/ui/button';

interface AIAssistantQuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  messagesLength: number;
}

const AIAssistantQuickSuggestions: React.FC<AIAssistantQuickSuggestionsProps> = ({
  onSuggestionClick,
  messagesLength,
}) => {
  const quickSuggestions = [
    "Help me prepare for behavioral questions",
    "What skills should I focus on?",
    "How can I improve my confidence?",
    "Review my recent interview performance"
  ];

  if (messagesLength > 1) return null;

  return (
    <div className="px-4 py-2 border-t border-white/20">
      <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
      <div className="flex flex-wrap gap-1">
        {quickSuggestions.slice(0, 2).map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs border-white/20 text-gray-300 hover:bg-white/10"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AIAssistantQuickSuggestions;
