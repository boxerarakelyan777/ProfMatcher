import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard
            title="AI Support Agent"
            description="Instant, accurate professor information using Pinecone-stored data."
          />
          <FeatureCard
            title="Automated Data Integration"
            description="Submit professor URLs, and our AI will scrape and store the data."
          />
          <FeatureCard
            title="Advanced Search & Recommendations"
            description="Find professors based on personalized criteria like teaching style and feedback."
          />
          <FeatureCard
            title="Sentiment Analysis & Trend Tracking"
            description="Track shifts in ratings and sentiment over time."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default Features;