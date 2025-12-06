import React from 'react';
import { GlassCard } from './GlassCard';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'summary' | 'skills' | 'experience';
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const suggestions = {
    summary: [
      "Results-oriented professional with 5+ years of experience in...",
      "Creative problem solver skilled in Agile methodologies and...",
      "Dedicated graduate seeking entry-level opportunities in..."
    ],
    skills: ["Project Management", "Data Analysis", "React", "Node.js", "Communication"],
    experience: [
      "Led a cross-functional team to deliver...",
      "Optimized workflow processes resulting in 20% efficiency...",
      "Developed comprehensive strategies for..."
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard className="w-full max-w-md relative bg-slate-900/90">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <div className="flex items-center gap-2 mb-4 text-purple-400">
           <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           <h3 className="text-xl font-bold">AI Suggestions</h3>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Boost your resume with these ATS-optimized suggestions for <strong>{type}</strong>.
        </p>
        
        <div className="space-y-3">
          {suggestions[type].map((item, idx) => (
            <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition text-sm">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
           <button onClick={onClose} className="text-sm text-gray-400 hover:text-white">Close</button>
        </div>
      </GlassCard>
    </div>
  );
};