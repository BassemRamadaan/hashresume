import React from 'react';
import { ResumeData } from '../types';

interface ResumePaperProps {
  data: ResumeData;
  className?: string;
  scale?: number;
}

export const ResumePaper: React.FC<ResumePaperProps> = ({ data, className = "", scale = 1 }) => {
  return (
    <div 
      className={`bg-white text-slate-900 shadow-2xl rounded-sm font-serif origin-top-left ${className}`}
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        padding: '20mm', // Standard A4 padding
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }}
      id="resume-preview"
    >
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 break-words">{data.fullName || "Your Name"}</h1>
          <p className="text-xl text-slate-600 mt-1 font-sans font-light tracking-wider">{data.title || "Professional Title"}</p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-500 font-sans">
              {data.email && <div className="flex items-center gap-1"><span>📧</span><span>{data.email}</span></div>}
              {data.phone && <div className="flex items-center gap-1"><span>📱</span><span>{data.phone}</span></div>}
              {data.linkedin && <div className="flex items-center gap-1"><span>🔗</span><span>{data.linkedin.replace(/^https?:\/\//, '')}</span></div>}
              <div className="flex items-center gap-1"><span>📍</span><span>Egypt</span></div>
          </div>
      </div>

      {/* Summary */}
      {data.summary && (
          <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans border-b border-slate-200 pb-1">Professional Summary</h3>
              <p className="text-slate-800 leading-relaxed text-sm text-justify">
                  {data.summary}
              </p>
          </div>
      )}

      {/* Experience */}
      {(data.experience && data.experience.length > 0) && (
        <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans border-b border-slate-200 pb-1">Experience</h3>
            {data.experience.map((exp, i) => (
                    <div key={i} className="mb-6 last:mb-0 relative pl-4 border-l-2 border-slate-100">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-lg text-slate-800">{exp.role}</h4>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-sans whitespace-nowrap">{exp.duration}</span>
                        </div>
                        <p className="font-semibold text-teal-700 text-sm mb-2">{exp.company}</p>
                        <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed text-justify">{exp.description}</p>
                    </div>
                ))
            }
        </div>
      )}

      {/* Projects */}
      {(data.projects && data.projects.length > 0) && (
        <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans border-b border-slate-200 pb-1">Projects</h3>
            {data.projects.map((proj, i) => (
                <div key={i} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-slate-800">{proj.name}</h4>
                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">{proj.link.replace(/^https?:\/\//, '')}</a>}
                    </div>
                    <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed text-justify">{proj.description}</p>
                </div>
            ))}
        </div>
      )}

      {/* Education */}
      {(data.education && data.education.length > 0) && (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans border-b border-slate-200 pb-1">Education</h3>
          {data.education.map((edu, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                          <span className="text-sm text-slate-500 font-sans">{edu.year}</span>
                      </div>
                      <p className="text-sm text-teal-700 font-medium">{edu.institution}</p>
                  </div>
              ))
          }
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
          {/* Skills */}
          {data.skills.length > 0 && (
              <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans border-b border-slate-200 pb-1">Skills</h3>
                  <div className="flex flex-wrap gap-x-2 gap-y-2">
                      {data.skills.map((skill, i) => (
                          <span key={i} className="text-slate-800 font-medium bg-slate-100 px-3 py-1 rounded-full text-xs border border-slate-200">
                              {skill}
                          </span>
                      ))}
                  </div>
              </div>
          )}

          {/* Languages */}
          {(data.languages && data.languages.length > 0) && (
              <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans border-b border-slate-200 pb-1">Languages</h3>
                  <div className="space-y-1">
                      {data.languages.map((lang, i) => (
                          <div key={i} className="flex justify-between text-sm">
                              <span className="text-slate-800 font-medium">{lang.language}</span>
                              <span className="text-slate-500">{lang.proficiency}</span>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};