import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  FileText, 
  Download, 
  Palette, 
  Eye,
  Plus,
  Trash2,
  Home,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModernTemplate from '@/components/cv-builder/ModernTemplate';
import ClassicTemplate from '@/components/cv-builder/ClassicTemplate';
import MinimalTemplate from '@/components/cv-builder/MinimalTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

const CVBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    education: [{
      id: '1',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }],
    experience: [],
    projects: [],
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Black', value: '#1F2937' }
  ];

  const templates = [
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'classic', name: 'Classic', component: ClassicTemplate },
    { id: 'minimal', name: 'Minimal', component: MinimalTemplate }
  ];

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    };
    setCVData(prev => ({ ...prev, education: [...prev.education, newEducation] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCVData(prev => ({ ...prev, experience: [...prev.experience, newExperience] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    setCVData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (id: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCVData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setCVData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleDownload = async () => {
    if (!printRef.current) {
      toast({
        title: "Error",
        description: "CV preview not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.minHeight = '297mm'; // A4 height
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
      document.body.appendChild(tempContainer);

      // Clone the CV content
      const cvElement = printRef.current.cloneNode(true) as HTMLElement;
      cvElement.style.width = '100%';
      cvElement.style.maxWidth = 'none';
      cvElement.style.margin = '0';
      cvElement.style.padding = '20mm';
      cvElement.style.boxSizing = 'border-box';
      cvElement.style.fontSize = '12px';
      cvElement.style.lineHeight = '1.4';
      
      tempContainer.appendChild(cvElement);

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate canvas from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the cloned document
          const clonedElement = clonedDoc.querySelector('div') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Arial, sans-serif';
          }
        }
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is longer than one page, we might need to handle pagination
      if (imgHeight > 297) {
        // For now, we'll scale it to fit one page
        const scaledHeight = 297;
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, scaledHeight);
      } else {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // Generate filename based on user's name
      const fileName = cvData.personalInfo.fullName 
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
        : 'My_CV.pdf';

      pdf.save(fileName);

      toast({
        title: "CV Downloaded Successfully!",
        description: "Your ATS-friendly CV has been generated and saved as PDF with all formatting preserved."
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || ModernTemplate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
              <p className="text-sm text-gray-600">Create your professional ATS-friendly CV</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button 
              onClick={handleDownload} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={cvData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={cvData.personalInfo.address}
                          onChange={(e) => updatePersonalInfo('address', e.target.value)}
                          placeholder="City, State, Country"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={cvData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={cvData.personalInfo.github}
                          onChange={(e) => updatePersonalInfo('github', e.target.value)}
                          placeholder="github.com/johndoe"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="summary">Professional Summary *</Label>
                      <Textarea
                        id="summary"
                        value={cvData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        placeholder="A brief summary of your background, skills, and career objectives..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education */}
              <TabsContent value="education" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Button onClick={addEducation} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
                {cvData.education.map((edu, index) => (
                  <Card key={edu.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Education {index + 1}</CardTitle>
                      {cvData.education.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Institution *</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <Label>Degree *</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Bachelor's, Master's, etc."
                          />
                        </div>
                        <div>
                          <Label>Field of Study *</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            placeholder="Computer Science, Engineering, etc."
                          />
                        </div>
                        <div>
                          <Label>GPA (Optional)</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            placeholder="3.8/4.0"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Experience */}
              <TabsContent value="experience" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {cvData.experience.map((exp, index) => (
                  <Card key={exp.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Experience {index + 1}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Company *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label>Position *</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            placeholder="Job Title"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        />
                        <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities, achievements, and impact..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Projects */}
              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Button onClick={addProject} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
                {cvData.projects.map((proj, index) => (
                  <Card key={proj.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Project {index + 1}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProject(proj.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Project Name *</Label>
                          <Input
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            placeholder="My Awesome Project"
                          />
                        </div>
                        <div>
                          <Label>Link (Optional)</Label>
                          <Input
                            value={proj.link}
                            onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          placeholder="Describe what the project does, your role, and the impact..."
                          className="min-h-[80px]"
                        />
                      </div>
                      <div>
                        <Label>Technologies Used</Label>
                        <Input
                          placeholder="React, Node.js, MongoDB (comma-separated)"
                          onChange={(e) => {
                            const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                            updateProject(proj.id, 'technologies', techs);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Skills */}
              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g., JavaScript, Python, etc.)"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Template & Color Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Customize Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Template</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        onClick={() => setSelectedTemplate(template.id)}
                        className="h-auto p-3"
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Color Scheme</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color.value ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          {(showPreview || window.innerWidth >= 1024) && (
            <div className="lg:sticky lg:top-6">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    ref={printRef}
                    className="bg-white border rounded-lg overflow-hidden shadow-sm"
                    style={{ minHeight: '800px' }}
                  >
                    <SelectedTemplateComponent data={cvData} color={selectedColor} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CVBuilder;
