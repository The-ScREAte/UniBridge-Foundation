import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './utils/storage';
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

function App() {
  return (
    <Router>
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
