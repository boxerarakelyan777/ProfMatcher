import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Navbar from "../../../componenets/NavBar";
import Footer from "../../../componenets/Footer";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProfMatcher",
  description: "Discover the best professors tailored to your needs with ProfTracker. Our AI-driven platform offers personalized professor recommendations, real-time sentiment analysis, and effortless data integration from Rate My Professor. Start your search today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      
    <html lang="en">
      <body className={inter.className}>
        <header>
          <Navbar />
        </header>
        <main>{children}</main>
      
          <Footer />
        
      </body>
    </html>
    </ClerkProvider>
  );
}