import React from "react";

const ScrollingText = () => {
  const messages = [
    "✨ SPECIAL OFFER: Renew your subscription for 2 Months and get 5% off! OFFER valid for Limited time only",
    "🚚 Free delivery within 12km radius of Yusufguda",
    "🍎 Fresh fruits delivered weekly to your doorstep"
  ];

  return (
<div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black py-2 overflow-hidden z-[60] h-8">      <div className="animate-marquee whitespace-nowrap">
        {messages.map((message, index) => (
          <span key={index} className="text-sm font-semibold mx-4">
            {message}
          </span>
        ))}
      </div>
      
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ScrollingText;