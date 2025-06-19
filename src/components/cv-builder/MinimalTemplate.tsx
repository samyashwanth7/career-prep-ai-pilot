
import React from 'react';

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

interface MinimalTemplateProps {
  data: CVData;
  color: string;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data, color }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 text-sm leading-relaxed p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-2 tracking-wide">{data.personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-gray-600 space-y-1">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
          {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          {data.personalInfo.github && <div>{data.personalInfo.github}</div>}
        </div>
      </div>

      <div className="space-y-8">
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color }}>
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <h3 className="font-medium text-gray-900">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 mt-2 text-sm">
                      {exp.description.split('\n').map((line, idx) => (
                        <p key={idx} className="mb-1">{line}</p>
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
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color }}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
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
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        View Project
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {proj.technologies.join(' • ')}
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
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color }}>
              Skills
            </h2>
            <p className="text-gray-700 text-sm">
              {data.skills.join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
