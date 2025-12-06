import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';
import { GlassCard } from './components/GlassCard';
import { Input, TextArea } from './components/Input';
import { AIModal } from './components/AIModal';
import { InstaPayModal } from './components/InstaPayModal';
import { INITIAL_RESUME_STATE, APP_SLOGANS } from './constants';
import { ResumeData, AtsAnalysis } from './types';
import { generatePdfUrl } from './services/mockApi';

// -- Page Components --

// 1. Home Page
const Home: React.FC = () => {
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % APP_SLOGANS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Logo className="w-8 h-8 text-purple-400" />
           <span className="font-bold text-xl tracking-tight">Hash Resume</span>
        </div>
        <div className="flex gap-4 text-sm font-medium text-gray-300">
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
        </div>
      </div>

      <div className="text-center max-w-3xl space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
          v1.0 Now Available in Egypt
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Build your career with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
             Intelligent Design
          </span>
        </h1>

        <div className="h-8 md:h-12 overflow-hidden">
          <p key={sloganIndex} className="text-xl md:text-2xl text-gray-400 animate-fade-in">
            {APP_SLOGANS[sloganIndex]}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            to="/editor" 
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-white/10"
          >
            Create Resume
          </Link>
          <button className="px-8 py-4 bg-slate-800 border border-slate-600 text-white rounded-full font-bold text-lg hover:bg-slate-700 transition-colors">
            Upload Existing
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
         {/* Trust signals */}
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs">ATS Compliant</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs">AES-256 Secure</span>
         </div>
      </div>
    </div>
  );
};

