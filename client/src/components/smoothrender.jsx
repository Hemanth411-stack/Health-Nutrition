// // components/SmoothRender.js
// import React, { useEffect, useState } from 'react';
// import { useInView } from 'react-intersection-observer';

// const SmoothRender = ({ children, delay = 0 }) => {
//   const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (inView) {
//       const timer = setTimeout(() => setVisible(true), delay);
//       return () => clearTimeout(timer);
//     }
//   }, [inView, delay]);

//   return (
//     <div
//       ref={ref}
//       className={`transition-all duration-700 ease-out ${
//         visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// export default SmoothRender;