import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenChooser }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoClick = (e) => {
    if (onOpenChooser) {
      onOpenChooser(e);
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-100 ${
        isScrolled ? 'shadow-md py-3' : 'py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="#" className="flex items-center gap-2">
          <Logo size="md" />
        </a>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#integrations"
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Integrations
          </a>
          <a
            href="#pricing"
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={handleDemoClick}
            className="text-[15px] font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={handleDemoClick}
            className="bg-[#0B1220] hover:bg-slate-800 text-white text-[14px] font-semibold px-5 py-2.5 rounded-[14px] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Get demo
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-1.5"
          >
            Features
          </a>
          <a
            href="#integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-1.5"
          >
            Integrations
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-1.5"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-1.5"
          >
            FAQ
          </a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleDemoClick(e);
              }}
              className="w-full bg-[#0B1220] text-white py-2.5 rounded-[14px] font-semibold text-sm cursor-pointer"
            >
              Get demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
