const SocialProof = () => {
    return (
      <section className="bg-gradient-to-r from-midnight-blue via-neon-purple to-electric-blue py-20">
        <div className="container mx-auto text-center">
          <blockquote className="relative text-2xl font-semibold italic text-off-white max-w-3xl mx-auto">
            <span className="absolute top-0 left-0 transform -translate-x-8 -translate-y-8 text-6xl text-electric-blue opacity-50">
              &ldquo;
            </span>
            "I can't wait to use ProfTracker! Joining the waitlist was easy, and I'm excited to see how this tool will help me find the best professors."
            <span className="absolute bottom-0 right-0 transform translate-x-8 translate-y-8 text-6xl text-electric-blue opacity-50">
              &rdquo;
            </span>
            <cite className="block mt-4 text-neon-purple text-lg">— Alex R., Junior at University XYZ</cite>
          </blockquote>
        </div>
      </section>
    );
  };
  
  export default SocialProof;
  