import React from 'react';
import SectionBadge from './common/SectionBadge';
import { Check, Zap } from 'lucide-react';

export default function Pricing({ onOpenChooser }) {
  const handleDemoClick = (e) => {
    if (onOpenChooser) {
      onOpenChooser(e);
    }
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge>Pricing</SectionBadge>
          <h2 className="text-4xl md:text-[56px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] mb-4">
            Simple pricing plans
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed">
            Choose the tier that matches your learning and development needs.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-[1080px] mx-auto">
          
          {/* Card 1: Basic */}
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Basic plan</h3>
              <p className="text-xs text-slate-500 mb-6">Perfect for students.</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-[#0F172A] tracking-tight">$5</span>
                <span className="text-sm font-semibold text-slate-400">/mo</span>
              </div>

              <button
                onClick={handleDemoClick}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] mb-8 shadow-sm cursor-pointer"
              >
                Get started
              </button>

              <div className="pt-6 border-t border-slate-100">
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>All 5 modules</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>50 checks per day</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>1 chatbot</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Pro (Featured - Middle, Taller, Solid Blue, Lightning Badge) */}
          <div className="relative bg-[#1E5BFF] text-white rounded-[24px] p-9 shadow-xl flex flex-col justify-between lg:-translate-y-2 lg:scale-[1.03] transition-all duration-300">
            {/* Tilted White Rounded Badge with Yellow Lightning Bolt overlapping top-right */}
            <div className="absolute -top-4 -right-3 rotate-[12deg] w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100">
              <Zap size={20} className="text-amber-400 fill-amber-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">Pro plan</h3>
              <p className="text-xs text-blue-100 mb-6">Ideal for creators and freelancers.</p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white tracking-tight">$9</span>
                <span className="text-sm font-semibold text-blue-200">/mo</span>
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-6">
                Best choice
              </span>

              <button
                onClick={handleDemoClick}
                className="w-full bg-white hover:bg-slate-50 text-[#1E5BFF] font-bold text-sm py-3.5 rounded-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] mb-8 shadow-md cursor-pointer"
              >
                Get started
              </button>

              <div className="pt-6 border-t border-blue-400/30">
                <ul className="space-y-3.5 text-xs text-white">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
                    <span>All 5 modules</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
                    <span>Unlimited checks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
                    <span>All chatbots</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
                    <span>Prompt history</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Advanced */}
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Advanced plan</h3>
              <p className="text-xs text-slate-500 mb-6">Best for teams and companies.</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-[#0F172A] tracking-tight">$15</span>
                <span className="text-sm font-semibold text-slate-400">/mo</span>
              </div>

              <button
                onClick={handleDemoClick}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] mb-8 shadow-sm cursor-pointer"
              >
                Get started
              </button>

              <div className="pt-6 border-t border-slate-100">
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>Team workspace</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>Custom injection test suites</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Small Gray Note */}
        <p className="text-center text-xs text-slate-400 mt-10">
          Concept pricing for a course project. No real payments.
        </p>

      </div>
    </section>
  );
}
