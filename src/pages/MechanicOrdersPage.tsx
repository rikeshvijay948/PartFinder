import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MechanicSidebar } from '../components/mechanic/MechanicSidebar';
import { ReservationOrder } from '../types';
import { 
  Menu, 
  Search, 
  ShoppingBag, 
  Truck, 
  Store, 
  Car, 
  Calendar
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const MechanicOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('view') === 'history' ? 'history' : 'active';

  const [activeTab, setActiveTab] = useState<'active' | 'history'>(initialTab);
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

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'rejected');
  const historyOrders = orders.filter(o => o.status === 'delivered' || o.status === 'rejected');
  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

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
              <h1 className="text-base sm:text-lg font-bold text-white">Workshop Orders</h1>
              <div className="text-xs text-slate-400">Live bay deliveries & counter holds</div>
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
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-navy-900 text-slate-400 hover:text-white'
              }`}
            >
              Active Orders ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-navy-900 text-slate-400 hover:text-white'
              }`}
            >
              Completed History ({historyOrders.length})
            </button>
          </div>

          {/* Orders Cards Grid */}
          <div className="space-y-4">
            {displayedOrders.length === 0 ? (
              <div className="text-center py-16 bg-navy-900/60 rounded-3xl border border-slate-800 p-8 space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="text-slate-300 font-bold text-sm">No {activeTab} orders found</div>
                <Button variant="primary" size="md" onClick={() => navigate('/find-part')}>
                  Search & Order Spare Parts
                </Button>
              </div>
            ) : (
              displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-navy-900/85 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-card-dark flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                        #{order.id}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {order.createdAt}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        order.status === 'delivered'
                          ? 'bg-slate-800 text-slate-300'
                          : order.status === 'out_for_delivery'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-base font-bold text-white">
                      {order.partName} <span className="text-xs font-normal text-slate-400">(OEM #{order.partNumber})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-brand-400" />
                        <span>{order.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{order.shopName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="capitalize">{order.fulfillmentType} ({order.fulfillmentType === 'delivery' ? '₹50 courier' : 'Counter hold'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-start md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Price</div>
                      <div className="text-lg font-black text-white">₹{order.totalPrice}</div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      icon={<Truck className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/track/${order.id}`)}
                    >
                      Track Order
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
