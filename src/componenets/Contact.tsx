'use client';

import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';


const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [glowProps, setGlowProps] = useSpring(() => ({
    glowStrength: 0,
    config: { duration: 200 }
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <section id="contact" className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
            <input 
              type="email" 
              id="email" 
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
              placeholder="name@proftracker.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
            <input 
              type="text" 
              id="subject" 
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
              placeholder="Let us know how we can help you" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required 
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
            <textarea 
              id="message" 
              rows={6} 
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
              placeholder="Leave a comment..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <animated.button
              type="submit"
              onMouseEnter={() => setGlowProps({ glowStrength: 1 })}
              onMouseLeave={() => setGlowProps({ glowStrength: 0 })}
              style={{
                background: 'linear-gradient(45deg, #3498DB, #8E44AD)',
                boxShadow: glowProps.glowStrength.to(
                  (s: number) => `0 0 ${s * 20}px ${s * 10}px rgba(52, 152, 219, ${s * 0.5})`
                )
              }}
              className="w-full text-white font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 backdrop-filter backdrop-blur-sm bg-opacity-30"
            >
              Send Message
            </animated.button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;