import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Store, 
  CheckCircle2, 
  Phone, 
  Check, 
  Hourglass, 
  Sparkles, 
  Navigation, 
  User, 
  ShieldCheck, 
  ArrowLeft,
  PackageCheck,
  Wrench
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ReservationOrder, OrderStatus } from '../types';

export const TrackOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const targetId = orderId || searchParams.get('id') || '';
  const [inputOrderId, setInputOrderId] = useState(targetId);
  const [order, setOrder] = useState<ReservationOrder | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800); // 30 mins

  // Load order from localStorage or create realistic demo order
  useEffect(() => {
    // 1. Check shared reservations list
    const savedList = localStorage.getItem('partfinder_reservations');
    if (savedList) {
      try {
        const parsedList: ReservationOrder[] = JSON.parse(savedList);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          const found = targetId ? parsedList.find(o => o.id.toLowerCase() === targetId.toLowerCase()) : parsedList[0];
          if (found) {
            setOrder(found);
            setInputOrderId(found.id);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Check active order
    const stored = localStorage.getItem('partfinder_active_order');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ReservationOrder;
        if (!targetId || targetId === parsed.id) {
          setOrder(parsed);
          setInputOrderId(parsed.id);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Fallback realistic demo order
    const fallbackOrder: ReservationOrder = {
      id: targetId || 'PF-8842',
      shopName: 'Sri Lakshmi Auto Spares',
      vehicle: '2019 Tata Ace',
      partName: 'Clutch Release Bearing',
      partNumber: '31210-87703',
      pricePerUnit: 850,
      quantity: 1,
      deliveryFee: 50,
      totalPrice: 900,
      fulfillmentType: 'delivery',
      deliveryAddress: 'Plot 4A, Auto Nagar Industrial Area, 5 Roads, Salem',
      deliveryDistanceKm: 2.4,
      deliveryEtaMins: 25,
      mechanicName: 'Ramesh Kumar',
      mechanicPhone: '+91 98420 77890',
      workshopName: 'Apex Auto Workshop',
      workshopLocation: 'Salem, Tamil Nadu',
      status: 'shop_confirmed',
      createdAt: '12 mins ago',
      expiresAt: new Date(Date.now() + 28 * 60 * 1000).toISOString(),
      shopPhone: '+91 98427 11223',
      shopAddress: '14/B, 5 Roads Main Junction, Salem',
      estimatedConfirmationTime: '< 2 mins',
      driver: {
        name: 'Murugan K.',
        phone: '+91 98421 88990',
        vehicleModel: 'Bajaj Pulsar 150 (TN-54-AB-2940)',
        rating: 4.9,
        currentLocationDesc: 'Passing Meyyanur Roundabout • 1.1 km to workshop',
      },
    };
    setOrder(fallbackOrder);
    if (!targetId) setInputOrderId(fallbackOrder.id);
  }, [targetId]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOrderId.trim()) {
      navigate(`/track/${encodeURIComponent(inputOrderId.trim())}`);
    }
  };

  // Status simulation triggers for live demo
  const handleAdvanceStatus = (newStatus: OrderStatus) => {
    if (order) {
      const updated: ReservationOrder = { ...order, status: newStatus };
      setOrder(updated);
      localStorage.setItem('partfinder_active_order', JSON.stringify(updated));

      // Also update in shared reservations
      const savedList = localStorage.getItem('partfinder_reservations');
      if (savedList) {
        try {
          const parsedList: ReservationOrder[] = JSON.parse(savedList);
          const newArr = parsedList.map(o => o.id === updated.id ? updated : o);
          localStorage.setItem('partfinder_reservations', JSON.stringify(newArr));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  if (!order) return null;

  // 5 Stages Definition
  const stages = [
    { key: 'request_sent', title: 'Part Reserved', desc: 'Dispatched to shop counter', icon: Hourglass },
    { key: 'shop_confirmed', title: 'Shop Confirmed', desc: 'Shelf stock verified by manager', icon: CheckCircle2 },
    { key: 'ready_for_pickup', title: order.fulfillmentType === 'delivery' ? 'Part Packed' : 'Ready for Pickup', desc: order.fulfillmentType === 'delivery' ? 'Packed in tamper-proof seal' : '30-minute counter hold active', icon: PackageCheck },
    { key: 'out_for_delivery', title: order.fulfillmentType === 'delivery' ? 'Out for Delivery' : 'At Shop Counter', desc: order.fulfillmentType === 'delivery' ? 'Courier en route to workshop bay' : 'Present code at pickup counter', icon: Truck },
    { key: 'delivered', title: order.fulfillmentType === 'delivery' ? 'Delivered' : 'Collected', desc: 'Handover complete at garage bay', icon: Check },
  ];

  const getStageIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'request_sent': return 0;
      case 'shop_confirmed': return 1;
      case 'ready_for_pickup': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStageIdx = getStageIndex(order.status);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/mechanic/dashboard')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Mechanic Dashboard</span>
          </button>

          {/* Quick Search Another Order */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="Search Order / Res ID"
              className="bg-navy-900 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 font-mono uppercase w-48"
            />
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              Search
            </Button>
          </form>
        </div>

        {/* Order Header Summary Banner */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20 font-mono">
                  #{order.id}
                </span>
                <span className="text-xs text-slate-400">Created: {order.createdAt}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {order.partName}
              </h1>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                Compatible: <strong>{order.vehicle}</strong> • OEM #{order.partNumber}
              </div>
            </div>

            {/* Hold / Delivery Badge */}
            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 bg-navy-950 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">30-Min Shelf Hold</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {formatTime(secondsRemaining)}
              </div>
              <div className="text-[10px] text-slate-400">Expires automatically</div>
            </div>
          </div>

          {/* Key attributes row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-navy-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Shop Counter</span>
              <strong className="text-white truncate block">{order.shopName}</strong>
            </div>

            <div className="p-3 bg-navy-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Fulfillment Type</span>
              <strong className="text-white capitalize block">{order.fulfillmentType === 'delivery' ? 'Express Courier' : 'Counter Pickup'}</strong>
            </div>

            <div className="p-3 bg-navy-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Estimated ETA</span>
              <strong className="text-emerald-400 block">{order.fulfillmentType === 'delivery' ? `${order.deliveryEtaMins || 25} Minutes` : '< 2 min at counter'}</strong>
            </div>

            <div className="p-3 bg-navy-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Price</span>
              <strong className="text-white block font-mono font-bold">₹{order.totalPrice} ({order.quantity} unit)</strong>
            </div>
          </div>
        </div>

        {/* 5-STAGE PROGRESSION TIMELINE */}
        <div className="bg-navy-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Order & Dispatch Status Progression
              </h2>
              <p className="text-xs text-slate-400">Real-time status updates broadcast from shop counter</p>
            </div>

            <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/30 uppercase">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Horizontal for Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {stages.map((stg, idx) => {
              const Icon = stg.icon;
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div
                  key={stg.key}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-brand-600/20 border-brand-500 shadow-lg shadow-brand-600/20'
                      : isPast
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-navy-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCurrent
                        ? 'bg-brand-600 text-white animate-pulse'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-navy-900 text-slate-500'
                    }`}>
                      {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className={`text-xs font-bold ${isCurrent ? 'text-brand-300' : isPast ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {stg.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                      {stg.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIMULATED MAP VISUAL & DRIVER CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Map Simulation Panel (2 cols) */}
          <div className="md:col-span-2 bg-navy-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Simulated Transit Route (Salem Hub)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-slate-800">
                Simulated GPS Route
              </span>
            </div>

            {/* Visual Route Flow: SHOP -> DRIVER -> WORKSHOP */}
            <div className="p-5 rounded-2xl bg-navy-950 border border-slate-800/80 space-y-4">
              
              {/* Point A: Shop */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-bold">{order.shopName}</strong>
                    <span className="text-[10px] text-emerald-400 font-semibold">Origin Point</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{order.shopAddress}</div>
                </div>
              </div>

              {/* Connecting line with active courier */}
              <div className="ml-4 pl-4 border-l-2 border-dashed border-brand-500/50 py-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-brand-300 font-semibold">
                  <Truck className="w-4 h-4 text-brand-400 animate-bounce" />
                  <span>Murugan K. • En Route (Estimated 2.4 km)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {order.driver?.currentLocationDesc || 'Transit via Omalur Road • Avg speed 32 km/h'}
                </div>
              </div>

              {/* Point B: Workshop */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-bold">{order.workshopName}</strong>
                    <span className="text-[10px] text-brand-400 font-semibold">Destination Bay</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{order.deliveryAddress || order.workshopLocation}</div>
                </div>
              </div>

            </div>
          </div>

          {/* Driver & Shop Hotline Card (1 col) */}
          <div className="bg-navy-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" />
                <span>Express Courier Details</span>
              </h3>

              {/* Driver Info */}
              <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    MK
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{order.driver?.name || 'Murugan K.'}</div>
                    <div className="text-[11px] text-amber-400 font-semibold">⭐ {order.driver?.rating || 4.9} (PartFinder Express)</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
                  Vehicle: <strong className="text-white">{order.driver?.vehicleModel || 'Bajaj Pulsar 150 (TN-54-AB-2940)'}</strong>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={`tel:${order.driver?.phone || '+91 98421 88990'}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Delivery Courier</span>
                </a>

                <a
                  href={`tel:${order.shopPhone}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Shop Counter</span>
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified courier with OTP receipt handover</span>
            </div>
          </div>

        </div>

        {/* PROTOTYPE STATUS PROGRESSION SIMULATOR BAR */}
        <div className="bg-navy-900/90 rounded-3xl border border-brand-500/30 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Prototype Demo Status Progression Simulator
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Click to preview each stage in real time</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => handleAdvanceStatus('request_sent')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                order.status === 'request_sent'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              1. Request Sent
            </button>

            <button
              onClick={() => handleAdvanceStatus('shop_confirmed')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                order.status === 'shop_confirmed'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              2. Shop Confirmed
            </button>

            <button
              onClick={() => handleAdvanceStatus('ready_for_pickup')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                order.status === 'ready_for_pickup'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                  : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              3. Part Packed / Ready
            </button>

            <button
              onClick={() => handleAdvanceStatus('out_for_delivery')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                order.status === 'out_for_delivery'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              4. Out for Delivery
            </button>

            <button
              onClick={() => handleAdvanceStatus('delivered')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                order.status === 'delivered'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              5. Delivered
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
