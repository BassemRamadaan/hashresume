import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from './components/Logo';
import { GlassCard } from './components/GlassCard';
import { Input, TextArea } from './components/Input';
import { AIModal } from './components/AIModal';
import { InstaPayModal } from './components/InstaPayModal';
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

// -- Page Components --

// 1. Home Page
const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-900 text-white selection:bg-teal-300 selection:text-teal-900 animate-gradient-x">
      
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
           <Logo className="w-8 h-8 text-teal-300" />
           <span className="font-bold text-xl tracking-tight">Hash Resume</span>
        </div>
        <div className="flex gap-4 text-sm font-medium text-white/80">
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
        </div>
      </div>

      <GlassCard className="relative z-10 max-w-lg w-full text-center p-8 md:p-12 border-white/20 shadow-2xl">
        
        {/* Logo & Title */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 mb-6"
        >
            <Logo className="w-20 h-20 text-teal-300 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-teal-200">
              Hash Resume
            </h1>
        </motion.div>

        {/* Slogan */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
        >
            <p className="text-lg font-light text-gray-100 tracking-wide">
                Mobile‑First • AI‑Powered • Localized for MENA
            </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        >
            <Link 
                to="/editor" 
                className="group relative inline-flex items-center justify-center w-full py-4 bg-white text-teal-800 rounded-full font-bold text-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] transition-all transform hover:scale-[1.02]"
            >
                <span className="relative z-10">ابدأ بناء سيرتك الآن</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
        </motion.div>

        {/* Journey Steps */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-3 gap-2 mt-10 border-t border-white/10 pt-8"
        >
            {[
                { icon: "✍️", label: "أدخل بياناتك" },
                { icon: "🤖", label: "اقتراحات AI" },
                { icon: "📄", label: "تصدير PDF" }
            ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-2xl drop-shadow-md">{step.icon}</span>
                    <span className="text-xs font-semibold text-gray-200">{step.label}</span>
                </div>
            ))}
        </motion.div>

        {/* Trust Signals */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 flex flex-col items-center gap-3"
        >
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5 shadow-inner">
                {/* Stylized InstaPay text acting as logo */}
                <div className="font-bold italic flex items-center select-none">
                    <span className="text-purple-400">Insta</span><span className="text-white">Pay</span>
                </div>
                <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
                <span className="text-xs text-yellow-300 font-bold tracking-wide">
                    20 EGP <span className="line-through opacity-60 text-white font-normal ml-1">100 EGP</span>
                </span>
            </div>
            <p className="text-[10px] text-teal-200/80">Limited time offer for Egypt & MENA</p>
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
  const [editingId, setEditingId] = useState<string | null>(null); // For Experience/Education modals or inline edit
  const navigate = useNavigate();

  // Temporary state for adding new items
  const [tempExp, setTempExp] = useState<Experience>({ id: '', company: '', role: '', duration: '', description: '' });
  const [tempEdu, setTempEdu] = useState<Education>({ id: '', institution: '', degree: '', year: '' });
  const [showForm, setShowForm] = useState(false);

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
      // Parse CSV or just append
       const newSkills = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
       updateData({ ...data, skills: Array.from(new Set([...data.skills, ...newSkills])) });
    } else if (aiType === 'experience' && editingId) {
       // Update description in tempExp
       setTempExp(prev => ({ ...prev, description: text }));
    }
  };

  const handleChange = (field: keyof ResumeData, value: any) => {
    updateData({ ...data, [field]: value });
  };

  // Experience Handlers
  const saveExperience = () => {
    if (tempExp.id) {
        updateData({...data, experience: data.experience.map(e => e.id === tempExp.id ? tempExp : e)});
    } else {
        updateData({...data, experience: [...data.experience, { ...tempExp, id: Date.now().toString() }]});
    }
    setShowForm(false);
    setTempExp({ id: '', company: '', role: '', duration: '', description: '' });
  };

  const editExperience = (exp: Experience) => {
      setTempExp(exp);
      setEditingId(exp.id);
      setShowForm(true);
  };

  const deleteExperience = (id: string) => {
      updateData({...data, experience: data.experience.filter(e => e.id !== id)});
  };

  // Education Handlers
  const saveEducation = () => {
      if (tempEdu.id) {
          updateData({...data, education: data.education.map(e => e.id === tempEdu.id ? tempEdu : e)});
      } else {
          updateData({...data, education: [...data.education, { ...tempEdu, id: Date.now().toString() }]});
      }
      setShowForm(false);
      setTempEdu({ id: '', institution: '', degree: '', year: '' });
  };

  const editEducation = (edu: Education) => {
      setTempEdu(edu);
      setEditingId(edu.id);
      setShowForm(true);
  };

  const deleteEducation = (id: string) => {
      updateData({...data, education: data.education.filter(e => e.id !== id)});
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <AIModal 
        isOpen={showAI} 
        onClose={() => setShowAI(false)} 
        type={aiType} 
        contextText={aiContext}
        onSelect={handleAiSelect}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Editor</h2>
           <p className="text-gray-400 text-sm">Craft your professional story</p>
        </div>
        <div className="flex gap-3">
             <button 
               onClick={() => navigate('/preview')}
               className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition shadow-lg shadow-purple-500/20 flex items-center gap-2"
             >
               <span>Preview & Export</span>
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-3 space-y-4">
          <div className={`rounded-2xl p-5 border ${rank.border} ${rank.bg} relative overflow-hidden transition-all duration-500 group`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl pointer-events-none select-none grayscale group-hover:scale-110 transition-transform">
                {rank.icon}
             </div>
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                   <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Current Rank</span>
                      <h3 className={`text-lg font-black flex items-center gap-1.5 ${rank.color}`}>
                         {rank.icon} {rank.label}
                      </h3>
                   </div>
                   <div className="text-right">
                      <span className="text-2xl font-bold text-white">{completionScore}</span>
                      <span className="text-[10px] text-gray-300 block">/ 100</span>
                   </div>
                </div>
                
                {/* Gamified Progress Bar */}
                <div className="h-2.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative">
                   <div 
                      style={{ width: `${completionScore}%` }} 
                      className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${rank.bar}`}
                   >
                       {/* Subtle shimmer animation */}
                       <div className="absolute inset-0 bg-white/20 w-full -skew-x-12 animate-[shimmer_2s_infinite] opacity-30"></div>
                   </div>
                </div>
                
                <p className="mt-3 text-[10px] font-medium text-gray-300">
                   {completionScore < 100 
                       ? "Add more details to level up!" 
                       : "Legendary status achieved!"}
                </p>
             </div>
          </div>

          <div className="space-y-1">
            {[
                { id: 'personal', label: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'experience', label: 'Experience', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { id: 'education', label: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' }
            ].map((tab) => (
                <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeTab === tab.id 
                    ? 'bg-purple-600/20 text-purple-300 font-medium border border-purple-500/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
                </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20">
            <h4 className="text-sm font-bold text-purple-200 mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span> Pro Tip
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Adding <strong>quantifiable metrics</strong> to your experience (e.g., "Increased revenue by 20%") boosts your ATS score significantly.
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-9">
          <GlassCard className="min-h-[500px] relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {activeTab === 'personal' && (
              <div className="space-y-6 animate-fade-in relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    value={data.fullName} 
                    onChange={(e) => handleChange('fullName', e.target.value)} 
                    placeholder="e.g. Karim Ahmed"
                  />
                  <Input 
                    label="Job Title" 
                    value={data.title} 
                    onChange={(e) => handleChange('title', e.target.value)} 
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                  <Input 
                    label="Email" 
                    value={data.email} 
                    onChange={(e) => handleChange('email', e.target.value)} 
                    placeholder="karim@example.com"
                  />
                  <Input 
                    label="Phone" 
                    value={data.phone} 
                    onChange={(e) => handleChange('phone', e.target.value)} 
                    placeholder="+20 100 000 0000"
                  />
                   <Input 
                    label="LinkedIn URL" 
                    value={data.linkedin} 
                    onChange={(e) => handleChange('linkedin', e.target.value)} 
                    placeholder="linkedin.com/in/karim"
                    className="md:col-span-2"
                  />
                </div>
                
                <div className="relative">
                   <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300 ml-2">Professional Summary</label>
                      <button 
                        onClick={() => handleAiTrigger('summary', data.summary)}
                        className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 hover:bg-purple-500/20 transition flex items-center gap-1.5"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        AI Rewrite
                      </button>
                   </div>
                   <textarea 
                     className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-600 text-white resize-none h-32 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all placeholder-slate-500"
                     value={data.summary}
                     onChange={(e) => handleChange('summary', e.target.value)}
                     placeholder="Briefly describe your career highlights..."
                   />
                </div>

                <div className="relative">
                   <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300 ml-2">Skills (Comma separated)</label>
                      <button 
                        onClick={() => handleAiTrigger('skills', data.title + " " + data.summary)}
                        className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 hover:bg-purple-500/20 transition flex items-center gap-1.5"
                      >
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        AI Suggest
                      </button>
                   </div>
                   <Input 
                    label="" 
                    value={data.skills.join(', ')} 
                    onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))} 
                    placeholder="React, Node.js, Project Management..."
                  />
                  <div className="flex flex-wrap gap-2 mt-3 pl-2">
                      {data.skills.map((skill, i) => skill && (
                          <span key={i} className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300 border border-slate-600">
                              {skill}
                          </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'experience' && (
                <div className="animate-fade-in relative z-10">
                    {!showForm ? (
                        <div className="space-y-4">
                            {data.experience.length === 0 && (
                                <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl">
                                    <p>No experience added yet.</p>
                                </div>
                            )}
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition group relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{exp.role}</h4>
                                            <p className="text-purple-300">{exp.company}</p>
                                            <p className="text-xs text-gray-400 mt-1">{exp.duration}</p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => editExperience(exp)} className="p-2 hover:bg-white/10 rounded-full text-blue-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => deleteExperience(exp.id)} className="p-2 hover:bg-white/10 rounded-full text-red-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-300 line-clamp-2">{exp.description}</p>
                                </div>
                            ))}
                            <button 
                                onClick={() => { setTempExp({ id: '', company: '', role: '', duration: '', description: '' }); setEditingId(null); setShowForm(true); }}
                                className="w-full py-3 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition flex justify-center items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Position
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                             <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h3 className="text-xl font-bold">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Role" value={tempExp.role} onChange={e => setTempExp({...tempExp, role: e.target.value})} placeholder="e.g. Product Manager" />
                                <Input label="Company" value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} placeholder="e.g. Microsoft" />
                                <Input label="Duration" value={tempExp.duration} onChange={e => setTempExp({...tempExp, duration: e.target.value})} placeholder="e.g. Jan 2020 - Present" className="md:col-span-2" />
                             </div>
                             <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-300 ml-2">Description</label>
                                    <button 
                                        onClick={() => { setEditingId(tempExp.id || 'temp'); handleAiTrigger('experience', tempExp.description); }}
                                        className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 hover:bg-purple-500/20 transition flex items-center gap-1.5"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                                        Enhance
                                    </button>
                                </div>
                                <TextArea 
                                    label="" 
                                    value={tempExp.description} 
                                    onChange={e => setTempExp({...tempExp, description: e.target.value})}
                                    placeholder="• Led a team of..."
                                    className="h-40"
                                />
                             </div>
                             <button onClick={saveExperience} className="w-full py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-[1.01] transition">Save Position</button>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'education' && (
               <div className="animate-fade-in relative z-10">
                    {!showForm ? (
                        <div className="space-y-4">
                            {data.education.length === 0 && (
                                <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl">
                                    <p>No education added yet.</p>
                                </div>
                            )}
                            {data.education.map((edu) => (
                                <div key={edu.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition group flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-lg text-white">{edu.degree}</h4>
                                        <p className="text-purple-300">{edu.institution}</p>
                                        <p className="text-xs text-gray-400 mt-1">{edu.year}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => editEducation(edu)} className="p-2 hover:bg-white/10 rounded-full text-blue-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => deleteEducation(edu.id)} className="p-2 hover:bg-white/10 rounded-full text-red-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => { setTempEdu({ id: '', institution: '', degree: '', year: '' }); setEditingId(null); setShowForm(true); }}
                                className="w-full py-3 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition flex justify-center items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Education
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                             <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h3 className="text-xl font-bold">{editingId ? 'Edit Education' : 'Add Education'}</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Institution" value={tempEdu.institution} onChange={e => setTempEdu({...tempEdu, institution: e.target.value})} placeholder="e.g. Cairo University" />
                                <Input label="Degree" value={tempEdu.degree} onChange={e => setTempEdu({...tempEdu, degree: e.target.value})} placeholder="e.g. B.Sc. Computer Science" />
                                <Input label="Graduation Year" value={tempEdu.year} onChange={e => setTempEdu({...tempEdu, year: e.target.value})} placeholder="e.g. 2023" className="md:col-span-2" />
                             </div>
                             <button onClick={saveEducation} className="w-full py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-[1.01] transition">Save Education</button>
                        </div>
                    )}
               </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// 3. Preview Page
const Preview: React.FC<{ data: ResumeData }> = ({ data }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [exportToken, setExportToken] = useState<string | null>(null);

  // ATS Analysis Logic
  const analysis: AtsAnalysis = useMemo(() => {
    const breakdown: RubricItem[] = [];
    const missingKeywords: string[] = [];

    // --- 1. Content & Impact (40%) ---
    let impactScore = 100;
    const impactTips: string[] = [];
    
    // Check Summary
    if (!data.summary || data.summary.trim().length === 0) {
      impactScore -= 30;
      impactTips.push("Summary is missing. Add a 2-3 sentence overview.");
    } else {
      const summaryWords = data.summary.split(/\s+/).length;
      if (summaryWords < 20) {
        impactScore -= 10;
        impactTips.push("Summary is too short. Aim for 30-50 words.");
      } else if (summaryWords > 100) {
        impactScore -= 5;
        impactTips.push("Summary is too long. Keep it concise.");
      }
    }

    // Check Experience
    if (data.experience.length === 0) {
      impactScore -= 30;
      impactTips.push("No experience listed. Add at least one role or internship.");
    } else {
       let hasMetrics = false;
       let hasActionVerbs = false;
       const actionVerbs = ["led", "developed", "created", "managed", "increased", "reduced", "launched", "optimized"];
       
       data.experience.forEach(exp => {
           if (/\d+|%|\$/.test(exp.description)) hasMetrics = true;
           if (actionVerbs.some(v => exp.description.toLowerCase().includes(v))) hasActionVerbs = true;
       });

       if (!hasMetrics) {
           impactScore -= 10;
           impactTips.push("Quantify your achievements (e.g. 'Boosted sales by 20%').");
       }
       if (!hasActionVerbs) {
           impactScore -= 10;
           impactTips.push("Start bullet points with strong action verbs (e.g. 'Spearheaded', 'Engineered').");
       }
    }

    breakdown.push({
        category: "Content & Impact",
        score: Math.max(0, impactScore),
        status: impactScore > 80 ? 'good' : impactScore > 60 ? 'warning' : 'critical',
        tips: impactTips
    });

    // --- 2. Keywords & ATS Optimization (40%) ---
    let keywordScore = 100;
    const keywordTips: string[] = [];
    const fullText = JSON.stringify(data).toLowerCase();
    
    const found = MOCK_ATS_KEYWORDS.filter(k => fullText.includes(k.toLowerCase()));
    const missing = MOCK_ATS_KEYWORDS.filter(k => !found.includes(k));
    
    if (missing.length > 0) {
        const penalty = Math.min(missing.length * 10, 40);
        keywordScore -= penalty;
        keywordTips.push(`Missing high-value industry terms: ${missing.slice(0, 2).join(', ')}.`);
    }

    if (data.skills.length < 5) {
        keywordScore -= 20;
        keywordTips.push("Skills section is sparse. Aim for 6-10 relevant hard skills.");
    }

    breakdown.push({
        category: "Keywords & ATS",
        score: Math.max(0, keywordScore),
        status: keywordScore > 80 ? 'good' : keywordScore > 60 ? 'warning' : 'critical',
        tips: keywordTips
    });

    // --- 3. Completeness & Style (20%) ---
    let formatScore = 100;
    const formatTips: string[] = [];

    if (!data.email) { formatScore -= 25; formatTips.push("Missing contact email."); }
    if (!data.phone) { formatScore -= 25; formatTips.push("Missing phone number."); }
    if (!data.linkedin) { formatScore -= 10; formatTips.push("LinkedIn profile URL is highly recommended."); }
    if (!data.title) { formatScore -= 15; formatTips.push("Professional job title is missing."); }
    
    breakdown.push({
        category: "Completeness",
        score: Math.max(0, formatScore),
        status: formatScore > 85 ? 'good' : formatScore > 60 ? 'warning' : 'critical',
        tips: formatTips
    });

    // Calculate Weighted Average
    const overallScore = Math.round(
        (breakdown[0].score * 0.4) + 
        (breakdown[1].score * 0.4) + 
        (breakdown[2].score * 0.2)
    );

    return {
        overallScore,
        breakdown,
        missingKeywords: missing
    };
  }, [data]);

  const handleDownload = async () => {
    if (!exportToken) {
        setShowPayment(true);
        return;
    }
    
    try {
        const url = await generatePdfUrl(exportToken);
        alert(`Simulating PDF download from: ${url}`);
        window.print(); 
    } catch (e) {
        alert("Error generating PDF");
    }
  };

  const handlePaymentSuccess = (token: string) => {
    setExportToken(token);
    setShowPayment(false);
    setTimeout(() => handleDownload(), 500);
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-400';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-amber-400';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'good': return 'text-green-400';
          case 'warning': return 'text-yellow-400';
          case 'critical': return 'text-red-400';
          default: return 'text-gray-400';
      }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-6xl mx-auto">
      {showPayment && <InstaPayModal onSuccess={handlePaymentSuccess} onClose={() => setShowPayment(false)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel: ATS Score Card */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="border-t-4 border-t-purple-500">
              <div className="flex items-start justify-between mb-6">
                 <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        ATS Audit
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Based on MENA recruitment standards</p>
                 </div>
                 
                 {/* Overall Score Circle */}
                 <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                        <circle 
                            cx="32" cy="32" r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="none" 
                            strokeDasharray={175} 
                            strokeDashoffset={175 - (175 * analysis.overallScore / 100)} 
                            className={`transition-all duration-1000 ${getStatusColor(analysis.overallScore >= 80 ? 'good' : analysis.overallScore >= 60 ? 'warning' : 'critical')}`}
                        />
                    </svg>
                    <span className="absolute text-lg font-bold">{analysis.overallScore}</span>
                 </div>
              </div>

              <div className="space-y-6">
                 {analysis.breakdown.map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm text-gray-200">{item.category}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.score >= 80 ? 'bg-green-500/20 text-green-300' : (item.score >= 60 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300')}`}>
                                {item.score}/100
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                            <div 
                                style={{width: `${item.score}%`}} 
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(item.score)}`} 
                            />
                        </div>
                        
                        {/* Actionable Tips */}
                        {item.tips.length > 0 ? (
                            <ul className="space-y-2 mt-3 pt-3 border-t border-white/5">
                                {item.tips.map((tip, i) => (
                                    <li key={i} className="flex gap-2 items-start text-xs text-gray-400 leading-snug">
                                        <svg className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-2 mt-3 text-xs text-green-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Optimized
                            </div>
                        )}
                    </div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="text-center space-y-4">
              <button 
                onClick={handleDownload}
                className="w-full py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-white/10"
              >
                {exportToken ? (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download PDF
                    </>
                ) : (
                    <>Export PDF <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-200 rounded text-slate-600 tracking-wider">Locked</span></>
                )}
              </button>
              {!exportToken && (
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Unlock high-res export & remove watermark</p>
                    <span className="text-sm font-bold text-green-400">20 EGP <span className="text-gray-500 font-normal line-through text-xs ml-1">100 EGP</span></span>
                </div>
              )}
           </GlassCard>
        </div>

        {/* Resume Render */}
        <div className="lg:col-span-8">
            <div className="bg-white text-slate-900 p-8 md:p-12 min-h-[1000px] shadow-2xl rounded-sm font-serif" id="resume-preview">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-6 mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900">{data.fullName || "Your Name"}</h1>
                    <p className="text-xl text-slate-600 mt-1">{data.title || "Professional Title"}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 font-sans">
                        {data.email && <span>{data.email}</span>}
                        {data.email && data.phone && <span>•</span>}
                        {data.phone && <span>{data.phone}</span>}
                        {(data.email || data.phone) && <span>•</span>}
                        <span>Egypt</span>
                        {data.linkedin && (
                            <>
                             <span>•</span>
                             <span>{data.linkedin}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Summary */}
                {data.summary && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans">Professional Summary</h3>
                        <p className="text-slate-800 leading-relaxed">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans">Core Competencies</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-slate-800 font-medium bg-slate-100 px-2 py-1 rounded text-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans">Experience</h3>
                    {(data.experience && data.experience.length > 0) ? (
                        data.experience.map((exp, i) => (
                             <div key={i} className="mb-6 last:mb-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg">{exp.role}</h4>
                                    <span className="text-sm text-slate-500 font-sans">{exp.duration}</span>
                                </div>
                                <p className="font-semibold text-slate-700 text-sm mb-2">{exp.company}</p>
                                <p className="text-slate-800 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-slate-400 italic text-sm">No experience listed.</div>
                    )}
                </div>

                 {/* Education */}
                 <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans">Education</h3>
                    {(data.education && data.education.length > 0) ? (
                        data.education.map((edu, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                                    <span className="text-sm text-slate-500 font-sans">{edu.year}</span>
                                </div>
                                <p className="text-sm text-slate-700">{edu.institution}</p>
                            </div>
                        ))
                    ) : (
                         <div className="text-slate-400 italic text-sm">No education listed.</div>
                    )}
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

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            {/* Navbar */}
            {location.pathname !== '/' && (
                <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" className="flex items-center gap-2 group">
                                <Logo className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors" />
                                <span className="font-bold text-lg">Hash Resume</span>
                            </Link>
                            <div className="flex gap-6">
                                <Link to="/editor" className={`relative text-sm font-medium hover:text-white transition ${location.pathname === '/editor' ? 'text-white' : 'text-gray-400'}`}>
                                    Editor
                                    {location.pathname === '/editor' && <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-purple-500 rounded-full"></span>}
                                </Link>
                                <Link to="/preview" className={`relative text-sm font-medium hover:text-white transition ${location.pathname === '/preview' ? 'text-white' : 'text-gray-400'}`}>
                                    Preview
                                    {location.pathname === '/preview' && <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-purple-500 rounded-full"></span>}
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor data={resumeData} updateData={setResumeData} />} />
                <Route path="/preview" element={<Preview data={resumeData} />} />
                <Route path="/about" element={<div className="p-20 text-center z-10 relative mt-20"><h1>About Hash Resume</h1><p>The first mobile-first ATS builder for MENA.</p><Link to="/" className="text-purple-400 underline mt-4 block">Go Home</Link></div>} />
                <Route path="/privacy" element={<div className="p-20 text-center z-10 relative mt-20"><h1>Privacy Policy</h1><p>We do not store your credit card info.</p><Link to="/" className="text-purple-400 underline mt-4 block">Go Home</Link></div>} />
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