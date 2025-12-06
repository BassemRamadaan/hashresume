import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { GlassCard } from './components/GlassCard';
import { Input, TextArea } from './components/Input';
import { AIModal } from './components/AIModal';
import { InstaPayModal } from './components/InstaPayModal';
import { ResumePaper } from './components/ResumePaper';
import { INITIAL_RESUME_STATE, MOCK_ATS_KEYWORDS } from './constants';
import { ResumeData, AtsAnalysis, RubricItem, Experience, Education } from './types';
import { generatePdfUrl } from './services/mockApi';

// -- Utils --
const calculateAtsScore = (data: ResumeData): number => {
  let score = 0;
  if (data.fullName) score += 10;
  if (data.title) score += 10;
  if (data.email && data.phone) score += 10;
  if (data.summary && data.summary.length > 50) score += 15;
  if (data.skills.length >= 5) score += 15;
  if (data.experience.length > 0) score += 20;
  if (data.education.length > 0) score += 20;
  return Math.min(100, score);
};

const getRank = (score: number) => {
  if (score === 100) return { label: 'Legend', icon: '🏆', color: 'text-yellow-400', bg: 'bg-gradient-to-br from-yellow-900/40 to-yellow-600/10', border: 'border-yellow-500/50', bar: 'from-yellow-400 to-orange-500' };
  if (score >= 80) return { label: 'Expert', icon: '🥇', color: 'text-purple-400', bg: 'bg-gradient-to-br from-purple-900/40 to-purple-600/10', border: 'border-purple-500/50', bar: 'from-purple-500 to-indigo-500' };
  if (score >= 50) return { label: 'Achiever', icon: '🥈', color: 'text-blue-400', bg: 'bg-gradient-to-br from-blue-900/40 to-blue-600/10', border: 'border-blue-500/50', bar: 'from-blue-400 to-cyan-400' };
  return { label: 'Rookie', icon: '🥉', color: 'text-gray-400', bg: 'bg-gradient-to-br from-gray-800/40 to-gray-600/10', border: 'border-gray-500/30', bar: 'from-gray-500 to-slate-400' };
};

