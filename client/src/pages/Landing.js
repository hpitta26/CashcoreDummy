import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PulsatingCircle from '../components/PulsatingCircle';
import Carousel from '../components/Carousel';

const Landing = () => {
  const [email, setEmail] = useState('');
  const window_width = window.innerWidth;
  const window_height = window.innerHeight;
  const master_measure = Math.sqrt(window_height * window_width); 

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Header */}
      {/* <header className="w-full">
        <div className="flex items-center justify-between p-4">
          <img src="/assets/logo.svg" alt="Logo" className="h-8" />
          
          <nav className="flex gap-8">
            <a href="#about" className="hover:text-[#4cb086] transition-colors">About</a>
            <a href="#resources" className="hover:text-[#4cb086] transition-colors">Resources</a>
            <a href="#contact" className="hover:text-[#4cb086] transition-colors">Contact Us</a>
          </nav>

          <div className="flex gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 border border-[#299f62] rounded-lg hover:bg-[#299f62] transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-gradient-to-r from-[#299f62] to-[#4db088] rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="flex items-center justify-center" style={{ width: window_width, height: window_height * 0.8 }}>
        <div className="flex flex-col items-center justify-center" style={{ width: window_width * 0.4,height: window_height * 0.8 }}>
          <PulsatingCircle win_width={window_width} win_height={window_height} />
          <h1 className="font-bold font-space-grotesk z-10 bg-transparent" style={{ fontSize: Math.round(master_measure * 0.082) }}>
            <div className="text-white">Control</div>
            <div className="text-primary-green">Your</div>
            <div className="text-white">Finances</div>
          </h1>
        </div>
      </section>
      

      {/* Mission Section */}
      <section style={{ width: window_width, height: window_height * 0.5, paddingTop: Math.round(master_measure * 0.1)}}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-primary-green mb-2">Our Mission</p>
          <h2 className="font-bold mb-2" style={{ fontSize: Math.round(master_measure * 0.04)}}>Financial Freedom Starts Here!</h2>
          <p className="text-gray-300">
            We believe money management is a crucial topic that is not covered enough in our schools, 
            leaving individuals uninformed. We aim to offer the tools needed for you to successfully 
            manage personal finances.
          </p>
        </div>
        <Carousel component_array={[]} carousel_width={window_width} carousel_height={window_height * 0.25}/>  
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#222222] py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative">
            <img 
              src="/assets/mail-icon.svg" 
              alt="Mail" 
              className="absolute -top-10 -left-10 w-16 h-16"
            />
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter!</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to receive updates with the latest insights, tips, and alerts.
            </p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 px-4 py-2 bg-transparent border border-[#1aa47b] rounded-l-lg text-white focus:outline-none focus:border-[#4db088]"
              />
              <button 
                onClick={() => handleSubscribe(email)}
                className="px-6 py-2 bg-[#1aa47b] rounded-r-lg hover:bg-[#4db088] transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <img src="/assets/logo.svg" alt="Logo" className="h-8" />
            <div className="flex gap-8">
              <a href="/privacy" className="hover:text-[#4cb086] transition-colors">Privacy Policy</a>
              <a href="/faq" className="hover:text-[#4cb086] transition-colors">FAQ</a>
              <a href="/contact" className="hover:text-[#4cb086] transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="text-center text-gray-400">
            ©CashCore 2024. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const handleSubscribe = (email) => {
  console.log(email);
  // Handle newsletter subscription
};

export default Landing;