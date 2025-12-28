import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim();
  }, [location.search]);

  const effectiveQuery = query.trim() || currentQuery;

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/organizations?q=${encodeURIComponent(q)}` : '/organizations');
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img src="/logo.png" alt="UniBridge Logo" className="h-8 sm:h-12 w-auto" />
            <span className="text-base sm:text-2xl font-bold text-unibridge-navy leading-none">UniBridge</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
                About
              </Link>
              <Link to="/organizations" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
                Organizations
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-unibridge-blue transition-colors font-medium">
                Contact
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-28 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none transition"
                placeholder="Search partner organizations…"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-unibridge-blue text-white text-sm font-semibold hover:bg-unibridge-navy transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-5 h-5 text-unibridge-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none transition"
                placeholder="Search organizations…"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-2xl bg-unibridge-blue text-white text-sm font-semibold hover:bg-unibridge-navy transition-colors"
              >
                Go
              </button>
            </form>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link onClick={() => setMobileOpen(false)} to="/" className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-unibridge-navy font-medium hover:border-unibridge-blue transition">
                Home
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/about" className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-unibridge-navy font-medium hover:border-unibridge-blue transition">
                About
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/organizations" className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-unibridge-navy font-medium hover:border-unibridge-blue transition">
                Organizations
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/contact" className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-unibridge-navy font-medium hover:border-unibridge-blue transition">
                Contact
              </Link>
            </div>
            {effectiveQuery && (
              <p className="mt-3 text-xs text-gray-500">Searching: “{effectiveQuery}”</p>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
