
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  skills: string[];
}

interface ModernTemplateProps {
  data: CVData;
  color: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, color }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="relative">
        <div 
          className="h-24 w-full"
          style={{ backgroundColor: color }}
        />
        <div className="absolute inset-0 flex items-end pb-4 px-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-1">{data.personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              {data.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{data.personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Contact & Links */}
        {(data.personalInfo.linkedin || data.personalInfo.github) && (
          <div className="flex flex-wrap gap-4 text-sm">
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" style={{ color }} />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github className="w-3 h-3" style={{ color }} />
                <span>{data.personalInfo.github}</span>
              </div>
            )}
          </div>
        )}

        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: color, color }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: color, color }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="font-medium" style={{ color }}>{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 mt-2">
                      {exp.description.split('\n').map((line, idx) => (
                        <p key={idx} className="mb-1">• {line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && data.education[0].institution && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: color, color }}>
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="font-medium" style={{ color }}>{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: color, color }}>
              PROJECTS
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <div className="flex items-center gap-1 text-sm" style={{ color }}>
                        <ExternalLink className="w-3 h-3" />
                        <span>View Project</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 text-xs rounded text-white"
                          style={{ backgroundColor: color }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: color, color }}>
              TECHNICAL SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 text-sm rounded-full border"
                  style={{ borderColor: color, color }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
