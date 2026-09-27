import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  BookmarkCheck, 
  ShoppingBag, 
  Truck, 
  Clock, 
  LogOut, 
  Wrench, 
  X,
  Store
} from 'lucide-react';

interface MechanicSidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const MechanicSidebar: React.FC<MechanicSidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/mechanic/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/find-part', label: 'Find a Part', icon: Search, highlight: true },
    { path: '/mechanic/reservations', label: 'My Reservations', icon: BookmarkCheck, badge: 'Active' },
    { path: '/mechanic/orders', label: 'Active Orders', icon: ShoppingBag },
    { path: '/track-order', label: 'Delivery Tracking', icon: Truck },
    { path: '/mechanic/orders?view=history', label: 'Order History', icon: Clock },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <div>
          {/* Top Logo */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div 
              onClick={() => handleNavigate('/')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Part<span className="text-brand-500">Finder</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mechanic Portal
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

          {/* User Workshop Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-navy-900/90 border border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Ramesh Kumar'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.workshopName || 'Apex Auto Garage'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Verified Workshop • Salem Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path.split('?')[0];

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : item.highlight
                      ? 'text-brand-300 hover:text-white hover:bg-brand-600/20 bg-brand-600/10 border border-brand-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
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

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
          >
            <Store className="w-4 h-4 text-slate-500" />
            <span>Public Home</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
