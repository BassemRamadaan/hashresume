import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-gray-300 ml-2">{label}</label>
      <input 
        className={`
          w-full px-5 py-3 rounded-full bg-slate-800/50 border border-slate-600
          text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-gray-300 ml-2">{label}</label>
      <textarea 
        className={`
          w-full px-5 py-3 rounded-2xl bg-slate-800/50 border border-slate-600
          text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          transition-all duration-200 resize-none min-h-[100px]
          ${className}
        `}
        {...props}
      />
    </div>
  );
};