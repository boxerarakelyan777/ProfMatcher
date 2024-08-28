import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Navbar from "../../../componenets/NavBar";
import Footer from "../../../componenets/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProfMatcher Dashboard",
  description: "Access advanced features and personalized professor recommendations with ProfMatcher.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gradient-to-b from-[#F2F4F6] to-white min-h-screen`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] to-[#8E44AD] opacity-10 animate-gradient-x"></div>
          <header>
            <Navbar />
          </header>
          <main className="relative z-10 container mx-auto px-4 py-24"> {/* Increased top padding */}
            <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#8E44AD] to-[#3498DB] text-transparent bg-clip-text">
              ProfMatcher Dashboard
            </h1>
            {children}
          </main>
       
        </body>
      </html>
    </ClerkProvider>
  );
}