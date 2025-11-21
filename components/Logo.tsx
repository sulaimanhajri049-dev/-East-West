import React from 'react';

export const Logo: React.FC<{ className?: string, size?: 'sm' | 'lg' }> = ({ className = '', size = 'lg' }) => {
  const sizeClasses = size === 'lg' ? 'w-48 h-48 text-4xl' : 'w-16 h-16 text-lg';
  
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-navy-900 border-4 border-gold-500 shadow-xl shadow-gold-500/20 ${sizeClasses} ${className}`}>
      <div className="absolute inset-0 rounded-full border border-dashed border-gold-500/30 animate-spin-slow"></div>
      <div className="flex flex-col items-center justify-center font-kufi text-gold-400 z-10">
        <span className="mb-1">شرق</span>
        <div className="h-8 w-[1px] bg-gold-500 transform rotate-12 my-1"></div>
        <span className="mt-1">غرب</span>
      </div>
    </div>
  );
};