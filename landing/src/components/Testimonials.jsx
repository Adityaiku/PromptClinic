import React from 'react';
import SectionBadge from './common/SectionBadge';
import { Star } from 'lucide-react';

const REVIEWS_ROW_1 = [
  {
    stars: 5,
    quote: "The Diagnose module rewrote my team's vague prompts into structured instructions in seconds. The difference in output quality was night and day.",
    name: "Sarah W.",
    role: "Computer Science TA",
    avatar: "SW",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    stars: 5,
    quote: "Prompt injection was always a black box for our class. Defend demonstrated how delimiters and instruction hierarchy actually protect applications.",
    name: "David K.",
    role: "AI Security Student",
    avatar: "DK",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    stars: 5,
    quote: "Verify decomposed complex answers into discrete claims and flagged risky assertions. It taught students to never trust AI facts blindly.",
    name: "Daniela T.",
    role: "Course Instructor",
    avatar: "DT",
    gradient: "from-rose-500 to-orange-500"
  },
  {
    stars: 5,
    quote: "The live side-by-side comparison makes teaching prompt engineering effortless. Students can immediately see why constraints and role matter.",
    name: "Marcus L.",
    role: "Product Management Lead",
    avatar: "ML",
    gradient: "from-purple-500 to-pink-600"
  }
];

const REVIEWS_ROW_2 = [
  {
    stars: 5,
    quote: "Context Cards in Remember solved the long-chat hallucination problem for our final semester research project. Pure genius.",
    name: "Priya M.",
    role: "Data Science Major",
    avatar: "PM",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    stars: 5,
    quote: "Voice extracted my exact technical writing style from 3 snippets. Now my AI drafts sound like me rather than a generic corporate robot.",
    name: "Alex C.",
    role: "Freelance Technical Writer",
    avatar: "AC",
    gradient: "from-amber-500 to-red-500"
  },
  {
    stars: 5,
    quote: "The 'Show Prompts Used' feature is brilliant. Demystifies everything going on behind the scenes for students learning LLM mechanics.",
    name: "John D.",
    role: "College Lab Lecturer",
    avatar: "JD",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    stars: 5,
    quote: "Having the offline Demo Mode meant our classroom presentation never skipped a beat even when campus Wi-Fi gave out.",
    name: "Rachel B.",
    role: "Teaching Assistant",
    avatar: "RB",
    gradient: "from-violet-500 to-purple-600"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 text-center mb-16">
        <SectionBadge>Testimonials</SectionBadge>
        <h2 className="text-4xl md:text-[56px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] mb-4">
          Trusted by students and creators
        </h2>
        <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
          See how Prompt Clinic helps people get better answers from AI.
        </p>
        <span className="text-xs text-slate-400 block mt-2">
          Sample feedback for demo
        </span>
      </div>

      {/* Marquee Container with Gradient Edge Masks */}
      <div className="relative w-full marquee-mask pause-hover space-y-6">
        
        {/* Row 1: Scrolling Left */}
        <div className="flex w-max gap-6 animate-marquee marquee-track">
          {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, i) => (
            <div
              key={i}
              className="w-[340px] md:w-[380px] bg-white rounded-[24px] p-6 shadow-soft border border-slate-100 flex-shrink-0 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-slate-700 leading-relaxed font-normal mb-5">
                  "{review.quote}"
                </p>
              </div>

              {/* Divider & User */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${review.gradient} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
                  {review.avatar}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block">{review.name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex w-max gap-6 animate-marquee-reverse marquee-track">
          {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, i) => (
            <div
              key={i}
              className="w-[340px] md:w-[380px] bg-white rounded-[24px] p-6 shadow-soft border border-slate-100 flex-shrink-0 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-slate-700 leading-relaxed font-normal mb-5">
                  "{review.quote}"
                </p>
              </div>

              {/* Divider & User */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${review.gradient} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
                  {review.avatar}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block">{review.name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