// -- Components --

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-900 text-white selection:bg-teal-300 selection:text-teal-900 animate-gradient-x">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/30 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
           <Logo className="w-10 h-10 text-white" />
           <span className="font-bold text-xl tracking-tight hidden sm:block">Hash Resume</span>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-white/90">
          <Link to="/about" className="hover:text-teal-300 transition">About</Link>
          <Link to="/privacy" className="hover:text-teal-300 transition">Privacy</Link>
        </div>
      </nav>

      <GlassCard className="relative z-10 max-w-lg w-full text-center p-8 md:p-14 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        
        {/* Logo & Title */}
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 mb-8"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-teal-400 blur-2xl opacity-20 rounded-full"></div>
                <Logo className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Hash Resume
            </h1>
        </motion.div>

        {/* Slogan with Typewriter */}
        <div className="h-16 md:h-8 mb-8 text-lg md:text-xl font-light text-teal-100 tracking-wide">
            <TypewriterText text="Mobile‑First • AI‑Powered • Localized for MENA" delay={0.5} />
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
                className="group relative inline-flex items-center justify-center w-full py-4 px-8 bg-white text-indigo-900 rounded-full font-bold text-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105 active:scale-95 animate-[bounce_1s_infinite_ease-in-out_3s]"
                style={{ animationIterationCount: 1 }}
            >
                <span className="relative z-10">Start Building Now</span>
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
                { icon: "✍️", label: "Enter Data" },
                { icon: "🤖", label: "AI Suggestions" },
                { icon: "📄", label: "Export PDF" }
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
                {/* Stylized InstaPay */}
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
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education'>('personal');
  const [showAI, setShowAI] = useState(false);
  const [aiType, setAiType] = useState<'summary' | 'skills' | 'experience'>('summary');
  const [aiContext, setAiContext] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Temporary state
  const [tempExp, setTempExp] = useState<Experience>({ id: '', company: '', role: '', duration: '', description: '' });
  const [tempEdu, setTempEdu] = useState<Education>({ id: '', institution: '', degree: '', year: '' });
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

  // --- Handlers (Experience/Education) - Simplified for brevity in this update ---
  const saveExperience = () => {
    if (tempExp.id) {
        updateData({...data, experience: data.experience.map(e => e.id === tempExp.id ? tempExp : e)});
    } else {
        updateData({...data, experience: [...data.experience, { ...tempExp, id: Date.now().toString() }]});
    }
    setShowForm(false);
    setTempExp({ id: '', company: '', role: '', duration: '', description: '' });
  };
  const editExperience = (exp: Experience) => { setTempExp(exp); setEditingId(exp.id); setShowForm(true); };
  const deleteExperience = (id: string) => { updateData({...data, experience: data.experience.filter(e => e.id !== id)}); };

  const saveEducation = () => {
      if (tempEdu.id) {
          updateData({...data, education: data.education.map(e => e.id === tempEdu.id ? tempEdu : e)});
      } else {
          updateData({...data, education: [...data.education, { ...tempEdu, id: Date.now().toString() }]});
      }
      setShowForm(false);
      setTempEdu({ id: '', institution: '', degree: '', year: '' });
  };
  const editEducation = (edu: Education) => { setTempEdu(edu); setEditingId(edu.id); setShowForm(true); };
  const deleteEducation = (id: string) => { updateData({...data, education: data.education.filter(e => e.id !== id)}); };


  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <AIModal isOpen={showAI} onClose={() => setShowAI(false)} type={aiType} contextText={aiContext} onSelect={handleAiSelect} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-indigo-200">Editor</h2>
           <p className="text-indigo-200/60 text-sm">Build your professional profile</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <button 
               onClick={() => navigate('/preview')}
               className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold transition shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2"
             >
               <span>Preview & Export</span>
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left Sidebar (Nav & Score) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Gamified Score Card */}
          <GlassCard className={`!p-0 overflow-hidden border ${rank.border} group`}>
             <div className={`p-4 ${rank.bg}`}>
                <div className="flex justify-between items-center mb-1">
                   <h3 className={`font-black uppercase text-xs tracking-widest ${rank.color} flex items-center gap-1`}>
                      {rank.icon} {rank.label}
                   </h3>
                   <span className="text-white font-bold">{completionScore}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                   <div style={{ width: `${completionScore}%` }} className={`h-full rounded-full bg-gradient-to-r ${rank.bar}`}></div>
                </div>
             </div>
             <div className="p-3 bg-black/20 text-[10px] text-gray-400 text-center">
                 {completionScore < 100 ? "Complete sections to rank up!" : "Max level reached!"}
             </div>
          </GlassCard>

          {/* Nav Tabs */}
          <div className="space-y-1">
            {[
                { id: 'personal', label: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'experience', label: 'Experience', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { id: 'education', label: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' }
            ].map((tab) => (
                <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-3 font-medium ${
                    activeTab === tab.id 
                    ? 'bg-white/10 text-white border border-white/20 shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                >
                <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
                </button>
            ))}
          </div>
        </div>

        {/* Center Form Area */}
        <div className="lg:col-span-9">
          <GlassCard className="min-h-[600px] relative overflow-hidden backdrop-blur-xl border-white/10">
            {activeTab === 'personal' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Full Name" value={data.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="e.g. Karim Ahmed" />
                    <Input label="Job Title" value={data.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g. Frontend Developer" />
                    <Input label="Email" value={data.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="name@example.com" />
                    <Input label="Phone" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+20 100..." />
                    <Input label="LinkedIn" value={data.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/..." className="md:col-span-2" />
                  </div>
                  <div className="pt-4">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4">Professional Summary</label>
                        <button onClick={() => handleAiTrigger('summary', data.summary)} className="text-xs px-3 py-1 bg-purple-600 rounded-full hover:bg-purple-500 transition text-white flex gap-1 items-center">✨ AI Rewrite</button>
                     </div>
                     <TextArea label="" value={data.summary} onChange={(e) => handleChange('summary', e.target.value)} placeholder="Describe your professional background..." />
                  </div>
                  <div className="pt-2">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4">Skills</label>
                        <button onClick={() => handleAiTrigger('skills', data.title + " " + data.summary)} className="text-xs px-3 py-1 bg-purple-600 rounded-full hover:bg-purple-500 transition text-white flex gap-1 items-center">✨ Suggest Skills</button>
                     </div>
                     <Input label="" value={data.skills.join(', ')} onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))} placeholder="React, Node.js..." />
                  </div>
              </motion.div>
            )}

            {/* Experience & Education are similar structures, simplified for brevity but full functionality maintained */}
            {(activeTab === 'experience' || activeTab === 'education') && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                     {/* List View */}
                     {!showForm && (
                        <div className="space-y-4">
                             {(activeTab === 'experience' ? data.experience : data.education).length === 0 && (
                                 <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                                     <p className="text-gray-400">Add your first item</p>
                                 </div>
                             )}
                             {(activeTab === 'experience' ? data.experience : data.education).map((item: any) => (
                                 <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex justify-between items-center group">
                                     <div>
                                         <h4 className="font-bold text-white">{item.role || item.degree}</h4>
                                         <p className="text-sm text-gray-400">{item.company || item.institution}</p>
                                     </div>
                                     <div className="flex gap-2">
                                         <button onClick={() => activeTab === 'experience' ? editExperience(item) : editEducation(item)} className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-full transition"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                         <button onClick={() => activeTab === 'experience' ? deleteExperience(item.id) : deleteEducation(item.id)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-full transition"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                     </div>
                                 </div>
                             ))}
                             <button onClick={() => { 
                                 if(activeTab === 'experience') { setTempExp({ id: '', company: '', role: '', duration: '', description: '' }); }
                                 else { setTempEdu({ id: '', institution: '', degree: '', year: '' }); }
                                 setEditingId(null); 
                                 setShowForm(true); 
                             }} className="w-full py-4 rounded-full border border-dashed border-teal-500/50 text-teal-400 hover:bg-teal-500/10 font-bold transition flex items-center justify-center gap-2">
                                 <span>+ Add New</span>
                             </button>
                        </div>
                     )}

                     {/* Form View */}
                     {showForm && (
                         <div className="space-y-5">
                             <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
                             {activeTab === 'experience' ? (
                                 <>
                                    <Input label="Role" value={tempExp.role} onChange={e => setTempExp({...tempExp, role: e.target.value})} />
                                    <Input label="Company" value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} />
                                    <Input label="Duration" value={tempExp.duration} onChange={e => setTempExp({...tempExp, duration: e.target.value})} />
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4">Description</label>
                                            <button onClick={() => handleAiTrigger('experience', tempExp.description)} className="text-xs px-3 py-1 bg-purple-600 rounded-full hover:bg-purple-500 transition text-white flex gap-1 items-center">✨ Enhance</button>
                                        </div>
                                        <TextArea label="" value={tempExp.description} onChange={e => setTempExp({...tempExp, description: e.target.value})} />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-full border border-white/20 hover:bg-white/5 transition">Cancel</button>
                                        <button onClick={saveExperience} className="flex-1 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-100 transition">Save</button>
                                    </div>
                                 </>
                             ) : (
                                 <>
                                    <Input label="Institution" value={tempEdu.institution} onChange={e => setTempEdu({...tempEdu, institution: e.target.value})} />
                                    <Input label="Degree" value={tempEdu.degree} onChange={e => setTempEdu({...tempEdu, degree: e.target.value})} />
                                    <Input label="Year" value={tempEdu.year} onChange={e => setTempEdu({...tempEdu, year: e.target.value})} />
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-full border border-white/20 hover:bg-white/5 transition">Cancel</button>
                                        <button onClick={saveEducation} className="flex-1 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-100 transition">Save</button>
                                    </div>
                                 </>
                             )}
                         </div>
                     )}
                </motion.div>
            )}

          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// 3. Preview Page (Full Screen)
