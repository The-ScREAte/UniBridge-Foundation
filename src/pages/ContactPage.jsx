import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { messageService } from '../utils/storage';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save to Supabase
    const newMessage = {
      ...formData,
      status: 'unread'
    };
    
    await messageService.addMessage(newMessage);

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-unibridge-navy mb-4">
              Contact Us
            </h1>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600">
              Get in touch with UniBridge Foundation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-unibridge-navy mb-6">
                  Let's Connect
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Whether you're interested in partnering with us, volunteering, or learning more 
                  about our work, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-unibridge-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-unibridge-navy mb-1">Email</h3>
                    <p className="text-gray-600">info@unibridge.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-unibridge-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-unibridge-navy mb-1">Location</h3>
                    <p className="text-gray-600">Making a difference worldwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-unibridge-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-unibridge-navy mb-1">Response Time</h3>
                    <p className="text-gray-600">Within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-unibridge-navy mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-unibridge-blue text-white py-3 rounded-lg font-semibold hover:bg-unibridge-navy transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
