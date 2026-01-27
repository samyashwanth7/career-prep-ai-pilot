export interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'situational' | 'industry-specific';
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  category: string;
  industry?: string[];
  role?: string[];
  tags: string[];
  followUpQuestions?: string[];
  timeRecommendation: number;
  // Compatibility fields
  timeLimit?: number;
}

export const expandedQuestionBank: Question[] = [
  // Technical Questions - Software Engineering
  {
    id: 'tech_001',
    text: 'Explain the difference between synchronous and asynchronous programming, and provide examples of when you would use each.',
    type: 'technical',
    difficulty: 'mid',
    category: 'programming-concepts',
    industry: ['technology', 'fintech'],
    role: ['software-engineer', 'full-stack-developer'],
    tags: ['programming', 'async', 'performance'],
    followUpQuestions: [
      'How would you handle error handling in asynchronous code?',
      'What are the performance implications of each approach?'
    ],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'tech_002',
    text: 'Design a scalable architecture for a real-time chat application that needs to support millions of users.',
    type: 'technical',
    difficulty: 'senior',
    category: 'system-design',
    industry: ['technology', 'social-media'],
    role: ['senior-engineer', 'architect', 'tech-lead'],
    tags: ['scalability', 'real-time', 'architecture'],
    followUpQuestions: [
      'How would you handle message persistence?',
      'What would be your strategy for handling network failures?'
    ],
    timeRecommendation: 300,
    timeLimit: 300
  },
  {
    id: 'tech_003',
    text: 'Walk me through how you would optimize a database query that is performing poorly.',
    type: 'technical',
    difficulty: 'mid',
    category: 'database',
    industry: ['technology', 'fintech', 'healthcare'],
    role: ['backend-developer', 'database-engineer', 'full-stack-developer'],
    tags: ['database', 'optimization', 'performance'],
    timeRecommendation: 240,
    timeLimit: 240
  },
  {
    id: 'tech_004',
    text: 'Explain the concept of microservices architecture and when you would choose it over a monolithic approach.',
    type: 'technical',
    difficulty: 'mid',
    category: 'system-design',
    industry: ['technology', 'fintech'],
    role: ['software-engineer', 'architect'],
    tags: ['microservices', 'architecture', 'design'],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'tech_005',
    text: 'How would you implement authentication and authorization in a modern web application?',
    type: 'technical',
    difficulty: 'mid',
    category: 'security',
    industry: ['technology', 'fintech', 'healthcare'],
    role: ['software-engineer', 'full-stack-developer', 'security-engineer'],
    tags: ['security', 'authentication', 'authorization'],
    timeRecommendation: 200,
    timeLimit: 200
  },

  // Behavioral Questions
  {
    id: 'behav_001',
    text: 'Tell me about a time when you had to learn a completely new technology or skill quickly for a project.',
    type: 'behavioral',
    difficulty: 'entry',
    category: 'learning-adaptability',
    industry: ['technology', 'consulting', 'healthcare'],
    role: ['any'],
    tags: ['learning', 'adaptability', 'growth'],
    followUpQuestions: [
      'What was your learning strategy?',
      'How did you measure your progress?'
    ],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'behav_002',
    text: 'Describe a situation where you had to influence a team decision without having formal authority.',
    type: 'behavioral',
    difficulty: 'mid',
    category: 'leadership',
    industry: ['any'],
    role: ['team-lead', 'senior-engineer', 'product-manager'],
    tags: ['leadership', 'influence', 'collaboration'],
    timeRecommendation: 200,
    timeLimit: 200
  },
  {
    id: 'behav_003',
    text: 'Tell me about a time when you disagreed with your manager or a senior stakeholder. How did you handle it?',
    type: 'behavioral',
    difficulty: 'senior',
    category: 'conflict-resolution',
    industry: ['any'],
    role: ['any'],
    tags: ['conflict', 'communication', 'professionalism'],
    timeRecommendation: 220,
    timeLimit: 220
  },
  {
    id: 'behav_004',
    text: 'Describe a project where you had to collaborate with multiple teams or departments.',
    type: 'behavioral',
    difficulty: 'mid',
    category: 'collaboration',
    industry: ['any'],
    role: ['any'],
    tags: ['collaboration', 'teamwork', 'communication'],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'behav_005',
    text: 'Tell me about a time you failed at something. What did you learn from it?',
    type: 'behavioral',
    difficulty: 'entry',
    category: 'growth-mindset',
    industry: ['any'],
    role: ['any'],
    tags: ['failure', 'learning', 'resilience'],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'behav_006',
    text: 'Describe a situation where you had to prioritize multiple urgent tasks. How did you decide what to focus on?',
    type: 'behavioral',
    difficulty: 'mid',
    category: 'time-management',
    industry: ['any'],
    role: ['any'],
    tags: ['prioritization', 'time-management', 'decision-making'],
    timeRecommendation: 180,
    timeLimit: 180
  },

  // Industry-Specific Questions - Finance
  {
    id: 'fin_001',
    text: 'How would you explain a complex financial derivative to a client with limited financial knowledge?',
    type: 'industry-specific',
    difficulty: 'mid',
    category: 'client-communication',
    industry: ['finance', 'investment-banking'],
    role: ['financial-advisor', 'analyst', 'relationship-manager'],
    tags: ['communication', 'finance', 'client-service'],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'fin_002',
    text: 'Walk me through your process for conducting due diligence on a potential investment.',
    type: 'industry-specific',
    difficulty: 'senior',
    category: 'analysis',
    industry: ['finance', 'private-equity', 'venture-capital'],
    role: ['investment-analyst', 'portfolio-manager'],
    tags: ['analysis', 'investment', 'risk-assessment'],
    timeRecommendation: 300,
    timeLimit: 300
  },

  // Industry-Specific Questions - Healthcare
  {
    id: 'health_001',
    text: 'How do you ensure patient data privacy and security in your daily work?',
    type: 'industry-specific',
    difficulty: 'entry',
    category: 'compliance',
    industry: ['healthcare', 'pharmaceuticals'],
    role: ['any'],
    tags: ['privacy', 'compliance', 'HIPAA'],
    timeRecommendation: 150,
    timeLimit: 150
  },

  // Situational Questions
  {
    id: 'sit_001',
    text: 'You notice that a project deadline is at risk due to scope creep. The client is requesting additional features, but your team is already stretched thin. How do you handle this situation?',
    type: 'situational',
    difficulty: 'mid',
    category: 'project-management',
    industry: ['technology', 'consulting'],
    role: ['project-manager', 'team-lead', 'senior-engineer'],
    tags: ['project-management', 'scope', 'client-management'],
    timeRecommendation: 200,
    timeLimit: 200
  },
  {
    id: 'sit_002',
    text: 'A team member consistently misses deadlines and their work quality has declined. They report to you, but you suspect personal issues might be involved. How do you address this?',
    type: 'situational',
    difficulty: 'senior',
    category: 'people-management',
    industry: ['any'],
    role: ['manager', 'team-lead', 'senior-engineer'],
    tags: ['management', 'performance', 'empathy'],
    timeRecommendation: 220,
    timeLimit: 220
  },
  {
    id: 'sit_003',
    text: 'You discover a critical bug in production that affects a small percentage of users. Your manager wants to delay the fix until the next release. What do you do?',
    type: 'situational',
    difficulty: 'mid',
    category: 'decision-making',
    industry: ['technology'],
    role: ['software-engineer', 'team-lead'],
    tags: ['decision-making', 'ethics', 'communication'],
    timeRecommendation: 180,
    timeLimit: 180
  },
  {
    id: 'sit_004',
    text: 'Your team has two conflicting priorities from different stakeholders. Both claim their request is urgent. How do you handle this?',
    type: 'situational',
    difficulty: 'senior',
    category: 'stakeholder-management',
    industry: ['any'],
    role: ['project-manager', 'team-lead', 'product-manager'],
    tags: ['stakeholder-management', 'prioritization', 'communication'],
    timeRecommendation: 200,
    timeLimit: 200
  }
];

