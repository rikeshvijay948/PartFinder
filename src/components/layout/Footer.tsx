import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenModal?: (type: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  const navigate = useNavigate();

  const handleNavigateSection = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAction = (type: string, fallbackPath: string) => {
    if (onOpenModal) {
      onOpenModal(type);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <footer className="bg-navy-950 border-t border-slate-800/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white tracking-tight">
                  Part<span className="text-brand-500">Finder</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Automotive Spares Network
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              PartFinder connects automotive repair workshops with certified local spare-parts retailers for real-time stock verification, instant reservations, and rapid doorstep bay delivery.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-emerald-400">
                Network Online: 426 Verified Shops Connected
              </span>
            </div>
          </div>

          {/* For Mechanics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Mechanics
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('/find-part')}
                  className="hover:text-white transition-colors text-left font-semibold text-brand-400"
                >
                  Mechanic Part Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('track-order', '/track-order')}
                  className="hover:text-white transition-colors text-left"
                >
                  Track Workshop Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateSection('how-it-works')}
                  className="hover:text-white transition-colors text-left"
                >
                  How Reservation Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('signup', '/register')}
                  className="hover:text-white transition-colors text-left"
                >
                  Garage Partner Program
                </button>
              </li>
            </ul>
          </div>

          {/* For Spare Shops */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Shop Owners
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleAction('list-shop', '/register?role=shop')}
                  className="hover:text-white transition-colors text-left text-brand-400 font-semibold"
                >
                  List Your Spare Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop/dashboard')}
                  className="hover:text-white transition-colors text-left font-semibold text-emerald-400"
                >
                  Shop Dashboard (Demo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('login', '/login')}
                  className="hover:text-white transition-colors text-left"
                >
                  Dealer Portal Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('list-shop', '/register?role=shop')}
                  className="hover:text-white transition-colors text-left"
                >
                  POS & Inventory Sync
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('list-shop', '/register?role=shop')}
                  className="hover:text-white transition-colors text-left"
                >
                  Get Verified Dealer Badge
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Hubs & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Active Hubs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Salem • 5 Roads & Meyyanur</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Coimbatore • Gandhipuram</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Chennai • Pudupet Auto Cluster</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Bangalore • JC Road Market</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} PartFinder Technologies Inc. Built for professional automotive mechanics.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Safety Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