const Preview: React.FC<{ data: ResumeData }> = ({ data }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [exportToken, setExportToken] = useState<string | null>(null);

  // Simple ATS Analysis (Reused logic)
  const analysis = useMemo(() => {
    let score = 50; // Base
    const tips = [];
    if (!data.summary) { score -= 10; tips.push("Add a summary."); }
    if (data.skills.length < 5) { score -= 10; tips.push("Add more skills."); }
    if (data.experience.length === 0) { score -= 20; tips.push("Add experience."); }
    return { score: Math.max(0, score), tips };
  }, [data]);

  const handleDownload = async () => {
    if (!exportToken) { setShowPayment(true); return; }
    window.print(); 
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-7xl mx-auto">
      {showPayment && <InstaPayModal onSuccess={(t) => { setExportToken(t); setShowPayment(false); setTimeout(handleDownload, 500); }} onClose={() => setShowPayment(false)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="border-t-4 border-t-teal-400">
               <h3 className="text-xl font-bold mb-4">Final Review</h3>
               <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 rounded-full border-4 border-teal-500/30 flex items-center justify-center text-xl font-bold text-teal-400">
                       {analysis.score}
                   </div>
                   <div className="text-sm text-gray-300">
                       <p className="font-semibold text-white">ATS Score</p>
                       <p>{analysis.score < 70 ? "Needs Improvement" : "Ready to Send"}</p>
                   </div>
               </div>
               <div className="space-y-2">
                   {analysis.tips.map((tip, i) => (
                       <div key={i} className="flex gap-2 text-xs text-yellow-200 bg-yellow-900/20 p-2 rounded">
                           <span>⚠️</span> {tip}
                       </div>
                   ))}
                   {analysis.tips.length === 0 && <div className="text-green-400 text-xs">No critical issues found!</div>}
               </div>
           </GlassCard>

           <GlassCard>
                <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-white block">20 EGP</span>
                    <span className="text-sm text-gray-400 line-through">100 EGP</span>
                </div>
                <button 
                    onClick={handleDownload}
                    className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 ${exportToken ? 'bg-green-500 text-white' : 'bg-white text-indigo-900'}`}
                >
                    {exportToken ? "Download PDF" : "Unlock Export"}
                </button>
                <div className="mt-4 flex justify-center gap-2 opacity-60">
                     <span className="text-[10px] text-gray-400">Secured by InstaPay</span>
                </div>
           </GlassCard>
        </div>

        {/* Resume Render */}
        <div className="lg:col-span-8 flex justify-center">
            <div className="border border-white/10 shadow-2xl overflow-hidden rounded-sm">
                <ResumePaper data={data} scale={0.9} />
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

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
            {location.pathname !== '/' && (
                <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" className="flex items-center gap-2">
                                <Logo className="w-8 h-8 text-teal-400" />
                                <span className="font-bold text-lg hidden sm:block">Hash Resume</span>
                            </Link>
                            <div className="flex gap-1 bg-white/5 p-1 rounded-full">
                                <Link to="/editor" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/editor' ? 'bg-teal-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Editor</Link>
                                <Link to="/preview" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/preview' ? 'bg-teal-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Preview</Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor data={resumeData} updateData={setResumeData} />} />
                <Route path="/preview" element={<Preview data={resumeData} />} />
                <Route path="/about" element={<div className="p-20 text-center mt-20"><h1>About</h1><Link to="/" className="text-teal-400">Home</Link></div>} />
                <Route path="/privacy" element={<div className="p-20 text-center mt-20"><h1>Privacy</h1><Link to="/" className="text-teal-400">Home</Link></div>} />
            </Routes>
        </div>
    );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}