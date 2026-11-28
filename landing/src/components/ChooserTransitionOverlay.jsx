import React, { useState, useEffect, useRef } from 'react';
import {
  Stethoscope,
  SearchCheck,
  Brain,
  Palette,
  ShieldCheck,
  Check,
  ArrowRight,
  Activity,
} from 'lucide-react';

/**
 * All configurable timing parameters in one place for easy tuning.
 */
export const TRANSITION_TIMINGS = {
  // 1. Circle Expand: 0.0s - 0.6s
  CIRCLE_EXPAND_MS: 600,

  // 2. Logo & Heartbeat reveal: 0.6s - 1.3s
  LOGO_APPEAR_MS: 600,
  BRAND_TEXT_MS: 850,

  // 3. Staggered Pills: 1.3s - 2.8s
  PILLS_START_MS: 1300,
  PILL_STAGGER_MS: 240,     // Time between each pill popping in
  PILL_FIXED_DELAY_MS: 260, // Time after pill appears until it pulses & turns green "Fixed"

  // 4. FLIP Morph into Chooser: 2.8s - 3.6s
  MORPH_START_MS: 2800,
  MORPH_DURATION_MS: 800,

  // Total standard duration
  TOTAL_DURATION_MS: 3600,

  // Fast repeat visit in same session: 0.8s
  FAST_REVISIT_MS: 800,

  // Reduced motion
  REDUCED_MOTION_MS: 300,
};

const PILL_DATA = [
  {
    num: '01',
    name: 'Diagnose',
    icon: Stethoscope,
    problem: 'Vague prompts',
  },
  {
    num: '02',
    name: 'Verify',
    icon: SearchCheck,
    problem: 'False facts',
  },
  {
    num: '03',
    name: 'Remember',
    icon: Brain,
    problem: 'Lost context',
  },
  {
    num: '04',
    name: 'Voice',
    icon: Palette,
    problem: 'Robotic tone',
  },
  {
    num: '05',
    name: 'Defend',
    icon: ShieldCheck,
    problem: 'Hijacked prompts',
  },
];

