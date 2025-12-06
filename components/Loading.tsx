import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 animate-pulse">Loading Hash Resume...</p>
    </div>
  );
};

export default Loading;