import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="pt-20 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=A%20vibrant%20collage%20of%20fresh%20seasonal%20fruits%20including%20apples%2C%20oranges%2C%20berries%2C%20and%20tropical%20fruits%20arranged%20beautifully%20with%20a%20happy%20family%20enjoying%20fruits%20in%20the%20background%2C%20bright%20natural%20lighting%2C%20fresh%20and%20appetizing%2C%20professional%20food%20photography%20with%20soft%20focus%20background&width=1440&height=600&seq=1&orientation=landscape')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "600px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-transparent"></div>
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Daily Fresh Fruit Variety – No Repetition, Always Fresh!
          </h1>
          <p className="text-xl mb-8">
            Experience the joy of fresh, handpicked seasonal fruits delivered
            to your doorstep. Nutritious, delicious, and convenient.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                const plansSection = document.getElementById("plans");
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
            >
              Subscribe Now
            </button>
            <button
              onClick={() => {
                const plansSection = document.getElementById("plans");
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;