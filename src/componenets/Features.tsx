import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-off-white to-white relative">
      {/* Top decorative divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-midnight-blue tracking-tight">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard
            title="AI Support Agent"
            description="Instant, accurate professor information using Pinecone-stored data."
            icon="🔍"
          />
          <FeatureCard
            title="Automated Data Integration"
            description="Submit professor URLs, and our AI will scrape and store the data."
            icon="🔗"
          />
          <FeatureCard
            title="Advanced Search & Recommendations"
            description="Find professors based on personalized criteria like teaching style and feedback."
            icon="🎯"
          />
          <FeatureCard
            title="Sentiment Analysis & Trend Tracking"
            description="Track shifts in ratings and sentiment over time."
            icon="📊"
          />
        </div>
      </div>

      {/* Bottom decorative divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden transform rotate-180">
        <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white text-midnight-blue rounded-xl shadow-lg hover:shadow-2xl hover:transform hover:scale-105 transition-transform duration-300 p-8 relative">
      <div className="text-4xl absolute top-0 right-0 p-4 text-electric-blue">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-lg">{description}</p>
      <div className="absolute bottom-0 left-0 p-4 text-neon-purple">
        <span className="inline-block transform rotate-45">⬆️</span>
      </div>
    </div>
  );
};

export default Features;