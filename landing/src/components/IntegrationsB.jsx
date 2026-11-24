import React from 'react';
import Logo from './Logo';
import ChatbotIcon from './common/ChatbotIcon';

export default function IntegrationsB() {
  // Inner ring: 4 chatbots at radius 130px
  const innerChatbots = [
    { name: 'chatgpt', angle: 0 },
    { name: 'claude', angle: 90 },
    { name: 'gemini', angle: 180 },
    { name: 'copilot', angle: 270 },
  ];

  // Outer ring: 8 chatbots at radius 230px
  const outerChatbots = [
    { name: 'perplexity', angle: 22.5 },
    { name: 'llama', angle: 67.5 },
    { name: 'mistral', angle: 112.5 },
    { name: 'deepseek', angle: 157.5 },
    { name: 'grok', angle: 202.5 },
    { name: 'poe', angle: 247.5 },
    { name: 'huggingface', angle: 292.5 },
    { name: 'cohere', angle: 337.5 },
  ];

  const degToRad = (deg) => (deg * Math.PI) / 180;

  return (
    <section className="py-24 md:py-36 square-grid relative overflow-hidden bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        
        {/* Heading: No pill, matching reference screenshot 3 */}
        <h2 className="text-4xl md:text-[56px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] max-w-2xl mx-auto mb-16">
          Connect chatbots you use every day
        </h2>

        {/* Orbit Stage */}
        <div className="relative w-full max-w-[620px] h-[520px] md:h-[580px] mx-auto flex items-center justify-center select-none">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

          {/* Center Logo Tile */}
          <div className="relative z-20 w-16 h-16 rounded-[22px] bg-white shadow-xl border border-slate-100 flex items-center justify-center transition-transform hover:scale-110">
            <Logo size="lg" showWordmark={false} />
          </div>

          {/* INNER RING: 260px diameter (130px radius) */}
          <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-slate-300/80 animate-orbit pointer-events-none">
            {innerChatbots.map((bot, i) => {
              const r = 130;
              const rad = degToRad(bot.angle);
              const x = r * Math.cos(rad);
              const y = r * Math.sin(rad);

              return (
                <div
                  key={i}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `calc(50% + ${x}px - 22px)`,
                    top: `calc(50% + ${y}px - 22px)`,
                  }}
                >
                  {/* Counter-rotate tile so icon stays upright */}
                  <div className="animate-orbit-reverse">
                    <div className="w-11 h-11 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
                      <ChatbotIcon name={bot.name} size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* OUTER RING: 460px diameter (230px radius) */}
          <div className="absolute w-[460px] h-[460px] rounded-full border border-dashed border-slate-300/80 animate-orbit pointer-events-none">
            {outerChatbots.map((bot, i) => {
              const r = 230;
              const rad = degToRad(bot.angle);
              const x = r * Math.cos(rad);
              const y = r * Math.sin(rad);

              return (
                <div
                  key={i}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `calc(50% + ${x}px - 22px)`,
                    top: `calc(50% + ${y}px - 22px)`,
                  }}
                >
                  {/* Counter-rotate tile so icon stays upright */}
                  <div className="animate-orbit-reverse">
                    <div className="w-11 h-11 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
                      <ChatbotIcon name={bot.name} size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
