import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Boxes, 
  BookmarkCheck, 
  ShoppingBag, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
  activeSection,
  onSelectSection,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Mechanics & Users', icon: Users, badge: '142' },
    { id: 'shops', label: 'Connected Shops', icon: Store, badge: '28' },
    { id: 'parts', label: 'Global Parts Catalog', icon: Boxes },
    { id: 'reservations', label: 'Reservations', icon: BookmarkCheck, badge: '14 Live' },
    { id: 'orders', label: 'Deliveries & Orders', icon: ShoppingBag },
    { id: 'reports', label: 'Platform Audit Logs', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-navy-950 border-r border-slate-800/90 z-50 transition-transform duration-300 flex flex-col justify-between ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-brand-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Part<span className="text-brand-500">Finder</span>
                </span>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Super Admin HQ
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

          {/* Admin User Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-navy-900/90 border border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                HQ
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Super Admin'}</div>
                <div className="text-[11px] text-purple-300 truncate">Platform Administrator</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
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
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
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

        {/* Bottom Switch & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5">
          <button
            onClick={() => navigate('/')}
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
