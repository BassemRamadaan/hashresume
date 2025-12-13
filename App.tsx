import React, { useState, useEffect } from 'react';
import { ResumeData, SectionType } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import InstaPayModal from './components/InstaPayModal';
import LandingPage from './components/LandingPage';
import { Icons } from './components/Icons';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    location: '',
    jobTitle: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: []
};

const STORAGE_KEY = 'hash_resume_data';

function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeSection, setActiveSection] = useState<SectionType>('personal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mobile: Toggle between Edit and Preview
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResumeData({ ...initialData, ...parsedData });
      } catch (error) {
        console.error('Failed to load resume data:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save data to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      }, 500); // Debounce save by 500ms
      return () => clearTimeout(timeoutId);
    }
  }, [resumeData, isLoaded]);

  const handleDownload = () => {
    if (!isVerified) {
      setIsPaymentModalOpen(true);
    } else {
      window.print();
    }
  };

  const handleVerifyPayment = () => {
    setIsVerified(true);
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar - Left Drawer on Mobile / Fixed on Desktop */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isVerified={isVerified}
        onDownload={handleDownload}
        onHome={() => setView('landing')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
        
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
            <Icons.Menu size={24} />
          </button>
          <span className="font-bold text-lg">Hash Resume</span>
          <div className="flex bg-slate-100 rounded-lg p-1">
             <button 
                onClick={() => setMobileViewMode('edit')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mobileViewMode === 'edit' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
             >
                Edit
             </button>
             <button 
                onClick={() => setMobileViewMode('preview')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mobileViewMode === 'preview' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
             >
                View
             </button>
          </div>
        </div>

        {/* Workspace Grid - 3 Column Layout logic (Sidebar | Editor | Preview) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Editor Column - Center */}
          <div className={`
            flex-1 overflow-y-auto bg-slate-100/50 
            ${mobileViewMode === 'preview' ? 'hidden lg:block' : 'block'}
            lg:border-r lg:border-slate-200
          `}>
            <Editor 
              section={activeSection} 
              data={resumeData} 
              onChange={setResumeData} 
            />
          </div>

          {/* Preview Column - Right (Hidden on mobile unless toggled) */}
          <div className={`
             lg:w-[45%] xl:w-[42%] bg-slate-200/50 overflow-y-auto overflow-x-hidden flex justify-center p-4 lg:p-8
             ${mobileViewMode === 'edit' ? 'hidden lg:flex' : 'flex w-full'}
          `}>
             <Preview data={resumeData} isMobile={mobileViewMode === 'preview' && window.innerWidth < 1024} />
          </div>

        </div>
      </main>

      {/* Payment Modal */}
      <InstaPayModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onVerify={handleVerifyPayment}
      />

      {/* Print Styles for PDF Generation */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            transform: none !important;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}

export default App;