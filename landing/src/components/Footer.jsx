import React from 'react';
import Logo from './Logo';
import {
  Stethoscope,
  Shield,
  MessageSquare,
  Lightbulb,
  Check,
  Clock,
  Brain,
  Sparkles,
  Timer,
  FastForward,
  ArrowRight
} from 'lucide-react';

export default function Footer({ onOpenChooser }) {
  // ~10 Scattered Floating Icon Tiles
  const FLOATING_TILES = [
    { icon: Stethoscope, color: 'text-blue-600', angle: '-8deg', delay: '0s', left: '6%', top: '25%' },
    { icon: Shield, color: 'text-rose-600', angle: '6deg', delay: '1s', left: '16%', top: '65%' },
    { icon: MessageSquare, color: 'text-emerald-600', angle: '-5deg', delay: '2s', left: '26%', top: '30%' },
    { icon: Lightbulb, color: 'text-amber-500', angle: '12deg', delay: '0.5s', left: '38%', top: '70%' },
    { icon: Check, color: 'text-blue-500', angle: '-10deg', delay: '1.5s', left: '48%', top: '20%' },
    { icon: Clock, color: 'text-slate-700', angle: '8deg', delay: '2.5s', left: '58%', top: '60%' },
    { icon: Brain, color: 'text-indigo-600', angle: '-6deg', delay: '3s', left: '68%', top: '25%' },
    { icon: Sparkles, color: 'text-amber-600', angle: '10deg', delay: '1.2s', left: '78%', top: '68%' },
    { icon: Timer, color: 'text-teal-600', angle: '-4deg', delay: '2.2s', left: '88%', top: '32%' },
    { icon: FastForward, color: 'text-blue-700', angle: '7deg', delay: '0.8s', left: '94%', top: '75%' },
  ];

  const handleDemoClick = (e) => {
    if (onOpenChooser) {
      e.preventDefault();
      onOpenChooser(e);
    }
  };

  return (
    <footer className="pt-24 pb-12 dot-grid bg-[#FAFAFA] border-t border-slate-100 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Top Section: Heading + Links */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-20">
          
          {/* Left Column: Logo & Large Display Heading */}
          <div className="max-w-xl">
            <div className="mb-6">
              <Logo size="md" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-[-0.03em] leading-[1.1] mb-6">
              Stay sharp and get better answers from every AI
            </h2>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              Open-source educational laboratory for Prompt Engineering. 
              Built with Python, Streamlit, and modern web standards.
            </p>
          </div>

          {/* Right Columns: Two Navigation Lists with Arrows */}
          <div className="grid grid-cols-2 gap-10 md:gap-16 sm:w-auto">
            {/* Column 1 */}
            <div>
              <ul className="space-y-3.5 text-sm font-semibold text-slate-700">
                {['About Us', 'Contact', "What's New", 'Careers'].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#features"
                      className="group inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-3.5 text-sm font-semibold text-slate-700">
                {['Product', 'Solutions', 'Integrations', 'Price'].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link === 'Price' ? '#pricing' : `#${link.toLowerCase()}`}
                      className="group inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Scattered Floating Icon Tiles Playground */}
        <div className="relative w-full h-44 my-12 hidden md:block select-none pointer-events-none">
          {FLOATING_TILES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="absolute animate-float-slow"
                style={{
                  left: item.left,
                  top: item.top,
                  animationDelay: item.delay,
                  transform: `rotate(${item.angle})`,
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-slate-100 flex items-center justify-center transition-transform hover:scale-110">
                  <Icon size={20} className={item.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Line: Thin divider & Copyright */}
        <div className="pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Prompt Clinic. Built for Prompt Engineering Education.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={handleDemoClick}
              className="hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-slate-500"
            >
              Choose Module Demo
            </button>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Privacy & Guidelines
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              Docs & Syllabus
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
