import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Wrench, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Store, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect');

  const [role, setRole] = useState<UserRole>('MECHANIC');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Salem');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const success = register({
      name,
      email,
      phone,
      role,
      workshopName: role === 'MECHANIC' ? (businessName || `${name}'s Garage`) : undefined,
      shopName: role === 'SHOP' ? (businessName || `${name} Auto Spares`) : undefined,
      location: city ? `${city}, Tamil Nadu` : 'Salem, Tamil Nadu',
    });

    if (success) {
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl));
      } else if (role === 'SHOP') {
        navigate('/shop/dashboard');
      } else {
        navigate('/mechanic/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        
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
                Mechanic Spares Network
              </span>
            </div>
          </Link>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-3">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-400">
            Join hundreds of repair workshops and spare parts retailers across Salem
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-6 bg-navy-900/90 py-8 px-6 sm:px-8 rounded-3xl border border-slate-800/90 shadow-2xl backdrop-blur-xl">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Account Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                I am a: <span className="text-brand-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setRole('MECHANIC')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                    role === 'MECHANIC'
                      ? 'bg-brand-600/20 border-brand-500 shadow-lg shadow-brand-600/20'
                      : 'bg-navy-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${
                    role === 'MECHANIC' ? 'bg-brand-600 text-white' : 'bg-navy-900 text-slate-400'
                  }`}>
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Mechanic / Garage</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Search, reserve & get bay delivery</span>
                </div>

                <div
                  onClick={() => setRole('SHOP')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                    role === 'SHOP'
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : 'bg-navy-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${
                    role === 'SHOP' ? 'bg-emerald-600 text-white' : 'bg-navy-900 text-slate-400'
                  }`}>
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Spare Parts Shop</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">List live shelf inventory & orders</span>
                </div>
              </div>
            </div>

            {/* Full Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name <span className="text-brand-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {role === 'MECHANIC' ? 'Workshop / Garage Name' : 'Shop / Dealership Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    {role === 'MECHANIC' ? <Wrench className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={role === 'MECHANIC' ? 'e.g. Apex Auto Works' : 'e.g. Sri Lakshmi Spares'}
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address <span className="text-brand-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mobile Phone <span className="text-brand-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98420 12345"
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                City / Auto Cluster Area
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Salem - 5 Roads"
                  className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password <span className="text-brand-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Confirm Password <span className="text-brand-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms notice */}
            <p className="text-[11px] text-slate-400 pt-1">
              By creating an account, you agree to PartFinder's 30-Minute Counter Reservation terms and verified stock policies.
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full text-sm font-bold shadow-lg shadow-brand-600/30"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Create Account & Get Started
              </Button>
            </div>
          </form>

          {/* Footer link to Login */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to={redirectUrl ? `/login?redirect=${redirectUrl}` : '/login'}
              className="text-brand-400 font-bold hover:text-brand-300 hover:underline inline-flex items-center gap-1"
            >
              <span>Sign in here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
