import React from 'react';

/**
 * SectionBadge: Small white pill with thin border, centered above each major section heading.
 */
export default function SectionBadge({ children }) {
  return (
    <div className="flex justify-center mb-4">
      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-[12px] font-semibold text-slate-700 shadow-sm tracking-wide">
        {children}
      </span>
    </div>
  );
}
