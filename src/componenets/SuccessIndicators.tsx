import React from 'react';

const SuccessIndicators: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-electric-blue to-neon-purple">
      <div className="container mx-auto text-center text-off-white">
        <h2 className="text-4xl font-extrabold mb-12">Success Indicators</h2>
        <ul className="list-none space-y-8 text-xl">
          <li className="flex justify-center items-center space-x-4">
            <span className="text-4xl font-bold text-neon-purple">500+</span>
            <span className="text-xl">Early Access Spots Already Filled</span>
          </li>
          <li className="flex justify-center items-center space-x-4">
            <span className="text-4xl font-bold text-neon-purple">80%+</span>
            <span className="text-xl">of Waitlist Users Report High Satisfaction with Early Features</span>
          </li>
          <li className="flex justify-center items-center space-x-4">
            <span className="text-4xl font-bold text-neon-purple">1,000</span>
            <span className="text-xl">Limited spots available on the waitlist for our beta launch</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SuccessIndicators;
