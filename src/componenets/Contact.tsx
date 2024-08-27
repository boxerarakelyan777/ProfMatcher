'use client';

import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [glowProps, setGlowProps] = useSpring(() => ({
    glowStrength: 0,
    config: { duration: 200 }
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const docRef = await addDoc(collection(db, 'contacts'), {
        email,
        subject,
        message,
        timestamp: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      setShowSuccessModal(true);
      
      // Clear form
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('There was an error sending your message. Please try again later.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out ProfTracker',
        text: 'I just contacted ProfTracker. You should check them out!',
        url: 'https://profmatcher.vercel.app/',
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Sharing is not supported on this browser, but we appreciate your intention!');
    }
  };

  return (
    <section id="contact" className="bg-white dark:bg-gray-900 relative">
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

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Thank You!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your message has been sent successfully. We&apos;ll get back to you soon.</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactForm;