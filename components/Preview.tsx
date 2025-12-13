import React from 'react';
import { ResumeData } from '../types';
import { Icons } from './Icons';

interface PreviewProps {
  data: ResumeData;
  isMobile: boolean;
}

const Preview: React.FC<PreviewProps> = ({ data, isMobile }) => {
  // A4 Ratio approx 1:1.41
  // We use scale to fit it in the view if needed, but for web view just scroll
  
  return (
    <div className={`
      bg-white shadow-2xl overflow-hidden
      ${isMobile ? 'w-full min-h-[600px]' : 'w-[210mm] min-h-[297mm] scale-[0.6] origin-top-left'} 
      text-slate-900 font-sans mx-auto
    `}
    style={!isMobile ? { width: '210mm', height: '297mm' } : {}}
    id="resume-preview"
    >
      <div className="p-8 md:p-12 h-full flex flex-col">
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xl text-teal-700 font-medium mb-4">
            {data.personalInfo.jobTitle || "Job Title"}
          </p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {data.personalInfo.email && (
              <span className="flex items-center gap-1">
                 {data.personalInfo.email}
              </span>
            )}
             {data.personalInfo.phone && (
              <span className="flex items-center gap-1">
                 {data.personalInfo.phone}
              </span>
            )}
             {data.personalInfo.location && (
              <span className="flex items-center gap-1">
                 {data.personalInfo.location}
              </span>
            )}
             {data.personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                 {data.personalInfo.linkedin}
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="space-y-6">
          
          {/* Summary */}
          {data.summary && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
                Professional Profile
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-200 pb-1">
                Experience
              </h3>
              <div className="space-y-4">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800">{exp.title}</h4>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-teal-700 font-medium mb-1">{exp.company}</div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
             <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-200 pb-1">
                Education
              </h3>
              <div className="space-y-3">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-slate-800">{edu.school}</h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-teal-700">{edu.degree}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-200 pb-1">
                Key Projects
              </h3>
              <div className="space-y-3">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <h4 className="font-bold text-slate-800 mb-1">{proj.name}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

           {/* Skills */}
           {data.skills.some(s => s.trim()) && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-200 pb-1">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => skill.trim() && (
                  <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default Preview;
