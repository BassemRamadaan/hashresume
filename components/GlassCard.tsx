import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", hoverEffect = false }) => {
  return (
    <div 
      className={`
        bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6
        ${hoverEffect ? 'transition-transform duration-300 hover:scale-[1.02] hover:bg-white/15' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};