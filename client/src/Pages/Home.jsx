import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from "../components/Hero";
import Subscription from "../components/SubscriptionPlans";
import Extrabenefits from "../components/Extrabenefits";
import Whychooseus from "../components/Whychooseus";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import confetti from 'canvas-confetti';
import FruitBoxGuidelines from '../components/FruitBoxGuidelines';
import { FaArrowUp } from 'react-icons/fa';


const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Confetti effect
    confetti({
      particleCount: 500,
      spread: 200,
      origin: { y: 0 },
      angle: 90,
      gravity: 1,
      drift: 0,
      ticks: 200,
      shapes: ['square'],
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      scalar: 1,
    });

    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
     <div className="relative">
     
      <Header className="mt-12" /> 
      <Hero />
      <Subscription />
      <Extrabenefits />
      <FruitBoxGuidelines/>
      <Whychooseus />
      <Testimonials />
      <Footer />

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-8 bottom-8 z-50 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${
          showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="animate-bounce" />
      </button>
    </div>
  );
};

export default Home;