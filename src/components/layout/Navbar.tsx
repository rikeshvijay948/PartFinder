import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Wrench, 
  Search, 
  Store, 
  Truck, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenModal?: (type: string) => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'SHOP') return '/shop/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/mechanic/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
          : 'bg-navy-950/80 backdrop-blur-sm border-b border-slate-800/40 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-500 p-0.5 shadow-md group-hover:shadow-brand-500/30 transition-all">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Part<span className="text-brand-500">Finder</span>
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-0.5">
                Mechanic Spares Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-navy-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <Link
              to="/"
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
                location.pathname === '/' ? 'text-white bg-slate-800/90' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>

            {/* If logged in as shop, highlight shop portal */}
            {user?.role === 'SHOP' ? (
              <>
                <Link
                  to="/shop/dashboard"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/shop')
                      ? 'text-white bg-brand-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-brand-300" />
                  Shop Dashboard
                </Link>
                <Link
                  to="/track-order"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/track')
                      ? 'text-white bg-brand-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Live Tracking
                </Link>
              </>
            ) : user?.role === 'ADMIN' ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-white bg-purple-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  Admin Console
                </Link>
                <Link
                  to="/find-part"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/find-part') || location.pathname.startsWith('/search-results')
                      ? 'text-white bg-brand-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-brand-300" />
                  Search Parts
                </Link>
                <Link
                  to="/shop/dashboard"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/shop')
                      ? 'text-white bg-brand-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  Shop Preview
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/find-part"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/find-part') || location.pathname.startsWith('/search-results')
                      ? 'text-white bg-brand-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-brand-300" />
                  Find a Part
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/mechanic/dashboard"
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                        location.pathname === '/mechanic/dashboard'
                          ? 'text-white bg-brand-600 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-brand-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/mechanic/orders"
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                        location.pathname === '/mechanic/orders'
                          ? 'text-white bg-brand-600 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-indigo-400" />
                      Orders
                    </Link>
                  </>
                )}

                <Link
                  to="/track-order"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/track')
                      ? 'text-white bg-brand-600 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Track Order
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/shop/dashboard"
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                      location.pathname.startsWith('/shop')
                        ? 'text-white bg-brand-600 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    Shop Portal
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 bg-navy-900/80 border border-slate-800 py-1 px-3 rounded-2xl">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white max-w-[120px] truncate">{user.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : user.role === 'SHOP'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {user.workshopName || user.shopName || user.location || 'Member'}
                    </span>
                  </div>
                </Link>

                <div className="h-6 w-px bg-slate-800 mx-1" />

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  Login
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<UserPlus className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="px-3 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Portal
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-navy-900 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900/98 border-b border-slate-800/90 backdrop-blur-2xl px-4 pt-3 pb-6 mt-2 shadow-2xl animate-fade-in">
          {isAuthenticated && user && (
            <div className="p-3 mb-3 rounded-xl bg-navy-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {user.name}
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-brand-500/20 text-brand-400 rounded">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 bg-navy-900 rounded-lg border border-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <span>Home</span>
            </Link>

            <Link
              to="/find-part"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Search className="w-4 h-4 text-brand-400" />
              <span>Find a Part</span>
            </Link>

            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Track Order</span>
            </Link>

            {user?.role === 'MECHANIC' && (
              <>
                <Link
                  to="/mechanic/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-400" />
                  <span>Mechanic Dashboard</span>
                </Link>
                <Link
                  to="/mechanic/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  <ClipboardList className="w-4 h-4 text-indigo-400" />
                  <span>My Orders</span>
                </Link>
              </>
            )}

            <Link
              to="/shop/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Shop Dashboard</span>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-purple-300 hover:bg-purple-900/30"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Super Admin Console</span>
              </Link>
            )}

            {!isAuthenticated && (
              <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-300 bg-navy-800/80 rounded-xl border border-slate-700/80"
                >
                  Login
                </button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

