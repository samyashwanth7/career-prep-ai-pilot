
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface AIAssistantInputProps {
  inputText: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
}

const AIAssistantInput: React.FC<AIAssistantInputProps> = ({
  inputText,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isTyping,
}) => {
  return (
    <div className="p-4 border-t border-white/20">
      <div className="flex space-x-2">
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about your career..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm resize-none"
          rows={1}
          disabled={isTyping}
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputText.trim() || isTyping}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistantInput;
