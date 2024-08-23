'use client'
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useSpring as useReactSpring, animated } from 'react-spring';
// Import other necessary libraries for animations and effects

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
              <animated.a 
                href="#waitlist" 
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
              </animated.a>
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

      {/* Scroll-triggered animations */}
      <div className="scroll-animations">
        {/* Add elements that animate on scroll */}
      </div>
    </motion.div>
  );
};

export default Hero;