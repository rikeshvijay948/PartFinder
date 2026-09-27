import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../common/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`/login?redirect=${returnUrl}`}
        state={{ message: 'Please sign in to continue.' }}
        replace
      />
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const getDashboardPath = (role: UserRole) => {
      switch (role) {
        case 'SHOP':
          return '/shop/dashboard';
        case 'ADMIN':
          return '/admin/dashboard';
        case 'MECHANIC':
        default:
          return '/mechanic/dashboard';
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-navy-900/90 rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl backdrop-blur-xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Your account is signed in as a <strong className="text-brand-400 uppercase">{user.role}</strong>. This section requires <strong className="text-white uppercase">{allowedRoles.join(' / ')}</strong> access.
            </p>
          </div>

          <div className="p-3.5 bg-navy-950 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Role security active</span>
            </span>
            <span className="font-mono text-slate-300">{user.email}</span>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(getDashboardPath(user.role))}
            >
              Go to Your {user.role === 'SHOP' ? 'Shop' : user.role === 'ADMIN' ? 'Admin' : 'Mechanic'} Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

