import React from 'react';
import { Search, Store, ShieldCheck, PhoneOff, Zap } from 'lucide-react';
import { Button } from '../common/Button';

interface CTASectionProps {
  onFindPartClick: () => void;
  onListShopClick: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onFindPartClick,
  onListShopClick,
}) => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-850 to-navy-950 border border-brand-500/30 p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden text-center">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-brand-500/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-emerald-500/10 blur-[90px] pointer-events-none" />

          {/* Micro pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-950/80 border border-brand-500/40 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <PhoneOff className="w-3.5 h-3.5 text-amber-400" />
            <span>End Workshop Bottlenecks</span>
          </div>

          {/* Exact Required Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Stop calling multiple shops.{' '}
            <span className="block bg-gradient-to-r from-brand-400 via-blue-100 to-emerald-400 bg-clip-text text-transparent mt-2">
              Find the part in minutes.
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join over 420+ automotive spare parts shops and 2,800+ independent mechanics who save 2+ hours on every vehicle repair job.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-base shadow-xl shadow-brand-600/30 group"
              icon={<Search className="w-5 h-5 text-brand-200 group-hover:scale-110 transition-transform" />}
              onClick={onFindPartClick}
            >
              Find a Part
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-7 py-4 text-base border-slate-700 hover:border-emerald-500/50 group"
              icon={<Store className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />}
              onClick={onListShopClick}
            >
              List Your Shop
            </Button>
          </div>

          {/* Footnote reassurance */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Free part searches for mechanics
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-400" />
              Instant counter reservations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
