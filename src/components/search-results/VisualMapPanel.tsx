import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Crosshair,
  Store
} from 'lucide-react';
import { ShopResult } from '../../types';

interface VisualMapPanelProps {
  shops: ShopResult[];
  selectedShopId: string | null;
  onSelectShop: (shopId: string) => void;
  city: string;
}

export const VisualMapPanel: React.FC<VisualMapPanelProps> = ({
  shops,
  selectedShopId,
  onSelectShop,
  city,
}) => {
  const [hoveredShopId, setHoveredShopId] = useState<string | null>(null);

  const getPinColor = (status: string) => {
    switch (status) {
      case 'unverified':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-300',
          text: 'text-blue-400',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        };
      case 'in-stock':
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-300',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        };
      case 'limited-stock':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-300',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        };
      case 'out-of-stock':
        return {
          bg: 'bg-red-500',
          border: 'border-red-300',
          text: 'text-red-400',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
        };
      default:
        return {
          bg: 'bg-brand-500',
          border: 'border-brand-300',
          text: 'text-brand-400',
          glow: 'shadow-md',
        };
    }
  };

  return (
    <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col h-[580px]">
      
      {/* Map Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {city} Hub Radar Map
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 bg-navy-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Crosshair className="w-3 h-3 text-brand-400" />
            <span>GPS Active</span>
          </span>
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="flex-1 relative mt-3 rounded-2xl bg-[#070D1B] border border-slate-800/80 overflow-hidden select-none">
        
        {/* Background Grid & Road Simulation */}
        <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
        
        {/* Simulated Road Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/80 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Ring Road */}
          <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeDasharray="6 4" />
          <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          
          {/* Highways */}
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#1E2A4F" strokeWidth="3" />
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#1E2A4F" strokeWidth="3" />
          <line x1="15%" y1="15%" x2="85%" y2="85%" stroke="#15203B" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="85%" y1="15%" x2="15%" y2="85%" stroke="#15203B" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Area Landmarks */}
        <div className="absolute top-[28%] left-[46%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 tracking-wider uppercase pointer-events-none">
          5 Roads Junction
        </div>
        <div className="absolute top-[52%] left-[22%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 tracking-wider uppercase pointer-events-none">
          Meyyanur Bypass
        </div>
        <div className="absolute top-[75%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 tracking-wider uppercase pointer-events-none">
          Omalur Main Rd
        </div>

        {/* Center: Workshop Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative">
            <span className="animate-ping absolute inset-0 rounded-full bg-brand-400 opacity-60"></span>
            <div className="w-5 h-5 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center shadow-lg shadow-brand-500/50">
              <Navigation className="w-3 h-3 text-white fill-white rotate-45" />
            </div>
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-navy-950/90 text-brand-300 font-bold text-[10px] border border-brand-500/30 whitespace-nowrap shadow-md">
            Your Workshop Bay
          </span>
        </div>

        {/* Shop Location Pins */}
        {shops.map((shop) => {
          const colors = getPinColor(shop.stockStatus);
          const isSelected = selectedShopId === shop.id;
          const isHovered = hoveredShopId === shop.id;
          const active = isSelected || isHovered;

          return (
            <div
              key={shop.id}
              onClick={() => onSelectShop(shop.id)}
              onMouseEnter={() => setHoveredShopId(shop.id)}
              onMouseLeave={() => setHoveredShopId(null)}
              style={{
                left: `${shop.coordinates.x}%`,
                top: `${shop.coordinates.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group transition-transform duration-200"
            >
              {/* Pin marker */}
              <div className="relative flex flex-col items-center">
                {/* Active Tooltip Badge */}
                <div
                  className={`mb-1 px-2.5 py-1 rounded-xl bg-navy-950/95 border border-slate-700 shadow-2xl transition-all duration-200 whitespace-nowrap ${
                    active ? 'scale-110 -translate-y-1 border-brand-400' : 'scale-90 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                    <Store className="w-3 h-3 text-brand-400" />
                    <span>{shop.shopName.split(' ')[0]}</span>
                    <span className="text-emerald-400 font-extrabold">₹{shop.price}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 text-center font-medium">
                    {shop.distanceKm} km • {shop.stockStatus === 'unverified' ? 'Verify with Shop' : shop.stockCount > 0 ? `${shop.stockCount} in stock` : 'Out of stock'}
                  </div>
                </div>

                {/* The Dot Pin */}
                <div
                  className={`w-7 h-7 rounded-full ${colors.bg} ${colors.border} ${colors.glow} border-2 flex items-center justify-center text-white shadow-xl transition-transform ${
                    active ? 'scale-125 ring-4 ring-white/20' : 'group-hover:scale-110'
                  }`}
                >
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
          <div className="p-1.5 rounded-lg bg-navy-950/90 border border-slate-800 text-slate-300 text-[11px] font-bold">
            {city} Radius Radar
          </div>
        </div>

      </div>

      {/* Map Legend */}
      <div className="pt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 mt-3 flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[11px] text-slate-300">Google Place</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-slate-300">Verified Stock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] text-slate-300">Limited</span>
          </div>
        </div>

        <span className="text-[10px] text-slate-500">
          Click any pin to inspect
        </span>
      </div>

    </div>
  );
};
