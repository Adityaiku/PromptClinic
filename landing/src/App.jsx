import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import IntegrationsA from './components/IntegrationsA';
import IntegrationsB from './components/IntegrationsB';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ModuleChooser from './components/ModuleChooser';

export default function App() {
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [circleExpanded, setCircleExpanded] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleOpenChooser = (e) => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
      });
    } else {
      setOrigin({
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2),
      });
    }

    if (prefersReducedMotion) {
      setIsChooserOpen(true);
      return;
    }

    // Trigger expanding blue ripple animation
    setIsExpanding(true);
    setCircleExpanded(false);

    // Expand the circle across the screen
    requestAnimationFrame(() => {
      setTimeout(() => {
        setCircleExpanded(true);
      }, 20);
    });

    // Reveal Chooser overlay at peak expansion
    setTimeout(() => {
      setIsChooserOpen(true);
      setIsExpanding(false);
      setCircleExpanded(false);
    }, 780);
  };

  const handleCloseChooser = () => {
    setIsChooserOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#0F172A] antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Expanding Blue Circle Overlay (800ms transition) */}
      {isExpanding && (
        <div
          style={{
            clipPath: circleExpanded
              ? `circle(160% at ${origin.x}px ${origin.y}px)`
              : `circle(0% at ${origin.x}px ${origin.y}px)`,
            transition: 'clip-path 780ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="fixed inset-0 z-40 bg-[#2563EB] pointer-events-none"
        />
      )}

      {/* Main Landing Page (Scales down slightly and fades when Chooser is active) */}
      <div
        className={`transition-all duration-700 ease-out flex flex-col min-h-screen ${
          isChooserOpen || isExpanding
            ? 'scale-[0.96] opacity-40 blur-[0.5px] pointer-events-none'
            : 'scale-100 opacity-100'
        }`}
      >
        {/* 1. Sticky Navbar */}
        <Navbar onOpenChooser={handleOpenChooser} />

        <main className="flex-grow">
          {/* 2. Hero with 4 Floating Tilted Cards */}
          <Hero onOpenChooser={handleOpenChooser} />

          {/* 3. Features: 5 Modules Grid */}
          <Features onOpenChooser={handleOpenChooser} />

          {/* 4. Integrations A: Sync, 1-Click Connect, Live Activity Log */}
          <IntegrationsA />

          {/* 5. Integrations B: Dual Concentric Orbit with Upright Counter-Rotation */}
          <IntegrationsB />

          {/* 6. Testimonials: Dual-Row Marquee */}
          <Testimonials />

          {/* 7. Pricing: 3 Cards, Featured Pro Tier */}
          <Pricing onOpenChooser={handleOpenChooser} />

          {/* 8. FAQ: Accordion with Active Border and Plus/Minus Buttons */}
          <FAQ />
        </main>

        {/* 9. Footer with Scattered Floating Tiles */}
        <Footer onOpenChooser={handleOpenChooser} />
      </div>

      {/* Full-Screen Module Chooser Overlay */}
      {isChooserOpen && (
        <ModuleChooser onClose={handleCloseChooser} />
      )}

    </div>
  );
}
