import React, { useState, useEffect } from 'react';
import { ResumeData, SectionType, ATSAnalysis, JobMatchAnalysis } from '../types';
import { Icons } from './Icons';
import { generateResumeContent, analyzeATSScore, calculateJobMatch } from '../services/geminiService';

interface EditorProps {
  section: SectionType;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

// Data Lists for Dropdowns
const jobTitles = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Product Manager", "Project Manager", "Data Scientist", "Data Analyst",
  "UX/UI Designer", "Graphic Designer", "Marketing Manager", "Sales Representative",
  "Accountant", "Financial Analyst", "Teacher", "Customer Service Representative",
  "Human Resources Manager", "Operations Manager", "Business Analyst", "DevOps Engineer"
];

const degrees = [
  "High School Diploma", "Associate Degree", "Bachelor's Degree", "Master's Degree", 
  "Doctorate (PhD)", "Diploma", "Certification"
];

const egyptianUniversities = [
  "Cairo University", "Ain Shams University", "Alexandria University", 
  "The American University in Cairo (AUC)", "German University in Cairo (GUC)",
  "Helwan University", "Mansoura University", "Assiut University", 
  "Zagazig University", "The British University in Egypt (BUE)",
  "Future University in Egypt (FUE)", "Misr International University (MIU)",
  "October 6 University", "Nile University", "Benha University", 
  "Minia University", "Suez Canal University", "Tanta University"
];

const commonTechs = [
  "React", "Angular", "Vue.js", "Node.js", "Python", "Java", "C++", "C#", 
  "JavaScript", "TypeScript", "HTML5", "CSS3", "SQL", "MongoDB", "PostgreSQL",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "Rest API", 
  "GraphQL", "Next.js", "Tailwind CSS", "Bootstrap", "Sass", "Redux", "Express",
  "Flutter", "Dart", "Swift", "Kotlin", "Firebase", "Supabase", "Prisma"
];

