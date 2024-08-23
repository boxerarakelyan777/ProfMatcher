'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Stripe Plans
const plans = [
  {
    name: 'Free',
    price: 0,
    link: '#',
    features: [
      'AI Support Agent: 5 queries/month',
      'Basic Professor Search',
      'Limited access to public reviews',
      'Submit 3 professor URLs/month',
      'Basic sentiment analysis',
      'Email and AI Chat support',
    ],
  },
  {
    name: 'Basic', 
    price: 9.99,
    link: 'https://buy.stripe.com/test_8wM3eb0eY8O15b2aEG',
    priceId: 'price_1PqSRUBGuZJEG2quYl0LPh29',
    features: [
      'AI Support Agent: 50 queries/month',
      'Advanced Professor Search',
      'Full access to public reviews',
      'Submit 15 professor URLs/month',
      'Advanced sentiment analysis',
      'Custom recommendations',
      'Priority email and AI Chat support',
      'Data export functionality',
    ],
  },
  {
    name: 'Pro',
    price: 19.99,
    link: 'https://buy.stripe.com/test_eVabKH8LufcpcDu003',
    priceId: 'price_1PqSY0BGuZJEG2quz5Ixehbc',
    features: [
      'Unlimited AI Support Agent queries',
      'Premium Professor Search across institutions',
      'Full access to reviews & trends',
      'Unlimited professor URL submissions',
      'Advanced sentiment analysis & trend tracking',
      'Custom recommendations & alerts',
      'Priority support (email & AI Chat)',

      'Advanced data export & custom reports',
      
    ],
  },
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="bg-white dark:bg-gray-900">
      <div className="px-4 py-24 mx-auto max-w-screen-xl lg:py-24 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Choose the Best Plan for Your Professor Insights
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Explore our flexible pricing plans to enhance your academic experience. Whether you're a casual user or a dedicated researcher, we've got the right tools for you.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 pt-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
              whileInView={{ 
                opacity: 1, 
                scale: plan.name === 'Basic' ? 1.1 : 1, 
                y: 0, 
                rotateX: 0 
              }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1,
                delay: index * 0.1
              }}
              className={`flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border shadow xl:p-8
                ${plan.name === 'Basic' 
                  ? 'lg:scale-110 lg:z-10 relative shadow-2xl border-purple-500 bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-purple-900' 
                  : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-600'}`}
            >
              {plan.name === 'Basic' && (
                <>
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    Most Popular
                  </span>
                  <div className="absolute inset-0 bg-purple-300 dark:bg-purple-700 opacity-20 rounded-lg blur-[30px] z-[-1]"></div>
                </>
              )}
              <h3 className={`mb-4 text-2xl font-bold ${plan.name === 'Basic' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <p className={`font-light ${plan.name === 'Basic' ? 'text-purple-700 dark:text-purple-200' : 'text-gray-500 dark:text-gray-400'} sm:text-lg`}>
                {plan.name === 'Free' 
                  ? 'Ideal for personal use to explore the features.' 
                  : plan.name === 'Pro' 
                    ? 'Best for advanced users who need more features.' 
                    : 'Perfect for individual learners and small study groups.'}
              </p>
              <div className={`flex justify-center items-baseline my-8 ${plan.name === 'Basic' ? 'text-purple-600 dark:text-purple-300' : ''}`}>
                <span className="mr-2 text-5xl font-extrabold">${plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))} 
              </ul>
              <div className="mt-auto">
                <button
                  onClick={(e) => e.preventDefault()}
                  className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full ${
                    plan.name === 'Basic'
                      ? 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80'
                      : 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800'
                  }`}
                >
                  Coming Soon
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;