// 2. Editor Page
const Editor: React.FC<{ data: ResumeData, updateData: (d: ResumeData) => void }> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education'>('personal');
  const [showAI, setShowAI] = useState(false);
  const [aiType, setAiType] = useState<'summary' | 'skills' | 'experience'>('summary');
  const navigate = useNavigate();

  const handleAiTrigger = (type: 'summary' | 'skills' | 'experience') => {
    setAiType(type);
    setShowAI(true);
  };

  const handleChange = (field: keyof ResumeData, value: any) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
      <AIModal isOpen={showAI} onClose={() => setShowAI(false)} type={aiType} />
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Editor</h2>
        <div className="flex gap-3">
             <button 
               onClick={() => navigate('/preview')}
               className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
             >
               Preview & Export
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-3 space-y-2">
          {['personal', 'experience', 'education'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full text-left px-5 py-3 rounded-xl transition-all ${
                activeTab === tab 
                ? 'bg-white/10 text-white font-medium border border-white/10' 
                : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20">
            <h4 className="text-sm font-bold text-purple-200 mb-2">💡 AI Power Tip</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Use action verbs like "Spearheaded" or "Optimized" to increase your ATS score by up to 15%.
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-9">
          <GlassCard className="min-h-[500px]">
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-fade-in">
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
                </div>
                
                <div className="relative">
                   <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-300 ml-2">Professional Summary</label>
                      <button 
                        onClick={() => handleAiTrigger('summary')}
                        className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        AI Rewrite
                      </button>
                   </div>
                   <textarea 
                     className="w-full px-5 py-3 rounded-2xl bg-slate-800/50 border border-slate-600 text-white resize-none h-32 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                     value={data.summary}
                     onChange={(e) => handleChange('summary', e.target.value)}
                     placeholder="Briefly describe your career highlights..."
                   />
                </div>
              </div>
            )}
            
            {activeTab === 'experience' && (
               <div className="text-center py-20 text-gray-400">
                  <p>Experience Editor Placeholder</p>
                  <p className="text-sm mt-2">(Use 'Personal' tab for demo functionality)</p>
               </div>
            )}
            
            {activeTab === 'education' && (
               <div className="text-center py-20 text-gray-400">
                  <p>Education Editor Placeholder</p>
                  <p className="text-sm mt-2">(Use 'Personal' tab for demo functionality)</p>
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
  const [atsScore, setAtsScore] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [exportToken, setExportToken] = useState<string | null>(null);
  
  // Animate ATS Score
  useEffect(() => {
    const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
    setTimeout(() => setAtsScore(score), 500);
  }, []);

  const handleDownload = async () => {
    if (!exportToken) {
        setShowPayment(true);
        return;
    }
    
    // Simulate Download
    try {
        const url = await generatePdfUrl(exportToken);
        // In a real app we would use window.open(url) or fetch blob
        alert(`Simulating PDF download from: ${url}`);
        window.print(); // Fallback for demo
    } catch (e) {
        alert("Error generating PDF");
    }
  };

  const handlePaymentSuccess = (token: string) => {
    setExportToken(token);
    setShowPayment(false);
    // Auto trigger download after payment
    setTimeout(() => handleDownload(), 500);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 max-w-6xl mx-auto">
      {showPayment && <InstaPayModal onSuccess={handlePaymentSuccess} onClose={() => setShowPayment(false)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 ATS Score
                 <div className="relative group">
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-xs rounded hidden group-hover:block">Based on keyword density and formatting.</div>
                 </div>
              </h3>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-900">
                    {atsScore >= 80 ? 'Excellent' : 'Good'}
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-white">{atsScore}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200/20">
                  <div style={{ width: `${atsScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"></div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="text-sm font-semibold text-gray-300">Improvements Needed:</h4>
                <ul className="text-sm space-y-2 text-gray-400">
                    <li className="flex gap-2">
                        <span className="text-red-400">⚠</span> Missing keyword: "Leadership"
                    </li>
                    <li className="flex gap-2">
                        <span className="text-yellow-400">⚡</span> Summary is too short
                    </li>
                </ul>
              </div>
           </GlassCard>

           <GlassCard className="text-center space-y-4">
              <button 
                onClick={handleDownload}
                className="w-full py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                {exportToken ? (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download PDF
                    </>
                ) : (
                    <>Export PDF <span className="text-xs px-2 py-0.5 bg-slate-200 rounded text-slate-600">Locked</span></>
                )}
              </button>
              {!exportToken && <p className="text-xs text-gray-400">Unlock high-res export for 20 EGP</p>}
           </GlassCard>
        </div>

        {/* Resume Render */}
        <div className="lg:col-span-8">
            <div className="bg-white text-slate-900 p-8 md:p-12 min-h-[800px] shadow-2xl rounded-sm" id="resume-preview">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-6 mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900">{data.fullName || "Your Name"}</h1>
                    <p className="text-xl text-slate-600 mt-1">{data.title || "Professional Title"}</p>
                    <div className="flex gap-4 mt-4 text-sm text-slate-500">
                        <span>{data.email || "email@example.com"}</span>
                        <span>•</span>
                        <span>{data.phone || "Phone Number"}</span>
                        <span>•</span>
                        <span>Egypt</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Professional Summary</h3>
                    <p className="text-slate-800 leading-relaxed">
                        {data.summary || "A results-driven professional with a strong background in..."}
                    </p>
                </div>

                {/* Experience */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Experience</h3>
                    <div className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-lg">Senior Developer</h4>
                            <span className="text-sm text-slate-500">2020 - Present</span>
                        </div>
                        <p className="font-semibold text-slate-700 text-sm mb-2">Tech Solutions Co. • Cairo, Egypt</p>
                        <ul className="list-disc ml-4 space-y-1 text-slate-800 text-sm">
                            <li>Led frontend development for high-traffic e-commerce platform.</li>
                            <li>Mentored junior developers and conducted code reviews.</li>
                        </ul>
                    </div>
                </div>

                 {/* Education */}
                 <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Education</h3>
                    <div>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold">B.Sc. Computer Science</h4>
                            <span className="text-sm text-slate-500">2019</span>
                        </div>
                        <p className="text-sm text-slate-700">Cairo University</p>
                    </div>
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
        <div className="bg-slate-900 text-white min-h-screen font-sans selection:bg-purple-500 selection:text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navbar */}
            {location.pathname !== '/' && (
                <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" className="flex items-center gap-2">
                                <Logo className="w-8 h-8 text-white" />
                                <span className="font-bold">Hash Resume</span>
                            </Link>
                            <div className="flex gap-4">
                                <Link to="/editor" className={`text-sm font-medium hover:text-white ${location.pathname === '/editor' ? 'text-white' : 'text-gray-400'}`}>Editor</Link>
                                <Link to="/preview" className={`text-sm font-medium hover:text-white ${location.pathname === '/preview' ? 'text-white' : 'text-gray-400'}`}>Preview</Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor data={resumeData} updateData={setResumeData} />} />
                <Route path="/preview" element={<Preview data={resumeData} />} />
                <Route path="/about" element={<div className="p-20 text-center z-10 relative"><h1>About Hash Resume</h1><p>The first mobile-first ATS builder for MENA.</p><Link to="/" className="text-purple-400 underline mt-4 block">Go Home</Link></div>} />
                <Route path="/privacy" element={<div className="p-20 text-center z-10 relative"><h1>Privacy Policy</h1><p>We do not store your credit card info.</p><Link to="/" className="text-purple-400 underline mt-4 block">Go Home</Link></div>} />
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