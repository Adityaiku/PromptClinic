import React, { useState } from 'react';
import SectionBadge from './common/SectionBadge';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'What is Prompt Clinic?',
    a: 'Prompt Clinic is an educational laboratory designed for college students and developers. It demonstrates how systematic prompt engineering techniques diagnose, verify, remember, stylize, and defend LLM interactions to produce reliable, high-quality AI outputs.'
  },
  {
    q: 'How does it work with chatbots?',
    a: 'Prompt Clinic acts as a transparent prompt-optimization layer. You can formulate, diagnose, and harden prompts in the clinic, inspect the exact system templates sent, and immediately pipe them into major AI providers including ChatGPT, Claude, Gemini, and local open-source models.'
  },
  {
    q: 'Which prompt engineering techniques does it use?',
    a: 'The suite demonstrates five foundational techniques: Structural Prompt Decomposition (Role, Context, Constraints), Self-Verification (claim extraction & confidence rating), Context Distillation (JSON state compression), Few-Shot Style Induction (syntactic tone modeling), and Instruction Hierarchy (delimiter-based sandboxing).'
  },
  {
    q: 'How accurate is the Verify module?',
    a: 'The Verify module decomposes generated answers into discrete factual claims and evaluates model uncertainty to detect risky statements. However, it is an uncertainty-reduction tool, not an oracle. While it significantly cuts down on hallucinations, critical and high-stakes facts must always be cross-referenced against authoritative, trusted sources.'
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Prompt Clinic is designed with safety and data privacy first. In standard mode, inputs are sent directly to the official Gemini API using your personal API key. In Offline Demo Mode, zero network requests leave your machine and all examples are loaded locally from static cache files.'
  },
  {
    q: 'Can I try it for free?',
    a: 'Absolutely. Prompt Clinic is completely free and open-source for students and educators. You can run the interactive Streamlit lab locally or explore pre-computed classroom examples with a single click using our built-in Demo Mode.'
  }
];

export default function FAQ() {
  // First item open by default
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-24 md:py-32 dot-grid bg-[#FAFAFA]">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <SectionBadge>FAQ</SectionBadge>
          <h2 className="text-4xl md:text-[56px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed">
            Everything you need to know about Prompt Clinic.
          </p>
        </div>

        {/* Accordion Cards */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-[22px] transition-all duration-300 shadow-soft overflow-hidden border ${
                  isOpen ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Header / Question row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-bold text-[#0F172A] tracking-tight">
                    {faq.q}
                  </span>
                  
                  {/* Square Toggle Button */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-[#2563EB] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-6 md:px-7 pb-6 pt-1 text-sm md:text-[15px] text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
