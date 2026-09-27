import React from 'react';
import { Search, Store, ShieldCheck, Clock, Zap, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onFindPartClick: () => void;
  onListShopClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindPartClick,
  onListShopClick,
}) => {
  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Glows & Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-brand-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill / Live Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-brand-500/30 shadow-card-glow mb-6 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">
              Live Spare Parts Network for Workshops & Garages
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-xs font-bold text-brand-400">
              20+ Regional Hubs
            </span>
          </div>

          {/* Exact Required Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] sm:leading-[1.1]">
            Find the exact part.{' '}
            <span className="block bg-gradient-to-r from-brand-400 via-blue-200 to-emerald-400 bg-clip-text text-transparent mt-1 sm:mt-2">
              Nearby. Available. Ready.
            </span>
          </h1>

          {/* Exact Required Subheading */}
          <p className="mt-6 sm:mt-7 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            PartFinder helps mechanics find the exact spare part nearby, reserve it instantly, and get it delivered to their workshop.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-4 shadow-xl shadow-brand-600/30 group"
              icon={<Search className="w-5 h-5 text-brand-200 group-hover:scale-110 transition-transform" />}
              onClick={onFindPartClick}
            >
              Find a Part
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base px-7 py-4 border-slate-700 hover:border-brand-500/50 group"
              icon={<Store className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />}
              onClick={onListShopClick}
            >
              List Your Shop
            </Button>
          </div>

          {/* Trust Highlights Strip */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">100% Real-Time</div>
                <div className="text-[11px] text-slate-400">Live shop timestamps</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Verified Shops</div>
                <div className="text-[11px] text-slate-400">OEM & OES vetted stock</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Fast Hold</div>
                <div className="text-[11px] text-slate-400">Counter reservation</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Express Delivery</div>
                <div className="text-[11px] text-slate-400">Direct to repair bay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
