import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-unibridge-navy text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <img src="/logo.png" alt="UniBridge Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold">UniBridge Foundation Inc.</span>
          </div>
          <p className="text-blue-200 text-sm">
            Connecting opportunities through verified partnerships.
          </p>
        </div>
        
        <div className="border-t border-blue-800 mt-6 pt-6 text-center text-blue-300 text-xs">
          <p>&copy; 2024 UniBridge Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
