import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Wrench, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect');
  const stateMessage = (location.state as { message?: string } | null)?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('MECHANIC');
  const [error, setError] = useState<string | null>(null);

  const handleRedirectAfterLogin = (role: UserRole) => {
    if (redirectUrl) {
      navigate(decodeURIComponent(redirectUrl));
      return;
    }
    if (role === 'SHOP') {
      navigate('/shop/dashboard');
    } else if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/mechanic/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    login(email, selectedRole);
    handleRedirectAfterLogin(selectedRole);
  };

  const handleDemoClick = (role: UserRole) => {
    loginAsDemo(role);
    handleRedirectAfterLogin(role);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-500 p-0.5 shadow-xl group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black text-white tracking-tight">
                Part<span className="text-brand-500">Finder</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-1">
                Automotive Network
              </span>
            </div>
          </Link>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-3">
            Sign In to PartFinder
          </h2>
          <p className="text-xs text-slate-400">
            Access nearby spare-parts inventory, live reservations, and orders
          </p>
        </div>

        {/* Redirect Alert Notice */}
        {stateMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-xs text-brand-300 flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{stateMessage}</span>
          </div>
        )}

        {/* Card Form */}
        <div className="mt-6 bg-navy-900/90 py-8 px-6 sm:px-8 rounded-3xl border border-slate-800/90 shadow-2xl backdrop-blur-xl">
          
          {/* Quick 1-Click Demo Login Pills */}
          <div className="mb-6 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Demo Logins</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('MECHANIC')}
                className="p-2.5 rounded-xl bg-navy-950 hover:bg-brand-600/20 border border-slate-800 hover:border-brand-500 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-300">
                  <Wrench className="w-3.5 h-3.5 text-brand-400" />
                  <span>Mechanic</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Ramesh Kumar</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('SHOP')}
                className="p-2.5 rounded-xl bg-navy-950 hover:bg-emerald-600/20 border border-slate-800 hover:border-emerald-500 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-300">
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Shop</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Sri Lakshmi</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('ADMIN')}
                className="p-2.5 rounded-xl bg-navy-950 hover:bg-purple-600/20 border border-slate-800 hover:border-purple-500 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-purple-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Platform HQ</div>
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Account Role Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Sign in as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('MECHANIC');
                    if (!email || email.includes('shop')) setEmail('mechanic@partfinder.com');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    selectedRole === 'MECHANIC'
                      ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30'
                      : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Mechanic / Garage</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('SHOP');
                    if (!email || email.includes('mechanic')) setEmail('shop@partfinder.com');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    selectedRole === 'SHOP'
                      ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30'
                      : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Spare Parts Shop</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address / Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mechanic@partfinder.com"
                  className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field with Show/Hide */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-navy-950 text-white text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-navy-950 border-slate-700 text-brand-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full text-sm font-bold shadow-lg shadow-brand-600/30"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Account
              </Button>
            </div>
          </form>

          {/* Footer link to Register */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have a PartFinder account?{' '}
            <Link
              to={redirectUrl ? `/register?redirect=${redirectUrl}` : '/register'}
              className="text-brand-400 font-bold hover:text-brand-300 hover:underline inline-flex items-center gap-1"
            >
              <span>Create free account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
