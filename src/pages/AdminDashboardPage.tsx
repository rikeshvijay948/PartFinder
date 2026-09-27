import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ReservationOrder } from '../types';
import { 
  Menu, 
  Users, 
  Store, 
  Boxes, 
  BookmarkCheck, 
  Truck, 
  Activity, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Bell
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [reservations, setReservations] = useState<any[]>([
    { id: 'PF-8842', mechanic: 'Ramesh Kumar (Apex Auto)', shop: 'Sri Lakshmi Auto Spares', part: 'Clutch Release Bearing', vehicle: 'Tata Ace 2019', amount: '₹900', status: 'Confirmed', time: '12 min ago' },
    { id: 'PF-7910', mechanic: 'Murugan P. (Sri Murugan Motors)', shop: 'Kumar Automobiles', part: 'Brake Pad Set', vehicle: 'Tata Ace', amount: '₹1,200', status: 'Ready Pickup', time: '45 min ago' },
    { id: 'PF-6420', mechanic: 'Suresh V. (Modern Garage)', shop: 'ABC Auto Spares', part: 'Fuel Filter', vehicle: 'Mahindra Bolero', amount: '₹1,090', status: 'Delivered', time: '2 hours ago' },
    { id: 'PF-5512', mechanic: 'Karthik S. (Salem Diesels)', shop: 'Salem Motor Spares', part: 'Alternator Belt', vehicle: 'Tata 407', amount: '₹450', status: 'Delivered', time: '3 hours ago' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('partfinder_reservations');
    if (saved) {
      try {
        const parsed: ReservationOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map(o => ({
            id: o.id,
            mechanic: `${o.mechanicName} (${o.workshopName})`,
            shop: o.shopName,
            part: o.partName,
            vehicle: o.vehicle,
            amount: `₹${o.totalPrice}`,
            status: o.status === 'shop_confirmed' ? 'Confirmed' : o.status === 'ready_for_pickup' ? 'Ready Pickup' : o.status === 'delivered' ? 'Delivered' : o.status === 'request_sent' ? 'Pending' : o.status,
            time: o.createdAt || 'Just now',
          }));
          setReservations(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const stats = [
    { label: 'Total Mechanics', value: '142', subtext: '+12 this week', icon: Users, color: 'text-brand-400', glow: 'bg-brand-500/10' },
    { label: 'Connected Shops', value: '28', subtext: '4 pending verify', icon: Store, color: 'text-emerald-400', glow: 'bg-emerald-500/10' },
    { label: 'Catalog Parts', value: '1,840', subtext: '92% in stock', icon: Boxes, color: 'text-purple-400', glow: 'bg-purple-500/10' },
    { label: 'Active Reservations', value: `${reservations.length}`, subtext: '30m holds live', icon: BookmarkCheck, color: 'text-amber-400', glow: 'bg-amber-500/10' },
    { label: 'Active Deliveries', value: '6', subtext: 'Couriers en route', icon: Truck, color: 'text-blue-400', glow: 'bg-blue-500/10' },
    { label: 'Completed Orders', value: '482', subtext: '₹4.8L gross GMV', icon: CheckCircle2, color: 'text-teal-400', glow: 'bg-teal-500/10' },
  ];

  const connectedShops = [
    { name: 'Sri Lakshmi Auto Spares', location: '5 Roads, Salem', partsCount: 142, rating: 4.8, status: 'Verified Active' },
    { name: 'Kumar Automobiles', location: 'Meyyanur, Salem', partsCount: 98, rating: 4.6, status: 'Verified Active' },
    { name: 'ABC Auto Spares', location: 'Trichy Main Road, Salem', partsCount: 210, rating: 4.2, status: 'Verified Active' },
    { name: 'Salem Motor Spares', location: 'Shevapet Auto Market', partsCount: 164, rating: 4.7, status: 'Verified Active' },
  ];

  const activityLogs = [
    { time: '2 mins ago', text: 'Mechanic Ramesh Kumar reserved Clutch Release Bearing at Sri Lakshmi Auto Spares' },
    { time: '8 mins ago', text: 'Sri Lakshmi Auto Spares accepted reservation #PF-8842 (30m hold ticket issued)' },
    { time: '19 mins ago', text: 'Express Delivery Rider Murugan K. assigned to Order #PF-8842' },
    { time: '35 mins ago', text: 'Kumar Automobiles added 4 units of Tata Ace Brake Pad (BP-2044) to shelf' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex">
      <AdminSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  PartFinder Platform Control Panel
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                  Super Admin
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Salem Regional Automotive Cluster Hub (Tamil Nadu)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-800 text-slate-300 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                HQ
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-white leading-tight">Admin Console</div>
                <div className="text-[10px] text-purple-400">Master Level Access</div>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-950/60 via-navy-900 to-navy-900 rounded-3xl p-6 border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 inline-block">
                ⚡ Real-Time Network Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Salem Automotive Grid Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                426 mechanics and 28 verified retail counters connected. Average counter confirmation response time: <strong>1.8 minutes</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-2xl bg-navy-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Network Uptime</div>
                <div className="text-lg font-black text-emerald-400">99.98%</div>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-navy-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Riders</div>
                <div className="text-lg font-black text-brand-400">18 Bikes</div>
              </div>
            </div>
          </div>

          {/* 6 Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {stats.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.label}
                  className="bg-navy-900/90 rounded-2xl p-4 border border-slate-800 shadow-card-dark flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl ${st.glow} flex items-center justify-center ${st.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{st.value}</div>
                    <div className="text-[11px] font-bold text-slate-300 mt-0.5">{st.label}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80">
                    {st.subtext}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tables: Recent Reservations & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Recent Reservations Table */}
            <div className="lg:col-span-2 bg-navy-900/90 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-purple-400" />
                  <span>Recent Platform Reservations</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Grid Stream</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Order / Part</th>
                      <th className="py-2.5 px-3">Mechanic</th>
                      <th className="py-2.5 px-3">Shop</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reservations.map((r) => (
                      <tr key={r.id} className="hover:bg-navy-850/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{r.part}</div>
                          <div className="text-[10px] text-slate-400 font-mono">#{r.id} • {r.vehicle}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {r.mechanic}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {r.shop}
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          {r.amount}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === 'Confirmed'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : r.status === 'Ready Pickup'
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: System Activity Logs */}
            <div className="bg-navy-900/90 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>System Activity Feed</span>
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-3">
                {activityLogs.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-navy-950 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-brand-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Event Log
                      </span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{log.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Registered Shops Directory Preview */}
          <div className="bg-navy-900/90 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>Connected Retail Shops Network (Salem Hub)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Automotive retail outlets broadcasting live inventory</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {connectedShops.map((s) => (
                <div key={s.name} className="p-4 rounded-2xl bg-navy-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {s.status}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">⭐ {s.rating}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{s.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{s.location}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Listed Parts:</span>
                    <strong className="text-white">{s.partsCount} SKUs</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
