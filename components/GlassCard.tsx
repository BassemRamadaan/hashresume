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
        bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-[32px] p-6 md:p-8
        ${hoverEffect ? 'transition-transform duration-300 hover:scale-[1.01] hover:bg-white/15' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};