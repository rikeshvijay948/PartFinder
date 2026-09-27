import React from 'react';
import { MapPin, BadgeCheck, Clock, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { FEATURES_DATA } from '../../data/mockData';

export const FeaturesSection: React.FC = () => {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-brand-400" />;
      case 'BadgeCheck':
        return <BadgeCheck className="w-6 h-6 text-emerald-400" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-blue-400" />;
      default:
        return <MapPin className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <section id="shops" className="py-20 md:py-28 bg-navy-950/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Engineered for Mechanics & Distributors
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Why Workshops Rely on PartFinder
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Say goodbye to calling 10 different shops or sending runners across town. Get parts into your workshop faster than ever.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-navy-900 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Zero Ghost Inventory Guarantee</span>
          </div>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.id}
              className="bg-navy-900/80 hover:bg-navy-850/90 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-7 sm:p-8 transition-all duration-300 shadow-card-dark flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-navy-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  
                  {feature.statBadge && (
                    <span className="text-xs font-semibold text-slate-200 bg-navy-950 px-3 py-1 rounded-full border border-slate-800">
                      {feature.statBadge}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  {feature.badge}
                </span>

                <h3 className="text-2xl font-bold text-white mt-1 mb-2 tracking-tight">
                  {feature.title}
                </h3>

                <div className="text-sm font-medium text-slate-300 mb-3">
                  {feature.tagline}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Feature highlights */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Instant mechanic activation
                </span>
                <span className="text-brand-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Learn details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
