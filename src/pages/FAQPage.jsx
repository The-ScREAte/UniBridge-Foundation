import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* FAQ Section */}
      <section className="ub-section">
        <div className="ub-container max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-unibridge-navy">Frequently asked questions</h1>
            <p className="mt-3 text-gray-600 text-lg">The donor‑trust questions people ask first.</p>
          </div>

          <div className="grid gap-4">
            {[ 
              {
                q: 'How do you verify cases?',
                a: 'We verify through trusted partners, documentation when available, and direct confirmation before anything is published.'
              },
              {
                q: 'Does my donation go directly to the person or project?',
                a: 'Donations are tied to a specific verified need and delivered through vetted partners or direct confirmation, with tracking and follow‑up.'
              },
              {
                q: 'Will I receive updates after donating?',
                a: 'Yes. We share progress updates so you can see what your support achieved.'
              },
              {
                q: 'How can an organization submit a case for verification?',
                a: 'Contact us with your organization details and the case context. We\'ll follow up with verification steps and documentation requirements.'
              },
              {
                q: 'Is my donation tax-deductible?',
                a: 'Yes, UniBridge Foundation is a registered 501(c)(3) nonprofit organization, and all donations are tax-deductible to the fullest extent allowed by law.'
              },
              {
                q: 'How long does the verification process take?',
                a: 'The verification process typically takes 2-4 weeks depending on the complexity of the case and availability of documentation.'
              },
              {
                q: 'Can I choose which project or person to support?',
                a: 'Yes, you can browse verified cases and opportunities and choose exactly where your donation goes.'
              },
              {
                q: 'What percentage of my donation goes directly to the cause?',
                a: 'We maintain full transparency in our operations. Administrative costs are kept minimal, with the majority of funds going directly to verified needs.'
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-lg font-display font-semibold text-unibridge-navy">{item.q}</span>
                  <span className="shrink-0 h-9 w-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-unibridge-navy group-open:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-unibridge-navy border-2 border-unibridge-navy rounded-md hover:bg-unibridge-navy hover:text-white transition-colors duration-300"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
