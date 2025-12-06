import React, { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { getAISuggestions } from '../services/genai';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'summary' | 'skills' | 'experience';
  contextText: string;
  onSelect: (text: string) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, type, contextText, onSelect }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(false);
      setSuggestions([]);
      
      getAISuggestions(type, contextText)
        .then((results) => {
          setSuggestions(results);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [isOpen, type, contextText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard className="w-full max-w-md relative bg-slate-900/90 border border-purple-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        <div className="flex items-center gap-2 mb-4 text-purple-400">
           <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {loading ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              )}
           </svg>
           <h3 className="text-xl font-bold">AI Assistant</h3>
        </div>
        
        <p className="text-sm text-gray-300 mb-4">
          {loading 
            ? `Generating optimized ${type} suggestions...` 
            : `Select a suggestion to update your ${type}.`}
        </p>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-12 bg-white/5 rounded-lg"></div>
              <div className="h-12 bg-white/5 rounded-lg"></div>
              <div className="h-12 bg-white/5 rounded-lg"></div>
            </div>
          )}

          {!loading && !error && suggestions.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 cursor-pointer transition text-sm group"
            >
              <div className="flex gap-2">
                 <span className="text-purple-400 opacity-50 group-hover:opacity-100">✨</span>
                 <span className="text-gray-200">{item}</span>
              </div>
            </div>
          ))}
          
          {!loading && error && (
            <div className="text-red-400 text-sm text-center">Failed to load suggestions.</div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
           <button onClick={onClose} className="text-sm text-gray-400 hover:text-white">Cancel</button>
        </div>
      </GlassCard>
    </div>
  );
};
