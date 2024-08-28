"use client";
import { useState } from "react";
import SubmitProfessorLink from '../../../componenets/SubmitProfessorLink';
import AdvancedSearch from '../../../componenets/AdvancedSearch';
import Link from 'next/link';
import RateProfessorAgent from '../../../componenets/RateProfessorAgent';

export default function Dashboard() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const renderContent = () => {
    switch (activeLevel) {
      case 1:
        return <RateProfessorAgent />;
      case 2:
        return <SubmitProfessorLink />;
      case 3:
        return <AdvancedSearch />;
      case 4:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Sentiment Analysis and Trend Tracking</h2>
            <p>This feature is coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
        Professor Dashboard
      </h1>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto text-center">
        Explore our features to find the perfect professor for your academic journey.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-6 py-3 text-lg font-medium rounded-md transition-colors ${
              activeLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Level {level}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}
