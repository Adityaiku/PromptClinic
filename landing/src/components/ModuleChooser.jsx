import React, { useState, useEffect } from 'react';
import SectionBadge from './common/SectionBadge';
import {
  Stethoscope,
  SearchCheck,
  Brain,
  Palette,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const MODULES = [
  {
    num: '01',
    name: 'Diagnose',
    slug: 'diagnose',
    badge: 'Prompt decomposition',
    desc: "Paste a weak prompt. We find what's missing, rewrite it, and show both answers side by side.",
    icon: Stethoscope,
    tilt: '-3deg',
    floatClass: 'animate-float',
    delay: 0,
  },
  {
    num: '02',
    name: 'Verify',
    slug: 'verify',
    badge: 'Chain-of-verification',
    desc: 'Splits an answer into claims and flags the shaky ones with a confidence rating.',
    icon: SearchCheck,
    tilt: '2.5deg',
    floatClass: 'animate-float-slow',
    delay: 100,
  },
  {
    num: '03',
    name: 'Remember',
    slug: 'remember',
    badge: 'Structured summarization',
    desc: 'Turns a long chat into a context card you can paste into a fresh chat.',
    icon: Brain,
    tilt: '-3.5deg',
    floatClass: 'animate-float-reverse',
    delay: 200,
  },
  {
    num: '04',
    name: 'Voice',
    slug: 'voice',
    badge: 'Few-shot style transfer',
    desc: 'Learns your writing style from 3 samples and rewrites any draft in your voice.',
    icon: Palette,
    tilt: '3deg',
    floatClass: 'animate-float',
    delay: 300,
  },
  {
    num: '05',
    name: 'Defend',
    slug: 'defend',
    badge: 'Instruction hierarchy',
    desc: 'Watch a hidden instruction hijack a naive prompt, then see the defended version resist.',
    icon: ShieldCheck,
    tilt: '-2deg',
    floatClass: 'animate-float-slow',
    delay: 400,
  },
];

export default function ModuleChooser({ onClose, onNavigate }) {
  const [selectedSlug, setSelectedSlug] = useState(null);

  // Listen for Esc key to close chooser
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCardClick = (slug) => {
    if (selectedSlug) return;
    setSelectedSlug(slug);

    // After 400ms selection transition, navigate internally
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(`/app/${slug}`);
      }
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Module Chooser"
      className="fixed inset-0 z-50 bg-[#FAFAFA] dot-grid overflow-y-auto flex flex-col justify-between p-6 md:p-12 select-none"
    >
      {/* Top Bar: Back Button */}
      <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between mb-8">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-white text-slate-700 hover:text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-[14px] border border-slate-200/90 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
          aria-label="Back to landing page"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-sans shadow-2xs">Esc</kbd> to return
        </span>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] w-full mx-auto my-auto text-center py-4">
        {/* Header */}
        <div className="max-w-xl mx-auto mb-12">
          <SectionBadge>Live demo</SectionBadge>
          <h1 className="text-4xl md:text-[52px] font-black tracking-[-0.03em] leading-[1.05] text-[#0F172A] mb-3">
            Choose your <span className="text-[#2563EB]">check-up</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed">
            Pick a module to open it in the live app.
          </p>
        </div>

        {/* 5 Cards Layout: 3 on Top, 2 Centered Below */}
        <div className="max-w-[1100px] mx-auto">
          {/* Top Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {MODULES.slice(0, 3).map((item) => renderCard(item))}
          </div>

          {/* Bottom Row: 2 Cards Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[730px] mx-auto">
            {MODULES.slice(3, 5).map((item) => renderCard(item))}
          </div>
        </div>
      </div>

      {/* Bottom Spacer / Footer Note */}
      <div className="text-center pt-8 text-xs text-slate-400 font-medium">
        Prompt Clinic • Interactive Demonstration Lab
      </div>
    </div>
  );

  function renderCard(item) {
    const Icon = item.icon;
    const isSelected = selectedSlug === item.slug;
    const isOtherSelected = selectedSlug && !isSelected;

    return (
      <button
        key={item.slug}
        onClick={() => handleCardClick(item.slug)}
        disabled={!!selectedSlug}
        style={{
          transform: isSelected
            ? 'scale(1.04) rotate(0deg)'
            : undefined,
          animationDelay: `${item.delay}ms`,
        }}
        className={`chooser-card animate-rise text-left bg-white rounded-[24px] p-7 shadow-soft border border-slate-100/90 cursor-pointer flex flex-col justify-between group ${
          item.floatClass
        } ${
          isOtherSelected
            ? 'opacity-0 scale-95 pointer-events-none'
            : isSelected
            ? 'shadow-2xl ring-2 ring-blue-500 scale-105 z-20'
            : 'opacity-100'
        }`}
      >
        <div>
          {/* Top Row: Icon Tile + Number Pill */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
              <Icon size={24} />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-full">
              {item.num}
            </span>
          </div>

          {/* Module Name */}
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
            {item.name}
          </h2>

          {/* Technique Badge */}
          <div className="mb-3">
            <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
              {item.badge}
            </span>
          </div>

          {/* Description */}
          <p className="text-[14px] text-slate-600 leading-relaxed font-normal mb-6">
            {item.desc}
          </p>
        </div>

        {/* Bottom Link: "Open ->" */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-blue-600 group-hover:text-blue-700">
          <span className="flex items-center gap-1.5">
            Open
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-xs text-slate-400 font-normal group-hover:text-slate-600">
            Live app →
          </span>
        </div>
      </button>
    );
  }
}