export class QuestionService {
  static getQuestionsByFilters(filters: {
    industry?: string;
    role?: string;
    difficulty?: string;
    category?: string;
    type?: string;
    tags?: string[];
  }): Question[] {
    return expandedQuestionBank.filter(question => {
      if (filters.industry && question.industry && !question.industry.includes(filters.industry)) return false;
      if (filters.role && question.role && !question.role.includes(filters.role)) return false;
      if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
      if (filters.category && question.category !== filters.category) return false;
      if (filters.type && question.type !== filters.type) return false;
      if (filters.tags && !filters.tags.some(tag => question.tags.includes(tag))) return false;
      return true;
    });
  }

  static getRandomQuestions(count: number, filters?: any): Question[] {
    const filteredQuestions = filters ? this.getQuestionsByFilters(filters) : expandedQuestionBank;
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static getQuestionById(id: string): Question | undefined {
    return expandedQuestionBank.find(q => q.id === id);
  }

  static getPersonalizedQuestions(userProfile: {
    industry: string;
    role: string;
    experienceLevel: string;
    weakAreas?: string[];
  }): Question[] {
    const baseQuestions = this.getQuestionsByFilters({
      industry: userProfile.industry,
      role: userProfile.role,
      difficulty: userProfile.experienceLevel as any
    });

    if (userProfile.weakAreas) {
      const weakAreaQuestions = expandedQuestionBank.filter(q => 
        userProfile.weakAreas!.some(area => q.tags.includes(area))
      );
      baseQuestions.push(...weakAreaQuestions);
    }

    return this.getRandomQuestions(10, { questions: baseQuestions });
  }

  static getQuestionsByCategory(category: string, count: number = 5): Question[] {
    const categoryQuestions = expandedQuestionBank.filter(q => q.category === category);
    return this.getRandomQuestions(count, { questions: categoryQuestions });
  }

  static getQuestionsByType(type: string, count: number = 5): Question[] {
    const typeQuestions = expandedQuestionBank.filter(q => q.type === type);
    return this.getRandomQuestions(count, { questions: typeQuestions });
  }
}
