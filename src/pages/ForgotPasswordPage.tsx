import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

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
                Account Recovery
              </span>
            </div>
          </Link>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-3">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-400">
            Enter your registered email address and we'll send you a recovery link
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-6 bg-navy-900/90 py-8 px-6 sm:px-8 rounded-3xl border border-slate-800/90 shadow-2xl backdrop-blur-xl">
          
          {submitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  We've sent password reset instructions and a verification code to <strong className="text-white">{email}</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-navy-950 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Prototype Simulation OTP
                </div>
                <div className="font-mono text-lg font-bold text-white tracking-widest">
                  492 - 108
                </div>
              </div>

              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="md" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mechanic@partfinder.com"
                    className="w-full bg-navy-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full text-sm font-bold shadow-lg shadow-brand-600/30"
                >
                  Send Reset Link
                </Button>
              </div>

              <div className="pt-3 border-t border-slate-800 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
