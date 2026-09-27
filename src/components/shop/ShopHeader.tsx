import React from 'react';
import { 
  Menu, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShopHeaderProps {
  onToggleMobileMenu: () => void;
  shopName?: string;
  location?: string;
  isVerified?: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  onToggleMobileMenu,
  shopName = 'Sri Lakshmi Auto Spares',
  location = 'Salem',
  isVerified = true,
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Shop Title Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {shopName}
              </h1>
              
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Shop
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Location: {location}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">5 Roads Counter</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* View Public Storefront Button */}
          <button
            onClick={() => navigate('/search-results')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
          >
            <span>Mechanic View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          {/* Owner Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              SL
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-white leading-tight">Lakshmi Nathan</div>
              <div className="text-[10px] text-slate-400">Shop Manager</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
