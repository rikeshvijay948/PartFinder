import React from 'react';
import { 
  BookmarkCheck, 
  Car, 
  Wrench, 
  User, 
  Clock, 
  Check, 
  X, 
  Building2,
  Store
} from 'lucide-react';
import { Button } from '../common/Button';
import { ShopReservationRequest } from '../../types';

interface ReservationRequestsProps {
  requests: ShopReservationRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const ReservationRequests: React.FC<ReservationRequestsProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  return (
    <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Incoming Reservation Requests
          </h3>
        </div>
        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>Action Required</span>
        </span>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
              req.status === 'Confirmed'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : req.status === 'Rejected'
                ? 'bg-red-500/10 border-red-500/25 opacity-75'
                : 'bg-navy-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left: Request details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                    NEW RESERVATION
                  </span>
                  {req.shopName && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      {req.shopName}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    #{req.id}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {req.timeAgo}
                  </span>
                </div>

                {/* Mechanic & Vehicle Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <User className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>Mechanic: {req.mechanicName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Car className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Vehicle: <strong>{req.vehicle}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Part: <strong>{req.partName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span>Quantity: <strong className="text-emerald-400 font-mono font-bold text-sm">{req.quantity}</strong> (₹{req.price})</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Workshop: {req.workshopName} • {req.fulfillment}</span>
                </div>
              </div>

              {/* Right: Actions & Current Status */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                {req.status === 'Pending' ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="text-xs font-bold px-4 py-2"
                      icon={<Check className="w-4 h-4" />}
                      onClick={() => onAccept(req.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold px-3 py-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                      icon={<X className="w-3.5 h-3.5" />}
                      onClick={() => onReject(req.id)}
                    >
                      Reject
                    </Button>
                  </>
                ) : req.status === 'Confirmed' ? (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                    <Check className="w-4 h-4" />
                    <span>Confirmed (30m Hold Active)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold">
                    <X className="w-4 h-4" />
                    <span>Declined</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
