import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const donationUrl = 'mailto:info@unibridge.org?subject=Donation%20Inquiry';
  const mailtoHref = `mailto:info@unibridge.org?subject=${encodeURIComponent('Newsletter signup')}&body=${encodeURIComponent(`Please add me to the newsletter list.\n\nEmail: ${email}`)}`;

  return (
    <footer className="bg-gradient-to-b from-unibridge-navy to-unibridge-blue text-white">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="max-w-md">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="UniBridge Logo" className="h-10 w-auto" />
              <div>
                <div className="text-xl font-semibold">UniBridge Foundation</div>
                <div className="text-blue-100 text-sm">Verified partnerships. Real-world impact.</div>
              </div>
            </div>

            <p className="mt-5 text-blue-50/90 leading-relaxed">
              UniBridge connects donors to verified cases and community partners, with clear purpose and follow‑up updates.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={donationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 text-base font-semibold bg-white text-unibridge-navy border-2 border-white rounded-md hover:bg-unibridge-navy hover:text-white hover:border-unibridge-navy transition-colors duration-300"
              >
                Donate
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 text-base font-semibold text-white border-2 border-white rounded-md hover:bg-white hover:text-unibridge-navy transition-colors duration-300"
              >
                Partner with us
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-blue-50">Explore</h4>
              <ul className="mt-4 space-y-3 text-blue-50/90">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/organizations" className="hover:text-white transition">Organizations</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-blue-50">Get Involved</h4>
              <ul className="mt-4 space-y-3 text-blue-50/90">
                <li><Link to="/" className="hover:text-white transition">Volunteer</Link></li>
                <li><Link to="/" className="hover:text-white transition">Open Opportunities</Link></li>
                <li><Link to="/" className="hover:text-white transition">Start a Partnership</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-blue-50">Transparency</h4>
              <ul className="mt-4 space-y-3 text-blue-50/90">
                <li><Link to="/" className="hover:text-white transition">How we verify</Link></li>
                <li><Link to="/" className="hover:text-white transition">Where funds go</Link></li>
                <li><Link to="/" className="hover:text-white transition">Annual updates</Link></li>
                <li><Link to="/" className="hover:text-white transition">Policies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-blue-50">Newsletter</h4>
              <p className="mt-4 text-blue-50/90 text-sm leading-relaxed">
                Monthly highlights, partner spotlights, and verified opportunities.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder:text-blue-100/80 text-white outline-none focus:ring-2 focus:ring-white/40"
                />
                <a
                  href={mailtoHref}
                  className="shrink-0 px-4 py-3 rounded-xl bg-white text-unibridge-navy font-semibold hover:bg-blue-50 transition"
                >
                  Join
                </a>
              </div>

              <div className="mt-5">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 text-blue-50/90 hover:text-white transition text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z" />
                  </svg>
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-blue-50/80 text-sm">
          <p>&copy; {new Date().getFullYear()} UniBridge Foundation. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a className="hover:text-white transition" href="mailto:info@unibridge.org">info@unibridge.org</a>
            <span className="hidden md:inline">•</span>
            <span>Impact built on verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
