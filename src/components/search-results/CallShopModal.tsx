import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Clock, 
  Check, 
  Copy, 
  PhoneCall, 
  Wrench
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShopResult } from '../../types';

interface CallShopModalProps {
  shop: ShopResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CallShopModal: React.FC<CallShopModalProps> = ({
  shop,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!shop) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shop.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Spare Parts Counter"
      subtitle={`Direct line to ${shop.shopName}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        
        {/* Shop identity pill */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{shop.shopName}</h4>
              {shop.isVerified && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Dealer
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{shop.address}</span>
            </div>
          </div>
        </div>

        {/* Big Phone Number Display */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-850 to-navy-950 p-5 rounded-2xl border border-brand-500/30 text-center space-y-2 shadow-inner">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Counter Sales Desk Phone
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-wider">
            {shop.phone}
          </div>
          
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={`tel:${shop.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Now</span>
            </a>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Number</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Counter Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Operating Schedule
            </span>
            <div className="font-bold text-slate-200">{shop.openingHours}</div>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-brand-400" /> Part Availability
            </span>
            <div className="font-bold text-amber-400">
              {shop.stockStatus === 'unverified' ? 'Verify with Counter' : `${shop.stockCount} units on shelf`}
            </div>
          </div>
        </div>

        {/* Mechanic notice */}
        <div className="bg-brand-500/10 p-3 rounded-xl border border-brand-500/20 text-xs text-brand-300">
          <strong>Mechanic Tip:</strong> Inquire directly with the shop counter for stock availability, current quote, and counter hold or bay dispatch.
        </div>

        <div className="space-y-2">
          {shop.googleMapsUri && (
            <a
              href={shop.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors w-full"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>View Business on Google Maps</span>
            </a>
          )}

          <Button
            variant="secondary"
            size="md"
            className="w-full text-xs"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
};
