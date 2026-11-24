import React from 'react';
import Logo from './Logo';
import ChatbotIcon from './common/ChatbotIcon';
import { Stethoscope, Check } from 'lucide-react';

export default function Hero({ onOpenChooser }) {
  const handleDemoClick = (e) => {
    if (onOpenChooser) {
      onOpenChooser(e);
    }
  };

  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-36 dot-grid overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 relative">
        
        {/* Floating Card 1: Top-Left Yellow Sticky Note */}
        <div className="hidden lg:block absolute left-0 top-6 rotate-[-4deg] animate-float z-20 pointer-events-none select-none">
          <div className="relative bg-[#FEF08A] rounded-2xl p-5 shadow-lg w-64 border border-amber-200/60">
            {/* Red Push Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-md flex items-center justify-center border border-red-600">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
            </div>
            
            {/* Handwriting Monospace Note */}
            <p className="font-mono text-[13px] text-amber-950 leading-relaxed font-medium pt-1">
              Tip: give the AI a role, context and a format.
              <span className="inline-block w-1.5 h-3.5 bg-amber-900 ml-1 translate-y-0.5 animate-blink"></span>
            </p>

            {/* Blue Checkbox Tile overlapping bottom-left corner */}
            <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Check size={16} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Floating Card 2: Top-Right "Diagnosis" Card */}
        <div className="hidden lg:block absolute right-2 top-8 rotate-[4deg] animate-float-slow z-20 pointer-events-none select-none">
          <div className="bg-white rounded-[22px] p-4 shadow-hero-card w-64 border border-slate-100">
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Stethoscope size={15} />
                </div>
                <span className="text-xs font-bold text-slate-800">Diagnosis</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Live check</span>
            </div>

            {/* Sub-card: Prompt Check-up */}
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700">Prompt check-up</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2 issues found
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Missing role & output format constraints.
              </p>
            </div>
          </div>
        </div>

        {/* Central Content */}
        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Centered App Icon Tile with Logo */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-[22px] bg-white shadow-md border border-slate-100 flex items-center justify-center transition-transform hover:scale-105">
              <Logo size="lg" showWordmark={false} />
            </div>
          </div>

          {/* H1 Heading */}
          <h1 className="font-black tracking-[-0.03em] leading-[1.05] text-[clamp(44px,6.5vw,82px)] text-[#0F172A] mb-4">
            Diagnose, verify, and defend<br />
            <span className="text-[#94A3B8]">every AI prompt</span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-9">
            Fix vague answers, false facts, lost context and hijacked prompts with prompt engineering.
          </p>

          {/* CTA Button: Opens Module Chooser */}
          <div className="flex justify-center">
            <button
              onClick={handleDemoClick}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-base px-9 py-4 rounded-[14px] shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Try live demo
            </button>
          </div>
        </div>

        {/* Floating Card 3: Bottom-Left "Today's checks" Card */}
        <div className="hidden lg:block absolute left-4 bottom-[-10px] rotate-[-3deg] animate-float-reverse z-20 pointer-events-none select-none">
          <div className="absolute -top-2.5 left-6 w-16 h-4 bg-slate-200/80 rounded-t-lg -z-10"></div>
          
          <div className="bg-white rounded-[22px] p-4 shadow-hero-card w-72 border border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-3">Today's checks</span>

            {/* Row 1: Answer confidence */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-100 text-amber-700 text-[9px] font-bold flex items-center justify-center">
                    8
                  </span>
                  <span className="font-medium text-slate-700">Answer confidence</span>
                </div>
                <span className="font-bold text-slate-800">74%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            {/* Row 2: Injection resisted */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="font-medium text-slate-700">Injection resisted</span>
                </div>
                <span className="font-bold text-slate-800">100%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Card 4: Bottom-Right "Works with any chatbot" Card */}
        <div className="hidden lg:block absolute right-6 bottom-[-10px] rotate-[4deg] animate-float z-20 pointer-events-none select-none">
          <div className="absolute -top-2.5 left-6 w-16 h-4 bg-slate-200/80 rounded-t-lg -z-10"></div>

          <div className="bg-white rounded-[22px] p-4 shadow-hero-card w-64 border border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-3">Works with any chatbot</span>
            
            {/* 3 Tilted Icon Tiles */}
            <div className="flex items-center justify-center gap-3 py-1">
              <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center rotate-[-6deg]">
                <ChatbotIcon name="chatgpt" size={20} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center rotate-[3deg]">
                <ChatbotIcon name="claude" size={20} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center rotate-[-3deg]">
                <ChatbotIcon name="gemini" size={20} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
