import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      quote: "The fruits are always fresh and the variety is amazing! My family loves the surprise element every day.",
      name: "Sarah Johnson",
      rating: 5,
    },
    {
      quote: "Best subscription service I've tried. The fruits are handpicked and the packaging is eco-friendly.",
      name: "Michael Chen",
      rating: 5,
    },
    {
      quote: "I love that I don't have to worry about buying fruits anymore. 7Star delivers quality consistently!",
      name: "Priya Sharma",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trust matters the most to us. Here's what our happy customers
            have to say.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-xl italic text-gray-700">
                "{testimonials[activeTestimonial].quote}"
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faUser} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <div className="flex text-yellow-500">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      )
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-green-600" />
                </button>
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) =>
                      prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-green-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full mx-1 cursor-pointer whitespace-nowrap ${
                  activeTestimonial === index ? "bg-green-600" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;