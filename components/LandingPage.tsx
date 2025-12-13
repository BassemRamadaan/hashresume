import React from 'react';
import { Icons } from './Icons';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-teal-700">
          <div className="bg-teal-600 text-white p-1.5 rounded-lg shadow-sm">
            <span className="font-bold text-xl leading-none">#</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Hash Resume</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm text-sm font-medium text-slate-600 mb-4">
            <Icons.AI size={16} className="text-purple-600" />
            <span>AI-Powered ATS Optimization</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Build your professional CV in <span className="text-teal-600">minutes</span>.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create a modern, ATS-friendly resume that stands out. Free to build, AI-enhanced, and ready for your next career move.
          </p>

          <div className="pt-4">
            <button 
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-slate-800 hover:scale-105 transition-all duration-300"
            >
              Start Free
              <Icons.ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple logos or text for trust indicators if needed, simplified for now */}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Hash Resume. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;