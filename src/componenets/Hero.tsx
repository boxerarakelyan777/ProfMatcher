import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-deep-blue to-bright-cyan min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
              Transform How You Choose Professors with AI-Powered Insights
            </h1>
            <p className="text-xl md:text-2xl text-black mb-8">
              Join the waitlist for early access to personalized professor recommendations and real-time sentiment tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="#waitlist" 
                className="inline-block bg-soft-orange hover:bg-soft-orange-dark text-black font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Join the Waitlist
              </a>
              <a 
                href="#learn-more" 
                className="inline-block bg-transparent border-2 border-black text-black hover:bg-black hover:text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Column: Image/Illustration */}
          <div className="hidden md:block">
            {/* Placeholder for app interface mockup */}
            <div className="bg-white rounded-lg shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gray-200 h-40 rounded-md mb-4 animate-pulse"></div>
              <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;