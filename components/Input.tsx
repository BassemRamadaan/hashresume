import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-5 group-focus-within:text-teal-300 transition-colors flex items-center gap-2">
        {icon && <span className="text-teal-400">{icon}</span>}
        {label}
      </label>
      <input 
        className={`
          w-full px-6 py-4 rounded-full bg-black/20 border border-white/10 backdrop-blur-md
          text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50
          transition-all duration-300 shadow-inner hover:bg-black/30
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, icon?: React.ReactNode }> = ({ label, icon, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-5 group-focus-within:text-teal-300 transition-colors flex items-center gap-2">
        {icon && <span className="text-teal-400">{icon}</span>}
        {label}
      </label>
      <textarea 
        className={`
          w-full px-6 py-4 rounded-[32px] bg-black/20 border border-white/10 backdrop-blur-md
          text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400/50
          transition-all duration-300 resize-none min-h-[120px] shadow-inner custom-scrollbar hover:bg-black/30
          ${className}
        `}
        {...props}
      />
    </div>
  );
};