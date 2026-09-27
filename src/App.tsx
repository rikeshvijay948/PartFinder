import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { FindPartPage } from './pages/FindPartPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ReservationPage } from './pages/ReservationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { MechanicDashboardPage } from './pages/MechanicDashboardPage';
import { MechanicOrdersPage } from './pages/MechanicOrdersPage';
import { MechanicReservationsPage } from './pages/MechanicReservationsPage';
import { ShopDashboardPage } from './pages/ShopDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const location = useLocation();

  const isPortalLayout = 
    location.pathname.startsWith('/mechanic') || 
    location.pathname.startsWith('/shop') || 
    location.pathname.startsWith('/admin');

  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
      {/* Navigation Header - Rendered on public and non-portal pages */}
      {!isPortalLayout && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ================= MECHANIC & SEARCH FLOW (PROTECTED) ================= */}
          <Route
            path="/find-part"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'SHOP', 'ADMIN']}>
                <FindPartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-results"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'SHOP', 'ADMIN']}>
                <SearchResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'SHOP', 'ADMIN']}>
                <ReservationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/:id"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'SHOP', 'ADMIN']}>
                <ReservationPage />
              </ProtectedRoute>
            }
          />

          {/* ================= ORDER TRACKING & DELIVERY (PROTECTED) ================= */}
          <Route
            path="/track-order"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'SHOP', 'ADMIN']}>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track/:orderId"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'SHOP', 'ADMIN']}>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />

          {/* ================= MECHANIC PORTAL (PROTECTED) ================= */}
          <Route
            path="/mechanic/dashboard"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']}>
                <MechanicDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanic/orders"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']}>
                <MechanicOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanic/reservations"
            element={
              <ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']}>
                <MechanicReservationsPage />
              </ProtectedRoute>
            }
          />

          {/* ================= SHOP PORTAL (PROTECTED) ================= */}
          <Route
            path="/shop/dashboard"
            element={
              <ProtectedRoute allowedRoles={['SHOP', 'ADMIN']}>
                <ShopDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/inventory"
            element={
              <ProtectedRoute allowedRoles={['SHOP', 'ADMIN']}>
                <ShopDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/reservations"
            element={
              <ProtectedRoute allowedRoles={['SHOP', 'ADMIN']}>
                <ShopDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/orders"
            element={
              <ProtectedRoute allowedRoles={['SHOP', 'ADMIN']}>
                <ShopDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ================= SUPER ADMIN PORTAL (PROTECTED) ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ================= CATCH-ALL REDIRECT ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer - Display on public landing and consumer pages */}
      {!isPortalLayout && !isAuthPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
