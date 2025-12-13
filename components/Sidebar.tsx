import React from 'react';
import { SectionType } from '../types';
import { Icons } from './Icons';

interface SidebarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isVerified: boolean;
  onDownload: () => void;
}

const menuItems: { id: SectionType; label: string; icon: any }[] = [
  { id: 'personal', label: 'Personal Info', icon: Icons.User },
  { id: 'summary', label: 'Summary', icon: Icons.Summary },
  { id: 'experience', label: 'Experience', icon: Icons.Briefcase },
  { id: 'education', label: 'Education', icon: Icons.Education },
  { id: 'skills', label: 'Skills', icon: Icons.Skills },
  { id: 'projects', label: 'Projects', icon: Icons.Projects },
  { id: 'jobMatch', label: 'Job Match Analysis', icon: Icons.Target },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  isOpen, 
  setIsOpen,
  isVerified,
  onDownload
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-white border-r border-slate-200 shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700">
            <div className="bg-teal-600 text-white p-1 rounded">
              <span className="font-bold text-xl leading-none">#</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Hash Resume</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors">
            <Icons.Close />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                text-sm font-medium
                ${activeSection === item.id 
                  ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100 translate-x-1' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'}
              `}
            >
              <item.icon size={18} className={`transition-colors duration-200 ${activeSection === item.id ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {item.label}
              {activeSection === item.id && <Icons.ChevronRight size={16} className="ml-auto opacity-50 animate-in fade-in slide-in-from-left-1" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onDownload}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-300 transform active:scale-[0.98]
              ${isVerified 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200' 
                : 'bg-gradient-to-r from-[#583395] to-[#7f52ce] text-white hover:opacity-90 shadow-lg shadow-purple-200'}
            `}
          >
            {isVerified ? <Icons.Download size={18} /> : <Icons.Check size={18} />}
            {isVerified ? 'Download PDF' : 'Verify & Download'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;