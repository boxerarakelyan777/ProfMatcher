'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useSpring as useReactSpring, animated } from 'react-spring';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY = useTransform(smoothScrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(smoothScrollYProgress, [0, 1], ['0%', '100%']);

  const [{ glowStrength }, setGlowStrength] = useReactSpring(() => ({ glowStrength: 0 }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWaitlistClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic client-side validation
      if (!name.trim() || !email.trim()) {
        throw new Error('Name and email are required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }

      // Add to Firestore
      await addDoc(collection(db, 'waitlist'), {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        timestamp: serverTimestamp()
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize particle effects, mouse interaction effects, etc.
  }, []);

  return (
    <motion.div 
      ref={heroRef} 
      className="relative min-h-screen overflow-hidden bg-[#F2F4F6] pt-4 sm:pt-0"
      style={{ backgroundPositionY: backgroundY }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] to-[#8E44AD] opacity-10 animate-gradient-x"></div>
      
      {/* Diagonal hexagon pattern with 3D glow */}
      <div className="absolute inset-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <pattern id="hexagons" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <path d="M75,0 L150,43.3 L150,129.9 L75,173.2 L0,129.9 L0,43.3 Z" fill="none" stroke="rgba(52, 152, 219, 0.15)" strokeWidth="1" filter="url(#glow)">
                <animate attributeName="stroke-width" values="1;2;1" dur="4s" repeatCount="indefinite" />
              </path>
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="70%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hexagons)" />
          <rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
        </svg>
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-20">
        {/* Add SVG patterns here */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Text Content */}
          <motion.div 
            className="text-left mt-4 sm:mt-0"
            style={{ y: textY }}
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-[#8E44AD] to-[#3498DB] text-transparent bg-clip-text leading-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Transform How You Choose Professors with AI-Powered Insights
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-[#2C3E50] mb-6 sm:mb-12 leading-relaxed"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Join the waitlist for early access to personalized professor recommendations and real-time sentiment tracking.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4">
              <animated.button 
                onClick={handleWaitlistClick}
                onMouseEnter={() => setGlowStrength({ glowStrength: 1 })}
                onMouseLeave={() => setGlowStrength({ glowStrength: 0 })}
                style={{
                  background: 'linear-gradient(45deg, #3498DB, #8E44AD)',
                  boxShadow: glowStrength.to(
                    (s: number) => `0 0 ${s * 20}px ${s * 10}px rgba(52, 152, 219, ${s * 0.5})`
                  )
                }}
                className="inline-block text-white font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 backdrop-filter backdrop-blur-sm bg-opacity-30"
              >
                Join the Waitlist
              </animated.button>
              <a 
                href="#learn-more" 
                className="inline-block bg-transparent border-2 border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive App Mockup */}
          <div className="hidden md:block">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Add 3D app mockup here */}
              <div className="bg-white rounded-lg shadow-xl p-4 backdrop-filter backdrop-blur-sm bg-opacity-30">
                {/* Add mockup content with animations here */}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-white to-[#F0F4F8] text-[#2C3E50] rounded-2xl p-8 max-w-lg w-full mx-auto shadow-2xl border border-[#3498db]/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-transparent bg-clip-text">Join the Future</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-[#2C3E50] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#2C3E50] mb-1">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 bg-white border border-[#3498db]/30 rounded-lg focus:outline-none focus:border-[#3498db] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2C3E50] mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 bg-white border border-[#3498db]/30 rounded-lg focus:outline-none focus:border-[#3498db] transition-colors"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Secure Your Spot'}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-semibold mb-4 text-[#2C3E50]">Welcome aboard, {name}!</p>
                <p className="text-green-600 mb-6">You've successfully joined our exclusive waitlist.</p>
                <p className="text-sm text-[#2C3E50] mb-4">Help us revolutionize education:</p>
                <div className="flex justify-center space-x-4">
                  <button className="bg-[#1da1f2] p-2 rounded-full hover:bg-[#1a91da] transition-colors">
                    <FaTwitter className="w-5 h-5 text-white" />
                  </button>
                  <button className="bg-[#4267B2] p-2 rounded-full hover:bg-[#365899] transition-colors">
                    <FaFacebookF className="w-5 h-5 text-white" />
                  </button>
                  <button className="bg-[#0e76a8] p-2 rounded-full hover:bg-[#0b5f8a] transition-colors">
                    <FaLinkedinIn className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}
            <p className="mt-6 text-xs text-[#2C3E50] text-center">
              By joining, you agree to our <a href="#" className="text-[#3498db] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#3498db] hover:underline">Terms of Service</a>.
            </p>
          </motion.div>
        </div>
      )}

      {/* Scroll-triggered animations */}
      <div className="scroll-animations">
        {/* Add elements that animate on scroll */}
      </div>
    </motion.div>
  );
};

export default Hero;