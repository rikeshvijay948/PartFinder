import React from 'react';
import { Search, Layers, CheckCircle2, Truck } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';

export const HowItWorksSection: React.FC = () => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-5 h-5 text-brand-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-brand-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-amber-400" />;
      default:
        return <Search className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle background radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Workflow Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How PartFinder Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            From diagnosis to doorstep delivery in four frictionless steps.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-navy-900/70 hover:bg-navy-850/80 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-card-glow group relative"
            >
              {/* Step indicator pill */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-navy-950 border border-slate-800 flex items-center justify-center group-hover:border-brand-500/40 transition-colors">
                  {getStepIcon(step.icon)}
                </div>
                <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-brand-400 transition-colors">
                  {step.stepNumber}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>
                <div className="text-xs font-semibold text-brand-400 mt-1 mb-3">
                  {step.tagline}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span>{step.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