const Editor: React.FC<EditorProps> = ({ section, data, onChange }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  
  // AI Analysis States
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);
  
  // Job Match State
  const [jdText, setJdText] = useState('');
  const [jobMatch, setJobMatch] = useState<JobMatchAnalysis | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<{ index: number; type: SectionType } | null>(null);

  // Auto-analyze ATS on mount (once) or when big sections change significantly?
  // For now, manual trigger or simple effect
  useEffect(() => {
    // Initial silent check or keep it manual to save tokens
  }, []);

  const handleAI = async (fieldContext: string, setter: (val: string) => void, currentVal: string) => {
    setLoadingAI(true);
    // Pass the section type to the service to allow for tailored prompts
    const suggestion = await generateResumeContent(section, fieldContext, currentVal);
    setter(suggestion);
    setLoadingAI(false);
  };

  const runATSCheck = async () => {
    setIsAnalyzingAts(true);
    const result = await analyzeATSScore(data);
    setAtsAnalysis(result);
    setIsAnalyzingAts(false);
  };

  const runJobMatch = async () => {
    if (!jdText.trim()) return;
    setIsMatching(true);
    const result = await calculateJobMatch(data, jdText);
    setJobMatch(result);
    setIsMatching(false);
  };

  const addSkill = (skill: string) => {
    const cleanSkill = skill.replace(/^['"]|['"]$/g, ''); 
    if (!data.skills.includes(cleanSkill)) {
      onChange({ ...data, skills: [...data.skills, cleanSkill] });
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number, type: SectionType) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) {
      e.preventDefault();
      return;
    }
    setDraggedItem({ index, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number, type: SectionType, listKey: keyof ResumeData) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== type || draggedItem.index === dropIndex) return;

    const list = [...(data[listKey] as any[])];
    const itemToMove = list[draggedItem.index];
    list.splice(draggedItem.index, 1);
    list.splice(dropIndex, 0, itemToMove);

    onChange({ ...data, [listKey]: list });
    setDraggedItem(null);
  };

  // Helper for Hybrid Select/Input fields
  const renderSelectWithCustomOption = (
    label: string, 
    value: string, 
    onChangeValue: (val: string) => void, 
    options: string[], 
    placeholder: string
  ) => {
    // Treat as custom if value is not in options list and is not empty
    const isCustom = value && !options.includes(value);

    if (isCustom) {
      return (
        <div className="relative">
          <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={value}
              onChange={(e) => onChangeValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
            />
            <button 
              onClick={() => onChangeValue('')}
              className="px-3 py-2 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              title="Back to list"
            >
              List
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <div className="relative">
          <select
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none text-slate-900"
            value={value}
            onChange={(e) => {
              if (e.target.value === 'CUSTOM_OPTION') {
                onChangeValue(' '); // Set a temp value to trigger custom input mode
              } else {
                onChangeValue(e.target.value);
              }
            }}
          >
            <option value="">Select {label}</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="CUSTOM_OPTION" className="font-semibold text-teal-600">+ Other / Custom...</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Icons.ChevronRight className="rotate-90" size={16} />
          </div>
        </div>
      </div>
    );
  };

  // --- Render Functions ---

  const renderATSWidget = () => (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white mb-6 shadow-lg border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <Icons.Chart className="text-teal-400" size={20} /> ATS Score
        </h3>
        <button 
          onClick={runATSCheck}
          disabled={isAnalyzingAts}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          {isAnalyzingAts ? <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Icons.Zap size={14} />}
          Analyze Now
        </button>
      </div>
      
      {atsAnalysis ? (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="flex items-end gap-2 mb-3">
            <span className={`text-5xl font-extrabold tracking-tight ${
              atsAnalysis.score >= 80 
                ? 'text-green-500 drop-shadow-sm' 
                : atsAnalysis.score >= 60 
                  ? 'text-yellow-400' 
                  : 'text-red-500'
            }`}>
              {atsAnalysis.score}
            </span>
            <span className="text-slate-400 text-sm mb-1.5 font-medium">/ 100</span>
          </div>
          <div className="space-y-2">
             {atsAnalysis.tips.map((tip, i) => (
               <div key={i} className="flex gap-2 text-xs md:text-sm text-slate-300">
                 <Icons.Check size={14} className={`mt-0.5 shrink-0 ${atsAnalysis.score >= 80 ? 'text-green-500' : 'text-teal-500'}`} />
                 {tip}
               </div>
             ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400 italic">
          Click analyze to check your resume score.
        </div>
      )}
    </div>
  );

  const renderJobMatch = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Icons.Target className="text-teal-600" /> Job Match Analyzer
      </h2>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
        <textarea
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-40 resize-none transition-all text-sm"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description (text only) here to see how well you match..."
        />
        <div className="mt-3 flex justify-end">
          <button 
            onClick={runJobMatch}
            disabled={isMatching || !jdText.trim()}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-medium text-sm"
          >
            {isMatching ? 'Analyzing...' : <>Check Match <Icons.ArrowRight size={16} /></>}
          </button>
        </div>

        {jobMatch && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4
                ${jobMatch.matchPercentage > 75 ? 'border-green-500 text-green-700 bg-green-50' : 'border-yellow-500 text-yellow-700 bg-yellow-50'}
              `}>
                {jobMatch.matchPercentage}%
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Match Score</h4>
                <p className="text-sm text-slate-500">{jobMatch.advice}</p>
              </div>
            </div>

            {jobMatch.missingKeywords.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Missing Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {jobMatch.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

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
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={data.personalInfo.fullName}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, fullName: e.target.value } })}
            placeholder="John Doe"
          />
        </div>
        
        {/* Job Title Dropdown */}
        {renderSelectWithCustomOption(
          "Job Title",
          data.personalInfo.jobTitle,
          (val) => onChange({ ...data, personalInfo: { ...data.personalInfo, jobTitle: val.trimStart() } }),
          jobTitles,
          "Software Engineer"
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={data.personalInfo.email}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
          <input
            type="tel"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={data.personalInfo.phone}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: e.target.value } })}
            placeholder="+20 123 456 7890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={data.personalInfo.location}
            onChange={(e) => onChange({ ...data, personalInfo: { ...data.personalInfo, location: e.target.value } })}
            placeholder="Cairo, Egypt"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">LinkedIn</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
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
          onClick={() => handleAI(`${data.personalInfo.jobTitle}`, (val) => onChange({ ...data, summary: val }), data.summary)}
          disabled={loadingAI}
          className="flex items-center gap-2 text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Icons.AI size={14} /> {loadingAI ? 'Thinking...' : 'AI Suggest'}
        </button>
      </div>
      <textarea
        className="w-full p-4 h-48 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed resize-none transition-all"
        value={data.summary}
        onChange={(e) => onChange({ ...data, summary: e.target.value })}
        placeholder="Briefly describe your professional background..."
      />
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
          <div 
            key={item.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index, 'experience')}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index, 'experience', 'experience')}
            className={`
              bg-white p-5 pl-12 rounded-xl border transition-all relative group animate-in fade-in zoom-in-95
              ${draggedItem?.type === 'experience' && draggedItem.index === index 
                ? 'opacity-40 border-dashed border-teal-500' 
                : 'border-slate-200 shadow-sm'}
            `}
          >
            <div className="absolute left-3 top-5 text-slate-300 hover:text-teal-600 cursor-grab active:cursor-grabbing drag-handle p-1">
              <Icons.DragHandle size={24} />
            </div>

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
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none font-medium"
                value={item.title}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].title = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
              <input
                placeholder="Company"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none"
                value={item.company}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].company = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
              <input
                placeholder="Start Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm"
                value={item.startDate}
                onChange={(e) => {
                  const newExp = [...data.experience];
                  newExp[index].startDate = e.target.value;
                  onChange({ ...data, experience: newExp });
                }}
              />
              <input
                placeholder="End Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm"
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
                className="w-full p-3 bg-slate-50 rounded border-none focus:ring-1 focus:ring-teal-500 text-sm h-24 resize-none"
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
          <div 
            key={item.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index, 'education')}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index, 'education', 'education')}
            className={`
              bg-white p-5 pl-12 rounded-xl border transition-all relative animate-in fade-in zoom-in-95
              ${draggedItem?.type === 'education' && draggedItem.index === index 
                ? 'opacity-40 border-dashed border-teal-500' 
                : 'border-slate-200 shadow-sm'}
            `}
          >
             <div className="absolute left-3 top-5 text-slate-300 hover:text-teal-600 cursor-grab active:cursor-grabbing drag-handle p-1">
                <Icons.DragHandle size={24} />
             </div>

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
              
              {/* Degree Dropdown */}
              {renderSelectWithCustomOption(
                "Degree / Certificate",
                item.degree,
                (val) => {
                  const newEdu = [...data.education];
                  newEdu[index].degree = val.trimStart();
                  onChange({ ...data, education: newEdu });
                },
                degrees,
                "Bachelor's Degree"
              )}

              {/* University Dropdown */}
              {renderSelectWithCustomOption(
                "University / School",
                item.school,
                (val) => {
                  const newEdu = [...data.education];
                  newEdu[index].school = val.trimStart();
                  onChange({ ...data, education: newEdu });
                },
                egyptianUniversities,
                "Cairo University"
              )}

              <input
                placeholder="Start Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm"
                value={item.startDate}
                onChange={(e) => {
                  const newEdu = [...data.education];
                  newEdu[index].startDate = e.target.value;
                  onChange({ ...data, education: newEdu });
                }}
              />
              <input
                placeholder="End Date"
                className="p-2 border-b border-slate-200 focus:border-teal-500 outline-none text-sm"
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
          className="w-full p-4 h-32 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none transition-all"
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

      <div className="flex flex-wrap gap-2 mt-4">
        {data.skills.map((skill, i) => skill.trim() && (
          <span key={i} className="flex items-center gap-1 pl-3 pr-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100 animate-in zoom-in">
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
          <div 
            key={item.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index, 'projects')}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index, 'projects', 'projects')}
            className={`
              bg-white p-5 pl-12 rounded-xl border transition-all relative animate-in fade-in zoom-in-95
              ${draggedItem?.type === 'projects' && draggedItem.index === index 
                ? 'opacity-40 border-dashed border-teal-500' 
                : 'border-slate-200 shadow-sm'}
            `}
          >
             <div className="absolute left-3 top-5 text-slate-300 hover:text-teal-600 cursor-grab active:cursor-grabbing drag-handle p-1">
                <Icons.DragHandle size={24} />
             </div>

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
                className="w-full p-2 border-b border-slate-200 focus:border-teal-500 outline-none font-medium text-lg"
                value={item.name}
                onChange={(e) => {
                  const newPrj = [...data.projects];
                  newPrj[index].name = e.target.value;
                  onChange({ ...data, projects: newPrj });
                }}
              />
            </div>

            {/* Technologies Input with Tags */}
            <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Technologies</label>
                <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  {(item.technologies || []).map((tech, techIndex) => (
                    <span key={techIndex} className="flex items-center gap-1 pl-2.5 pr-1 py-1 bg-white border border-slate-200 text-teal-700 rounded-md text-xs font-bold shadow-sm animate-in zoom-in duration-200">
                      {tech}
                      <button
                        onClick={() => {
                           const newPrj = [...data.projects];
                           const currentTechs = item.technologies || [];
                           newPrj[index].technologies = currentTechs.filter((_, i) => i !== techIndex);
                           onChange({ ...data, projects: newPrj });
                        }}
                        className="hover:bg-slate-100 text-slate-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
                      >
                        <Icons.Close size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    list={`tech-suggestions-${item.id}`}
                    className="flex-1 min-w-[150px] bg-transparent outline-none text-sm p-1 placeholder:text-slate-400"
                    placeholder="Add tech (e.g. React) + Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val) {
                           const newPrj = [...data.projects];
                           const currentTechs = item.technologies || [];
                           if (!currentTechs.includes(val)) {
                             newPrj[index].technologies = [...currentTechs, val];
                             onChange({ ...data, projects: newPrj });
                           }
                           e.currentTarget.value = '';
                        }
                      } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
                           const currentTechs = item.technologies || [];
                           if (currentTechs.length > 0) {
                             const newPrj = [...data.projects];
                             newPrj[index].technologies = currentTechs.slice(0, -1);
                             onChange({ ...data, projects: newPrj });
                           }
                      }
                    }}
                  />
                  <datalist id={`tech-suggestions-${item.id}`}>
                    {commonTechs.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>
            </div>

             <div className="relative">
              <textarea
                placeholder="What did you build? What tech did you use?"
                className="w-full p-3 bg-slate-50 rounded border-none focus:ring-1 focus:ring-teal-500 text-sm h-24 resize-none"
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
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      {/* Top ATS Widget */}
      {renderATSWidget()}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {section === 'personal' && renderPersonalInfo()}
        {section === 'summary' && renderSummary()}
        {section === 'experience' && renderExperience()}
        {section === 'education' && renderEducation()}
        {section === 'skills' && renderSkills()}
        {section === 'projects' && renderProjects()}
        {section === 'jobMatch' && renderJobMatch()}
      </div>
    </div>
  );
};

export default Editor;