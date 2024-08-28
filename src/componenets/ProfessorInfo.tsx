import React from 'react';

interface Review {
  text: string;
  rating: number | null;
  date: string;
}

interface ProfessorData {
  name: string;
  department: string;
  institution: string;
  overallRating: number | null;
  reviews: Review[];
}

interface ProfessorInfoProps {
  data: ProfessorData;
}

const ProfessorInfo: React.FC<ProfessorInfoProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{data.name}</h2>
      <div className="mb-4">
        <p className="text-gray-600"><span className="font-semibold">Department:</span> {data.department}</p>
        <p className="text-gray-600"><span className="font-semibold">Institution:</span> {data.institution}</p>
        <p className="text-gray-600">
          <span className="font-semibold">Overall Rating:</span> 
          {data.overallRating !== null ? (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {data.overallRating.toFixed(1)}
            </span>
          ) : 'N/A'}
        </p>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-700">Reviews</h3>
      {data.reviews.length > 0 ? (
        <ul className="space-y-4">
          {data.reviews.map((review, index) => (
            <li key={index} className="border-b pb-4 last:border-b-0">
              <p className="text-gray-700 mb-2">{review.text}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Rating: {review.rating !== null ? review.rating.toFixed(1) : 'N/A'}</span>
                <span>{review.date}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No reviews available.</p>
      )}
    </div>
  );
};

export default ProfessorInfo;