import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  BookmarkCheck, 
  ShoppingBag, 
  Users, 
  Store, 
  Settings, 
  Wrench, 
  ArrowLeft,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShopSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'reservations', label: 'Reservations', icon: BookmarkCheck, badge: '1 New' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '12' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'profile', label: 'Shop Profile', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-navy-950 border-r border-slate-800/90 z-50 transition-transform duration-300 flex flex-col justify-between ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand & Header */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-500 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Part<span className="text-brand-500">Finder</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Partner Portal
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shop Quick Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-navy-900/90 border border-slate-800/90">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Store className="w-3.5 h-3.5 text-brand-400" />
              <span>Sri Lakshmi Auto Spares</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-emerald-400 font-semibold">Online • Live Sync Active</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to Mechanic / Customer view */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => navigate('/find-part')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Mechanic Search</span>
          </button>
        </div>

      </aside>
    </>
  );
};
