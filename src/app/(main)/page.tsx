import Image from "next/image";
import Hero from "../../componenets/Hero";
import Features from "../../componenets/Features";
import SocialProof from "../../componenets/SocialProof";
import Team from "../../componenets/Team";
import Contact from "../../componenets/Contact";
import SuccessIndicators from "../../componenets/SuccessIndicators";
import Pricing from "../../componenets/Price";
export default function Home() {
  return (
    <>
    <Hero />
    <Features />
    <SocialProof />

    <Pricing />
    <Team />
    <Contact />
    
    </>
  );
}
