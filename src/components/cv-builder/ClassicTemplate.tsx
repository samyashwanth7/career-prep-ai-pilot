
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

interface ClassicTemplateProps {
  data: CVData;
  color: string;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, color }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 text-sm leading-relaxed p-8">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">{data.personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.address}</span>
            </div>
          )}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github) && (
          <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1" style={{ color }}>
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-1" style={{ color }}>
                <Github className="w-4 h-4" />
                <span>{data.personalInfo.github}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color }}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-3 pl-4" style={{ borderColor: color }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="font-semibold text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600 italic">
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
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color }}>
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-3 pl-4" style={{ borderColor: color }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="font-semibold text-gray-700">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600 italic">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 italic">
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
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border-l-3 pl-4" style={{ borderColor: color }}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <div className="flex items-center gap-1 text-sm" style={{ color }}>
                        <ExternalLink className="w-3 h-3" />
                        <span className="italic">View Project</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2 text-justify">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Technologies: </span>
                      {proj.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color }}>
              Technical Skills
            </h2>
            <div className="border-l-3 pl-4" style={{ borderColor: color }}>
              <p className="text-gray-700 leading-relaxed">
                {data.skills.join(' • ')}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;
