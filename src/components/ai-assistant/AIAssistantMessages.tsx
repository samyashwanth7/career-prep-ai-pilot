
import React, { useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User } from 'lucide-react';
import { Message } from './AIAssistantTypes';

interface AIAssistantMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

const AIAssistantMessages: React.FC<AIAssistantMessagesProps> = ({
  messages,
  isTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-lg p-3 ${
            message.sender === 'user' 
              ? 'bg-purple-500 text-white' 
              : 'bg-white/10 text-gray-200'
          }`}>
            <div className="flex items-start space-x-2">
              {message.sender === 'ai' && <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />}
              {message.sender === 'user' && <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />}
              <div className="flex-1">
                <p className="text-sm">{message.text}</p>
                {message.type && (
                  <Badge className="mt-2 text-xs bg-cyan-500/20 text-cyan-300">
                    {message.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white/10 text-gray-200 rounded-lg p-3 max-w-[80%]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AIAssistantMessages;
