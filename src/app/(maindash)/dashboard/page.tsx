"use client";
import { useState } from "react";
import SubmitProfessorLink from '../../../componenets/SubmitProfessorLink';
import AdvancedSearch from '../../../componenets/AdvancedSearch';
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
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Sentiment Analysis & Trend Tracking</h2>
            <p className="text-gray-600">This feature is coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12"> {/* Increased vertical spacing */}
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
              activeLevel === level
                ? 'bg-gradient-to-r from-[#3498DB] to-[#8E44AD] text-white transform scale-105'
                : 'bg-white text-[#2C3E50] hover:bg-gray-100'
            }`}
          >
            Level {level}
          </button>
        ))}
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
}
