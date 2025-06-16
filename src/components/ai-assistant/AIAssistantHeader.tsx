
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';

interface AIAssistantHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({
  isMinimized,
  onToggleMinimize,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white font-medium">Career Prep AI</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMinimize}
          className="text-gray-400 hover:text-white"
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistantHeader;
