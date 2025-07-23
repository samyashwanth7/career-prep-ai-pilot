
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  MessageCircle, 
  FileText, 
  Target, 
  Users, 
  CheckCircle,
  ArrowRight,
  Brain,
  Briefcase,
  Star,
  TrendingUp,
  Send,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [sampleQuestions, setSampleQuestions] = useState<Array<{skill: string, questions: string[]}>>([]);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [roadmapProgress, setRoadmapProgress] = useState<{[key: string]: boolean}>({});

  // Mock data
  const mockSkillsDatabase = {
    'javascript': ['Can you explain event bubbling in JavaScript?', 'How do closures work in JavaScript?'],
    'react': ['What is the difference between state and props in React?', 'Explain the React component lifecycle.'],
    'python': ['What are decorators in Python?', 'Explain list comprehensions with an example.'],
    'node': ['What is the event loop in Node.js?', 'How do you handle asynchronous operations?'],
    'sql': ['What is the difference between INNER JOIN and LEFT JOIN?', 'How do you optimize database queries?'],
    'aws': ['What are the main AWS services you have used?', 'Explain the difference between EC2 and Lambda.'],
    'docker': ['What is containerization and why use Docker?', 'How do you optimize Docker images?'],
    'git': ['Explain the difference between merge and rebase.', 'How do you resolve merge conflicts?']
  };

  const careerRoadmaps = {
    'frontend': {
      title: 'Frontend Developer',
      steps: [
        'Master HTML/CSS fundamentals',
        'Learn JavaScript ES6+',
        'Study React or Vue.js',
        'Understand responsive design',
        'Learn state management (Redux/Context)',
        'Practice with real projects',
        'Prepare for technical interviews'
      ]
    },
    'backend': {
      title: 'Backend Developer',
      steps: [
        'Choose a backend language (Node.js/Python/Java)',
        'Learn database fundamentals (SQL/NoSQL)',
        'Understand API design (REST/GraphQL)',
        'Study cloud services (AWS/Azure)',
        'Learn containerization (Docker)',
        'Practice system design',
        'Build portfolio projects'
      ]
    },
    'fullstack': {
      title: 'Full Stack Developer',
      steps: [
        'Master frontend technologies',
        'Learn backend development',
        'Understand database design',
        'Study DevOps basics',
        'Learn testing methodologies',
        'Build end-to-end projects',
        'Prepare for system design interviews'
      ]
    }
  };

  // Skill extraction function
  const extractSkills = () => {
    if (!resumeText.trim()) {
      toast({
        title: "No resume content",
        description: "Please upload a resume or enter text first.",
        variant: "destructive"
      });
      return;
    }

    const text = resumeText.toLowerCase();
    const skills = [];
    
    // Check for common skills
    const skillPatterns = {
      'JavaScript': ['javascript', 'js', 'es6', 'node.js', 'nodejs'],
      'React': ['react', 'reactjs', 'jsx'],
      'Python': ['python', 'django', 'flask', 'fastapi'],
      'Node.js': ['node', 'nodejs', 'express'],
      'SQL': ['sql', 'mysql', 'postgresql', 'database'],
      'AWS': ['aws', 'amazon web services', 'ec2', 'lambda'],
      'Docker': ['docker', 'container', 'kubernetes'],
      'Git': ['git', 'github', 'version control']
    };

    for (const [skill, patterns] of Object.entries(skillPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        skills.push(skill);
      }
    }

    setExtractedSkills(skills.slice(0, 8)); // Limit to 8 skills
    generateSampleQuestions(skills.slice(0, 8));
    
    toast({
      title: "Skills extracted!",
      description: `Found ${skills.length} relevant skills.`
    });
  };

  // Generate sample questions
  const generateSampleQuestions = (skills: string[]) => {
    const questions = skills.map(skill => {
      const skillKey = skill.toLowerCase().replace('.js', '').replace('.', '');
      const skillQuestions = mockSkillsDatabase[skillKey] || [
        `How would you explain ${skill} to a beginner?`,
        `What projects have you worked on using ${skill}?`
      ];
      
      return {
        skill,
        questions: skillQuestions
      };
    });
    
    setSampleQuestions(questions);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        // For demo purposes, simulate PDF text extraction
        setResumeText(`John Doe
Software Engineer
Email: john@example.com

EXPERIENCE
Senior Frontend Developer at TechCorp (2022-Present)
- Developed React applications with TypeScript
- Implemented responsive designs using CSS and JavaScript
- Collaborated with backend teams using Node.js and Express
- Used Git for version control and Docker for containerization
- Deployed applications on AWS EC2 and Lambda

SKILLS
JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git

EDUCATION
Bachelor of Computer Science
University of Technology (2018-2022)`);
        
        toast({
          title: "PDF uploaded successfully!",
          description: "Resume content has been extracted."
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive"
        });
      }
    }
  };

  // Start interview
  const startInterview = () => {
    setInterviewStarted(true);
    setChatMessages([{
      type: 'ai',
      message: "Hello! I'm your AI interviewer. Let's start with a simple question: Can you tell me about yourself and your background?"
    }]);
  };

  // Send message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = { type: 'user' as const, message: currentMessage };
    const newMessages = [...chatMessages, userMessage];

    // Generate AI response
    const aiResponses = [
      "That's interesting! Can you elaborate on a specific project you worked on?",
      "Great experience! How did you handle challenges in that role?",
      "Tell me about a time when you had to learn a new technology quickly.",
      "How do you approach debugging complex issues?",
      "What interests you most about this role?"
    ];

    const aiMessage = {
      type: 'ai' as const,
      message: aiResponses[Math.floor(Math.random() * aiResponses.length)]
    };

    setChatMessages([...newMessages, aiMessage]);
    setCurrentMessage('');

    // Complete interview after 5 exchanges
    if (newMessages.filter(m => m.type === 'user').length >= 3) {
      setTimeout(() => {
        setInterviewCompleted(true);
        generateFeedback();
      }, 2000);
    }
  };

  // Generate feedback
  const generateFeedback = () => {
    setFeedback({
      overallScore: 85,
      technicalStrength: 78,
      communicationSkills: 92,
      improvements: [
        "Provide more specific examples when discussing projects",
        "Practice explaining technical concepts in simpler terms",
        "Ask clarifying questions about the role"
      ],
      strengths: [
        "Clear and confident communication",
        "Good understanding of technical concepts",
        "Professional demeanor"
      ]
    });
  };

  // Toggle roadmap step
  const toggleRoadmapStep = (step: string) => {
    setRoadmapProgress(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Interviewer Demo</h1>
              <p className="text-sm text-gray-400">Interactive platform demonstration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="resume" className="data-[state=active]:bg-purple-500">Resume Upload</TabsTrigger>
            <TabsTrigger value="interview" className="data-[state=active]:bg-purple-500">AI Interview</TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-purple-500">Feedback</TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-purple-500">Career Roadmap</TabsTrigger>
            <TabsTrigger value="recruiter" className="data-[state=active]:bg-purple-500">Mass Recruiter</TabsTrigger>
          </TabsList>

          {/* Resume Upload & Skill Extraction */}
          <TabsContent value="resume" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Resume Upload & Skill Extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume-upload" className="text-white">Upload Resume (PDF)</Label>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="text-center text-gray-400">OR</div>
                
                <div className="space-y-2">
                  <Label htmlFor="resume-text" className="text-white">Paste Resume Text</Label>
                  <Textarea
                    id="resume-text"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
                  />
                </div>

                <Button 
                  onClick={extractSkills}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Skills
                </Button>

                {extractedSkills.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Extracted Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {extractedSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-cyan-400 text-cyan-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {sampleQuestions.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">Sample Interview Questions:</h3>
                        {sampleQuestions.map((item, index) => (
                          <Card key={index} className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                              <h4 className="text-purple-400 font-medium mb-2">{item.skill}</h4>
                              <ul className="space-y-1 text-gray-300 text-sm">
                                {item.questions.map((question, qIndex) => (
                                  <li key={qIndex}>• {question}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Interview */}
          <TabsContent value="interview" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  AI Interview Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!interviewStarted ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">Ready to start your AI interview?</p>
                    <Button 
                      onClick={startInterview}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      Start Interview
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-64 overflow-y-auto space-y-3 p-4 bg-black/20 rounded-lg">
                      {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-gray-600 text-white'
                          }`}>
                            {message.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    {!interviewCompleted && (
                      <div className="flex space-x-2">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Type your answer..."
                          className="bg-white/10 border-white/20 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} className="bg-purple-500 hover:bg-purple-600">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {interviewCompleted && (
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p className="text-white">Interview completed! Check the Feedback tab for results.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback */}
          <TabsContent value="feedback" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Interview Feedback & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedback ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{feedback.overallScore}%</div>
                        <div className="text-gray-400">Overall Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{feedback.technicalStrength}%</div>
                        <div className="text-gray-400">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{feedback.communicationSkills}%</div>
                        <div className="text-gray-400">Communication</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-green-400 font-semibold mb-3">Strengths</h3>
                        <ul className="space-y-2">
                          {feedback.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-gray-300 flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-orange-400 font-semibold mb-3">Areas for Improvement</h3>
                        <ul className="space-y-2">
                          {feedback.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="text-gray-300 flex items-start">
                              <TrendingUp className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Complete an interview to see your feedback and analysis.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Roadmap */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Career Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Select Target Role:</Label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                  >
                    <option value="">Choose a role...</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="fullstack">Full Stack Developer</option>
                  </select>
                </div>

                {selectedRole && careerRoadmaps[selectedRole] && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg">
                      {careerRoadmaps[selectedRole].title} Roadmap
                    </h3>
                    <div className="space-y-3">
                      {careerRoadmaps[selectedRole].steps.map((step, index) => {
                        const isCompleted = roadmapProgress[step];
                        return (
                          <div 
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => toggleRoadmapStep(step)}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-400'
                            }`}>
                              {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <span className={`flex-1 ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round((Object.values(roadmapProgress).filter(Boolean).length / careerRoadmaps[selectedRole].steps.length) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(Object.values(roadmapProgress).filter(Boolean).length / careerRoadmaps[selectedRole].steps.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mass Recruiter Tool */}
          <TabsContent value="recruiter" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Mass Recruiter Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Upload Job Postings (CSV)</Label>
                    <Input 
                      type="file" 
                      accept=".csv"
                      className="mt-2 bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Analyze Job Matches
                  </Button>

                  {/* Mock results */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Job Match Results:</h3>
                    {[
                      { company: 'TechCorp', role: 'Senior Frontend Developer', match: 95, status: 'Applied' },
                      { company: 'StartupXYZ', role: 'Full Stack Engineer', match: 87, status: 'Draft' },
                      { company: 'BigTech Inc', role: 'React Developer', match: 92, status: 'Applied' }
                    ].map((job, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-medium">{job.role}</h4>
                              <p className="text-gray-400 text-sm">{job.company}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={job.match >= 90 ? 'border-green-400 text-green-400' : 'border-yellow-400 text-yellow-400'}
                            >
                              {job.match}% Match
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm px-2 py-1 rounded ${
                              job.status === 'Applied' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {job.status}
                            </span>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              View Details
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Demo;
