'use client';

import React from 'react';

const IntricateBorder = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Corner Ornaments */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#FF9933]/40 rounded-tl-sm z-20" />
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#FF9933]/40 rounded-tr-sm z-20" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#FF9933]/40 rounded-bl-sm z-20" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#FF9933]/40 rounded-br-sm z-20" />

      {/* Intricate Pattern Border */}
      <div className="absolute inset-0 border border-[#FF9933]/10 pointer-events-none z-10" />

      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default IntricateBorder;
