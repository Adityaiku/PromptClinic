import React, { useState, useEffect } from 'react';
import SectionBadge from './common/SectionBadge';
import Logo from './Logo';
import ChatbotIcon from './common/ChatbotIcon';

export default function IntegrationsA() {
  // Interactive Toggles State (ChatGPT, Claude on; Gemini off)
  const [toggles, setToggles] = useState({
    chatgpt: true,
    claude: true,
    gemini: false,
  });

  const toggleApp = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Live Terminal Activity Log Loop
  const LOG_EVENTS = [
    { time: '[10:42:01]', module: 'Diagnose:', msg: '3 issues found in prompt' },
    { time: '[10:42:15]', module: 'Verify:', msg: '2 claims flagged low confidence' },
    { time: '[10:42:33]', module: 'Defend:', msg: 'injection attempt blocked' },
    { time: '[10:43:05]', module: 'Remember:', msg: 'context card saved' },
    { time: '[10:43:22]', module: 'Waiting for events', msg: 'ready' },
  ];

  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((prev) => (prev >= LOG_EVENTS.length ? 1 : prev + 1));
    }, 2200);
    return () => clearInterval(timer);
  }, [LOG_EVENTS.length]);

  return (
    <section id="integrations" className="py-24 md:py-32 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge>Integrations</SectionBadge>
          <h2 className="text-4xl md:text-[56px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] mb-4">
            Connect your <span className="text-[#2563EB]">favorite chatbots.</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed">
            Prompt Clinic works with the AI tools you already use.
          </p>
        </div>

        {/* 3 Equal Cards in a Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CARD 1: Real-time Sync */}
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-1">
                Real-time Sync
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Prompts flow instantly between chatbots.
              </p>
            </div>

            {/* Orbit Illustration */}
            <div className="relative w-full h-56 flex items-center justify-center">
              {/* Outer faint circle */}
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-slate-200"></div>

              {/* Center Logo Tile */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
                <Logo size="md" showWordmark={false} />
              </div>

              {/* 4 Floating Chatbot Tiles */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
                <ChatbotIcon name="chatgpt" size={18} />
              </div>
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-9 h-9 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
                <ChatbotIcon name="claude" size={18} />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
                <ChatbotIcon name="gemini" size={18} />
              </div>
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-9 h-9 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
                <ChatbotIcon name="copilot" size={18} />
              </div>
            </div>
          </div>

          {/* CARD 2: 1-Click Connect (Interactive Toggles) */}
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-1">
                1-Click Connect
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Try it out: toggle chatbots on or off.
              </p>
            </div>

            {/* Interactive Toggle Rows */}
            <div className="space-y-4">
              {/* ChatGPT */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <ChatbotIcon name="chatgpt" size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">ChatGPT</span>
                    <span className={`text-xs font-semibold ${toggles.chatgpt ? 'text-[#16A34A]' : 'text-slate-400'}`}>
                      {toggles.chatgpt ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                {/* iOS Toggle Switch */}
                <button
                  onClick={() => toggleApp('chatgpt')}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
                    toggles.chatgpt ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle ChatGPT"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      toggles.chatgpt ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Claude */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <ChatbotIcon name="claude" size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Claude</span>
                    <span className={`text-xs font-semibold ${toggles.claude ? 'text-[#16A34A]' : 'text-slate-400'}`}>
                      {toggles.claude ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleApp('claude')}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
                    toggles.claude ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Claude"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      toggles.claude ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Gemini */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <ChatbotIcon name="gemini" size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Gemini</span>
                    <span className={`text-xs font-semibold ${toggles.gemini ? 'text-[#16A34A]' : 'text-slate-400'}`}>
                      {toggles.gemini ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleApp('gemini')}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
                    toggles.gemini ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Gemini"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      toggles.gemini ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 3: Live Activity Log (Dark Terminal) */}
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-1">
                Live Activity Log
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Prompt Clinic events in real-time.
              </p>
            </div>

            {/* Dark Terminal Window */}
            <div className="bg-[#0B1220] rounded-2xl p-4 shadow-inner min-h-[200px] flex flex-col justify-between font-mono text-[11px] border border-slate-800">
              {/* Window Dots */}
              <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                <span className="text-[10px] text-slate-500 ml-2 font-sans font-medium">prompt-clinic.log</span>
              </div>

              {/* Streaming Lines */}
              <div className="space-y-2 flex-grow">
                {LOG_EVENTS.slice(0, visibleCount).map((ev, i) => {
                  const isLast = i === visibleCount - 1 && ev.msg === 'ready';
                  return (
                    <div key={i} className="truncate leading-tight">
                      <span className="text-slate-500">{ev.time} </span>
                      <span className="text-blue-400 font-semibold">{ev.module} </span>
                      {isLast ? (
                        <span className="text-slate-300">
                          <span className="inline-block w-2 h-3 bg-blue-400 ml-1 translate-y-0.5 animate-blink"></span>
                        </span>
                      ) : (
                        <span className="text-emerald-400">{ev.msg}...</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Terminal Footer */}
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                <span>Status: Monitoring</span>
                <span className="text-emerald-500">Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
