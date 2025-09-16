"use client";
import { useState } from "react";
import SubmitProfessorLink from '../../../componenets/SubmitProfessorLink';
import AdvancedSearch from '../../../componenets/AdvancedSearch';
import RateProfessorAgent from '../../../componenets/RateProfessorAgent';

export default function Dashboard() {
  const [active, setActive] = useState<number>(1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: 1, label: "Chat" },
          { id: 2, label: "Link Search" },
          { id: 3, label: "Advanced Search" },
          { id: 4, label: "Coming Soon" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              active === t.id
                ? "bg-gradient-to-r from-[#3498DB] to-[#8E44AD] text-white"
                : "bg-white text-[#2C3E50] hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {active === 1 && <RateProfessorAgent />}
        {active === 2 && <SubmitProfessorLink />}
        {active === 3 && <AdvancedSearch />}
        {active === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#2C3E50]">Sentiment Analysis & Trend Tracking</h2>
            <p className="text-gray-600">This feature is coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
