import React from 'react';

/**
 * Prompt Clinic Custom Logo
 * Spec: A rounded medical-cross in blue inside a white rounded tile,
 * plus the wordmark "Prompt Clinic". Do NOT reuse the 4-dot ChronoTask logo.
 */
export default function Logo({ size = 'md', showWordmark = true, className = '' }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const tileClasses = isSmall
    ? 'w-7 h-7 rounded-lg shadow-sm border border-slate-100'
    : isLarge
    ? 'w-16 h-16 rounded-2xl shadow-lg border border-slate-100'
    : 'w-9 h-9 rounded-xl shadow-md border border-slate-100';

  const crossSize = isSmall ? 14 : isLarge ? 32 : 18;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Medical Cross Icon Tile */}
      <div className={`${tileClasses} bg-white flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          width={crossSize}
          height={crossSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rounded Medical Cross */}
          <path
            d="M9 4C9 2.89543 9.89543 2 11 2H13C14.1046 2 15 2.89543 15 4V9H20C21.1046 9 22 9.89543 22 11V13C22 14.1046 21.1046 15 20 15H15V20C15 21.1046 14.1046 22 13 22H11C9.89543 22 9 21.1046 9 20V15H4C2.89543 15 2 14.1046 2 13V11C2 9.89543 2.89543 9 4 9H9V4Z"
            fill="#2563EB"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span className={`font-bold tracking-[-0.03em] text-[#0F172A] ${isSmall ? 'text-base' : isLarge ? 'text-2xl' : 'text-lg'}`}>
          Prompt Clinic
        </span>
      )}
    </div>
  );
}
