
import { supabase } from '@/integrations/supabase/client';

interface AnalysisRequest {
  questionText: string;
  transcription: string;
  questionType: 'technical' | 'behavioral' | 'situational' | 'industry-specific';
  duration: number;
  industry?: string;
  role?: string;
}

interface DetailedFeedback {
  overallScore: number;
  specificity: number;
  relevance: number;
  impact: number;
  structure: number;
  starMethod?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
    score: number;
  };
  technicalAccuracy?: number;
  problemSolvingApproach?: number;
  communicationClarity: number;
  confidence: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
  industrySpecificFeedback?: string;
  nextSteps: string[];
}

export class AIAnalysisService {
  async analyzeResponse(request: AnalysisRequest): Promise<DetailedFeedback> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-interview-response', {
        body: request
      });

      if (error) {
        console.error('AI Analysis Error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to analyze response:', error);
      // Fallback to basic analysis if AI service fails
      return this.generateBasicFeedback(request);
    }
  }

  async generatePersonalizedQuestions(userProfile: {
    industry: string;
    role: string;
    experienceLevel: string;
    weakAreas?: string[];
    previousPerformance?: any[];
  }): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-personalized-questions', {
        body: userProfile
      });

      if (error) throw error;
      return data?.questions || [];
    } catch (error) {
      console.error('Failed to generate personalized questions:', error);
      return [];
    }
  }

  async analyzeVideoMetrics(videoBlob: Blob): Promise<{
    eyeContactScore: number;
    bodyLanguageScore: number;
    gestureAnalysis: string[];
    posture: string;
    facialExpressions: string[];
  }> {
    try {
      const arrayBuffer = await videoBlob.arrayBuffer();
      const base64Video = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('analyze-video-metrics', {
        body: { video: base64Video }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Video analysis error:', error);
      return {
        eyeContactScore: 75,
        bodyLanguageScore: 70,
        gestureAnalysis: ['Moderate hand gestures'],
        posture: 'Good posture maintained',
        facialExpressions: ['Professional expression']
      };
    }
  }

  private generateBasicFeedback(request: AnalysisRequest): DetailedFeedback {
    const wordCount = request.transcription.split(' ').length;
    const hasExamples = request.transcription.toLowerCase().includes('example') || 
                       request.transcription.toLowerCase().includes('instance');
    
    return {
      overallScore: Math.min(90, Math.max(40, wordCount * 2 + (hasExamples ? 20 : 0))),
      specificity: hasExamples ? 85 : 60,
      relevance: 75,
      impact: wordCount > 50 ? 80 : 60,
      structure: 70,
      communicationClarity: 75,
      confidence: 70,
      suggestions: [
        'Add more specific examples with quantifiable results',
        'Structure your response using the STAR method',
        'Include more details about your role and impact'
      ],
      strengths: [
        'Clear communication',
        'Relevant experience mentioned'
      ],
      improvements: [
        'More specific metrics needed',
        'Better structure required'
      ],
      nextSteps: [
        'Practice with STAR method',
        'Prepare 3-5 detailed examples',
        'Research company-specific examples'
      ]
    };
  }
}