export default function ChooserTransitionOverlay({
  origin = { x: 0, y: 0 },
  onComplete,
}) {
  const [phase, setPhase] = useState('circle'); // 'circle' | 'brand' | 'pills' | 'morph' | 'done'
  const [pillsState, setPillsState] = useState(
    PILL_DATA.map(() => ({ visible: false, fixed: false }))
  );
  const [bgFading, setBgFading] = useState(false);
  const [circleExpanded, setCircleExpanded] = useState(false);
  const [isFast, setIsFast] = useState(false);

  const containerRef = useRef(null);
  const pillRefs = useRef([]);
  const hasFinishedRef = useRef(false);

  const finishImmediately = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    try {
      sessionStorage.setItem('prompt_clinic_intro_seen', 'true');
    } catch (e) {
      // sessionStorage restricted / unavailable
    }
    if (onComplete) onComplete();
  };

  useEffect(() => {
    // 1. Accessibility: reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        finishImmediately();
      }, TRANSITION_TIMINGS.REDUCED_MOTION_MS);
      return () => clearTimeout(timer);
    }

    // 2. Session revisit check
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('prompt_clinic_intro_seen') === 'true';
    } catch (e) {}

    // Trigger expanding circle on mount
    requestAnimationFrame(() => {
      setCircleExpanded(true);
    });

    if (alreadySeen) {
      setIsFast(true);
      const fastTimer = setTimeout(() => {
        finishImmediately();
      }, TRANSITION_TIMINGS.FAST_REVISIT_MS);
      return () => clearTimeout(fastTimer);
    }

    // Full 3.6s timeline schedule
    const timers = [];

    // Stage 2: Logo and ECG line appear at 0.6s
    timers.push(
      setTimeout(() => {
        setPhase('brand');
      }, TRANSITION_TIMINGS.LOGO_APPEAR_MS)
    );

    // Stage 3: Pills start popping at 1.3s
    timers.push(
      setTimeout(() => {
        setPhase('pills');
      }, TRANSITION_TIMINGS.PILLS_START_MS)
    );

    // Stagger each pill and schedule its "Fixed" resolution
    PILL_DATA.forEach((_, idx) => {
      const pillAppearTime = TRANSITION_TIMINGS.PILLS_START_MS + idx * TRANSITION_TIMINGS.PILL_STAGGER_MS;
      const pillFixedTime = pillAppearTime + TRANSITION_TIMINGS.PILL_FIXED_DELAY_MS;

      timers.push(
        setTimeout(() => {
          setPillsState((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], visible: true };
            return next;
          });
        }, pillAppearTime)
      );

      timers.push(
        setTimeout(() => {
          setPillsState((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], fixed: true };
            return next;
          });
        }, pillFixedTime)
      );
    });

    // Stage 4: Morph starts at 2.8s
    timers.push(
      setTimeout(() => {
        setPhase('morph');
        setBgFading(true);
      }, TRANSITION_TIMINGS.MORPH_START_MS)
    );

    // Complete timeline at 3.6s
    timers.push(
      setTimeout(() => {
        finishImmediately();
      }, TRANSITION_TIMINGS.TOTAL_DURATION_MS)
    );

    // Keyboard listener for Esc
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        finishImmediately();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={finishImmediately}
      role="dialog"
      aria-label="Launching interactive lab"
      className="fixed inset-0 z-50 overflow-hidden select-none cursor-pointer"
      style={{
        pointerEvents: 'auto',
      }}
    >
      {/* 1. EXPANDING BLUE BACKGROUND */}
      <div
        className="absolute inset-0 bg-[#2563EB] transition-opacity duration-700 ease-out"
        style={{
          clipPath: circleExpanded
            ? `circle(160% at ${origin.x}px ${origin.y}px)`
            : `circle(0% at ${origin.x}px ${origin.y}px)`,
          transition: `clip-path ${TRANSITION_TIMINGS.CIRCLE_EXPAND_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${TRANSITION_TIMINGS.MORPH_DURATION_MS}ms ease-out`,
          opacity: bgFading ? 0 : 1,
        }}
      />

      {/* 2. ECG HEARTBEAT LINE (Behind content, visible during stage 2 and 3) */}
      {!isFast && (phase === 'brand' || phase === 'pills') && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-48 pointer-events-none opacity-25 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 100 L 250 100 L 280 40 L 310 160 L 340 70 L 370 120 L 400 100 L 600 100 L 630 30 L 660 170 L 690 60 L 720 125 L 750 100 L 950 100 L 980 40 L 1010 160 L 1040 70 L 1070 120 L 1200 100"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg-draw"
            />
          </svg>
        </div>
      )}

      {/* 3. MAIN CENTER CONTAINER */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto">
        {/* BRAND IDENTITY (Logo + Title + Tagline) */}
        {!isFast && (
          <div
            className={`flex flex-col items-center text-center transition-all duration-500 ease-out mb-6 ${
              phase === 'brand' || phase === 'pills'
                ? 'opacity-100 scale-100 translate-y-0'
                : phase === 'morph'
                ? 'opacity-0 scale-95 -translate-y-4'
                : 'opacity-0 scale-75 translate-y-4'
            }`}
          >
            {/* White Rounded Cross Icon Tile */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#2563EB] mb-3 animate-spring-pop">
              <svg
                className="w-8 h-8 md:w-9 md:h-9"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
              Prompt Clinic
            </h1>
            <p className="text-blue-100 text-sm md:text-base font-medium mt-1">
              Fix what's wrong with your AI
            </p>
          </div>
        )}

        {/* 5 STACKED MODULE PILLS */}
        {!isFast && (
          <div className="w-full space-y-2.5 max-w-md">
            {PILL_DATA.map((pill, idx) => {
              const Icon = pill.icon;
              const state = pillsState[idx];

              return (
                <div
                  key={pill.num}
                  ref={(el) => (pillRefs.current[idx] = el)}
                  className={`w-full bg-white rounded-xl px-4 py-3 shadow-lg border border-white/20 flex items-center justify-between transition-all duration-300 ease-out ${
                    state.visible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  } ${
                    state.fixed ? 'ring-2 ring-emerald-400/80 shadow-emerald-500/20' : ''
                  } ${
                    phase === 'morph' ? 'opacity-0 scale-90 translate-y-2' : ''
                  }`}
                  style={{
                    transform: state.fixed ? 'scale(1.015)' : undefined,
                    transitionProperty: 'opacity, transform, box-shadow, ring',
                  }}
                >
                  {/* Left: Icon + Number + Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {pill.num}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                      {pill.name}
                    </span>
                  </div>

                  {/* Right: Problem -> Fixed Badge Cross-fade */}
                  <div className="relative h-6 flex items-center">
                    {/* Problem Badge (Red) */}
                    <div
                      className={`transition-all duration-300 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        state.fixed
                          ? 'opacity-0 scale-90 pointer-events-none absolute'
                          : 'opacity-100 scale-100 bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                    >
                      <span>{pill.problem}</span>
                    </div>

                    {/* Fixed Badge (Green with drawn checkmark) */}
                    <div
                      className={`transition-all duration-300 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ${
                        state.fixed
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-90 pointer-events-none absolute'
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-emerald-600"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
                          className={state.fixed ? 'animate-check-draw' : ''}
                        />
                      </svg>
                      <span>Fixed</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAST REVISIT FALLBACK DISPLAY */}
        {isFast && (
          <div className="text-center text-white flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center animate-spin">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase opacity-90">
              Entering Clinic...
            </span>
          </div>
        )}
      </div>

      {/* 4. BOTTOM-RIGHT SKIP BUTTON & HINT */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            finishImmediately();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/25 hover:bg-black/40 text-white/90 hover:text-white backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] text-white/60 font-mono hidden sm:inline-block">
          Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white font-sans text-[10px]">Esc</kbd> or click anywhere
        </span>
      </div>
    </div>
  );
}
