import React from 'react';
import { Package, ShieldCheck, Timer, ThumbsUp } from 'lucide-react';
import { STATS_DATA } from '../../data/mockData';

export const StatsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Boxes':
        return <Package className="w-6 h-6 text-brand-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Timer':
        return <Timer className="w-6 h-6 text-amber-400" />;
      case 'TrendingUp':
        return <ThumbsUp className="w-6 h-6 text-brand-400" />;
      default:
        return <Package className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <section className="py-16 md:py-20 bg-navy-950 relative border-y border-slate-800/80">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-brand-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
            Verified Network Metrics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Built for High-Speed Workshop Operations
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Eliminating downtime and wasted travel for professional automotive mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {STATS_DATA.map((stat) => (
            <div
              key={stat.id}
              className="bg-navy-900/80 hover:bg-navy-850/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 shadow-card-dark group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(stat.iconName)}
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Live
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>

              <div className="text-sm font-bold text-slate-200 mt-1.5">
                {stat.label}
              </div>

              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
