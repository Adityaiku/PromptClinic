import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import IntegrationsA from './components/IntegrationsA';
import IntegrationsB from './components/IntegrationsB';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Sticky Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* 2. Hero with 4 Floating Tilted Cards */}
        <Hero />

        {/* 3. Features: 5 Modules Grid */}
        <Features />

        {/* 4. Integrations A: Sync, 1-Click Connect, Live Activity Log */}
        <IntegrationsA />

        {/* 5. Integrations B: Dual Concentric Orbit with Upright Counter-Rotation */}
        <IntegrationsB />

        {/* 6. Testimonials: Dual-Row Marquee */}
        <Testimonials />

        {/* 7. Pricing: 3 Cards, Featured Pro Tier */}
        <Pricing />

        {/* 8. FAQ: Accordion with Active Border and Plus/Minus Buttons */}
        <FAQ />
      </main>

      {/* 9. Footer with Scattered Floating Tiles */}
      <Footer />
    </div>
  );
}
