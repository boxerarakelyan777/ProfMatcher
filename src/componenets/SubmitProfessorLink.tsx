import React, { useState } from 'react';
import ProfessorInfo from './ProfessorInfo';

interface ProfessorData {
  name: string;
  department: string;
  institution: string;
  overallRating: number | null;
  reviews: {
    text: string;
    rating: number | null;
    date: string;
  }[];
}

const SubmitProfessorLink: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [professorData, setProfessorData] = useState<ProfessorData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setProfessorData(null);

    try {
      const response = await fetch('/api/submit-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setProfessorData(data.professorData);
        setUrl('');
      } else {
        throw new Error(data.error || 'Failed to submit professor link');
      }
    } catch (error) {
      console.error('Error submitting professor link:', error);
      setMessage(`Failed to submit professor link: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Submit Professor Link</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Rate My Professor URL"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
      {professorData && <ProfessorInfo data={professorData} />}
    </div>
  );
};

export default SubmitProfessorLink;