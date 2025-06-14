
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Users,
  Award,
  Clock,
  Sparkles,
  Search,
  RefreshCw
} from 'lucide-react';
import Tesseract from 'tesseract.js';

interface AnalysisResult {
  overallScore: number;
  sections: {
    format: { score: number; suggestions: string[] };
    content: { score: number; suggestions: string[] };
    keywords: { score: number; suggestions: string[]; missing: string[]; found: string[] };
    experience: { score: number; suggestions: string[] };
    skills: { score: number; suggestions: string[]; technical: string[]; soft: string[] };
    education: { score: number; suggestions: string[] };
    achievements: { score: number; suggestions: string[] };
  };
  strengths: string[];
  improvements: string[];
  industryMatch: number;
  atsCompatibility: number;
  readabilityScore: number;
}

interface JobMatch {
  title: string;
  company: string;
  matchScore: number;
  missingSkills: string[];
  salary: string;
}

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [processingStep, setProcessingStep] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);

  const industries = [
    { id: 'technology', name: 'Technology', keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'DevOps', 'Agile'] },
    { id: 'finance', name: 'Finance', keywords: ['Financial Analysis', 'Excel', 'SQL', 'Risk Management', 'Investment', 'Portfolio Management', 'Compliance', 'Bloomberg', 'VBA', 'CFA'] },
    { id: 'marketing', name: 'Marketing', keywords: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Brand Management', 'Campaign Management', 'CRM', 'Adobe Creative'] },
    { id: 'healthcare', name: 'Healthcare', keywords: ['Patient Care', 'Medical Records', 'HIPAA', 'Clinical Research', 'Healthcare Administration', 'Medical Terminology', 'EMR', 'Quality Assurance', 'Compliance', 'Patient Safety'] },
    { id: 'consulting', name: 'Consulting', keywords: ['Strategic Planning', 'Business Analysis', 'Process Improvement', 'Project Management', 'Client Relations', 'Data Analysis', 'Problem Solving', 'Presentation', 'Stakeholder Management', 'Change Management'] }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setExtractedText('');
      setAnalysisResult(null);
      
      if (uploadedFile.type === 'application/pdf' || uploadedFile.type.startsWith('image/')) {
        extractTextFromFile(uploadedFile);
      } else if (uploadedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setExtractedText(e.target?.result as string || '');
        };
        reader.readAsText(uploadedFile);
      }
    }
  }, []);

  const extractTextFromFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingStep('Extracting text from file...');
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      setExtractedText(result.data.text);
      setProcessingStep('Text extraction complete!');
    } catch (error) {
      console.error('OCR Error:', error);
      setProcessingStep('Error extracting text. Please try again.');
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
    }
  };

  const analyzeResume = async () => {
    if (!extractedText.trim()) return;
    
    setIsProcessing(true);
    setProcessingStep('Analyzing resume content...');
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const industry = industries.find(i => i.id === selectedIndustry);
    const industryKeywords = industry?.keywords || [];
    
    // Analyze keywords
    const foundKeywords = industryKeywords.filter(keyword => 
      extractedText.toLowerCase().includes(keyword.toLowerCase())
    );
    const missingKeywords = industryKeywords.filter(keyword => 
      !extractedText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Extract skills
    const technicalSkills = foundKeywords.slice(0, 8);
    const softSkills = ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Analytical Thinking']
      .filter(skill => extractedText.toLowerCase().includes(skill.toLowerCase()));
    
    // Calculate scores
    const keywordScore = Math.round((foundKeywords.length / industryKeywords.length) * 100);
    const formatScore = Math.random() * 20 + 75; // Mock format analysis
    const contentScore = Math.random() * 25 + 70; // Mock content analysis
    const experienceScore = Math.random() * 30 + 65; // Mock experience analysis
    const skillsScore = keywordScore;
    const educationScore = Math.random() * 20 + 75; // Mock education analysis
    const achievementsScore = Math.random() * 25 + 70; // Mock achievements analysis
    
    const overallScore = Math.round((formatScore + contentScore + keywordScore + experienceScore + skillsScore + educationScore + achievementsScore) / 7);
    
    const result: AnalysisResult = {
      overallScore,
      sections: {
        format: {
          score: Math.round(formatScore),
          suggestions: [
            'Use consistent formatting throughout',
            'Ensure proper spacing and margins',
            'Use a professional font like Arial or Calibri'
          ]
        },
        content: {
          score: Math.round(contentScore),
          suggestions: [
            'Add more quantifiable achievements',
            'Use action verbs to start bullet points',
            'Include relevant keywords for your industry'
          ]
        },
        keywords: {
          score: keywordScore,
          suggestions: missingKeywords.slice(0, 3).map(k => `Consider adding "${k}" if relevant to your experience`),
          missing: missingKeywords,
          found: foundKeywords
        },
        experience: {
          score: Math.round(experienceScore),
          suggestions: [
            'Quantify your achievements with numbers',
            'Use the STAR method for describing experiences',
            'Focus on results and impact'
          ]
        },
        skills: {
          score: skillsScore,
          suggestions: [
            'Add more technical skills relevant to your field',
            'Include soft skills with examples',
            'Organize skills by category'
          ],
          technical: technicalSkills,
          soft: softSkills
        },
        education: {
          score: Math.round(educationScore),
          suggestions: [
            'Include relevant coursework if recent graduate',
            'Add certifications and training',
            'Include GPA if above 3.5'
          ]
        },
        achievements: {
          score: Math.round(achievementsScore),
          suggestions: [
            'Add more specific accomplishments',
            'Include awards and recognition',
            'Quantify impact where possible'
          ]
        }
      },
      strengths: [
        'Strong technical skill set',
        'Relevant industry experience',
        'Clear career progression'
      ],
      improvements: [
        'Add more quantifiable achievements',
        'Include more industry-specific keywords',
        'Improve formatting consistency'
      ],
      industryMatch: Math.round(keywordScore * 0.8 + Math.random() * 20),
      atsCompatibility: Math.round(formatScore * 0.7 + keywordScore * 0.3),
      readabilityScore: Math.round(Math.random() * 20 + 75)
    };
    
    setAnalysisResult(result);
    generateJobMatches(result);
    setIsProcessing(false);
  };

  const generateJobMatches = (analysis: AnalysisResult) => {
    const mockJobs: JobMatch[] = [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        matchScore: 92,
        missingSkills: ['Kubernetes', 'GraphQL'],
        salary: '$120K - $160K'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        matchScore: 87,
        missingSkills: ['Docker', 'TypeScript'],
        salary: '$100K - $140K'
      },
      {
        title: 'Frontend Engineer',
        company: 'Digital Agency',
        matchScore: 82,
        missingSkills: ['Vue.js', 'WebGL'],
        salary: '$90K - $130K'
      }
    ];
    
    setJobMatches(mockJobs);
  };

  const downloadOptimizedResume = () => {
    if (!analysisResult) return;
    
    let optimizedText = extractedText;
    
    // Add missing keywords (simulation)
    const missingKeywords = analysisResult.sections.keywords.missing.slice(0, 3);
    optimizedText += '\n\nSuggested additions:\n';
    missingKeywords.forEach(keyword => {
      optimizedText += `- Experience with ${keyword}\n`;
    });
    
    const blob = new Blob([optimizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_resume.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              <p className="text-gray-300">Advanced resume optimization with OCR technology</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload and Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Resume</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Select Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {industries.map(industry => (
                      <option key={industry.id} value={industry.id} className="bg-slate-800">
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`border-2 border-dashed border-white/30 rounded-lg p-8 text-center transition-colors ${
                    file ? 'border-green-500 bg-green-500/10' : 'hover:border-white/50'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {file ? (
                      <div>
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-white font-medium">Upload your resume</p>
                        <p className="text-gray-400 text-sm">PDF, TXT, PNG, JPG supported</p>
                      </div>
                    )}
                  </label>
                </div>

                {isProcessing && (
                  <div className="space-y-3">
                    <div className="text-center text-white">{processingStep}</div>
                    {ocrProgress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>OCR Progress</span>
                          <span>{ocrProgress}%</span>
                        </div>
                        <Progress value={ocrProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                )}

                {extractedText && (
                  <Button
                    onClick={analyzeResume}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    Analyze Resume
                  </Button>
                )}
              </div>
            </Card>

            {extractedText && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Extracted Text Preview</h3>
                <div className="bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                    {extractedText.slice(0, 500)}
                    {extractedText.length > 500 && '...'}
                  </pre>
                </div>
              </Card>
            )}
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {analysisResult ? (
              <>
                {/* Overall Score */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{analysisResult.overallScore}/100</div>
                      <div className="text-gray-400">Overall Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">{analysisResult.industryMatch}%</div>
                      <div className="text-gray-400 text-sm">Industry Match</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{analysisResult.atsCompatibility}%</div>
                      <div className="text-gray-400 text-sm">ATS Compatible</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">{analysisResult.readabilityScore}%</div>
                      <div className="text-gray-400 text-sm">Readability</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={downloadOptimizedResume}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Optimized
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Pro Tips
                    </Button>
                  </div>
                </Card>

                {/* Section Scores */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Section Analysis</h3>
                  <div className="space-y-4">
                    {Object.entries(analysisResult.sections).map(([section, data]) => (
                      <div key={section} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium capitalize">{section}</h4>
                          <div className="flex items-center">
                            <span className="text-white font-semibold mr-2">{data.score}%</span>
                            {data.score >= 80 ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : data.score >= 60 ? (
                              <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            ) : (
                              <Target className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </div>
                        <Progress value={data.score} className="mb-3" />
                        <div className="text-gray-300 text-sm">
                          {data.suggestions.slice(0, 2).map((suggestion, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="text-cyan-400 mr-2">•</span>
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Skills Analysis */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Skills Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-green-400 font-medium mb-3">Found Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.sections.keywords.found.map(skill => (
                          <Badge key={skill} className="bg-green-500/20 text-green-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-medium mb-3">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.sections.keywords.missing.slice(0, 6).map(skill => (
                          <Badge key={skill} className="bg-red-500/20 text-red-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Job Matches */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Job Matches</h3>
                  <div className="space-y-4">
                    {jobMatches.map((job, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-white font-medium">{job.title}</h4>
                            <p className="text-gray-400">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-semibold">{job.matchScore}% match</div>
                            <div className="text-gray-400 text-sm">{job.salary}</div>
                          </div>
                        </div>
                        {job.missingSkills.length > 0 && (
                          <div>
                            <span className="text-yellow-400 text-sm">Missing skills: </span>
                            <span className="text-gray-300 text-sm">{job.missingSkills.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
                <p className="text-gray-400">Upload your resume and click analyze to get detailed insights</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
