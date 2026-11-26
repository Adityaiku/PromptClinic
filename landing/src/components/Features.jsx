import React from 'react';
import SectionBadge from './common/SectionBadge';
import { Stethoscope, ShieldCheck, Brain, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';

const MODULES = [
  {
    icon: Stethoscope,
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'Diagnose',
    badge: 'Prompt Decomposition',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    problem: 'Fixes vague, underspecified instructions',
    solution: 'Detects missing role, context, format, and operational constraints. Rewrites weak prompts into production-grade instructions and contrasts results side by side.'
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'Verify',
    badge: 'Self-Verification',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    problem: 'Fixes AI hallucinations & false confidence',
    solution: 'Extracts discrete factual claims, estimates confidence ratings, color-codes risk points, and produces a safety-hedged alternative output.'
  },
  {
    icon: Brain,
    iconBg: 'bg-indigo-50 text-indigo-600',
    title: 'Remember',
    badge: 'Context Distillation',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    problem: 'Fixes context rot in long conversations',
    solution: 'Distills rambling chats into structured, copy-pasteable JSON context cards (goals, decisions, constraints) to keep subsequent queries grounded.'
  },
  {
    icon: Sparkles,
    iconBg: 'bg-amber-50 text-amber-600',
    title: 'Voice',
    badge: 'Few-Shot Style Induction',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    problem: 'Fixes generic, robotic prose',
    solution: 'Analyzes 3 writing samples to induce sentence length, cadence, vocabulary quirks, and explicit do/don’t rules into a reusable persona prompt.'
  },
  {
    icon: ShieldAlert,
    iconBg: 'bg-rose-50 text-rose-600',
    title: 'Defend',
    badge: 'Instruction Hierarchy',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    problem: 'Fixes prompt injection & jailbreak attacks',
    solution: 'Sandboxes untrusted text with strict delimiters, enforces instruction hierarchies, and displays automated pass/fail attack resistance badges.'
  }
];

export default function Features({ onOpenChooser }) {
  const handleTestClick = (e, slug) => {
    if (onOpenChooser) {
      e.preventDefault();
      onOpenChooser(e);
    }
  };

  return (
    <section id="features" className="py-24 md:py-32 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge>Features</SectionBadge>
          <h2 className="text-4xl md:text-[56px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] mb-4">
            Five fixes. One clinic.
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed">
            Every module addresses a distinct LLM failure mode using formal prompt engineering techniques.
          </p>
        </div>

        {/* 5-Card Grid: Top 3, Bottom 2 centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[24px] p-7 shadow-soft hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon Tile & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Problem */}
                  <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-3">
                    {item.problem}
                  </p>
                  
                  {/* Solution */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.solution}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={(e) => handleTestClick(e, item.title.toLowerCase())}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group bg-transparent border-none p-0 cursor-pointer"
                  >
                    Test in clinic
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">Tab 0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
