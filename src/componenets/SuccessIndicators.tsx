import React from 'react';

const SuccessIndicators: React.FC = () => {
    return (
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Success Indicators</h2>
          <ul className="list-none">
            <li>500+ Early Access Spots Already Filled</li>
            <li>80%+ of Waitlist Users Report High Satisfaction with Early Features</li>
            <li>Be Part of the First 1,000: Limited spots available on the waitlist for our beta launch.</li>
          </ul>
        </div>
      </section>
    );
  };
  
  export default SuccessIndicators;