
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { askOpenAIChat } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";
import { Message, AIAssistantProps } from './ai-assistant/AIAssistantTypes';
import AIAssistantButton from './ai-assistant/AIAssistantButton';
import AIAssistantHeader from './ai-assistant/AIAssistantHeader';
import AIAssistantMessages from './ai-assistant/AIAssistantMessages';
import AIAssistantQuickSuggestions from './ai-assistant/AIAssistantQuickSuggestions';
import AIAssistantInput from './ai-assistant/AIAssistantInput';

const AIAssistant: React.FC<AIAssistantProps> = ({ context, suggestions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your Career Prep AI. I can help you with interview preparation, resume optimization, career guidance, and answering questions about your progress. ${context ? `I see you're currently on the ${context} page. ` : ''}How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'question'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const convContext = [
        { 
          role: "system", 
          content: `You are an expert AI career assistant. Give friendly, practical, and professional advice. Keep responses concise and actionable.${context ? ` The user is currently on the ${context} page.` : ""}`
        },
        ...messages.slice(-8).map(m => ({ 
          role: m.sender === 'user' ? 'user' : 'assistant', 
          content: m.text 
        })),
        { role: "user", content: inputText }
      ];

      const aiReply = await askOpenAIChat(convContext as any);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my AI service right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
        type: 'suggestion'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({ 
        title: "AI Service Error", 
        description: "Connection issue with AI service. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return <AIAssistantButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <Card className={`fixed bottom-6 right-6 bg-white/10 backdrop-blur-lg border-white/20 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <AIAssistantHeader
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        onClose={() => setIsOpen(false)}
      />

      {!isMinimized && (
        <>
          <AIAssistantMessages
            messages={messages}
            isTyping={isTyping}
          />

          <AIAssistantQuickSuggestions
            onSuggestionClick={setInputText}
            messagesLength={messages.length}
          />

          <AIAssistantInput
            inputText={inputText}
            onInputChange={setInputText}
            onSendMessage={sendMessage}
            onKeyPress={handleKeyPress}
            isTyping={isTyping}
          />
        </>
      )}
    </Card>
  );
};

export default AIAssistant;
