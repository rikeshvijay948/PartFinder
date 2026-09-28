import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MechanicSidebar } from '../components/mechanic/MechanicSidebar';
import { ReservationOrder } from '../types';
import { 
  Menu, 
  Search, 
  ShoppingBag, 
  BookmarkCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Store, 
  MapPin, 
  Bell, 
  Car, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Camera,
  Send
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { AIPartIdentifierModal } from '../components/mechanic/AIPartIdentifierModal';
import { InstantPartRequestModal } from '../components/mechanic/InstantPartRequestModal';

export const MechanicDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<ReservationOrder[]>([]);
  const [isAiIdentifierOpen, setIsAiIdentifierOpen] = useState(false);
  const [isInstantRequestOpen, setIsInstantRequestOpen] = useState(false);

  // Pre-seeded demo orders fallback
  const defaultOrders: ReservationOrder[] = [
    {
      id: 'PF-8842',
      shopName: 'Sri Lakshmi Auto Spares',
      vehicle: 'Tata Ace 2019',
      partName: 'Clutch Release Bearing',
      partNumber: '31210-87703',
      pricePerUnit: 850,
      quantity: 1,
      deliveryFee: 50,
      totalPrice: 900,
      fulfillmentType: 'delivery',
      deliveryAddress: 'Plot 4A, Auto Nagar, 5 Roads, Salem',
      deliveryEtaMins: 25,
      mechanicName: 'Ramesh Kumar',
      mechanicPhone: '+91 98420 77890',
      workshopName: 'Apex Auto Garage',
      workshopLocation: 'Salem, Tamil Nadu',
      status: 'shop_confirmed',
      createdAt: '15 mins ago',
      expiresAt: 'In 15 mins',
      shopPhone: '+91 98427 11223',
      shopAddress: 'No. 14, 5 Roads Junction, Salem',
      estimatedConfirmationTime: '< 2 mins',
      driver: {
        name: 'Murugan K.',
        phone: '+91 98421 88990',
        vehicleModel: 'Bajaj Pulsar 150 (TN-54-AB-2940)',
        rating: 4.9,
      },
    },
    {
      id: 'PF-7910',
      shopName: 'Kumar Automobiles',
      vehicle: 'Tata Ace',
      partName: 'Brake Pad Kit',
      partNumber: 'BP-2044',
      pricePerUnit: 1200,
      quantity: 1,
      deliveryFee: 0,
      totalPrice: 1200,
      fulfillmentType: 'pickup',
      mechanicName: 'Ramesh Kumar',
      mechanicPhone: '+91 98420 77890',
      workshopName: 'Apex Auto Garage',
      workshopLocation: 'Salem, Tamil Nadu',
      status: 'ready_for_pickup',
      createdAt: '1 hour ago',
      expiresAt: 'Completed',
      shopPhone: '+91 94432 55667',
      shopAddress: 'Omalur Main Road, Meyyanur, Salem',
      estimatedConfirmationTime: 'Instant',
    },
    {
      id: 'PF-6420',
      shopName: 'ABC Auto Spares',
      vehicle: 'Mahindra Bolero',
      partName: 'Fuel Filter Element',
      partNumber: 'FF-8812',
      pricePerUnit: 520,
      quantity: 2,
      deliveryFee: 50,
      totalPrice: 1090,
      fulfillmentType: 'delivery',
      mechanicName: 'Ramesh Kumar',
      mechanicPhone: '+91 98420 77890',
      workshopName: 'Apex Auto Garage',
      workshopLocation: 'Salem, Tamil Nadu',
      status: 'delivered',
      createdAt: 'Yesterday',
      expiresAt: 'Delivered',
      shopPhone: '+91 98420 44332',
      shopAddress: 'Trichy Main Road, Salem',
      estimatedConfirmationTime: 'Delivered',
    },
  ];

  // Load orders from shared localStorage
  useEffect(() => {
    const saved = localStorage.getItem('partfinder_reservations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Initialize with defaults if empty
    setOrders(defaultOrders);
    localStorage.setItem('partfinder_reservations', JSON.stringify(defaultOrders));
  }, []);

  const activeOrdersCount = orders.filter(o => o.status === 'shop_confirmed' || o.status === 'request_sent' || o.status === 'out_for_delivery').length;
  const reservedPartsCount = orders.filter(o => o.status === 'ready_for_pickup' || o.fulfillmentType === 'pickup').length;
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const pendingDeliveriesCount = orders.filter(o => o.fulfillmentType === 'delivery' && o.status !== 'delivered').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'request_sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span>Requested</span>
          </span>
        );
      case 'shop_confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Shop Confirmed</span>
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[11px] font-bold">
            <BookmarkCheck className="w-3 h-3" />
            <span>Ready for Pickup</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold animate-pulse">
            <Truck className="w-3 h-3" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex">
      {/* Sidebar */}
      <MechanicSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Mechanic Workshop Portal
              </h1>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{user?.workshopName || 'Apex Auto Garage'} • Salem Auto Cluster</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex text-xs"
              icon={<Search className="w-3.5 h-3.5" />}
              onClick={() => navigate('/find-part')}
            >
              Find a Part
            </Button>

            <button className="p-2 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-800 text-slate-300 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RK'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-white leading-tight">{user?.name || 'Ramesh Kumar'}</div>
                <div className="text-[10px] text-slate-400">Master Technician</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Salem Connected Auto Parts Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Good morning, {user?.name ? user.name.split(' ')[0] : 'Ramesh'}! 🔧
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                426 local spare parts shops are currently online with live shelf availability. Ready to find parts for your garage bays?
              </p>
            </div>

            <div className="relative z-10 shrink-0 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="text-xs sm:text-sm font-bold shadow-xl shadow-brand-600/30"
                icon={<Search className="w-4 h-4" />}
                onClick={() => navigate('/find-part')}
              >
                Search Nearby Spare Parts
              </Button>
            </div>
          </div>

          {/* ================= NEW WORKSHOP TOOLS: AI IDENTIFIER & INSTANT REQUEST ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Feature 1: AI Part Identifier Card */}
            <div className="bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-6 border border-brand-500/30 shadow-2xl relative overflow-hidden group hover:border-brand-500/60 transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-500/20 transition-all" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-lg shadow-brand-600/30">
                    <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                      <Camera className="w-6 h-6 text-brand-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-brand-400" />
                    <span>AI Vision Powered</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>AI Part Identifier</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Upload a photo to identify a possible spare part.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sample Recognition:</span>
                    <span className="font-bold text-emerald-400">87% Confidence</span>
                  </div>
                  <div className="font-semibold text-white truncate">
                    Clutch Release Bearing • Tata Ace 2019
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-bold shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 py-3"
                  icon={<Camera className="w-4 h-4" />}
                  onClick={() => setIsAiIdentifierOpen(true)}
                >
                  <span>Upload & Identify Part</span>
                </Button>
              </div>
            </div>

            {/* Feature 2: Instant Part Request Card */}
            <div className="bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden group hover:border-emerald-500/60 transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-600/30">
                    <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                      <Send className="w-6 h-6 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <span>Direct Shop Ping</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Instant Part Request
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Request a part directly from nearby local shops for rapid quotes and 30-min holds.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Instant Broadcast:</span>
                    <span className="font-bold text-brand-300">Pickup or Bay Delivery</span>
                  </div>
                  <div className="font-semibold text-white truncate">
                    Tata Ace 2019 • Clutch Bearing • Current Location
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-bold shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-500 border-emerald-500 flex items-center justify-center gap-2 py-3"
                  icon={<Send className="w-4 h-4" />}
                  onClick={() => setIsInstantRequestOpen(true)}
                >
                  <span>Request From Nearby Shops</span>
                </Button>
              </div>
            </div>

          </div>

          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-navy-900/85 rounded-2xl p-5 border border-slate-800 shadow-card-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-navy-950 px-2 py-0.5 rounded-full border border-slate-800">
                  In progress
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeOrdersCount}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Active Orders</div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                Awaiting counter & transit
              </div>
            </div>

            <div className="bg-navy-900/85 rounded-2xl p-5 border border-slate-800 shadow-card-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-navy-950 px-2 py-0.5 rounded-full border border-slate-800">
                  30m Holds
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {reservedPartsCount}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Reserved Parts</div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                Ready for counter pickup
              </div>
            </div>

            <div className="bg-navy-900/85 rounded-2xl p-5 border border-slate-800 shadow-card-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Express
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {pendingDeliveriesCount}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Pending Deliveries</div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                En route to workshop bay
              </div>
            </div>

            <div className="bg-navy-900/85 rounded-2xl p-5 border border-slate-800 shadow-card-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-navy-950 px-2 py-0.5 rounded-full border border-slate-800">
                  Total
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {completedOrdersCount}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Completed Orders</div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                Fulfilled successfully
              </div>
            </div>

          </div>

          {/* Recent Orders Section */}
          <div className="bg-navy-900/90 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Recent Workshop Part Orders & Reservations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live status synced directly with nearby shop counters
                </p>
              </div>
              <button
                onClick={() => navigate('/mechanic/orders')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1"
              >
                <span>View all ({orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Order / Part</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Shop</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Type & ETA</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-navy-850/60 transition-colors group">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{order.partName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">#{order.id} • OEM #{order.partNumber}</div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-300">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Car className="w-3.5 h-3.5 text-brand-400" />
                          <span>{order.vehicle}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-semibold text-white">{order.shopName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3.5 px-3 text-slate-300">
                        <div className="font-medium capitalize">{order.fulfillmentType}</div>
                        <div className="text-[11px] text-slate-400">
                          {order.fulfillmentType === 'delivery' ? `${order.deliveryEtaMins || 25} min ETA` : '30 min hold'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-white">
                        ₹{order.totalPrice}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs font-semibold py-1.5 px-3"
                          icon={<Truck className="w-3 h-3" />}
                          onClick={() => navigate(`/track/${order.id}`)}
                        >
                          Track
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Find Parts & Nearby Shops Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Quick search suggestions */}
            <div className="bg-navy-900/90 rounded-2xl p-5 border border-slate-800 shadow-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Quick Search Suggestions (Tata Ace / Commercial)
                </h4>
                <span className="text-[10px] text-brand-400 font-semibold">Popular</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Clutch Release Bearing', 'Brake Pads', 'Oil Filter', 'Alternator', 'Air Filter', 'Headlight Unit'].map((item) => (
                  <button
                    key={item}
                    onClick={() => navigate(`/find-part?part=${encodeURIComponent(item)}&make=Tata&model=Ace&year=2019`)}
                    className="px-3 py-1.5 rounded-xl bg-navy-950 hover:bg-brand-600/20 text-slate-300 hover:text-white border border-slate-800 hover:border-brand-500/50 text-xs font-medium transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby Verified Shops */}
            <div className="bg-navy-900/90 rounded-2xl p-5 border border-slate-800 shadow-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Nearby Verified Spare Shops (Salem)
                </h4>
                <span className="text-[10px] text-emerald-400 font-semibold">🟢 3 Online</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-slate-800/80">
                  <div>
                    <div className="font-bold text-white">Sri Lakshmi Auto Spares</div>
                    <div className="text-[11px] text-slate-400">5 Roads • 1.8 km away • ⭐ 4.8</div>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">In Stock</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-slate-800/80">
                  <div>
                    <div className="font-bold text-white">Kumar Automobiles</div>
                    <div className="text-[11px] text-slate-400">Meyyanur • 3.4 km away • ⭐ 4.6</div>
                  </div>
                  <span className="text-amber-400 font-bold text-[11px]">Limited Stock</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* AI Part Identifier Modal */}
      <AIPartIdentifierModal
        isOpen={isAiIdentifierOpen}
        onClose={() => setIsAiIdentifierOpen(false)}
      />

      {/* Instant Part Request Modal */}
      <InstantPartRequestModal
        isOpen={isInstantRequestOpen}
        onClose={() => setIsInstantRequestOpen(false)}
      />
    </div>
  );
};
