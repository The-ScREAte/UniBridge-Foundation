import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { authService } from './utils/storage';
import { organizationService, opportunityService } from './utils/storage';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import OrganizationDetail from './pages/OrganizationDetail';
import OpportunityDetail from './pages/OpportunityDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

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

  return (
    <Router>
      <ScrollToTop />
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
    </Router>
  );
}

export default App;
