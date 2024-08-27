import React from 'react';
import { SignIn } from "@clerk/nextjs";
import Navbar from '../../../../componenets/NavBar';
import Footer from '../../../../componenets/Footer';
export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Navbar />
      <SignIn />
      <Footer />
    </div>
  );
}