import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MechanicSidebar } from '../components/mechanic/MechanicSidebar';
import { ReservationOrder } from '../types';
import { 
  Menu, 
  Search, 
  BookmarkCheck, 
  Clock, 
  Store, 
  Phone, 
  MapPin, 
  Truck, 
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const MechanicReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<ReservationOrder[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('partfinder_reservations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setOrders(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const counterReservations = orders.filter(o => o.fulfillmentType === 'pickup' || o.status === 'ready_for_pickup' || o.status === 'shop_confirmed');

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex">
      <MechanicSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">Active Counter Reservations</h1>
              <div className="text-xs text-slate-400">Guaranteed 30-minute parts shelf hold tickets</div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="text-xs"
            icon={<Search className="w-3.5 h-3.5" />}
            onClick={() => navigate('/find-part')}
          >
            Find a Part
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Policy Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400 block">30-Minute Counter Guarantee Active</span>
              <p className="text-slate-400">
                Shops reserve physical shelf units for 30 minutes from confirmation. Present your 4-digit hold code at the counter for instant release without standing in general retail queues.
              </p>
            </div>
          </div>

          {/* Reservations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counterReservations.length === 0 ? (
              <div className="col-span-2 text-center py-16 bg-navy-900/60 rounded-3xl border border-slate-800 p-8 space-y-4">
                <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="text-slate-300 font-bold text-sm">No active counter reservations</div>
                <Button variant="primary" size="md" onClick={() => navigate('/find-part')}>
                  Search & Reserve a Part Now
                </Button>
              </div>
            ) : (
              counterReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-navy-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Bar with Code */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Hold Ticket #{res.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>30m Hold Active</span>
                      </span>
                    </div>

                    {/* Part Title */}
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{res.partName}</h3>
                      <div className="text-xs text-slate-400 font-mono">OEM #{res.partNumber} • {res.vehicle}</div>
                    </div>

                    {/* Hold Code Display */}
                    <div className="bg-navy-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Counter Release Code</div>
                      <div className="text-2xl font-black font-mono text-emerald-400 tracking-widest my-0.5">
                        RES-{res.id.replace(/\D/g, '').slice(0, 4) || '8492'}
                      </div>
                      <div className="text-[10px] text-slate-500">Show to shop billing counter</div>
                    </div>

                    {/* Shop Info */}
                    <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-brand-400" />
                        <span className="font-bold text-white">{res.shopName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{res.shopAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{res.shopPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                    <a
                      href={`tel:${res.shopPhone}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call Counter</span>
                    </a>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs"
                      icon={<Truck className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/track/${res.id}`)}
                    >
                      Track / Status
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
