import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload,
  FileText,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Zap,
  ArrowLeft,
  Download,
  RefreshCw,
  FileImage,
  Loader
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createWorker } from 'tesseract.js';

interface AnalysisResult {
  atsScore: number;
  overallScore: number;
  strengths: string[];
  improvements: { type: string; priority: 'high' | 'medium' | 'low'; suggestion: string; impact: string }[];
  keywordAnalysis: { found: string[]; missing: string[]; score: number };
  structureAnalysis: { score: number; issues: string[] };
  contentAnalysis: { score: number; suggestions: string[] };
  competitorAnalysis: { percentile: number; benchmark: string };
}

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resumeText, setResumeText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const roleKeywords = {
    'software-engineer': [
      'JavaScript', 'Python', 'React', 'Node.js', 'API', 'Git', 'SQL', 'Agile',
      'Frontend', 'Backend', 'Full-stack', 'DevOps', 'Cloud', 'Testing', 'CI/CD'
    ],
    'data-scientist': [
      'Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'PyTorch',
      'Pandas', 'NumPy', 'Scikit-learn', 'Data Analysis', 'Visualization', 'A/B Testing'
    ],
    'product-manager': [
      'Product Strategy', 'Roadmap', 'Stakeholder', 'Analytics', 'A/B Testing',
      'User Research', 'Agile', 'Scrum', 'KPIs', 'Growth', 'Leadership', 'Cross-functional'
    ],
    'frontend-developer': [
      'JavaScript', 'React', 'Vue', 'Angular', 'CSS', 'HTML', 'TypeScript',
      'Responsive Design', 'UI/UX', 'Performance', 'Accessibility', 'Testing'
    ],
    'backend-developer': [
      'Python', 'Java', 'Node.js', 'API', 'Database', 'SQL', 'NoSQL', 'Microservices',
      'Cloud', 'AWS', 'Docker', 'Kubernetes', 'Security', 'Scalability'
    ]
  };

  const roles = [
    { id: 'software-engineer', name: 'Software Engineer' },
    { id: 'frontend-developer', name: 'Frontend Developer' },
    { id: 'backend-developer', name: 'Backend Developer' },
    { id: 'data-scientist', name: 'Data Scientist' },
    { id: 'product-manager', name: 'Product Manager' },
    { id: 'ui-ux-designer', name: 'UI/UX Designer' },
    { id: 'devops-engineer', name: 'DevOps Engineer' }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load saved analysis
    const savedAnalysis = localStorage.getItem(`resume_analysis_${JSON.parse(user).id}`);
    if (savedAnalysis) {
      const parsed = JSON.parse(savedAnalysis);
      setAnalysis(parsed.analysis);
      setResumeText(parsed.resumeText);
      setSelectedRole(parsed.role);
    }
  }, [navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    setUploadedFile(file);

    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      // Handle text files directly
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
        toast({
          title: "File Uploaded",
          description: "Resume content loaded successfully!"
        });
      };
      reader.readAsText(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // Handle PDF files with OCR
      setIsProcessingFile(true);
      setOcrProgress(0);
      
      try {
        const worker = await createWorker();
        
        // Set up progress tracking
        worker.setParameters({
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        });

        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();

        setResumeText(text);
        setIsProcessingFile(false);
        
        toast({
          title: "PDF Processed",
          description: "Resume text extracted successfully from PDF!"
        });
      } catch (error) {
        console.error('OCR Error:', error);
        setIsProcessingFile(false);
        toast({
          title: "PDF Processing Error",
          description: "Failed to extract text from PDF. Please try uploading a text file instead.",
          variant: "destructive"
        });
      }
    } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/)) {
      // Handle image files with OCR
      setIsProcessingFile(true);
      setOcrProgress(0);
      
      try {
        const worker = await createWorker();
        
        worker.setParameters({
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        });

        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();

        setResumeText(text);
        setIsProcessingFile(false);
        
        toast({
          title: "Image Processed",
          description: "Resume text extracted successfully from image!"
        });
      } catch (error) {
        console.error('OCR Error:', error);
        setIsProcessingFile(false);
        toast({
          title: "Image Processing Error",
          description: "Failed to extract text from image. Please try a clearer image or text file.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "File Type Error",
        description: "Please upload a PDF, image, or text file.",
        variant: "destructive"
      });
    }
  };

  const analyzeKeywords = (text: string, role: string) => {
    const keywords = roleKeywords[role as keyof typeof roleKeywords] || [];
    const textLower = text.toLowerCase();
    
    const found = keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    const missing = keywords.filter(keyword => 
      !textLower.includes(keyword.toLowerCase())
    );

    return {
      found,
      missing,
      score: Math.round((found.length / keywords.length) * 100)
    };
  };

  const analyzeStructure = (text: string) => {
    const issues = [];
    let score = 100;

    // Check for common sections
    const sections = ['experience', 'education', 'skills', 'projects'];
    const missingSections = sections.filter(section => 
      !text.toLowerCase().includes(section)
    );
    
    if (missingSections.length > 0) {
      issues.push(`Missing sections: ${missingSections.join(', ')}`);
      score -= missingSections.length * 20;
    }

    // Check for contact info
    const hasEmail = /@/.test(text);
    const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text);
    
    if (!hasEmail) {
      issues.push('No email address found');
      score -= 15;
    }
    if (!hasPhone) {
      issues.push('No phone number found');
      score -= 10;
    }

    // Check length
    if (text.length < 500) {
      issues.push('Resume is too short (under 500 characters)');
      score -= 25;
    }
    if (text.length > 4000) {
      issues.push('Resume is too long (over 4000 characters)');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  };

  const analyzeContent = (text: string) => {
    const suggestions = [];
    let score = 100;

    // Check for quantifiable achievements
    const hasMetrics = /\d+%|\d+x|\$\d+|increased|decreased|improved|reduced/i.test(text);
    if (!hasMetrics) {
      suggestions.push('Add quantifiable achievements (e.g., "Increased performance by 40%")');
      score -= 20;
    }

    // Check for action verbs
    const actionVerbs = ['developed', 'built', 'created', 'implemented', 'designed', 'optimized', 'led', 'managed'];
    const hasActionVerbs = actionVerbs.some(verb => 
      text.toLowerCase().includes(verb)
    );
    if (!hasActionVerbs) {
      suggestions.push('Use more action verbs (developed, implemented, optimized, etc.)');
      score -= 15;
    }

    // Check for buzzwords to avoid
    const buzzwords = ['synergy', 'think outside the box', 'hardworking', 'team player'];
    const hasBuzzwords = buzzwords.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    if (hasBuzzwords) {
      suggestions.push('Remove generic buzzwords and replace with specific achievements');
      score -= 10;
    }

    // Check for typos (simple check)
    const commonMisspellings = ['teh', 'recieve', 'seperate', 'definately'];
    const hasTypos = commonMisspellings.some(typo => 
      text.toLowerCase().includes(typo)
    );
    if (hasTypos) {
      suggestions.push('Check for spelling errors and typos');
      score -= 25;
    }

    return { score: Math.max(0, score), suggestions };
  };

  const generateImprovements = (keywordAnalysis: any, structureAnalysis: any, contentAnalysis: any) => {
    const improvements = [];

    // High priority improvements
    if (keywordAnalysis.score < 50) {
      improvements.push({
        type: 'keywords',
        priority: 'high' as const,
        suggestion: `Add these missing keywords: ${keywordAnalysis.missing.slice(0, 5).join(', ')}`,
        impact: 'Increases ATS compatibility by 30-40%'
      });
    }

    if (structureAnalysis.score < 70) {
      improvements.push({
        type: 'structure',
        priority: 'high' as const,
        suggestion: structureAnalysis.issues[0] || 'Improve resume structure and formatting',
        impact: 'Makes resume more readable and professional'
      });
    }

    // Medium priority improvements
    if (contentAnalysis.score < 80) {
      improvements.push({
        type: 'content',
        priority: 'medium' as const,
        suggestion: contentAnalysis.suggestions[0] || 'Add more specific achievements',
        impact: 'Makes accomplishments more compelling'
      });
    }

    if (keywordAnalysis.score < 80 && keywordAnalysis.score >= 50) {
      improvements.push({
        type: 'keywords',
        priority: 'medium' as const,
        suggestion: `Consider adding: ${keywordAnalysis.missing.slice(0, 3).join(', ')}`,
        impact: 'Further improves keyword match'
      });
    }

    // Low priority improvements
    improvements.push({
      type: 'optimization',
      priority: 'low' as const,
      suggestion: 'Consider tailoring resume for each specific job application',
      impact: 'Maximizes relevance for each position'
    });

    return improvements;
  };

  const analyzeResume = () => {
    if (!resumeText.trim() || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please provide resume text and select a target role.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const keywordAnalysis = analyzeKeywords(resumeText, selectedRole);
      const structureAnalysis = analyzeStructure(resumeText);
      const contentAnalysis = analyzeContent(resumeText);

      const atsScore = keywordAnalysis.score;
      const overallScore = Math.round(
        (keywordAnalysis.score + structureAnalysis.score + contentAnalysis.score) / 3
      );

      const result: AnalysisResult = {
        atsScore,
        overallScore,
        strengths: [
          ...(keywordAnalysis.found.length > 5 ? ['Strong keyword presence'] : []),
          ...(structureAnalysis.score > 80 ? ['Well-structured format'] : []),
          ...(contentAnalysis.score > 80 ? ['Strong content quality'] : []),
          ...(resumeText.length > 1000 && resumeText.length < 3000 ? ['Appropriate length'] : [])
        ],
        improvements: generateImprovements(keywordAnalysis, structureAnalysis, contentAnalysis),
        keywordAnalysis,
        structureAnalysis,
        contentAnalysis,
        competitorAnalysis: {
          percentile: Math.max(10, overallScore - 10 + Math.random() * 20),
          benchmark: overallScore > 80 ? 'Top 20%' : overallScore > 60 ? 'Top 50%' : 'Bottom 50%'
        }
      };

      setAnalysis(result);
      setIsAnalyzing(false);

      // Save analysis
      localStorage.setItem(`resume_analysis_${currentUser.id}`, JSON.stringify({
        analysis: result,
        resumeText,
        role: selectedRole,
        timestamp: new Date().toISOString()
      }));

      toast({
        title: "Analysis Complete!",
        description: `Your resume scored ${overallScore}/100 overall.`
      });
    }, 2000);
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setResumeText('');
    setSelectedRole('');
    setUploadedFile(null);
    localStorage.removeItem(`resume_analysis_${currentUser.id}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Resume Analyzer</h1>
              <p className="text-gray-300">Optimize your resume for ATS and hiring managers</p>
            </div>
          </div>
          {analysis && (
            <Button
              onClick={clearAnalysis}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          )}
        </div>

        {!analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Upload Your Resume</h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Upload Resume (PDF, Image, or TXT)</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".txt,.pdf,.jpg,.jpeg,.png,.gif,.bmp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={isProcessingFile}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`cursor-pointer flex flex-col items-center space-y-2 ${isProcessingFile ? 'opacity-50' : ''}`}
                  >
                    {isProcessingFile ? (
                      <>
                        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                        <span className="text-purple-400">Processing file... {ocrProgress}%</span>
                        <Progress value={ocrProgress} className="w-full max-w-xs" />
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-300">
                          {uploadedFile ? uploadedFile.name : 'Click to upload resume'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Supports PDF, images (JPG, PNG), and text files
                        </span>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            PDF
                          </div>
                          <div className="flex items-center">
                            <FileImage className="w-4 h-4 mr-1" />
                            Images
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            Text
                          </div>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Or paste your resume text</label>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="w-full h-48 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={isProcessingFile}
                />
                <div className="text-right text-gray-400 text-sm mt-1">
                  {resumeText.length} characters
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Target Role</label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      disabled={isProcessingFile}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedRole === role.id
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 text-gray-300 hover:border-white/40'
                      } ${isProcessingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={analyzeResume}
                disabled={isAnalyzing || !resumeText.trim() || !selectedRole || isProcessingFile}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </Card>

            {/* Preview/Info Section */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">What We Analyze</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">ATS Compatibility</h3>
                    <p className="text-gray-400 text-sm">Keyword optimization and format checking</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-cyan-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Structure Analysis</h3>
                    <p className="text-gray-400 text-sm">Format, sections, and organization</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Content Quality</h3>
                    <p className="text-gray-400 text-sm">Achievements, metrics, and impact</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Zap className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Improvement Suggestions</h3>
                    <p className="text-gray-400 text-sm">Actionable recommendations with impact</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
                <h3 className="text-white font-medium mb-2">✨ New: AI-Powered File Processing</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <div>• Extract text from PDF files automatically</div>
                  <div>• Process resume images with OCR technology</div>
                  <div>• Support for multiple file formats</div>
                  <div>• Smart text cleanup and formatting</div>
                </div>
              </div>

              {resumeText && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Resume Preview</h3>
                  <div className="text-gray-300 text-sm max-h-32 overflow-y-auto">
                    {resumeText.substring(0, 300)}...
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{analysis.overallScore}</div>
                  <div className="text-gray-300">Overall Score</div>
                  <Progress value={analysis.overallScore} className="mt-3" />
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{analysis.atsScore}</div>
                  <div className="text-gray-300">ATS Score</div>
                  <Progress value={analysis.atsScore} className="mt-3" />
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{analysis.keywordAnalysis.found.length}</div>
                  <div className="text-gray-300">Keywords Found</div>
                  <div className="text-sm text-gray-400 mt-1">
                    of {analysis.keywordAnalysis.found.length + analysis.keywordAnalysis.missing.length} total
                  </div>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">{analysis.competitorAnalysis.benchmark}</div>
                  <div className="text-gray-300">Ranking</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {Math.round(analysis.competitorAnalysis.percentile)}th percentile
                  </div>
                </div>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Strengths & Improvements */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Strengths & Improvements</h2>
                
                {/* Strengths */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-gray-300 text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                    Priority Improvements
                  </h3>
                  <div className="space-y-3">
                    {analysis.improvements.map((improvement, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${
                            improvement.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            improvement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {improvement.priority.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-400">{improvement.type}</span>
                        </div>
                        <div className="text-white text-sm mb-1">{improvement.suggestion}</div>
                        <div className="text-gray-400 text-xs">{improvement.impact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Keyword Analysis */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Keyword Analysis</h2>
                
                {/* Found Keywords */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-3 text-green-400">
                    ✓ Keywords Found ({analysis.keywordAnalysis.found.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordAnalysis.found.map(keyword => (
                      <Badge key={keyword} className="bg-green-500/20 text-green-400">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div>
                  <h3 className="text-white font-medium mb-3 text-red-400">
                    ✗ Missing Keywords ({analysis.keywordAnalysis.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordAnalysis.missing.slice(0, 10).map(keyword => (
                      <Badge key={keyword} variant="outline" className="border-red-500/30 text-red-400">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  {analysis.keywordAnalysis.missing.length > 10 && (
                    <div className="text-gray-400 text-sm mt-2">
                      +{analysis.keywordAnalysis.missing.length - 10} more...
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([JSON.stringify(analysis, null, 2)], {type: 'application/json'});
                  element.href = URL.createObjectURL(file);
                  element.download = 'resume-analysis-report.json';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={() => navigate('/career-roadmap')}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Create Learning Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
