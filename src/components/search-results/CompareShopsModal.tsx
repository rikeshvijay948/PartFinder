import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Clock, 
  Truck, 
  Tag, 
  Sparkles, 
  Navigation,
  Award
} from 'lucide-react';
import { Button } from '../common/Button';
import { ShopResult, StockStatus } from '../../types';

interface CompareShopsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: ShopResult[];
  vehicle: string;
  partName: string;
  onReserve: (shop: ShopResult) => void;
  onCall: (shop: ShopResult) => void;
}

export const CompareShopsModal: React.FC<CompareShopsModalProps> = ({
  isOpen,
  onClose,
  shops,
  vehicle,
  partName,
  onReserve,
  onCall,
}) => {
  // If more than 3 shops, allow mechanic to toggle which 3 to compare
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return shops.slice(0, 3).map(s => s.id);
  });

  if (!isOpen || shops.length === 0) return null;

  // Active shops to display side-by-side (up to 3)
  const comparedShops = shops.filter(s => selectedIds.includes(s.id)).slice(0, 3);
  const activeList = comparedShops.length > 0 ? comparedShops : shops.slice(0, 3);

  // Calculate Best Price & Nearest distance
  const validPrices = activeList.map(s => s.price).filter(p => p > 0);
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const lowestDistance = Math.min(...activeList.map(s => s.distanceKm));

  const toggleShopSelection = (shopId: string) => {
    if (selectedIds.includes(shopId)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(id => id !== shopId));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, shopId]);
      } else {
        setSelectedIds([selectedIds[1], selectedIds[2], shopId]);
      }
    }
  };

  const getStockPill = (status: StockStatus, count: number) => {
    switch (status) {
      case 'in-stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            In Stock ({count} avail.)
          </span>
        );
      case 'limited-stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold">
            Limited ({count} left)
          </span>
        );
      case 'out-of-stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold">
            Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
            Contact Counter
          </span>
        );
    }
  };

  const gridColsClass = activeList.length >= 3 ? 'md:grid-cols-3' : activeList.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-navy-900 border border-slate-700/90 rounded-3xl shadow-2xl max-w-5xl w-full p-5 sm:p-7 space-y-6 relative overflow-hidden my-6">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-start justify-between relative z-10 pb-4 border-b border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-lg shadow-brand-600/30 shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-brand-400">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>Side-by-Side Workshop Comparator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Compare Nearby Spare Parts & Retailers
              </h2>
              <p className="text-xs text-slate-300">
                Comparing {activeList.length} local distributors for <strong className="text-white">{partName}</strong> • {vehicle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shop Picker Tabs if more than 3 shops */}
        {shops.length > 3 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Select Up to 3 Shops to Compare:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {shops.map(shop => {
                const isSelected = selectedIds.includes(shop.id);
                return (
                  <button
                    key={shop.id}
                    type="button"
                    onClick={() => toggleShopSelection(shop.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-500 font-bold shadow-sm'
                        : 'bg-navy-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span>{isSelected ? '✓ ' : '+ '}</span>
                    <span>{shop.shopName}</span>
                    <span className="text-[10px] opacity-75">(₹{shop.price})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Columns */}
        <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
          {activeList.map(shop => {
            const isLowestPrice = shop.price === lowestPrice && lowestPrice > 0;
            const isNearest = shop.distanceKm === lowestDistance;
            const hasPhone = Boolean(shop.phone && shop.phone.trim() !== '');

            return (
              <div 
                key={shop.id}
                className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 border transition-all relative ${
                  isLowestPrice 
                    ? 'bg-navy-950/95 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40' 
                    : 'bg-navy-950/80 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Best Value Ribbon / Nearest Badge */}
                <div className="flex items-center gap-1.5 flex-wrap min-h-[24px]">
                  {isLowestPrice && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                      <Award className="w-3 h-3 text-emerald-400" />
                      <span>Best Counter Value</span>
                    </span>
                  )}
                  {isNearest && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-[10px] font-bold uppercase tracking-wider">
                      <Navigation className="w-3 h-3 text-brand-400" />
                      <span>Closest ({shop.distanceKm} km)</span>
                    </span>
                  )}
                </div>

                {/* Shop Name & Header */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                      {shop.shopName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-amber-400 font-bold">★ {shop.rating}</span>
                    <span>•</span>
                    <span className="truncate max-w-[180px]">{shop.area || shop.address}</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-navy-900 border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Counter Price
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
                    <span>₹{shop.price}</span>
                    <span className="text-[11px] font-normal text-slate-400">incl. tax</span>
                  </div>
                  {isLowestPrice && (
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
                      <Tag className="w-3 h-3" />
                      <span>Lowest price among comparison</span>
                    </div>
                  )}
                </div>

                {/* Feature Comparison Rows */}
                <div className="space-y-2.5 text-xs">
                  {/* Stock Level */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Availability:</span>
                    <div>{getStockPill(shop.stockStatus, shop.stockCount)}</div>
                  </div>

                  {/* Brand & Grade */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">OEM / Brand:</span>
                    <span className="font-bold text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 text-[11px]">
                      {shop.brand || 'OEM Grade'}
                    </span>
                  </div>

                  {/* Part Number */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Part Ref:</span>
                    <span className="font-mono text-slate-200 font-semibold text-[11px]">
                      {shop.partNumber || '31210-87703'}
                    </span>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Distance:</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{shop.distanceKm} km (~{Math.round(shop.distanceKm * 3.5)} min)</span>
                    </span>
                  </div>

                  {/* Fulfillment Options */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Fulfillment:</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Express Bay Delivery</span>
                    </span>
                  </div>

                  {/* Counter Status */}
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Counter Status:</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{shop.openingHours || 'Open Now • Closes 8:30 PM'}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className={`w-full text-xs font-bold shadow-md ${
                      isLowestPrice 
                        ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 shadow-emerald-600/30' 
                        : 'shadow-brand-600/20'
                    }`}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => {
                      onReserve(shop);
                      onClose();
                    }}
                  >
                    <span>Reserve at this Shop</span>
                  </Button>

                  {hasPhone && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs border-slate-700 hover:border-slate-500"
                      icon={<Phone className="w-3.5 h-3.5 text-emerald-400" />}
                      onClick={() => onCall(shop)}
                    >
                      <span>Call {shop.phone}</span>
                    </Button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Bottom Strip */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Prices are verified counter prices with 30-minute reservation hold protection.</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs px-4"
          >
            Close Comparison
          </Button>
        </div>

      </div>
    </div>
  );
};
