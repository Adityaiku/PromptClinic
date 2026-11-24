import React from 'react';

/**
 * ChatbotIcon: Clean vector SVG icons / marks for AI chatbots.
 * Simple, recognizable colored SVG marks or initials, not copied official logos.
 */
export default function ChatbotIcon({ name, size = 20, className = '' }) {
  const n = (name || '').toLowerCase();

  if (n.includes('chatgpt') || n.includes('openai')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#10A37F" />
        <path d="M12 4a4 4 0 0 1 4 4v.5a3.5 3.5 0 0 1 2.5 3.5 3.5 3.5 0 0 1-2 3.16V16a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-.5A3.5 3.5 0 0 1 6 12a3.5 3.5 0 0 1 2-3.16V8a4 4 0 0 1 4-4Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('claude') || n.includes('anthropic')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#D97706" />
        <path d="M12 6L14 11L19 12L14 13L12 18L10 13L5 12L10 11L12 6Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('gemini') || n.includes('google')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#2563EB" />
        <path d="M12 4C12 8.418 8.418 12 4 12C8.418 12 12 15.582 12 20C12 15.582 15.582 12 20 12C15.582 12 12 8.418 12 4Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('copilot') || n.includes('microsoft')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#0284C7" />
        <path d="M7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="9.5" cy="13.5" r="1" fill="#FFFFFF" />
        <circle cx="14.5" cy="13.5" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('perplexity')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#0D9488" />
        <path d="M7 7L17 17M17 7L7 17M12 5V19" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('llama') || n.includes('meta')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#6366F1" />
        <path d="M7 16C7 13.5 9 10 12 10C15 10 17 13.5 17 16M9 9V7M15 9V7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('mistral')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#EA580C" />
        <path d="M6 8H10V12H6V8ZM14 8H18V12H14V8ZM10 12H14V16H10V12Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('deepseek')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#1D4ED8" />
        <path d="M6 15C8 11 11 9 14 10C17 11 18 8 18 8C18 8 18 13 14 15C10 17 7 15 6 15Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('grok') || n.includes('xai')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#0F172A" />
        <path d="M7 7L17 17M17 7L12 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('poe')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#8B5CF6" />
        <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Default AI Sparkle tile
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="6" fill="#3B82F6" />
      <path d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z" fill="#FFFFFF" />
    </svg>
  );
}
