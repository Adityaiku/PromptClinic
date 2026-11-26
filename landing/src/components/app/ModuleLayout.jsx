import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Sliders, RefreshCw, Check, Sparkles, Shield, Brain, Search, Stethoscope, AlertTriangle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const MODULE_REGISTRY = {
  diagnose: {
    slug: 'diagnose',
    num: '01',
    name: 'Diagnose',
    icon: Stethoscope,
    technique: 'Prompt decomposition',
    tagline: 'Check up your prompt',
    desc: 'Paste a weak prompt. We find what’s missing, rewrite it, and show both answers side by side.',
  },
  verify: {
    slug: 'verify',
    num: '02',
    name: 'Verify',
    icon: Search,
    technique: 'Chain-of-verification',
    tagline: 'Can you trust this answer?',
    desc: 'Splits an answer into claims and flags the shaky ones with a confidence rating.',
  },
  remember: {
    slug: 'remember',
    num: '03',
    name: 'Remember',
    icon: Brain,
    technique: 'Structured summarization',
    tagline: 'Save your chat’s memory',
    desc: 'Turns a long chat into a context card you can paste into a fresh chat.',
  },
  voice: {
    slug: 'voice',
    num: '04',
    name: 'Voice',
    icon: Sparkles,
    technique: 'Few-shot style transfer',
    tagline: 'Write like you',
    desc: 'Learns your writing style from 3 samples and rewrites any draft in your voice.',
  },
  defend: {
    slug: 'defend',
    num: '05',
    name: 'Defend',
    icon: Shield,
    technique: 'Delimited defense',
    tagline: 'Stop prompt hijacking',
    desc: 'Tests prompts against malicious instructions with clear PASS/FAIL results.',
  },
};

export default function ModuleLayout({ currentSlug = 'diagnose', onNavigate, children }) {
  const currentMod = MODULE_REGISTRY[currentSlug] || MODULE_REGISTRY.diagnose;
  const { temperature, setTemperature, demoMode, setDemoMode } = useSettings();

  const [switchOpen, setSwitchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const switchRef = useRef(null);
  const settingsRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (switchRef.current && !switchRef.current.contains(event.target)) {
        setSwitchOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const IconComp = currentMod.icon;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* SLIM TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left section: Home Link + Module Identity */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:border-slate-300 shadow-sm hover:shadow text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>Home</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div className="inline-flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <IconComp className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                {currentMod.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200">
                {currentMod.technique}
              </span>
            </div>
          </div>

          {/* Right section: Switch Module Popover & Settings Popover */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SWITCH MODULE POPOVER */}
            <div className="relative" ref={switchRef}>
              <button
                onClick={() => {
                  setSwitchOpen(!switchOpen);
                  setSettingsOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                  switchOpen
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Switch module</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {switchOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Prompt Clinic Modules
                  </div>
                  <div className="space-y-1">
                    {Object.values(MODULE_REGISTRY).map((mod) => {
                      const isActive = mod.slug === currentSlug;
                      const ModIcon = mod.icon;
                      return (
                        <button
                          key={mod.slug}
                          onClick={() => {
                            setSwitchOpen(false);
                            onNavigate(`/app/${mod.slug}`);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-all ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <ModIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="truncate">
                              {mod.num} {mod.name}
                            </span>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS POPOVER */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => {
                  setSettingsOpen(!settingsOpen);
                  setSwitchOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                  settingsOpen
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Settings</span>
                {demoMode && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
              </button>

              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Engine Controls
                  </div>

                  {/* Temperature slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-700 mb-1">
                      <span>Temperature</span>
                      <span className="font-mono font-semibold text-blue-600">{temperature.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Focused (0.0)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  {/* Offline Demo Mode toggle */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Offline Demo Mode</div>
                      <div className="text-xs text-slate-500">Zero network requests (bundled data)</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={demoMode}
                        onChange={(e) => setDemoMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Connection Status Badge */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Connection Status
                    </div>
                    {demoMode ? (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Demo Mode Active:</strong> Instant execution with pre-cached classroom datasets.
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Live Serverless API:</strong> Ready to process with Gemini 2.5 Flash on Vercel.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN MODULE CONTENT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
