import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Check, Sparkles } from 'lucide-react';

interface InventoryAccuracyCardProps {
  lastVerifiedText?: string;
  onSyncNow?: () => void;
}

export const InventoryAccuracyCard: React.FC<InventoryAccuracyCardProps> = ({
  lastVerifiedText = '8 minutes ago',
  onSyncNow,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setJustSynced(true);
      if (onSyncNow) onSyncNow();
      setTimeout(() => setJustSynced(false), 3000);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 rounded-2xl border border-emerald-500/30 p-5 shadow-xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        
        {/* Left: Text & Badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-md shadow-emerald-500/10">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Inventory Accuracy
              </h4>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified {justSynced ? 'just now' : lastVerifiedText}</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
              Stock shown to mechanics is based on the shop's latest inventory update. Maintaining accurate quantities prevents canceled trips and boosts your verified shop ranking.
            </p>
          </div>
        </div>

        {/* Right: Quick Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold transition-all shadow-sm focus:outline-none"
          >
            {isSyncing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Verifying...</span>
              </>
            ) : justSynced ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Shelf Synced!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Sync Shelf Now</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
