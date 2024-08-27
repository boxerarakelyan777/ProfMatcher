import React from 'react';
import { SignUp } from "@clerk/nextjs";
import Navbar from '../../../../componenets/NavBar';
import Footer from '../../../../componenets/Footer';

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Navbar />
      <SignUp />
      <Footer />
    </div>
  );
}