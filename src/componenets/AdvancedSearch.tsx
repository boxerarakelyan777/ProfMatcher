import React, { useState } from 'react';

interface SearchCriteria {
  teacherName: string;
  schoolName: string;
  department: string;
  minRating: number;
  courseLevel: string;
  teachingStyle: string;
}

const AdvancedSearch: React.FC = () => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    teacherName: '',
    schoolName: '',
    department: '',
    minRating: 0,
    courseLevel: '',
    teachingStyle: '',
  });

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: name === 'minRating' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting search criteria:', criteria);

      const response = await fetch('/api/advanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('Received search results:', data);

      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#3498DB] to-[#8E44AD] text-transparent bg-clip-text">
        Advanced Professor Search
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="teacherName"
            value={criteria.teacherName}
            onChange={handleInputChange}
            placeholder="Teacher Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="schoolName"
            value={criteria.schoolName}
            onChange={handleInputChange}
            placeholder="School Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="department"
            value={criteria.department}
            onChange={handleInputChange}
            placeholder="Department"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="minRating"
            value={criteria.minRating}
            onChange={handleInputChange}
            min="0"
            max="5"
            step="0.1"
            placeholder="Minimum Rating"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="courseLevel"
            value={criteria.courseLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Course Level</option>
            <option value="introductory">Introductory</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            name="teachingStyle"
            value={criteria.teachingStyle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Teaching Style</option>
            <option value="lecture">Lecture-based</option>
            <option value="interactive">Interactive</option>
            <option value="hands-on">Hands-on</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 text-white bg-gradient-to-r from-[#3498DB] to-[#8E44AD] rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {results.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-[#2C3E50]">Recommended Professors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((professor, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 ease-in-out">
                <h4 className="font-semibold text-xl mb-2 text-[#3498DB]">{professor.name}</h4>
                <p className="text-gray-600 mb-1">{professor.department} - {professor.school}</p>
                <p className="text-gray-600 mb-1">Rating: <span className="font-semibold text-[#8E44AD]">{professor.rating}</span></p>
                <p className="text-gray-600 mb-1">Teaching Style: {professor.teachingStyle}</p>
                <p className="text-gray-600">Course Level: {professor.courseLevel}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;