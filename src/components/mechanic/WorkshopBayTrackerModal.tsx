import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Wrench, 
  PackageCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  WorkshopBay, 
  INITIAL_WORKSHOP_BAYS, 
  formatCustomerPickupWhatsAppMessage, 
  sharePickupPassOnWhatsApp 
} from '../../utils/workshopBayTracker';

interface WorkshopBayTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkshopBayTrackerModal: React.FC<WorkshopBayTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [bays, setBays] = useState<WorkshopBay[]>(INITIAL_WORKSHOP_BAYS);
  const [copiedBayId, setCopiedBayId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdateStatus = (bayId: string, newStatus: WorkshopBay['bayStatus']) => {
    setBays(bays.map((bay) => {
      if (bay.id === bayId) {
        return {
          ...bay,
          bayStatus: newStatus,
          partsStatus: newStatus === 'ready_for_pickup' ? 'completed' : bay.partsStatus,
          estimatedReady: newStatus === 'ready_for_pickup' ? 'Ready for Collection' : bay.estimatedReady
        };
      }
      return bay;
    }));
  };

  const handleCopyPass = (bay: WorkshopBay) => {
    const text = formatCustomerPickupWhatsAppMessage(bay);
    navigator.clipboard.writeText(text);
    setCopiedBayId(bay.id);
    setTimeout(() => setCopiedBayId(null), 2000);
  };

  const readyCount = bays.filter(b => b.bayStatus === 'ready_for_pickup').length;
  const inProgressCount = bays.filter(b => b.bayStatus === 'in_progress').length;
  const awaitingCount = bays.filter(b => b.bayStatus === 'awaiting_spares').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Workshop Bay Queue & Live Progress
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                  Live Garage Bays
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking of vehicle hydraulic bays, spare parts installation, and customer pickup dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="p-4 bg-navy-950/90 border-b border-slate-800 grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-lg font-black text-emerald-400 font-mono">{readyCount}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Ready For Pickup</div>
          </div>
          <div className="p-2.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-lg font-black text-brand-400 font-mono">{inProgressCount}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Under Active Repair</div>
          </div>
          <div className="p-2.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-lg font-black text-amber-400 font-mono">{awaitingCount}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Awaiting Spares Arrival</div>
          </div>
        </div>

        {/* Modal Body: Bay Cards Grid */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bays.map((bay) => {
              const isReady = bay.bayStatus === 'ready_for_pickup';
              const isAwaiting = bay.bayStatus === 'awaiting_spares';

              const statusBadgeClass = isReady
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isAwaiting
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-brand-500/20 text-brand-300 border-brand-500/40';

              const partsBadgeClass = {
                awaiting_delivery: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                parts_arrived: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                installing: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              }[bay.partsStatus];

              return (
                <div
                  key={bay.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 flex flex-col justify-between ${
                    isReady
                      ? 'bg-gradient-to-br from-navy-950 via-navy-900 to-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'bg-navy-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Bay Name + Status Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                          #{bay.bayNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-300 truncate max-w-[180px]">
                          {bay.bayName}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeClass}`}>
                        {bay.bayStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Vehicle Plate & Model */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-900/90 border border-slate-800">
                      <div>
                        <div className="font-bold text-white text-xs">{bay.vehicle}</div>
                        <div className="text-[11px] text-slate-400">Customer: {bay.customerName}</div>
                      </div>
                      <span className="font-mono text-xs font-bold bg-blue-700 text-white px-2 py-0.5 rounded border border-white/20">
                        IND • {bay.plateNumber}
                      </span>
                    </div>

                    {/* Job Description */}
                    <div className="text-xs text-slate-300 flex items-start gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{bay.repairJob}</span>
                    </div>

                    {/* Spare Parts Status Tag */}
                    <div className="p-2.5 rounded-xl bg-navy-900/50 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <PackageCheck className="w-3 h-3 text-brand-400" />
                          <span>Parts Status:</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] border ${partsBadgeClass}`}>
                          {bay.partsStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {bay.installedParts.join(' • ')}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{bay.estimatedReady}</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        ₹{bay.totalBill.toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!isReady ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(bay.id, 'ready_for_pickup')}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark Ready For Pickup</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(bay.id, 'in_progress')}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                        >
                          Reopen Bay
                        </button>
                      )}

                      {isReady && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold shadow-md shadow-emerald-600/20"
                          icon={<Share2 className="w-3.5 h-3.5" />}
                          onClick={() => sharePickupPassOnWhatsApp(bay)}
                        >
                          WhatsApp Pickup Pass
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyPass(bay)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                        title="Copy Pickup Slip"
                      >
                        {copiedBayId === bay.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bay synchronization active across Apex Auto Workshop Salem.</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
