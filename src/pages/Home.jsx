import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import IntroVideo from '../components/IntroVideo';
import About from '../components/About';
import Organizations from '../components/Organizations';
import Opportunities from '../components/Opportunities';
import Volunteer from '../components/Volunteer';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <IntroVideo />
      <About className="py-5" />
      <div className="pt-2" />
      <Opportunities className="py-5" />
      <div className="pt-2" />
      <Organizations className="py-5" />
      <div className="pt-2" />
      <Volunteer className="py-5" />
      <Footer />
    </div>
  );
};

export default Home;
