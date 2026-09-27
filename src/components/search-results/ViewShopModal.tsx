import React from 'react';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Truck, 
  CreditCard,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShopResult } from '../../types';

interface ViewShopModalProps {
  shop: ShopResult | null;
  isOpen: boolean;
  onClose: () => void;
  onCall: (shop: ShopResult) => void;
  onReserve: (shop: ShopResult) => void;
}

export const ViewShopModal: React.FC<ViewShopModalProps> = ({
  shop,
  isOpen,
  onClose,
  onCall,
  onReserve,
}) => {
  if (!shop) return null;

  const isGooglePlace = shop.discoverySource === 'google_places';
  const hasPhone = Boolean(shop.phone && shop.phone.trim() !== '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGooglePlace ? "Auto Parts Business Details" : "Verified Distributor Profile"}
      subtitle={isGooglePlace ? "Discovered live via Google Maps Places" : `Authorized spare parts counter in ${shop.area}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-navy-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-brand-400">
                <Store className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-extrabold text-white">{shop.shopName}</h3>
                {shop.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PartFinder Verified
                  </span>
                ) : isGooglePlace ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    Google Maps Place
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                    Unverified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="text-amber-400 font-bold">★ {shop.rating}</span>
                <span className="text-slate-500">({shop.reviewsCount} reviews)</span>
                <span>•</span>
                <span className="text-brand-400 font-semibold">{shop.distanceKm} km from workshop</span>
                {shop.businessStatus && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono text-[11px] uppercase">{shop.businessStatus}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Status Notice for Google Places */}
        {isGooglePlace && (
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-amber-500/30 flex items-start gap-2.5 text-xs text-slate-300">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block">Stock Availability Notice:</strong>
              This business is discovered dynamically using Google Places API. PartFinder has not verified current counter stock. Please contact the shop directly to confirm exact part availability.
            </div>
          </div>
        )}

        {/* Location & Contact strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Full Address
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">{shop.address}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-400" /> Working Schedule
            </div>
            <p className="text-slate-200 font-medium">{shop.openingHours}</p>
            {shop.isOpenNow !== undefined && (
              <p className={`text-[11px] font-semibold ${shop.isOpenNow ? 'text-emerald-400' : 'text-slate-400'}`}>
                {shop.isOpenNow ? '● Open Now' : '● Closed'}
              </p>
            )}
          </div>
        </div>

        {/* Counter Features */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-white block mb-1">Services & Fulfillment</span>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Counter Pickup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Express Bay Delivery Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-brand-400 shrink-0" />
              <span>UPI / Card / Cash Accepted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Invoice with GST</span>
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hasPhone ? (
              <Button
                variant="secondary"
                size="md"
                className="w-full text-xs"
                icon={<Phone className="w-4 h-4 text-emerald-400" />}
                onClick={() => {
                  onClose();
                  onCall(shop);
                }}
              >
                Call Counter ({shop.phone})
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                disabled
                className="w-full text-xs opacity-60"
              >
                Phone Not Listed
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              className="w-full text-xs font-bold shadow-md shadow-brand-600/30"
              icon={<CheckCircle2 className="w-4 h-4" />}
              disabled={shop.stockStatus === 'out-of-stock'}
              onClick={() => {
                onClose();
                onReserve(shop);
              }}
            >
              {shop.stockStatus === 'out-of-stock' 
                ? 'Out of Stock' 
                : isGooglePlace 
                ? 'Inquire / Reserve Part' 
                : 'Reserve at This Shop'}
            </Button>
          </div>

          {/* Open in Google Maps */}
          {shop.googleMapsUri && (
            <a
              href={shop.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors w-full"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Open Business in Google Maps</span>
            </a>
          )}
        </div>

      </div>
    </Modal>
  );
};
