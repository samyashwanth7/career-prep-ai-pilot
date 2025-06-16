
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'suggestion' | 'insight' | 'question';
}

export interface AIAssistantProps {
  context?: string;
  suggestions?: string[];
}
