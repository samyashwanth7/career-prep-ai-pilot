import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  Minimize2, 
  Maximize2,
  Sparkles,
  User
} from 'lucide-react';
import ApiKeyModal from "./ApiKeyModal";
import { askOpenAIChat } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'suggestion' | 'insight' | 'question';
}

interface AIAssistantProps {
  context?: string;
  suggestions?: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context, suggestions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI Career Coach. I can help you with interview preparation, resume optimization, career guidance, and answering questions about your progress. ${context ? `I see you're currently on the ${context} page. ` : ''}How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'question'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const { toast } = useToast();

  const hasAPIKey = !!localStorage.getItem("openai_api_key");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses
    if (context === 'interview' && (lowerMessage.includes('nervous') || lowerMessage.includes('anxiety'))) {
      return "I understand interview nerves! Here are some quick tips: 1) Practice the STAR method for behavioral questions, 2) Take deep breaths and speak slowly, 3) Remember that they want you to succeed. Would you like me to help you practice some common questions?";
    }
    
    if (context === 'analytics' && lowerMessage.includes('improve')) {
      return "Based on your analytics, I can see areas for improvement! Focus on: 1) Practicing more technical questions if your technical scores are low, 2) Working on confidence through mock interviews, 3) Recording yourself to improve speech clarity. Which area would you like to focus on first?";
    }
    
    if (lowerMessage.includes('resume')) {
      return "For resume optimization, I recommend: 1) Using action verbs and quantifying achievements, 2) Tailoring keywords to job descriptions, 3) Keeping it concise (1-2 pages). Would you like me to analyze your current resume or help with specific sections?";
    }
    
    if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "I can help with career guidance! Are you looking for: 1) Job search strategies, 2) Career path recommendations, 3) Skill development suggestions, or 4) Industry insights? Let me know what specific area interests you most.";
    }
    
    if (lowerMessage.includes('question') || lowerMessage.includes('practice')) {
      return "Great! I can help you practice interview questions. What type would you like to focus on? 1) Behavioral questions (STAR method), 2) Technical questions for your field, 3) Company-specific questions, or 4) General questions about yourself?";
    }
    
    // Default responses
    const responses = [
      "That's a great question! Based on current industry trends, I'd recommend focusing on both technical skills and soft skills development.",
      "I can help you with that! Let me break this down into actionable steps you can take right away.",
      "Interesting point! From my analysis of successful candidates, here's what I've observed...",
      "That's exactly the kind of strategic thinking that employers love to see! Here's how you can develop this further..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

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

    // AI: use OpenAI if API key is present, fallback to basic if not. 
    if (hasAPIKey) {
      try {
        const convContext = [
          { role: "system", content: "You are an expert AI career assistant, give friendly, practical, and professional advice." + (context ? ` The user is currently on the ${context} page.` : "") },
          ...messages.slice(-8).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
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
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Sorry, something went wrong talking to OpenAI. Please check your API key or network connection.",
            sender: "ai",
            timestamp: new Date()
          }
        ]);
        toast({ title: "OpenAI Error", description: err.message || String(err), variant: "destructive" });
      } finally {
        setIsTyping(false);
      }
      return;
    }
    
    // fallback: previous static response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "AI is not configured. Please add your OpenAI API key for smarter assistance.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    "Help me prepare for behavioral questions",
    "What skills should I focus on?",
    "How can I improve my confidence?",
    "Review my recent interview performance"
  ];

  if (!isOpen) {
    return (
      <div>
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg z-50"
        >
          <Bot className="w-6 h-6" />
        </Button>
        <ApiKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 bg-white/10 backdrop-blur-lg border-white/20 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">AI Career Coach</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-400">Online{!hasAPIKey && " (demo mode)"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
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

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-white/20">
              <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(suggestion)}
                    className="text-xs border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Settings/footer: */}
          <div className="flex p-2 border-t border-white/20 items-center justify-between gap-3">
            <div>
              {!hasAPIKey ? (
                <Button variant="outline" size="sm" className="text-xs border-cyan-400 bg-cyan-400/10 text-cyan-300" onClick={() => setShowKeyModal(true)}>
                  Add OpenAI API Key
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-xs text-blue-400" onClick={() => setShowKeyModal(true)}>
                  Manage API Key
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              All processing is local — API key never leaves your browser.
            </div>
          </div>
          <ApiKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} onSave={() => {}} />
          {/* Input */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm resize-none"
                rows={1}
                disabled={isTyping}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIAssistant;
