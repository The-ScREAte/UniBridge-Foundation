import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { authService } from './utils/storage';
import { organizationService, opportunityService } from './utils/storage';
import Home from './pages/Home';

// Lazy load secondary routes only
const AboutPage = lazy(() => import('./pages/AboutPage'));
const OrganizationsPage = lazy(() => import('./pages/OrganizationsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const OrganizationDetail = lazy(() => import('./pages/OrganizationDetail'));
const OpportunityDetail = lazy(() => import('./pages/OpportunityDetail'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/admin" />;
};

// Scroll to top on route changes so each page starts at the top
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash]);
  return null;
};

function App() {
  useEffect(() => {
    const warmCaches = async () => {
      try {
        await Promise.all([
          organizationService.getAllOrganizations(),
          opportunityService.getAllOpportunities(),
        ]);
      } catch (err) {
        console.warn('Prefetch failed (non-blocking):', err);
      }
    };
    warmCaches();
  }, []);

  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unibridge-blue mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/organization/:id" element={<OrganizationDetail />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
