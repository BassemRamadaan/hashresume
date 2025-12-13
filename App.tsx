import React, { useState } from 'react';
import { ResumeData, SectionType } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import InstaPayModal from './components/InstaPayModal';
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

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeSection, setActiveSection] = useState<SectionType>('personal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Mobile: Toggle between Edit and Preview
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit');

  const handleDownload = () => {
    if (!isVerified) {
      setIsPaymentModalOpen(true);
    } else {
      // Trigger print dialog as a robust PDF generation method
      window.print();
    }
  };

  const handleVerifyPayment = () => {
    setIsVerified(true);
  };

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

        {/* Workspace Grid */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Editor Column - Center */}
          <div className={`
            flex-1 overflow-y-auto bg-slate-50 
            ${mobileViewMode === 'preview' ? 'hidden lg:block' : 'block'}
          `}>
            <Editor 
              section={activeSection} 
              data={resumeData} 
              onChange={setResumeData} 
            />
          </div>

          {/* Preview Column - Right */}
          <div className={`
             lg:w-[45%] xl:w-[40%] bg-slate-200/50 border-l border-slate-200 overflow-y-auto overflow-x-hidden flex justify-center p-4 lg:p-8
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
