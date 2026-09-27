import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Phone, 
  Store, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink,
  Navigation,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { ShopResult, StockStatus } from '../../types';

interface ShopCardProps {
  shop: ShopResult;
  isSelected?: boolean;
  onSelect?: () => void;
  onReserve: (shop: ShopResult) => void;
  onCall: (shop: ShopResult) => void;
  onView: (shop: ShopResult) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  isSelected = false,
  onSelect,
  onReserve,
  onCall,
  onView,
}) => {
  const isGooglePlace = shop.discoverySource === 'google_places';
  const hasPhone = Boolean(shop.phone && shop.phone.trim() !== '');

  // Stock styling helper
  const getStockBadge = (status: StockStatus, count: number) => {
    switch (status) {
      case 'unverified':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 font-medium text-xs shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Stock not verified • Contact shop</span>
          </div>
        );
      case 'in-stock':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>In Stock ({count} available)</span>
          </div>
        );
      case 'limited-stock':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-xs shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Limited Stock ({count} left)</span>
          </div>
        );
      case 'out-of-stock':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-bold text-xs shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            <span>Out of Stock (0 available)</span>
          </div>
        );
      default:
        return null;
    }
  };

  const isOutOfStock = shop.stockStatus === 'out-of-stock';

  return (
    <div
      onClick={onSelect}
      className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 relative border ${
        isSelected
          ? 'bg-navy-850/95 border-brand-500 shadow-glow-md ring-1 ring-brand-500/50'
          : 'bg-navy-900/85 hover:bg-navy-850/90 border-slate-800/90 hover:border-slate-700 shadow-xl'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Main Details Section */}
        <div className="flex-1 space-y-3">
          
          {/* Top Row: Shop Name, Verified Badge, Rating, Distance */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-center text-brand-400 shrink-0 shadow-inner">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {shop.shopName}
                  </h3>
                  {shop.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      PartFinder Verified
                    </span>
                  ) : isGooglePlace ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[10px] font-semibold">
                      <MapPin className="w-3 h-3" />
                      Google Maps Place
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                      Unverified Counter
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                  <span className="text-amber-400 font-bold">★ {shop.rating}</span>
                  <span className="text-slate-500">({shop.reviewsCount} reviews)</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium truncate max-w-[280px]">{shop.address}</span>
                </div>
              </div>
            </div>

            {/* Distance & Status Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-950 border border-slate-800 text-xs font-semibold text-slate-200">
                <Navigation className="w-3.5 h-3.5 text-brand-400" />
                <span>{shop.distanceKm} km away</span>
              </div>
            </div>
          </div>

          {/* Part Query / Shop Context Banner */}
          <div className="p-3 rounded-2xl bg-navy-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{shop.partName}</span>
                {shop.partNumber && (
                  <span className="text-xs font-mono text-slate-400 bg-navy-900 px-2 py-0.5 rounded border border-slate-800">
                    #{shop.partNumber}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-lg">
                {shop.brand}
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span>Compatible with: <strong className="text-slate-200 font-medium">{shop.compatibleVehicle}</strong></span>
              {shop.isOpenNow !== undefined && (
                <span className={`text-[11px] font-bold ${shop.isOpenNow ? 'text-emerald-400' : 'text-slate-400'}`}>
                  ● {shop.isOpenNow ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>
          </div>

          {/* Availability, Timestamps & Hours Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {/* Stock status indicator */}
            {getStockBadge(shop.stockStatus, shop.stockCount)}

            <div className="inline-flex items-center gap-1.5 text-slate-400 bg-navy-950/50 px-2.5 py-1 rounded-lg border border-slate-800/60">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{shop.lastUpdated}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-slate-400 bg-navy-950/50 px-2.5 py-1 rounded-lg border border-slate-800/60">
              <span className="text-slate-500">Hours:</span>
              <span className="text-slate-300 font-medium">{shop.openingHours}</span>
            </div>
          </div>

        </div>

        {/* Right Section: Price & Action Buttons */}
        <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          
          {/* Price */}
          <div className="text-left lg:text-right">
            <div className="text-xs text-slate-400 font-medium">
              {isGooglePlace ? 'Est. Market Reference' : 'Workshop Counter Price'}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1 lg:justify-end">
              <span>₹{shop.price}</span>
              <span className="text-xs font-normal text-slate-400">
                {isGooglePlace ? 'verify with shop' : 'incl. tax'}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-52">
            <Button
              variant={isOutOfStock ? 'secondary' : 'primary'}
              size="md"
              disabled={isOutOfStock}
              className={`w-full text-xs font-bold ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'shadow-md shadow-brand-600/30'
              }`}
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => onReserve(shop)}
            >
              {isOutOfStock 
                ? 'Out of Stock' 
                : isGooglePlace 
                ? 'Inquire / Reserve Part' 
                : 'Reserve Part'}
            </Button>

            <div className="grid grid-cols-2 gap-2 w-full">
              {hasPhone ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs px-2 py-2 border-slate-700 hover:border-emerald-500/50"
                  icon={<Phone className="w-3.5 h-3.5 text-emerald-400" />}
                  onClick={() => onCall(shop)}
                >
                  Call Shop
                </Button>
              ) : (
                <a
                  href={shop.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.shopName + ' ' + shop.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-xs px-2 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Maps</span>
                </a>
              )}

              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 py-2 border-slate-700 hover:border-slate-500"
                icon={<ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                onClick={() => onView(shop)}
              >
                View Details
              </Button>
            </div>

            {/* Direct Google Maps Link Button */}
            {hasPhone && shop.googleMapsUri && (
              <a
                href={shop.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-navy-950/80 hover:bg-slate-800 py-1.5 px-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors w-full"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Open in Google Maps</span>
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
