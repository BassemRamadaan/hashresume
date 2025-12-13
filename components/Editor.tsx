import React, { useState } from 'react';
import { ResumeData, SectionType, ExperienceItem, EducationItem, ProjectItem } from '../types';
import { Icons } from './Icons';
import { generateResumeContent, analyzeJobDescription } from '../services/geminiService';

interface EditorProps {
  section: SectionType;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const Editor: React.FC<EditorProps> = ({ section, data, onChange }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Job Description Analysis State
  const [jdText, setJdText] = useState('');
  const [jdSkills, setJdSkills] = useState<string[]>([]);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState(false);
  const [showJdSection, setShowJdSection] = useState(false);

  const handleAI = async (fieldContext: string, setter: (val: string) => void, currentVal: string) => {
    setLoadingAI(true);
    const suggestion = await generateResumeContent(section, fieldContext, currentVal);
    setter(suggestion);
    setLoadingAI(false);
  };

  const handleAnalyzeJd = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzingJd(true);
    const skills = await analyzeJobDescription(jdText);
    setJdSkills(skills);
    setIsAnalyzingJd(false);
  };

  const addSkill = (skill: string) => {
    const cleanSkill = skill.replace(/^['"]|['"]$/g, ''); // Remove quotes if any
    if (!data.skills.includes(cleanSkill)) {
      onChange({ ...data, skills: [...data.skills, cleanSkill] });
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Icons.User className="text-teal-600" /> Personal Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200 hover:border-slate-300"
            value={data.personalInfo.fullName}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, fullName: e.target.value } })}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Job Title</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200 hover:border-slate-300"
            value={data.personalInfo.jobTitle}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, jobTitle: e.target.value } })}
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200 hover:border-slate-300"
            value={data.personalInfo.email}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
          <input
            type="tel"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200 hover:border-slate-300"
            value={data.personalInfo.phone}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: e.target.value } })}
            placeholder="+20 123 456 7890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200 hover:border-slate-300"
            value={data.personalInfo.location}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, location: e.target.value } })}
            placeholder="Cairo, Egypt"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">LinkedIn</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200 hover:border-slate-300"
            value={data.personalInfo.linkedin}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, linkedin: e.target.value } })}
            placeholder="linkedin.com/in/john"
          />
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Icons.Summary className="text-teal-600" /> Professional Summary
        </h2>
        <button
          onClick={() => handleAI(`${data.personalInfo.jobTitle} with specific skills`, (val) => onChange({ ...data, summary: val }), data.summary)}
          disabled={loadingAI}
          className="flex items-center gap-2 text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Icons.AI size={14} /> {loadingAI ? 'Thinking...' : 'AI Suggest'}
        </button>
      </div>
      <div className="relative">
        <textarea
          className="w-full p-4 h-48 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed resize-none transition-all duration-200 hover:border-slate-300"
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Briefly describe your professional background..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Icons.Briefcase className="text-teal-600" /> Experience
        </h2>
        <button
          onClick={() => onChange({
            ...data,
            experience: [...data.experience, { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' }]
          })}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <Icons.Add size={16} /> Add Position
        </button>
      </div>

      <div className="space-y-4">
        {data.experience.map((item, index) => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => {
                const newExp = [...data.experience];
                newExp.splice(index, 1);
                onChange({ ...data, experience: newExp });
              }}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Icons.Delete size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Job Title"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none font-medium transition-colors"
                value={item.title}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].title = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
              <input
                placeholder="Company"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none transition-colors"
                value={item.company}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].company = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
              <input
                placeholder="Start Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm transition-colors"
                value={item.startDate}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].startDate = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
              <input
                placeholder="End Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm transition-colors"
                value={item.endDate}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].endDate = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
            </div>
            <div className="relative mt-2">
              <textarea
                placeholder="Description of responsibilities..."
                className="w-full p-3 bg-slate-50 rounded border-none focus:ring-1 focus:ring-teal-500 text-sm h-24 resize-none transition-all"
                value={item.description}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].description = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
               <button
                  onClick={() => handleAI(
                    `Job description for ${item.title} at ${item.company}`, 
                    (val) => {
                      const newExp = [...data.experience];
                      newExp[index].description = val;
                      onChange({ ...data, experience: newExp });
                    }, 
                    item.description
                  )}
                  disabled={loadingAI}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 p-1.5 bg-white shadow-sm border border-slate-200 rounded text-xs font-medium text-slate-600 hover:text-purple-600 transition-colors"
                  title="AI Enhance"
                >
                  <Icons.AI size={14} /> AI Rewrite
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
     <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Icons.Education className="text-teal-600" /> Education
        </h2>
        <button
          onClick={() => onChange({
            ...data,
            education: [...data.education, { id: Date.now().toString(), degree: '', school: '', startDate: '', endDate: '', description: '' }]
          })}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <Icons.Add size={16} /> Add School
        </button>
      </div>

      <div className="space-y-4">
        {data.education.map((item, index) => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative animate-in fade-in zoom-in-95 duration-300">
             <button
              onClick={() => {
                const newEdu = [...data.education];
                newEdu.splice(index, 1);
                onChange({ ...data, education: newEdu });
              }}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Icons.Delete size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Degree / Certificate"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none font-medium transition-colors"
                value={item.degree}
                onChange={(e) => {
                  const newEdu = [...data.education];
                  newEdu[index].degree = e.target.value;
                  onChange({ ...data, education: newEdu });
                }}
              />
              <input
                placeholder="University / School"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none transition-colors"
                value={item.school}
                onChange={(e) => {
                  const newEdu = [...data.education];
                  newEdu[index].school = e.target.value;
                  onChange({ ...data, education: newEdu });
                }}
              />
              <input
                placeholder="Start Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm transition-colors"
                value={item.startDate}
                onChange={(e) => {
                  const newEdu = [...data.education];
                  newEdu[index].startDate = e.target.value;
                  onChange({ ...data, education: newEdu });
                }}
              />
              <input
                placeholder="End Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm transition-colors"
                value={item.endDate}
                onChange={(e) => {
                  const newEdu = [...data.education];
                  newEdu[index].endDate = e.target.value;
                  onChange({ ...data, education: newEdu });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Icons.Skills className="text-teal-600" /> Skills
        </h2>
      </div>

      <div className="relative">
         <textarea
          className="w-full p-4 h-32 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none transition-all duration-200 hover:border-slate-300"
          value={data.skills.join(', ')}
          onChange={(e) => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trimLeft()) })} 
          placeholder="Java, Communication, Project Management..."
        />
         <button
          onClick={() => handleAI(
            `List of top 10 ATS-optimized skills for a ${data.personalInfo.jobTitle}`, 
            (val) => onChange({ ...data, skills: [...data.skills, ...val.split(',').map(s => s.trim())].filter((v, i, a) => a.indexOf(v) === i) }), 
            data.skills.join(', ')
          )}
          disabled={loadingAI}
          className="absolute bottom-4 right-4 text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
        >
          <Icons.AI size={12} /> Suggest by Title
        </button>
      </div>

      {/* Skills Analysis Section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all duration-300">
        <button 
          onClick={() => setShowJdSection(!showJdSection)}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Icons.Target size={18} className="text-teal-600" /> 
            Match with Job Description
          </div>
          <Icons.ChevronRight size={16} className={`text-slate-400 transform transition-transform duration-200 ${showJdSection ? 'rotate-90' : ''}`} />
        </button>
        
        {showJdSection && (
          <div className="p-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
             <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Paste Job Description</label>
             <textarea
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm h-32 resize-none mb-3 transition-colors"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here to extract relevant skills..."
             />
             <button 
               onClick={handleAnalyzeJd} 
               disabled={isAnalyzingJd || !jdText.trim()}
               className="w-full md:w-auto bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors duration-200 transform active:scale-95"
             >
               {isAnalyzingJd ? (
                 <>Analyzing...</>
               ) : (
                 <><Icons.AI size={16} /> Analyze & Extract Skills</>
               )}
             </button>
             
             {jdSkills.length > 0 && (
               <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-500">
                 <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                   <Icons.Check size={14} className="text-green-600" /> Suggested Skills
                   <span className="text-xs font-normal text-slate-500">(Click to add)</span>
                 </h4>
                 <div className="flex flex-wrap gap-2">
                   {jdSkills.map((skill, i) => (
                     <button 
                       key={i}
                       onClick={() => addSkill(skill)}
                       disabled={data.skills.includes(skill)}
                       className={`
                         flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-all duration-200
                         ${data.skills.includes(skill) 
                           ? 'bg-green-50 border-green-200 text-green-700 opacity-50 cursor-default scale-95' 
                           : 'bg-white border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-700 shadow-sm hover:scale-105'}
                       `}
                     >
                       {skill}
                       {!data.skills.includes(skill) && <Icons.Add size={12} />}
                     </button>
                   ))}
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
      
      {/* Current Skills Chips */}
      <div className="flex flex-wrap gap-2 mt-4">
        {data.skills.map((skill, i) => skill.trim() && (
          <span key={i} className="flex items-center gap-1 pl-3 pr-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100 group animate-in zoom-in duration-200">
            {skill.trim()}
            <button 
              onClick={() => {
                 const newSkills = [...data.skills];
                 newSkills.splice(i, 1);
                 onChange({ ...data, skills: newSkills });
              }}
              className="p-0.5 hover:bg-teal-100 rounded-full transition-colors"
            >
              <Icons.Close size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Icons.Projects className="text-teal-600" /> Projects
        </h2>
        <button
          onClick={() => onChange({
            ...data,
            projects: [...data.projects, { id: Date.now().toString(), name: '', description: '', technologies: [] }]
          })}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <Icons.Add size={16} /> Add Project
        </button>
      </div>

       <div className="space-y-4">
        {data.projects.map((item, index) => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative animate-in fade-in zoom-in-95 duration-300">
             <button
              onClick={() => {
                const newPrj = [...data.projects];
                newPrj.splice(index, 1);
                onChange({ ...data, projects: newPrj });
              }}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Icons.Delete size={18} />
            </button>
            <div className="mb-4">
              <input
                placeholder="Project Name"
                className="w-full p-2 border-b border-slate-200 focus:border-teal-500 outline-none font-medium text-lg transition-colors"
                value={item.name}
                onChange={(e) => {
                  const newPrj = [...data.projects];
                  newPrj[index].name = e.target.value;
                  onChange({ ...data, projects: newPrj });
                }}
              />
            </div>
             <div className="relative">
              <textarea
                placeholder="What did you build? What tech did you use?"
                className="w-full p-3 bg-slate-50 rounded border-none focus:ring-1 focus:ring-teal-500 text-sm h-24 resize-none transition-all"
                value={item.description}
                onChange={(e) => {
                  const newPrj = [...data.projects];
                  newPrj[index].description = e.target.value;
                  onChange({ ...data, projects: newPrj });
                }}
              />
              <button
                  onClick={() => handleAI(
                    `Description for a project named ${item.name}`, 
                    (val) => {
                      const newPrj = [...data.projects];
                      newPrj[index].description = val;
                      onChange({ ...data, projects: newPrj });
                    }, 
                    item.description
                  )}
                  disabled={loadingAI}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 p-1.5 bg-white shadow-sm border border-slate-200 rounded text-xs font-medium text-slate-600 hover:text-purple-600 transition-colors"
                  title="AI Enhance"
                >
                  <Icons.AI size={14} /> AI Rewrite
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <div key={section} className="animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out fill-mode-both">
        {section === 'personal' && renderPersonalInfo()}
        {section === 'summary' && renderSummary()}
        {section === 'experience' && renderExperience()}
        {section === 'education' && renderEducation()}
        {section === 'skills' && renderSkills()}
        {section === 'projects' && renderProjects()}
      </div>
    </div>
  );
};

export default Editor;