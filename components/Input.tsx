import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4 group-focus-within:text-teal-300 transition-colors">{label}</label>
      <input 
        className={`
          w-full px-6 py-3.5 rounded-full bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm
          text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400
          transition-all duration-300 shadow-inner
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-4 group-focus-within:text-teal-300 transition-colors">{label}</label>
      <textarea 
        className={`
          w-full px-6 py-4 rounded-3xl bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm
          text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400
          transition-all duration-300 resize-none min-h-[120px] shadow-inner custom-scrollbar
          ${className}
        `}
        {...props}
      />
    </div>
  );
};