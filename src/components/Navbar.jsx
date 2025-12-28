import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="UniBridge Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-unibridge-navy">UniBridge</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
              About Us
            </Link>
            <Link to="/organizations" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
              Organizations
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
              Contact
            </Link>
            <Link 
              to="/admin" 
              className="bg-unibridge-blue text-white px-6 py-2 rounded-full hover:bg-unibridge-navy transition-colors font-medium"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link 
              to="/admin" 
              className="bg-unibridge-blue text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
