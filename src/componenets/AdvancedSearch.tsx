import React, { useState } from 'react';

interface SearchCriteria {
  teacherName: string;
  schoolName: string;
  department: string;
}

const AdvancedSearch: React.FC = () => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    teacherName: '',
    schoolName: '',
    department: '',
  });

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/rmp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Professor Search</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="teacherName"
          value={criteria.teacherName}
          onChange={handleInputChange}
          placeholder="Professor Name"
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="schoolName"
          value={criteria.schoolName}
          onChange={handleInputChange}
          placeholder="School Name"
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="department"
          value={criteria.department}
          onChange={handleInputChange}
          placeholder="Department"
          className="w-full px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Search Results</h3>
          <ul className="space-y-4">
            {results.map((professor, index) => (
              <li key={index} className="border-b pb-4 last:border-b-0">
                <h4 className="font-semibold">{professor.name}</h4>
                <p>{professor.department} - {professor.school}</p>
                <p>Rating: {professor.rating}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;