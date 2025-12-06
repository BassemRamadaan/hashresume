import React, { useState, useMemo, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { GlassCard } from './components/GlassCard';
import { Input, TextArea } from './components/Input';
import { AIModal } from './components/AIModal';
import { InstaPayModal } from './components/InstaPayModal';
import { ResumePaper } from './components/ResumePaper';
import { INITIAL_RESUME_STATE, TRANSLATIONS } from './constants';
import { ResumeData, Experience, Education, Project, Language } from './types';

// -- Localization Context --
const LanguageContext = createContext<{ lang: 'en' | 'ar'; setLang: (l: 'en' | 'ar') => void }>({ lang: 'en', setLang: () => {} });

// -- Utils --
const calculateAtsScore = (data: ResumeData): number => {
  let score = 0;
  if (data.fullName) score += 5;
  if (data.title) score += 5;
  if (data.email && data.phone) score += 10;
  if (data.summary && data.summary.length > 50) score += 15;
  if (data.skills.length >= 5) score += 10;
  if (data.experience.length > 0) score += 20;
  if (data.education.length > 0) score += 15;
  if (data.projects && data.projects.length > 0) score += 10;
  if (data.languages && data.languages.length > 0) score += 10;
  return Math.min(100, score);
};

const getRank = (score: number) => {
  if (score === 100) return { label: 'Legend', icon: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
  if (score >= 80) return { label: 'Expert', icon: '🥇', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50' };
  if (score >= 50) return { label: 'Achiever', icon: '🥈', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50' };
  return { label: 'Rookie', icon: '🥉', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
};

// -- Components --

const TypewriterText: React.FC<{ text: string, delay?: number }> = ({ text, delay = 0 }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
    hidden: {
      opacity: 0,
      y: 20,
    }
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "inline-block" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block", marginRight: letter === " " ? "0.3em" : 0 }}>
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// 1. Home Page
const Home: React.FC = () => {
  const { lang, setLang } = useContext(LanguageContext);
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-900 text-white selection:bg-teal-300 selection:text-teal-900 animate-gradient-x" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
           <Logo className="w-10 h-10 text-white" />
           <span className="font-bold text-xl tracking-tight hidden sm:block">Hash Resume</span>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-white/90 items-center">
          <Link to="/about" className="hover:text-teal-300 transition">{t.nav.about}</Link>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 transition uppercase text-xs font-bold">
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
        </div>
      </nav>

      <GlassCard className="relative z-10 max-w-lg w-full text-center p-8 md:p-14 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        
        {/* Logo & Title */}
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 mb-8"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-teal-400 blur-3xl opacity-30 rounded-full"></div>
                <Logo className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {t.heroTitle}
            </h1>
        </motion.div>

        {/* Slogan with Typewriter */}
        <div className="h-16 md:h-12 mb-8 text-lg md:text-xl font-light text-teal-100 tracking-wide">
            <TypewriterText key={lang} text={t.heroSlogan} delay={0.5} />
        </div>

        {/* CTA Button */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5, type: "spring", stiffness: 200 }}
            className="mb-10"
        >
            <Link 
                to="/editor" 
                className="group relative inline-flex items-center justify-center w-full py-4 px-8 bg-white text-indigo-900 rounded-full font-bold text-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
                <span className="relative z-10">{t.startBtn}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
        </motion.div>

        {/* Journey Steps */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="flex justify-center gap-8 border-t border-white/10 pt-8"
        >
            {[
                { icon: "✍️", label: t.steps.data },
                { icon: "🤖", label: t.steps.ai },
                { icon: "📄", label: t.steps.export }
            ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 group">
                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{step.icon}</span>
                    <span className="text-[10px] md:text-xs font-bold text-indigo-200 tracking-wider uppercase">{step.label}</span>
                </div>
            ))}
        </motion.div>

        {/* Trust Signals */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="mt-8 flex flex-col items-center gap-3"
        >
            <div className="flex items-center gap-3 bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:bg-black/50 transition-colors">
                <div className="font-bold italic flex items-center select-none text-lg">
                    <span className="text-purple-400">Insta</span><span className="text-white">Pay</span>
                </div>
                <div className="h-5 w-[1px] bg-white/20"></div>
                <div className="flex flex-col items-start leading-none">
                     <span className="text-xs text-teal-400 font-bold tracking-wide">Limited Offer</span>
                     <span className="text-sm font-bold text-white">20 EGP <span className="line-through opacity-50 text-xs ml-1 font-normal">100 EGP</span></span>
                </div>
            </div>
        </motion.div>
      </GlassCard>
    </div>
  );
};

// 2. Editor Page
const Editor: React.FC<{ data: ResumeData, updateData: (d: ResumeData) => void }> = ({ data, updateData }) => {
  const { lang } = useContext(LanguageContext);
  const t = TRANSLATIONS[lang];
  
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'projects' | 'skills' | 'languages'>('personal');
  const [showAI, setShowAI] = useState(false);
  const [aiType, setAiType] = useState<'summary' | 'skills' | 'experience'>('summary');
  const [aiContext, setAiContext] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Temporary state
  const [tempExp, setTempExp] = useState<Experience>({ id: '', company: '', role: '', duration: '', description: '' });
  const [tempEdu, setTempEdu] = useState<Education>({ id: '', institution: '', degree: '', year: '' });
  const [tempProj, setTempProj] = useState<Project>({ id: '', name: '', description: '', link: '' });
  const [tempLang, setTempLang] = useState<Language>({ id: '', language: '', proficiency: '' });
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const completionScore = calculateAtsScore(data);
  const rank = getRank(completionScore);

  const handleAiTrigger = (type: 'summary' | 'skills' | 'experience', context: string) => {
    setAiType(type);
    setAiContext(context);
    setShowAI(true);
  };

  const handleAiSelect = (text: string) => {
    if (aiType === 'summary') {
      updateData({ ...data, summary: text });
    } else if (aiType === 'skills') {
       const newSkills = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
       updateData({ ...data, skills: Array.from(new Set([...data.skills, ...newSkills])) });
    } else if (aiType === 'experience' && editingId) {
       setTempExp(prev => ({ ...prev, description: text }));
    }
  };

  const handleChange = (field: keyof ResumeData, value: any) => {
    updateData({ ...data, [field]: value });
  };

  // --- Handlers ---
  const saveExperience = () => {
    if (tempExp.id) { updateData({...data, experience: data.experience.map(e => e.id === tempExp.id ? tempExp : e)}); } 
    else { updateData({...data, experience: [...data.experience, { ...tempExp, id: Date.now().toString() }]}); }
    setShowForm(false); setTempExp({ id: '', company: '', role: '', duration: '', description: '' });
  };
  const editExperience = (exp: Experience) => { setTempExp(exp); setEditingId(exp.id); setShowForm(true); };
  const deleteExperience = (id: string) => { updateData({...data, experience: data.experience.filter(e => e.id !== id)}); };

  const saveEducation = () => {
      if (tempEdu.id) { updateData({...data, education: data.education.map(e => e.id === tempEdu.id ? tempEdu : e)}); } 
      else { updateData({...data, education: [...data.education, { ...tempEdu, id: Date.now().toString() }]}); }
      setShowForm(false); setTempEdu({ id: '', institution: '', degree: '', year: '' });
  };
  const editEducation = (edu: Education) => { setTempEdu(edu); setEditingId(edu.id); setShowForm(true); };
  const deleteEducation = (id: string) => { updateData({...data, education: data.education.filter(e => e.id !== id)}); };

  const saveProject = () => {
    if (tempProj.id) { updateData({...data, projects: data.projects.map(p => p.id === tempProj.id ? tempProj : p)}); }
    else { updateData({...data, projects: [...data.projects, { ...tempProj, id: Date.now().toString() }]}); }
    setShowForm(false); setTempProj({ id: '', name: '', description: '', link: '' });
  };
  const editProject = (p: Project) => { setTempProj(p); setEditingId(p.id); setShowForm(true); };
  const deleteProject = (id: string) => { updateData({...data, projects: data.projects.filter(p => p.id !== id)}); };

  const saveLanguage = () => {
    if (tempLang.id) { updateData({...data, languages: data.languages.map(l => l.id === tempLang.id ? tempLang : l)}); }
    else { updateData({...data, languages: [...data.languages, { ...tempLang, id: Date.now().toString() }]}); }
    setShowForm(false); setTempLang({ id: '', language: '', proficiency: '' });
  };
  const editLanguage = (l: Language) => { setTempLang(l); setEditingId(l.id); setShowForm(true); };
  const deleteLanguage = (id: string) => { updateData({...data, languages: data.languages.filter(l => l.id !== id)}); };

  const getListItems = () => {
    if (activeTab === 'experience') return data.experience;
    if (activeTab === 'education') return data.education;
    if (activeTab === 'projects') return data.projects;
    if (activeTab === 'languages') return data.languages;
    return [];
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 md:px-6 max-w-3xl mx-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AIModal isOpen={showAI} onClose={() => setShowAI(false)} type={aiType} contextText={aiContext} onSelect={handleAiSelect} />
      
      {/* Top Gamification Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className={`rounded-full p-1.5 px-6 bg-black/30 backdrop-blur-xl border border-white/10 flex items-center gap-3 shadow-lg max-w-sm mx-auto`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 ${rank.color}`}>
                {rank.icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center text-xs mb-1">
                    <span className={`font-bold uppercase tracking-wider ${rank.color}`}>{rank.label}</span>
                    <span className="text-white font-bold">{completionScore}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionScore}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${completionScore >= 80 ? 'from-purple-500 to-indigo-500' : 'from-teal-400 to-blue-500'}`}
                    />
                </div>
            </div>
        </div>
      </motion.div>

      {/* Segmented Control Tabs (iOS Style) */}
      <div className="flex overflow-x-auto gap-2 mb-6 p-1.5 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/5 scrollbar-hide">
        {[
            { id: 'personal', label: t.editor.personal },
            { id: 'experience', label: t.editor.work },
            { id: 'education', label: t.editor.education },
            { id: 'projects', label: t.editor.projects },
            { id: 'languages', label: t.editor.languages },
            { id: 'skills', label: t.editor.skills }
        ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
              className={`flex-1 min-w-[90px] py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
        ))}
      </div>

      {/* Main Form Card */}
      <GlassCard className="min-h-[500px]">
        <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div 
                key="personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                  <div className="flex flex-col gap-5">
                    <Input label="Full Name" icon="👤" value={data.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="e.g. Karim Ahmed" />
                    <Input label="Job Title" icon="💼" value={data.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g. Frontend Developer" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input label="Email" icon="📧" value={data.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="name@example.com" />
                        <Input label="Phone" icon="📞" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+20 100..." />
                    </div>
                    <Input label="LinkedIn" icon="🔗" value={data.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                  </div>
                  
                  <div className="pt-2">
                     <div className="flex justify-between items-center mb-2 px-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4">Summary</label>
                        <button onClick={() => handleAiTrigger('summary', data.summary)} className="text-[10px] px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition text-white flex gap-1 items-center font-bold">
                            {t.editor.enhance}
                        </button>
                     </div>
                     <TextArea label="" value={data.summary} onChange={(e) => handleChange('summary', e.target.value)} placeholder="Briefly describe your professional background..." />
                  </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-[24px] text-center">
                    <h3 className="text-purple-300 font-bold mb-2">Enhance your profile</h3>
                    <p className="text-sm text-gray-400 mb-4">Let AI suggest relevant skills based on your title.</p>
                    <button onClick={() => handleAiTrigger('skills', data.title + " " + data.summary)} className="px-6 py-2 bg-purple-600 rounded-full text-white font-bold text-sm shadow-lg hover:bg-purple-500 transition">{t.editor.aiSuggest}</button>
                 </div>

                 <div>
                    <Input label="Add Skill" value="" 
                        placeholder="Type and press Enter..." 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = e.currentTarget.value.trim();
                                if (val) {
                                    handleChange('skills', [...data.skills, val]);
                                    e.currentTarget.value = '';
                                }
                            }
                        }}
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-sm text-white flex items-center gap-2 hover:bg-teal-500/20 hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all cursor-default group">
                                {skill}
                                <button onClick={() => handleChange('skills', data.skills.filter(s => s !== skill))} className="text-gray-400 hover:text-white group-hover:text-teal-200">×</button>
                            </span>
                        ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {['experience', 'education', 'projects', 'languages'].includes(activeTab) && (
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                >
                     {/* List View */}
                     {!showForm && (
                        <div className="space-y-4">
                             {getListItems().length === 0 && (
                                 <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-[24px]">
                                     <p className="text-gray-400">No items added yet.</p>
                                     <button onClick={() => { 
                                         if(activeTab === 'experience') setTempExp({ id: '', company: '', role: '', duration: '', description: '' });
                                         if(activeTab === 'education') setTempEdu({ id: '', institution: '', degree: '', year: '' });
                                         if(activeTab === 'projects') setTempProj({ id: '', name: '', description: '', link: '' });
                                         if(activeTab === 'languages') setTempLang({ id: '', language: '', proficiency: '' });
                                         setEditingId(null); 
                                         setShowForm(true); 
                                     }} className="mt-4 text-teal-400 font-bold hover:text-teal-300">{t.editor.addFirst}</button>
                                 </div>
                             )}
                             {getListItems().map((item: any) => (
                                 <div key={item.id} className="p-5 rounded-[24px] bg-white/5 border border-white/10 flex justify-between items-center group">
                                     <div>
                                         <h4 className="font-bold text-white text-lg">{item.role || item.degree || item.name || item.language}</h4>
                                         <p className="text-sm text-gray-400">{item.company || item.institution || item.proficiency || "Link: " + item.link}</p>
                                     </div>
                                     <div className="flex gap-2">
                                         <button onClick={() => {
                                             if(activeTab === 'experience') editExperience(item);
                                             if(activeTab === 'education') editEducation(item);
                                             if(activeTab === 'projects') editProject(item);
                                             if(activeTab === 'languages') editLanguage(item);
                                         }} className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-full transition">✏️</button>
                                         <button onClick={() => {
                                             if(activeTab === 'experience') deleteExperience(item.id);
                                             if(activeTab === 'education') deleteEducation(item.id);
                                             if(activeTab === 'projects') deleteProject(item.id);
                                             if(activeTab === 'languages') deleteLanguage(item.id);
                                         }} className="p-2 text-red-400 hover:bg-red-400/20 rounded-full transition">🗑️</button>
                                     </div>
                                 </div>
                             ))}
                             {getListItems().length > 0 && (
                                <button onClick={() => { 
                                    if(activeTab === 'experience') setTempExp({ id: '', company: '', role: '', duration: '', description: '' });
                                    if(activeTab === 'education') setTempEdu({ id: '', institution: '', degree: '', year: '' });
                                    if(activeTab === 'projects') setTempProj({ id: '', name: '', description: '', link: '' });
                                    if(activeTab === 'languages') setTempLang({ id: '', language: '', proficiency: '' });
                                    setEditingId(null); 
                                    setShowForm(true); 
                                }} className="w-full py-4 rounded-full border border-dashed border-teal-500/30 text-teal-400 hover:bg-teal-500/10 font-bold transition flex items-center justify-center gap-2">
                                    <span>{t.editor.addAnother}</span>
                                </button>
                             )}
                        </div>
                     )}

                     {/* Form View */}
                     {showForm && (
                         <div className="space-y-5 animate-fade-in">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">{editingId ? t.editor.edit : t.editor.new}</h3>
                                <button onClick={() => setShowForm(false)} className="text-sm text-gray-400 hover:text-white">{t.editor.cancel}</button>
                             </div>
                             
                             {activeTab === 'experience' && (
                                 <>
                                    <Input label="Role" value={tempExp.role} onChange={e => setTempExp({...tempExp, role: e.target.value})} />
                                    <Input label="Company" value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} />
                                    <Input label="Duration" value={tempExp.duration} onChange={e => setTempExp({...tempExp, duration: e.target.value})} />
                                    <div>
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4">Description</label>
                                            <button onClick={() => handleAiTrigger('experience', tempExp.description)} className="text-[10px] px-3 py-1 bg-purple-600 rounded-full hover:bg-purple-500 transition text-white flex gap-1 items-center font-bold">✨ Enhance</button>
                                        </div>
                                        <TextArea label="" value={tempExp.description} onChange={e => setTempExp({...tempExp, description: e.target.value})} />
                                    </div>
                                    <button onClick={saveExperience} className="w-full py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-gray-100 transition shadow-lg mt-4">{t.editor.save}</button>
                                 </>
                             )}

                             {activeTab === 'education' && (
                                 <>
                                    <Input label="Institution" value={tempEdu.institution} onChange={e => setTempEdu({...tempEdu, institution: e.target.value})} />
                                    <Input label="Degree" value={tempEdu.degree} onChange={e => setTempEdu({...tempEdu, degree: e.target.value})} />
                                    <Input label="Year" value={tempEdu.year} onChange={e => setTempEdu({...tempEdu, year: e.target.value})} />
                                    <button onClick={saveEducation} className="w-full py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-gray-100 transition shadow-lg mt-4">{t.editor.save}</button>
                                 </>
                             )}

                             {activeTab === 'projects' && (
                                 <>
                                    <Input label="Project Name" value={tempProj.name} onChange={e => setTempProj({...tempProj, name: e.target.value})} />
                                    <Input label="Link" value={tempProj.link} onChange={e => setTempProj({...tempProj, link: e.target.value})} />
                                    <TextArea label="Description" value={tempProj.description} onChange={e => setTempProj({...tempProj, description: e.target.value})} />
                                    <button onClick={saveProject} className="w-full py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-gray-100 transition shadow-lg mt-4">{t.editor.save}</button>
                                 </>
                             )}

                             {activeTab === 'languages' && (
                                 <>
                                    <Input label="Language" value={tempLang.language} onChange={e => setTempLang({...tempLang, language: e.target.value})} />
                                    <Input label="Proficiency" value={tempLang.proficiency} onChange={e => setTempLang({...tempLang, proficiency: e.target.value})} placeholder="e.g. Native, Fluent, Beginner" />
                                    <button onClick={saveLanguage} className="w-full py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-gray-100 transition shadow-lg mt-4">{t.editor.save}</button>
                                 </>
                             )}
                         </div>
                     )}
                </motion.div>
            )}
        </AnimatePresence>
      </GlassCard>
      
      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-40 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pb-8 pt-10">
         <div className="max-w-3xl mx-auto flex gap-4">
             <button 
                onClick={() => navigate('/preview')}
                className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full text-white font-bold text-lg shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_40px_rgba(20,184,166,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
             >
                <span>{t.editor.previewBtn}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
         </div>
      </div>
    </div>
  );
};

// 3. Preview Page
const Preview: React.FC<{ data: ResumeData }> = ({ data }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [exportToken, setExportToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Simple ATS Analysis
  const analysis = useMemo(() => {
    let score = 50; 
    const tips = [];
    if (!data.summary) { score -= 10; tips.push("Add a professional summary."); }
    if (data.skills.length < 5) { score -= 10; tips.push("Add at least 5 skills."); }
    if (data.experience.length === 0) { score -= 20; tips.push("Add work experience."); }
    if (!data.languages || data.languages.length === 0) { score -= 5; tips.push("Add languages."); }
    return { score: Math.max(0, score), tips };
  }, [data]);

  const handleDownload = async () => {
    if (!exportToken) { setShowPayment(true); return; }
    window.print(); 
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 max-w-6xl mx-auto">
      {showPayment && <InstaPayModal onSuccess={(t) => { setExportToken(t); setShowPayment(false); setTimeout(handleDownload, 500); }} onClose={() => setShowPayment(false)} />}
      
      <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/editor')} className="text-gray-400 hover:text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Editor
          </button>
          <h2 className="text-2xl font-bold">Final Preview</h2>
          <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
           <GlassCard className="border-t-4 border-t-teal-400">
               <h3 className="text-xl font-bold mb-4">ATS Analysis</h3>
               <div className="flex items-center gap-4 mb-6">
                   <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold ${analysis.score >= 80 ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                       {analysis.score}
                   </div>
                   <div className="text-sm text-gray-300">
                       <p className="font-semibold text-white">Overall Score</p>
                       <p>{analysis.score < 70 ? "Needs Improvement" : "Ready to Send"}</p>
                   </div>
               </div>
               <div className="space-y-2">
                   {analysis.tips.map((tip, i) => (
                       <div key={i} className="flex gap-2 text-xs text-yellow-200 bg-yellow-900/20 p-2 rounded">
                           <span>⚠️</span> {tip}
                       </div>
                   ))}
                   {analysis.tips.length === 0 && <div className="text-green-400 text-xs flex items-center gap-2"><span>✅</span> No critical issues found!</div>}
               </div>
           </GlassCard>

           <GlassCard>
                <div className="text-center mb-6">
                    <span className="block text-gray-400 text-sm mb-1">Total Price</span>
                    <span className="text-4xl font-bold text-white block">20 EGP</span>
                    <span className="text-sm text-gray-500 line-through">100 EGP</span>
                </div>
                <button 
                    onClick={handleDownload}
                    className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 ${exportToken ? 'bg-green-500 text-white' : 'bg-white text-indigo-900'}`}
                >
                    {exportToken ? "Download PDF" : "Unlock & Download"}
                </button>
                <div className="mt-4 flex flex-col items-center gap-2 opacity-60">
                     <span className="text-[10px] text-gray-400 uppercase tracking-widest">Secured by</span>
                     <div className="font-bold italic text-sm"><span className="text-purple-400">Insta</span><span className="text-white">Pay</span></div>
                </div>
           </GlassCard>
        </div>

        {/* Resume Preview */}
        <div className="lg:col-span-2 flex justify-center order-1 lg:order-2">
            <div className="border border-white/10 shadow-2xl overflow-hidden rounded-sm max-w-full">
                {/* Scale down slightly for mobile view if needed via CSS transform in parent */}
                <div className="origin-top transform scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.85] xl:scale-100">
                    <ResumePaper data={data} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Main App Layout
const AppContent: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_STATE);
    const location = useLocation();
    const { lang, setLang } = useContext(LanguageContext);
    const t = TRANSLATIONS[lang];

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {location.pathname !== '/' && (
                <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" className="flex items-center gap-2">
                                <Logo className="w-8 h-8 text-teal-400" />
                                <span className="font-bold text-lg hidden sm:block">Hash Resume</span>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                                    <Link to="/editor" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${location.pathname === '/editor' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>{t.nav.editor}</Link>
                                    <Link to="/preview" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${location.pathname === '/preview' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>{t.nav.preview}</Link>
                                </div>
                                <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold">
                                    {lang === 'en' ? 'ع' : 'En'}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor data={resumeData} updateData={setResumeData} />} />
                <Route path="/preview" element={<Preview data={resumeData} />} />
                <Route path="/about" element={<div className="p-20 text-center mt-20"><h1>{t.nav.about}</h1><Link to="/" className="text-teal-400">Home</Link></div>} />
                <Route path="/privacy" element={<div className="p-20 text-center mt-20"><h1>{t.nav.privacy}</h1><Link to="/" className="text-teal-400">Home</Link></div>} />
            </Routes>
        </div>
    );
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
        <HashRouter>
          <AppContent />
        </HashRouter>
    </LanguageContext.Provider>
  );
}